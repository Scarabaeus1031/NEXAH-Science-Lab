#!/usr/bin/env python3
from __future__ import annotations

import csv
import hashlib
import json
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import numpy as np


PACKAGE = Path(__file__).resolve().parents[1]
SOURCE = PACKAGE.parent / "PHX_01_EXTERNAL_E2_PHASE_ANALYSIS_2026-09-20" / "03_CYCLE_PHASE_RECORDS.csv"
SOURCE_SHA256 = "907ec0ef4bcde56c53ab39a656a78a4c12bbc6d343dc20732115762f28aa373a"
M11 = {0, 11, 22, 33, 44, 55, 66, 77, 88, 99}
SIGNED_CONTROLS = {10, 12, 17, -10, -12, -17}
DITHER_DRAWS = 20_000
DITHER_HALF_WIDTH_DEG = 0.005
SEED = 20260920


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def round_half_up_int(value: float, quantum: str) -> int:
    q = Decimal(quantum)
    return int((Decimal(str(value)) / q).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def round_half_up_array(values: np.ndarray, quantum: float) -> np.ndarray:
    scaled = values / quantum
    return np.sign(scaled).astype(np.int64) * np.floor(np.abs(scaled) + 0.5).astype(np.int64)


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)


def holm_adjust(named_p: dict[str, float]) -> dict[str, float]:
    ordered = sorted(named_p.items(), key=lambda kv: (kv[1], kv[0]))
    m = len(ordered)
    adjusted = {}
    running = 0.0
    for rank, (name, p) in enumerate(ordered):
        running = max(running, min(1.0, (m - rank) * p))
        adjusted[name] = running
    return adjusted


def load_carriers() -> list[dict]:
    if sha256(SOURCE) != SOURCE_SHA256:
        raise RuntimeError("source hash mismatch")
    with SOURCE.open(newline="", encoding="utf-8") as f:
        raw = list(csv.DictReader(f))

    carriers = []
    lookup = {}
    for r in raw:
        pair = r["pair"]
        cut = r["cut"]
        actuator = int(r["actuator"])
        cycle = int(r["cycle"])
        phase = float(r["phase_deg"])
        series = f"{pair}|{cut}|a{actuator}"
        carrier = {
            "corpus": "ABS_PHASE_72",
            "carrier_id": f"abs|{series}|c{cycle}",
            "series_id": series,
            "pair": pair,
            "cut": cut,
            "actuator": actuator,
            "cycle": cycle,
            "value_kind": "cycle_phase_deg",
            "value_deg": phase,
        }
        carriers.append(carrier)
        lookup[(pair, cut, actuator, cycle)] = phase

    keys = sorted({(r["pair"], int(r["actuator"]), int(r["cycle"])) for r in raw})
    for pair, actuator, cycle in keys:
        a = lookup.get((pair, "A", actuator, cycle))
        b = lookup.get((pair, "B", actuator, cycle))
        if a is None or b is None:
            raise RuntimeError(f"unmatched A/B carrier: {pair}, a{actuator}, c{cycle}")
        kappa = b - a
        series = f"{pair}|kappa_B_minus_A|a{actuator}"
        carriers.append({
            "corpus": "KAPPA_CYCLE_36",
            "carrier_id": f"kappa|{series}|c{cycle}",
            "series_id": series,
            "pair": pair,
            "cut": "B_MINUS_A",
            "actuator": actuator,
            "cycle": cycle,
            "value_kind": "paired_cycle_kappa_deg",
            "value_deg": kappa,
        })

    for r in carriers:
        n2 = round_half_up_int(r["value_deg"], "0.01")
        n3 = round_half_up_int(r["value_deg"], "0.001")
        r["n2_signed_centideg"] = n2
        r["block2_abs_mod100"] = abs(n2) % 100
        r["station11_hit"] = int(r["block2_abs_mod100"] in M11)
        r["n3_signed_millideg"] = n3
        r["block3_last2_abs_mod100"] = abs(n3) % 100
    return carriers


