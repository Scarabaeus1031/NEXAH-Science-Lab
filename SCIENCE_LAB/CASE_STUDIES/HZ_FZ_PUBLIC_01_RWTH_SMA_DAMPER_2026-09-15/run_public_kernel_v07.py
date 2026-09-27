#!/usr/bin/env python3
"""Attach the verified public cuts to NEXAH 0.7 and test robustness."""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import gzip
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
from typing import Any

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parent
EXPECTED_VERSION = "0.7.0"
DECIMATION = 8
PRIMARY = (4, 32, 42)
SENSITIVITY = ((3, 16, 42), (4, 16, 42), (4, 32, 7), PRIMARY, (4, 64, 42), (5, 32, 42))
COLORS = {"REFERENCE_A": "#54c8ff", "RETURN_B": "#ff9a3c"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--nexah-repo", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, default=ROOT)
    parser.add_argument("--no-visual", action="store_true")
    return parser.parse_args()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def json_safe(value: Any) -> Any:
    if hasattr(value, "tolist"):
        return json_safe(value.tolist())
    if hasattr(value, "item"):
        return value.item()
    if isinstance(value, dict):
        return {str(key): json_safe(item) for key, item in value.items()}
    if isinstance(value, (tuple, list)):
        return [json_safe(item) for item in value]
    return value


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(json_safe(value), sort_keys=True, separators=(",", ":"), allow_nan=False).encode("utf-8")


def deterministic_gzip(path: Path, payload: bytes) -> str:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as raw:
        with gzip.GzipFile(filename="", mode="wb", fileobj=raw, mtime=0) as zipped:
            zipped.write(payload)
    return sha256_bytes(path.read_bytes())


def fundamental(values: np.ndarray, time: np.ndarray, frequency: float) -> complex:
    centered = values - np.mean(values)
    return complex(2 * np.sum(centered * np.exp(-2j * np.pi * frequency * time)) / len(values))


def wrap_degrees(value: float) -> float:
    return (value + 180.0) % 360.0 - 180.0


def gain_phase(table: pd.DataFrame, frequency: float, actuator: int) -> tuple[float, float]:
    time = table["Time"].to_numpy(float)
    displacement = fundamental(table[f"Actuator{actuator}_Disp"].to_numpy(float), time, frequency)
    force = fundamental(table[f"Actuator{actuator}_Force"].to_numpy(float), time, frequency)
    return abs(force) / abs(displacement), wrap_degrees(math.degrees(np.angle(force / displacement)))


def relative_delta(a: float, b: float) -> float:
    return abs(a - b) / ((abs(a) + abs(b)) / 2.0)


def cycle_metrics(table: pd.DataFrame, frequency: float, actuator: int) -> list[dict[str, float]]:
    samples_per_cycle = round(512.0 / frequency)
    count = len(table) // samples_per_cycle
    rows = []
    for cycle in range(count):
        segment = table.iloc[cycle * samples_per_cycle:(cycle + 1) * samples_per_cycle]
        gain, phase = gain_phase(segment, frequency, actuator)
        displacement = segment[f"Actuator{actuator}_Disp"].to_numpy(float)
        rows.append({
            "cycle": cycle + 1, "gain_kn_per_mm": gain, "phase_deg": phase,
            "displacement_half_range_mm": float((np.max(displacement) - np.min(displacement)) / 2.0),
        })
    return rows


def median_iqr(values: list[float]) -> dict[str, float]:
    array = np.asarray(values, dtype=float)
    return {
        "median": float(np.median(array)),
        "q1": float(np.quantile(array, 0.25)),
        "q3": float(np.quantile(array, 0.75)),
        "minimum": float(np.min(array)),
        "maximum": float(np.max(array)),
    }


def inspect_fresh() -> dict[str, Any]:
    completed = subprocess.run(
        [sys.executable, str(ROOT / "inspect_public_source.py")],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise ValueError(f"public source intake failed closed: {completed.stdout or completed.stderr}")
    result = json.loads(completed.stdout)
    frozen = json.loads((ROOT / "SOURCE_INTAKE_RESULT.json").read_text(encoding="utf-8"))
    if canonical_bytes(result) != canonical_bytes(frozen):
        raise ValueError("fresh public-source intake differs from frozen intake result")
    return result


def run_kernel(table: pd.DataFrame, run: dict[str, Any], config: tuple[int, int, int], nexah: Any) -> Any:
    from nexah.backends import V07BackendAdapter
    from nexah.orientation import Context, Provenance
    from nexah.sources import TableSchema, TableSourceAdapter

    clusters, window, seed = config
    sampled = table.iloc[::DECIMATION].copy().reset_index(drop=True)
    epoch = datetime(2000, 1, 1, tzinfo=timezone.utc)
    sampled["timestamp"] = [epoch + timedelta(seconds=float(value)) for value in sampled["Time"]]
    provenance = Provenance(
        source=f"HZ_FZ_PUBLIC_01:{run['path']}",
        method="verified Zenodo CSV; ordered decimation by 8",
        recorded_at=datetime(2026, 9, 15, tzinfo=timezone.utc),
        record_id=run["sha256"],
        metadata={"doi": "10.5281/zenodo.17296336", "source_sha256": run["sha256"], "decimation": DECIMATION},
    )
    context = Context(domain="HZ_FZ_PUBLIC_01", values={
        "pair": run["pair"], "role": run["role"], "condition": run["condition"],
        "frequency_hz": run["frequency_hz"], "claim_class": "EXTERNAL_E2_ONLY",
    })
    schema = TableSchema(
        feature_columns=("Actuator1_Disp", "Actuator1_Force", "Actuator2_Disp", "Actuator2_Force"),
        timestamp_column="timestamp",
        units={"Actuator1_Disp": "mm", "Actuator1_Force": "kN", "Actuator2_Disp": "mm", "Actuator2_Force": "kN"},
    )
    source = TableSourceAdapter(schema)
    batch = source.adapt(sampled, batch_id=f"HZ_FZ_PUBLIC_01:{run['sha256'][:12]}", provenance=provenance, context=context)
    backend = V07BackendAdapter(n_clusters=clusters, window=window, random_state=seed, normalize=True)
    result = backend.adapt(
        batch.to_numpy(), analysis_id=f"HZ_FZ_PUBLIC_01:{run['sha256'][:12]}:c{clusters}w{window}s{seed}",
        provenance=provenance, context=context, timestamps=batch.timestamps,
    )
    return source.adapter_id, backend.backend_id, batch, result


def kernel_summary(result: Any) -> dict[str, Any]:
    raw = result.raw_output
    signature = json_safe(raw["signature"])
    occupancies = sorted((float(value) for value in signature["occupancy"].values()), reverse=True)
    entropies = [float(value) for value in signature["transition_entropy"].values()]
    return {
        "n_states_observed": int(signature["n_states_observed"]),
        "dominant_occupancy": occupancies[0],
        "mean_transition_entropy": float(np.mean(entropies)),
        "regime_shift_count": len(raw["regime_shifts"]),
        "regime_shift_density": len(raw["regime_shifts"]) / result.alignment.embedded_samples,
    }


def make_visual(path: Path, intake: dict[str, Any], cycles: dict[str, Any], sensitivity: dict[str, Any]) -> None:
    import matplotlib.pyplot as plt

    plt.style.use("dark_background")
    fig, axes = plt.subplots(3, 2, figsize=(16, 13))
    fig.subplots_adjust(left=0.07, right=0.98, bottom=0.075, top=0.92, hspace=0.38, wspace=0.17)
    fig.patch.set_facecolor("#0d1016")
    for axis in axes.flat:
        axis.set_facecolor("#121722")
        axis.grid(color="#637083", alpha=0.18, linewidth=0.7)
        for spine in axis.spines.values():
            spine.set_color("#3a4350")

    pair_ids = ["P05_BEFORE_AFTER_EQ", "P10_BEFORE_AFTER_EQ"]
    for column, pair_id in enumerate(pair_ids):
        pair = intake["pairs"][pair_id]
        for role, filename in (("REFERENCE_A", pair["a_file"]), ("RETURN_B", pair["b_file"])):
            table = pd.read_csv(ROOT / "selected" / filename)
            frequency = pair["frequency_hz"]
            period = 1.0 / frequency
            middle = 7 * period
            view = table[(table["Time"] >= middle) & (table["Time"] < middle + period)]
            x = (view["Time"] - middle) / period
            disp = view["Actuator1_Disp"].to_numpy(float)
            force = view["Actuator1_Force"].to_numpy(float)
            disp = (disp - disp.mean()) / np.std(disp)
            force = (force - force.mean()) / np.std(force)
            axes[0, column].plot(x, disp, color=COLORS[role], lw=1.5, label=f"{role} displacement")
            axes[0, column].plot(x, force, color=COLORS[role], lw=1.1, ls="--", alpha=0.75, label=f"{role} force")
        axes[0, column].set_title(f"{pair_id}: one frozen cycle ({pair['frequency_hz']} Hz)", loc="left", fontweight="bold")
        axes[0, column].set_xlabel("cycle fraction")
        axes[0, column].set_ylabel("standardized amplitude")
        axes[0, column].legend(frameon=False, fontsize=8, ncol=2)

        cycle_data = cycles[pair_id]
        for actuator, marker in (("actuator_1", "o"), ("actuator_2", "s")):
            values = [item for item in cycle_data[actuator]["paired_cycle_deltas"] if item["active"]]
            axes[1, column].plot(
                [item["cycle"] for item in values],
                [100 * item["gain_relative_delta"] for item in values],
                marker=marker, ms=4, lw=1.2, label=actuator.replace("_", " "),
            )
        inactive = cycle_data["actuator_1"]["inactive_windows"]
        if inactive:
            axes[1, column].axvspan(min(inactive) - 0.5, max(inactive) + 0.5, color="#9aa3ae", alpha=0.12)
            axes[1, column].text(np.mean(inactive), axes[1, column].get_ylim()[1] * 0.92, "inactive tail", ha="center", color="#aab2bf", fontsize=8)
        axes[1, column].set_title("Cut separation across active cycles", loc="left", fontweight="bold")
        axes[1, column].set_xlabel("nominal cycle window")
        axes[1, column].set_ylabel("A/B gain difference (%)")
        axes[1, column].set_xticks(range(1, 17, 2))
        axes[1, column].legend(frameon=False, fontsize=8)

        configs = sensitivity[pair_id]["configurations"]
        labels = [f"k{item['n_clusters']}·w{item['window']}·s{item['random_state']}" for item in configs]
        scores = [item["ab_similarity"] for item in configs]
        axes[2, column].barh(labels, scores, color="#af83ff", alpha=0.85)
        axes[2, column].set_xlim(0, 1)
        axes[2, column].set_xlabel("v0.7 permutation-invariant A/B similarity")
        axes[2, column].set_title("Kernel sensitivity battery", loc="left", fontweight="bold")
        for index, score in enumerate(scores):
            axes[2, column].text(min(score + 0.012, 0.93), index, f"{score:.3f}", va="center", fontsize=8)

    fig.suptitle("NEXAH HZ/FZ PUBLIC 01 · TWO CUTS, CYCLE TRACE, KERNEL 0.7", fontsize=18, fontweight="bold", color="#f2c96d")
    fig.text(0.5, 0.018, "RWTH SMA damper · External E2 evidence · before/after relation, not causal replay · 512 Hz signal / 64 Hz kernel input", ha="center", color="#aab2bf", fontsize=10)
    fig.savefig(path, dpi=180, facecolor=fig.get_facecolor())
    plt.close(fig)


def main() -> None:
    args = parse_args()
    output = args.output_dir.resolve()
    output.mkdir(parents=True, exist_ok=True)
    intake = inspect_fresh()
    nexah_repo = args.nexah_repo.resolve()
    if not (nexah_repo / "nexah" / "backends" / "v07.py").is_file():
        raise ValueError("declared NEXAH repository has no v0.7 adapter")
    sys.path.insert(0, str(nexah_repo))
    import nexah
    from nexah.orientation.memory import orientation_similarity

    if nexah.__version__ != EXPECTED_VERSION:
        raise ValueError(f"expected NEXAH {EXPECTED_VERSION}, got {nexah.__version__}")
    loaded_from = Path(nexah.__file__).resolve()
    if nexah_repo not in loaded_from.parents:
        raise ValueError(f"NEXAH loaded outside declared repository: {loaded_from}")

    tables = {name: pd.read_csv(ROOT / run["path"]) for name, run in intake["runs"].items()}
    cycle_report: dict[str, Any] = {}
    sensitivity_report: dict[str, Any] = {}
    primary_analyses: dict[str, Any] = {}

    for pair_id, pair in intake["pairs"].items():
        runs = {
            "REFERENCE_A": intake["runs"][pair["a_file"]],
            "RETURN_B": intake["runs"][pair["b_file"]],
        }
        per_actuator: dict[str, Any] = {}
        for actuator in (1, 2):
            a_cycles = cycle_metrics(tables[pair["a_file"]], pair["frequency_hz"], actuator)
            b_cycles = cycle_metrics(tables[pair["b_file"]], pair["frequency_hz"], actuator)
            paired = [{
                "cycle": a["cycle"],
                "active": min(a["displacement_half_range_mm"], b["displacement_half_range_mm"]) >= 0.9 * pair["nominal_displacement_mm"],
                "gain_relative_delta": relative_delta(a["gain_kn_per_mm"], b["gain_kn_per_mm"]),
                "phase_absolute_delta_deg": abs(wrap_degrees(b["phase_deg"] - a["phase_deg"])),
            } for a, b in zip(a_cycles, b_cycles)]
            active = [item for item in paired if item["active"]]
            if len(active) < 3:
                raise ValueError(f"fewer than three active paired cycles: {pair_id} actuator {actuator}")
            steady = active[1:-1]
            per_actuator[f"actuator_{actuator}"] = {
                "reference_cycles": a_cycles, "return_cycles": b_cycles, "paired_cycle_deltas": paired,
                "activity_rule": "both cuts displacement half-range >= 90% of declared nominal amplitude",
                "active_windows": [item["cycle"] for item in active],
                "inactive_windows": [item["cycle"] for item in paired if not item["active"]],
                "active_cycles": {
                    "gain_relative_delta": median_iqr([x["gain_relative_delta"] for x in active]),
                    "phase_absolute_delta_deg": median_iqr([x["phase_absolute_delta_deg"] for x in active]),
                },
                "steady_active_cycles": {
                    "windows": [item["cycle"] for item in steady],
                    "gain_relative_delta": median_iqr([x["gain_relative_delta"] for x in steady]),
                    "phase_absolute_delta_deg": median_iqr([x["phase_absolute_delta_deg"] for x in steady]),
                },
            }
        cycle_report[pair_id] = per_actuator

        config_rows = []
        for config in SENSITIVITY:
            states = {}
            summaries = {}
            for role, run in runs.items():
                _, _, _, result = run_kernel(tables[Path(run["path"]).name], run, config, nexah)
                states[role] = result.state
                summaries[role] = kernel_summary(result)
                if config == PRIMARY:
                    state_bytes = canonical_bytes(result.state.to_dict())
                    transition_bytes = canonical_bytes([item.to_dict() for item in result.transitions])
                    stem = Path(run["path"]).stem
                    state_path = output / "kernel" / f"{stem}.orientation-state.json.gz"
                    transition_path = output / "kernel" / f"{stem}.transitions.json.gz"
                    state_gzip_sha = deterministic_gzip(state_path, state_bytes)
                    transition_gzip_sha = deterministic_gzip(transition_path, transition_bytes)
                    primary_analyses[Path(run["path"]).name] = {
                        "pair": pair_id, "role": role, "source_sha256": run["sha256"],
                        "source_adapter": "pandas-table-source-v1", "backend_adapter": "nexah-v07",
                        "source_rows": run["rows"], "kernel_rows": math.ceil(run["rows"] / DECIMATION),
                        "orientation_state": {"path": str(state_path.relative_to(output)), "canonical_json_sha256": sha256_bytes(state_bytes), "gzip_sha256": state_gzip_sha},
                        "transitions": {"path": str(transition_path.relative_to(output)), "canonical_json_sha256": sha256_bytes(transition_bytes), "gzip_sha256": transition_gzip_sha},
                        "summary": summaries[role],
                    }
            similarity = orientation_similarity(states["RETURN_B"], states["REFERENCE_A"], f"{pair_id}:REFERENCE_A")
            config_rows.append({
                "n_clusters": config[0], "window": config[1], "random_state": config[2],
                "ab_similarity": similarity.value, "similarity_method": similarity.method,
                "cuts": summaries,
            })
        scores = [row["ab_similarity"] for row in config_rows]
        sensitivity_report[pair_id] = {
            "configurations": config_rows,
            "similarity_range": {"minimum": min(scores), "maximum": max(scores), "span": max(scores) - min(scores)},
        }

    robustness = {
        "schema": "nexah-hz-fz-public-robustness/0.1.0",
        "case_id": "HZ_FZ_PUBLIC_01", "nominal_cycle_windows_per_record": 16,
        "signal_analysis_source_rate_hz": 512.0,
        "cycle_robustness": cycle_report, "kernel_sensitivity": sensitivity_report,
        "interpretation": "Observed ranges only; no universal threshold or causal effect is asserted.",
    }
    (output / "ROBUSTNESS_RESULT.json").write_text(json.dumps(robustness, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    if not args.no_visual:
        make_visual(output / "NEXAH_HZ_FZ_PUBLIC_01_CUT_ROBUSTNESS.png", intake, cycle_report, sensitivity_report)

    evidence = {
        "schema": "nexah-hz-fz-public-v07-evidence/0.1.0",
        "evidence_class": "E2_COMPUTATIONAL_SUPPLEMENT", "case_id": "HZ_FZ_PUBLIC_01",
        "source_archive_sha256": intake["source"]["archive_sha256"],
        "kernel": {"name": "NEXAH", "version": nexah.__version__, "repository": str(nexah_repo), "loaded_from": str(loaded_from),
                   "primary_config": {"n_clusters": 4, "window": 32, "random_state": 42, "normalize": True},
                   "source_decimation": DECIMATION, "effective_sample_rate_hz": 64.0},
        "analyses": primary_analyses,
        "robustness": {"path": "ROBUSTNESS_RESULT.json", "sha256": sha256_bytes((output / "ROBUSTNESS_RESULT.json").read_bytes()), "battery_configurations": len(SENSITIVITY)},
        "comparison_boundary": "Each cut is a local fit; similarity is permutation-invariant and does not align cluster identifiers.",
        "limitations": ["before/after campaign is not an independent replay", "kernel outputs are descriptive heuristics", "uncertainty remains unknown", "kernel input is ordered-decimated while signal metrics use the full source"],
        "runtime_effect": "SUPPLEMENT_ONLY_NO_PROFILE_ACTIVATION",
    }
    print(json.dumps(evidence, sort_keys=True, separators=(",", ":"), allow_nan=False))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"classification": "FAIL_CLOSED", "error": str(error)}), file=sys.stderr)
        raise SystemExit(2)
