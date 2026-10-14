"""Hash-bound Euler/Tessarec spectrum comparator candidate.

The program fails closed unless a separate Human Owner authorization receipt
matches the frozen implementation and source hashes.  Contract validation is
available during STRUCTURE_FREEZE and performs no model fit or null simulation.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import platform
import sys
from pathlib import Path
from typing import Any

import numpy as np


HERE = Path(__file__).resolve().parent
PACKAGE = HERE.parent
PREREG = HERE / "assets" / "a0-euler-spectrum-comparator-r0-preregistration.json"
LOCK = HERE / "assets" / "a0-euler-spectrum-comparator-r1-lock.json"
RECORD_ID = "A0_EULER_TESSAREC_SPECTRUM_COMPARATOR_RUN_001"


class ContractError(RuntimeError):
    pass


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ContractError(f"expected JSON object: {path}")
    return value


def resolve_repo_path(relative: str) -> Path:
    root = PACKAGE.parents[1]
    path = root / relative
    if not path.is_file():
        raise ContractError(f"missing repository-local input: {relative}")
    return path


def validate_contract() -> tuple[dict[str, Any], dict[str, Any], Path, np.ndarray]:
    prereg = read_json(PREREG)
    lock = read_json(LOCK)
    source_path = resolve_repo_path(prereg["source"]["path"])

    expected = lock["sha256"]
    actual = {
        "implementation": sha256_file(Path(__file__).resolve()),
        "preregistration": sha256_file(PREREG),
        "source_spectrum": sha256_file(source_path),
    }
    if actual != expected:
        raise ContractError(f"hash divergence: expected {expected}, got {actual}")
    if prereg.get("execution_authorized") is not False:
        raise ContractError("preregistration must remain non-authorizing")
    if prereg.get("source", {}).get("rank_direction") != "descending":
        raise ContractError("rank direction must be descending")
    if prereg.get("euler_family", {}).get("best_c_search_allowed") is not False:
        raise ContractError("best-c search must remain prohibited")

    source = read_json(source_path)
    values = np.asarray(source["spectrum"]["eigenvalues"], dtype=float)
    if values.shape != (48,):
        raise ContractError(f"expected 48 eigenvalues, got {values.shape}")
    if not np.all(values[:-1] >= values[1:]):
        raise ContractError("source eigenvalues are not descending")
    graph = source.get("graph", {})
    if (graph.get("vertices"), graph.get("degree"), graph.get("connected")) != (48, 3, True):
        raise ContractError("source graph contract is not connected 3-regular on 48 vertices")
    return prereg, lock, source_path, values


def design_matrix(model: str, ranks: np.ndarray) -> np.ndarray:
    one = np.ones_like(ranks, dtype=float)
    if model == "M0":
        return one[:, None]
    if model == "M1":
        return np.column_stack((ranks, one))
    if model == "ME":
        return np.column_stack((ranks * ranks + ranks, one))
    if model == "M2":
        return np.column_stack((ranks * ranks, ranks, one))
    raise ContractError(f"unknown model: {model}")


def cv_nrmse(values: np.ndarray, model: str) -> float:
    ranks = np.arange(values.size, dtype=float)
    predictions = np.empty_like(values)
    for fold in range(8):
        start = fold * 6
        held = np.arange(start, start + 6)
        train = np.setdiff1d(np.arange(values.size), held, assume_unique=True)
        coefficients, *_ = np.linalg.lstsq(
            design_matrix(model, ranks[train]), values[train], rcond=None
        )
        predictions[held] = design_matrix(model, ranks[held]) @ coefficients
    scale = float(np.std(values, ddof=0))
    if not math.isfinite(scale) or scale <= 0:
        raise ContractError("spectrum has zero or non-finite population standard deviation")
    return float(np.sqrt(np.mean((values - predictions) ** 2)) / scale)


def spectrum_metrics(values: np.ndarray) -> dict[str, Any]:
    errors = {model: cv_nrmse(values, model) for model in ("M0", "M1", "ME", "M2")}
    if errors["M1"] <= 0 or errors["M2"] <= 0:
        raise ContractError("undefined registered ratio due to zero model error")
    advantage = (errors["M1"] - errors["ME"]) / errors["M1"]
    quadratic_gap = (errors["ME"] - errors["M2"]) / errors["M2"]
    return {"cv_nrmse": errors, "A_E": float(advantage), "G_Q": float(quadratic_gap)}


def connected(vertices: int, edges: list[tuple[int, int]]) -> bool:
    neighbors = [[] for _ in range(vertices)]
    for left, right in edges:
        neighbors[left].append(right)
        neighbors[right].append(left)
    seen = {0}
    stack = [0]
    while stack:
        node = stack.pop()
        for other in neighbors[node]:
            if other not in seen:
                seen.add(other)
                stack.append(other)
    return len(seen) == vertices


def sample_graph(rng: np.random.Generator, vertices: int = 48, degree: int = 3) -> tuple[np.ndarray | None, str | None]:
    stubs = np.repeat(np.arange(vertices, dtype=np.int16), degree)
    rng.shuffle(stubs)
    edges: list[tuple[int, int]] = []
    occupied: set[tuple[int, int]] = set()
    for index in range(0, stubs.size, 2):
        left = int(stubs[index])
        right = int(stubs[index + 1])
        if left == right:
            return None, "self_loop"
        edge = (left, right) if left < right else (right, left)
        if edge in occupied:
            return None, "parallel_edge"
        occupied.add(edge)
        edges.append(edge)
    if not connected(vertices, edges):
        return None, "disconnected"
    adjacency = np.zeros((vertices, vertices), dtype=float)
    for left, right in edges:
        adjacency[left, right] = 1.0
        adjacency[right, left] = 1.0
    return adjacency, None


def require_authorization(path: Path, lock: dict[str, Any]) -> dict[str, Any]:
    receipt = read_json(path)
    required = {
        "record_id": RECORD_ID,
        "status": "OWNER_AUTHORIZED",
        "owner_role": "Human Owner",
        "lab_state": "ACTIVE",
        "execution_authorized": True,
        "implementation_sha256": lock["sha256"]["implementation"],
        "preregistration_sha256": lock["sha256"]["preregistration"],
        "source_spectrum_sha256": lock["sha256"]["source_spectrum"],
    }
    mismatches = {key: {"expected": value, "actual": receipt.get(key)} for key, value in required.items() if receipt.get(key) != value}
    if mismatches:
        raise ContractError(f"authorization receipt mismatch: {mismatches}")
    if not receipt.get("decision_date") or not receipt.get("source_revision"):
        raise ContractError("authorization receipt lacks decision_date or source_revision")
    return receipt


def svg_histogram(null_values: np.ndarray, observed: float, q95: float) -> str:
    width, height = 1200, 720
    margin_left, margin_right, margin_top, margin_bottom = 110, 60, 80, 110
    bins = np.histogram_bin_edges(null_values, bins=50)
    counts, edges = np.histogram(null_values, bins=bins)
    x_min = float(min(edges[0], observed))
    x_max = float(max(edges[-1], observed))
    if x_max == x_min:
        x_max = x_min + 1.0
    y_max = max(int(counts.max()), 1)

    def sx(value: float) -> float:
        return margin_left + (value - x_min) / (x_max - x_min) * (width - margin_left - margin_right)

    def sy(value: float) -> float:
        return height - margin_bottom - value / y_max * (height - margin_top - margin_bottom)

    bars = []
    for count, left, right in zip(counts, edges[:-1], edges[1:]):
        x = sx(float(left))
        w = max(sx(float(right)) - x - 1, 0.5)
        y = sy(float(count))
        bars.append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{height-margin_bottom-y:.2f}" fill="#36c4e8" opacity="0.72"/>')
    observed_x = sx(observed)
    q95_x = sx(q95)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
<rect width="100%" height="100%" fill="#071722"/>
<text x="{margin_left}" y="42" fill="#f4f1e8" font-family="system-ui" font-size="28" font-weight="700">Euler / Tessarec spectrum comparator · registered A_E</text>
<line x1="{margin_left}" y1="{height-margin_bottom}" x2="{width-margin_right}" y2="{height-margin_bottom}" stroke="#78909c"/>
{''.join(bars)}
<line x1="{q95_x:.2f}" y1="{margin_top}" x2="{q95_x:.2f}" y2="{height-margin_bottom}" stroke="#f1bd52" stroke-width="4" stroke-dasharray="10 8"/>
<line x1="{observed_x:.2f}" y1="{margin_top}" x2="{observed_x:.2f}" y2="{height-margin_bottom}" stroke="#f45ba8" stroke-width="5"/>
<text x="{q95_x+8:.2f}" y="{margin_top+24}" fill="#f1bd52" font-family="ui-monospace" font-size="18">null q95 {q95:.6f}</text>
<text x="{observed_x+8:.2f}" y="{margin_top+54}" fill="#f45ba8" font-family="ui-monospace" font-size="18">observed {observed:.6f}</text>
<text x="{width/2}" y="{height-38}" fill="#bac8d3" text-anchor="middle" font-family="system-ui" font-size="20">A_E · held-out advantage over affine rank curve</text>
</svg>'''


def atomic_write_new(path: Path, data: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    try:
        with temporary.open("x", encoding="utf-8") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.link(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def execute(args: argparse.Namespace, prereg: dict[str, Any], lock: dict[str, Any], values: np.ndarray) -> None:
    authorization = require_authorization(Path(args.authorization).resolve(), lock)
    accepted_target = int(prereg["null_population"]["accepted_graphs"])
    maximum_attempts = int(lock["null_generation"]["maximum_attempts"])
    rng = np.random.Generator(np.random.PCG64(int(prereg["null_population"]["seed"])))
    observed = spectrum_metrics(values)
    null_advantages = np.empty(accepted_target, dtype=float)
    rejected = {"self_loop": 0, "parallel_edge": 0, "disconnected": 0}
    accepted = 0
    attempts = 0
    while accepted < accepted_target and attempts < maximum_attempts:
        attempts += 1
        adjacency, reason = sample_graph(rng)
        if adjacency is None:
            rejected[reason or "unknown"] = rejected.get(reason or "unknown", 0) + 1
            continue
        eigenvalues = np.linalg.eigvalsh(adjacency)[::-1]
        null_advantages[accepted] = spectrum_metrics(eigenvalues)["A_E"]
        accepted += 1
    if accepted != accepted_target:
        raise ContractError(f"null generation exhausted after {attempts} attempts with {accepted} accepted")

    q95 = float(np.quantile(null_advantages, 0.95, method="linear"))
    exceedances = int(np.count_nonzero(null_advantages >= observed["A_E"]))
    p_value = (1 + exceedances) / (accepted_target + 1)
    positive = observed["A_E"] >= 0.05 and observed["A_E"] > q95 and observed["G_Q"] <= 0.05
    disposition = prereg["decision"]["positive_label"] if positive else prereg["decision"]["negative_label"]
    result = {
        "schema": "nexah.a0.euler-spectrum-comparator-result",
        "version": "1.0.0",
        "record_id": RECORD_ID,
        "disposition": disposition,
        "authorization": authorization,
        "environment": {
            "python": sys.version,
            "numpy": np.__version__,
            "platform": platform.platform(),
        },
        "hashes": lock["sha256"],
        "rank_direction": "descending",
        "observed": observed,
        "null": {
            "seed": int(prereg["null_population"]["seed"]),
            "accepted": accepted,
            "attempts": attempts,
            "rejected": rejected,
            "A_E_mean": float(np.mean(null_advantages)),
            "A_E_sd_population": float(np.std(null_advantages, ddof=0)),
            "A_E_min": float(np.min(null_advantages)),
            "A_E_q05": float(np.quantile(null_advantages, 0.05, method="linear")),
            "A_E_median": float(np.quantile(null_advantages, 0.50, method="linear")),
            "A_E_q95": q95,
            "A_E_max": float(np.max(null_advantages)),
            "observed_exceedances": exceedances,
            "monte_carlo_p_upper": p_value,
        },
        "decision_gates": {
            "A_E_at_least_0_05": observed["A_E"] >= 0.05,
            "A_E_above_null_q95": observed["A_E"] > q95,
            "G_Q_at_most_0_05": observed["G_Q"] <= 0.05,
            "all_gates_pass": positive,
        },
        "audit": {
            "best_c_search_performed": False,
            "primary_statistic": prereg["statistics"]["primary"],
            "secondary_results_can_rescue": False,
        },
        "claim_boundary": prereg["claim_boundary"],
    }
    output_json = Path(args.output_json).resolve()
    output_svg = Path(args.output_svg).resolve()
    if output_json == output_svg:
        raise ContractError("result JSON and SVG paths must be distinct")
    atomic_write_new(output_json, json.dumps(result, indent=2, sort_keys=True) + "\n")
    atomic_write_new(output_svg, svg_histogram(null_advantages, observed["A_E"], q95))
    print(json.dumps({"status": "PASS", "disposition": disposition, "result": str(output_json), "figure": str(output_svg)}))


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--validate-contract", action="store_true")
    group.add_argument("--execute", action="store_true")
    parser.add_argument("--authorization")
    parser.add_argument("--output-json")
    parser.add_argument("--output-svg")
    args = parser.parse_args()
    try:
        prereg, lock, source_path, values = validate_contract()
        if args.validate_contract:
            print(json.dumps({
                "status": "PASS",
                "mode": "CONTRACT_ONLY_NO_MODEL_FIT_NO_NULL_SIMULATION",
                "execution_authorized": False,
                "rank_direction": "descending",
                "source": str(source_path),
                "eigenvalue_count": int(values.size),
                "implementation_sha256": lock["sha256"]["implementation"],
            }))
            return 0
        if not args.authorization or not args.output_json or not args.output_svg:
            raise ContractError("--execute requires --authorization, --output-json and --output-svg")
        execute(args, prereg, lock, values)
        return 0
    except (ContractError, KeyError, ValueError, OSError, np.linalg.LinAlgError) as error:
        print(json.dumps({"status": "INVALID_COMPARATOR_RUN", "error": str(error)}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