def build_transitions(carriers: list[dict]) -> list[dict]:
    grouped = defaultdict(list)
    for r in carriers:
        grouped[(r["corpus"], r["series_id"])].append(r)
    out = []
    for (corpus, series_id), rows in sorted(grouped.items()):
        rows.sort(key=lambda r: r["cycle"])
        for left, right in zip(rows, rows[1:]):
            d2 = right["n2_signed_centideg"] - left["n2_signed_centideg"]
            d3 = right["n3_signed_millideg"] - left["n3_signed_millideg"]
            out.append({
                "corpus": corpus,
                "series_id": series_id,
                "from_cycle": left["cycle"],
                "to_cycle": right["cycle"],
                "from_value_deg": left["value_deg"],
                "to_value_deg": right["value_deg"],
                "delta_raw_deg": right["value_deg"] - left["value_deg"],
                "delta2_signed_centideg": d2,
                "abs_delta2_centideg": abs(d2),
                "target_plus11": int(d2 == 11),
                "janus_minus11": int(d2 == -11),
                "prespecified_control": int(d2 in SIGNED_CONTROLS),
                "delta3_signed_millideg": d3,
                "same_physical_plus011_exact_at_p3": int(d3 == 110),
            })
    return out


def station_offset_null(carriers: list[dict]) -> tuple[list[dict], dict]:
    rows = []
    summary = {}
    for corpus in ("ABS_PHASE_72", "KAPPA_CYCLE_36"):
        ns = np.array([r["n2_signed_centideg"] for r in carriers if r["corpus"] == corpus], dtype=int)
        counts = []
        for offset in range(100):
            count = int(np.isin(np.abs(ns + offset) % 100, list(M11)).sum())
            counts.append(count)
            rows.append({"corpus": corpus, "offset_centideg": offset, "station11_count": count})
        observed = counts[0]
        p = sum(c >= observed for c in counts) / 100.0
        summary[corpus] = {
            "record_count": int(ns.size),
            "observed_station_count": observed,
            "observed_station_fraction": observed / ns.size,
            "offset_null_count_min": min(counts),
            "offset_null_count_median": float(np.median(counts)),
            "offset_null_count_max": max(counts),
            "station_p_shift": p,
        }
    return rows, summary


def step_spectrum(transitions: list[dict]) -> tuple[list[dict], dict]:
    rows = []
    summary = {}
    for corpus in ("ABS_PHASE_72", "KAPPA_CYCLE_36"):
        ds = [r["delta2_signed_centideg"] for r in transitions if r["corpus"] == corpus]
        counts = {}
        for magnitude in range(1, 26):
            pos = sum(d == magnitude for d in ds)
            neg = sum(d == -magnitude for d in ds)
            counts[magnitude] = pos + neg
            rows.append({
                "corpus": corpus,
                "magnitude_centideg": magnitude,
                "positive_count": pos,
                "negative_count": neg,
                "absolute_count": pos + neg,
                "is_target_magnitude": int(magnitude == 11),
                "is_prespecified_comparator": int(magnitude in {10, 12, 17}),
            })
        count11 = counts[11]
        other_ge = sum(counts[m] >= count11 for m in counts if m != 11)
        p_rank = (1 + other_ge) / 25.0
        summary[corpus] = {
            "transition_count": len(ds),
            "plus11_count": sum(d == 11 for d in ds),
            "minus11_count": sum(d == -11 for d in ds),
            "magnitude11_count": count11,
            "magnitude10_count": counts[10],
            "magnitude12_count": counts[12],
            "magnitude17_count": counts[17],
            "step_rank_p": p_rank,
            "magnitude11_exceeds_all_comparators": count11 > max(counts[10], counts[12], counts[17]),
            "plus11_exceeds_minus11": sum(d == 11 for d in ds) > sum(d == -11 for d in ds),
        }
    return rows, summary


def dither_summary(carriers: list[dict]) -> list[dict]:
    rng = np.random.default_rng(SEED)
    out = []
    for corpus in ("ABS_PHASE_72", "KAPPA_CYCLE_36"):
        rows = [r for r in carriers if r["corpus"] == corpus]
        values = np.array([r["value_deg"] for r in rows], dtype=float)
        series_cycles = defaultdict(list)
        for idx, r in enumerate(rows):
            series_cycles[r["series_id"]].append((r["cycle"], idx))
        edges = []
        for pairs in series_cycles.values():
            ordered = [idx for _, idx in sorted(pairs)]
            edges.extend(zip(ordered, ordered[1:]))
        edge_left = np.array([a for a, _ in edges], dtype=int)
        edge_right = np.array([b for _, b in edges], dtype=int)

        observed_n = round_half_up_array(values, 0.01)
        observed_station = int(np.isin(np.abs(observed_n) % 100, list(M11)).sum())
        observed_d = observed_n[edge_right] - observed_n[edge_left]
        observed_plus11 = int((observed_d == 11).sum())
        observed_minus11 = int((observed_d == -11).sum())
        observed_mag11 = int((np.abs(observed_d) == 11).sum())

        station_counts = np.empty(DITHER_DRAWS, dtype=int)
        plus_counts = np.empty(DITHER_DRAWS, dtype=int)
        minus_counts = np.empty(DITHER_DRAWS, dtype=int)
        magnitude_counts = np.empty(DITHER_DRAWS, dtype=int)
        chunk = 1000
        done = 0
        while done < DITHER_DRAWS:
            size = min(chunk, DITHER_DRAWS - done)
            noise = rng.uniform(-DITHER_HALF_WIDTH_DEG, DITHER_HALF_WIDTH_DEG, size=(size, values.size))
            n = round_half_up_array(values[None, :] + noise, 0.01)
            station_counts[done:done+size] = np.isin(np.abs(n) % 100, list(M11)).sum(axis=1)
            d = n[:, edge_right] - n[:, edge_left]
            plus_counts[done:done+size] = (d == 11).sum(axis=1)
            minus_counts[done:done+size] = (d == -11).sum(axis=1)
            magnitude_counts[done:done+size] = (np.abs(d) == 11).sum(axis=1)
            done += size

        metrics = [
            ("station11_count", observed_station, station_counts),
            ("plus11_count", observed_plus11, plus_counts),
            ("minus11_count", observed_minus11, minus_counts),
            ("magnitude11_count", observed_mag11, magnitude_counts),
        ]
        for name, observed, samples in metrics:
            out.append({
                "corpus": corpus,
                "metric": name,
                "observed_count": observed,
                "dither_mean": float(samples.mean()),
                "dither_median": float(np.median(samples)),
                "dither_p025": float(np.quantile(samples, 0.025)),
                "dither_p975": float(np.quantile(samples, 0.975)),
                "dither_equal_observed_fraction": float((samples == observed).mean()),
                "dither_at_least_observed_fraction": float((samples >= observed).mean()),
            })
    return out


def main() -> None:
    # Fixed synthetic assertions before processing empirical carriers.
    assert round_half_up_int(4.77, "0.01") == 477
    assert round_half_up_int(4.88, "0.01") == 488
    assert round_half_up_int(4.88, "0.01") - round_half_up_int(4.77, "0.01") == 11
    assert abs(round_half_up_int(4.88, "0.01")) % 100 == 88

    carriers = load_carriers()
    transitions = build_transitions(carriers)
    offset_rows, station = station_offset_null(carriers)
    spectrum_rows, steps = step_spectrum(transitions)
    dither = dither_summary(carriers)

    raw_p = {}
    for corpus in ("ABS_PHASE_72", "KAPPA_CYCLE_36"):
        raw_p[f"{corpus}|station"] = station[corpus]["station_p_shift"]
        raw_p[f"{corpus}|step_rank"] = steps[corpus]["step_rank_p"]
    adjusted = holm_adjust(raw_p)

    primary_rows = []
    any_full = False
    any_partial = False
    for corpus in ("ABS_PHASE_72", "KAPPA_CYCLE_36"):
        station_adj = adjusted[f"{corpus}|station"]
        step_adj = adjusted[f"{corpus}|step_rank"]
        full = (
            station_adj <= 0.05
            and step_adj <= 0.05
            and steps[corpus]["magnitude11_exceeds_all_comparators"]
            and steps[corpus]["plus11_exceeds_minus11"]
        )
        partial = (
            station_adj <= 0.05
            or step_adj <= 0.05
            or steps[corpus]["magnitude11_exceeds_all_comparators"]
            or steps[corpus]["plus11_exceeds_minus11"]
        )
        any_full |= full
        any_partial |= partial
        primary_rows.append({
            "corpus": corpus,
            **station[corpus],
            **steps[corpus],
            "station_p_holm": station_adj,
            "step_rank_p_holm": step_adj,
            "full_e11_rule_pass_without_rounding_gate": full,
        })

    if any_full:
        classification = "E11_SPECIFIC_ENRICHMENT_PENDING_ROUNDING_GATE_REVIEW"
    elif any_partial:
        classification = "PARTIAL_E11_PATTERN_NOT_CONFIRMATORY"
    else:
        classification = "NO_SPECIFIC_E11_ENRICHMENT"

    carrier_fields = [
        "corpus", "carrier_id", "series_id", "pair", "cut", "actuator", "cycle",
        "value_kind", "value_deg", "n2_signed_centideg", "block2_abs_mod100",
        "station11_hit", "n3_signed_millideg", "block3_last2_abs_mod100",
    ]
    transition_fields = [
        "corpus", "series_id", "from_cycle", "to_cycle", "from_value_deg",
        "to_value_deg", "delta_raw_deg", "delta2_signed_centideg",
        "abs_delta2_centideg", "target_plus11", "janus_minus11",
        "prespecified_control", "delta3_signed_millideg",
        "same_physical_plus011_exact_at_p3",
    ]
    offset_fields = ["corpus", "offset_centideg", "station11_count"]
    spectrum_fields = [
        "corpus", "magnitude_centideg", "positive_count", "negative_count",
        "absolute_count", "is_target_magnitude", "is_prespecified_comparator",
    ]
    dither_fields = [
        "corpus", "metric", "observed_count", "dither_mean", "dither_median",
        "dither_p025", "dither_p975", "dither_equal_observed_fraction",
        "dither_at_least_observed_fraction",
    ]
    primary_fields = list(primary_rows[0].keys())

    write_csv(PACKAGE / "01_CARRIERS.csv", carriers, carrier_fields)
    write_csv(PACKAGE / "02_TRANSITIONS.csv", transitions, transition_fields)
    write_csv(PACKAGE / "03_STATION_OFFSET_NULL.csv", offset_rows, offset_fields)
    write_csv(PACKAGE / "04_STEP_SPECTRUM.csv", spectrum_rows, spectrum_fields)
    write_csv(PACKAGE / "05_DITHER_SUMMARY.csv", dither, dither_fields)
    write_csv(PACKAGE / "06_PRIMARY_RESULTS.csv", primary_rows, primary_fields)

    result = {
        "schema": "nexah-e11-result/0.1.0",
        "mission_id": "E11-01",
        "status": "COMPLETE_POST_HOC_EXPLORATORY",
        "classification": classification,
        "source_sha256_verified": True,
        "carrier_counts": {
            "ABS_PHASE_72": sum(r["corpus"] == "ABS_PHASE_72" for r in carriers),
            "KAPPA_CYCLE_36": sum(r["corpus"] == "KAPPA_CYCLE_36" for r in carriers),
        },
        "transition_counts": {
            "ABS_PHASE_72": sum(r["corpus"] == "ABS_PHASE_72" for r in transitions),
            "KAPPA_CYCLE_36": sum(r["corpus"] == "KAPPA_CYCLE_36" for r in transitions),
        },
        "primary_results": primary_rows,
        "dither_summary": dither,
        "claims_not_authorized": [
            "11 causes phase behavior",
            "decimal notation is physically privileged",
            "octave mechanism demonstrated",
            "morphogenesis demonstrated",
            "post-hoc pattern is confirmatory evidence",
        ],
    }
    (PACKAGE / "E11_RESULT.json").write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "classification": classification,
        "carrier_counts": result["carrier_counts"],
        "transition_counts": result["transition_counts"],
    }, sort_keys=True))


if __name__ == "__main__":
    main()
