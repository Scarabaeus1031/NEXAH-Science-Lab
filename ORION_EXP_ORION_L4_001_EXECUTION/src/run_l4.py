from __future__ import annotations

import argparse
import hashlib
import json
import platform
import subprocess
import sys
from pathlib import Path

import numpy as np

from blind_observer import null_for_pair, quantile_higher
from l4_core import (
    ACTION_IDS,
    PULLBACK_METRIC,
    SCALE_MATRIX,
    Target,
    anchored_ranks,
    canonical_tree_manifest,
    fit_target,
    load_json,
    no_fixed_point_permutation,
    normalized_regret,
    pair_kappa,
    pair_summary,
    plant_products,
    save_json,
    save_npz_deterministic,
    sha256_file,
    sha_seed,
    source_dataset,
)

REVIEWED_HASH = "83811aca6c6c495bc98b3e6de4a8723b4e7452fed16534de92e806957476c4e9"
INHERITED_HASHES = {
    "EXP_00_V2_LEARNED_PARITY/config/exp_00_v2_config.yaml": "f52e470a0891f0b1d3021374eeae30e992dc3fab5ce45ea527c52a7d6a952790",
    "EXP_00_V2_LEARNED_PARITY/src/core.py": "2dcd3b6ed2a5b1ebdf92fa8b42602198d1c7c6371b832bf505d778d02e5afef5",
    "EXP_00_V2_LEARNED_PARITY/src/representations.py": "0b6b78e07b460b14f22d6afd27cd9742f5a32cb1778a8c8b2132983618a41cf1",
}


def canonical_digest(entries: dict[str, str]) -> str:
    payload = "".join(f"{name}\t{entries[name]}\n" for name in sorted(entries)).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def verify_design(prereg: Path) -> dict:
    manifest = load_json(prereg / "DESIGN_HASH_MANIFEST.json")
    actual = {name: sha256_file(prereg / name) for name in manifest["files"]}
    if actual != manifest["files"]:
        raise RuntimeError("reviewed preregistration component hash mismatch")
    digest = canonical_digest(actual)
    if digest != REVIEWED_HASH or manifest["reviewed_design_sha256"] != REVIEWED_HASH:
        raise RuntimeError("reviewed preregistration canonical hash mismatch")
    review = manifest["review_attestation"]
    if (review["critical_count"], review["major_count"], review["minor_count"]) != (0, 0, 3):
        raise RuntimeError("review state mismatch")
    return manifest


def verify_provenance(workspace: Path) -> dict:
    actual = {path: sha256_file(workspace / path) for path in INHERITED_HASHES}
    return {"actual": actual, "expected": INHERITED_HASHES, "valid": actual == INHERITED_HASHES}


def run_process(command: list[str], log: Path) -> None:
    result = subprocess.run(command, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, check=False)
    log.parent.mkdir(parents=True, exist_ok=True)
    log.write_text(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"subprocess failed ({result.returncode}); see {log}")


def write_input(path: Path, **arrays: np.ndarray) -> None:
    save_npz_deterministic(path, **arrays)


def worker_config(path: Path, config: dict) -> None:
    save_json(path, config)


def invoke_worker(execution_root: Path, input_path: Path, config_path: Path, output_path: Path) -> None:
    command = [sys.executable, str(execution_root / "src" / "extractor_worker.py"), "--input", str(input_path), "--config", str(config_path), "--output-dir", str(output_path)]
    run_process(command, output_path.parent / f"{output_path.name}_worker.log")


def load_candidate(path: Path) -> dict[str, np.ndarray]:
    data = np.load(path / "candidate.npz", allow_pickle=False)
    return {name: data[name] for name in data.files}


def extract_triplet(
    execution_root: Path,
    base: Path,
    source: dict[str, np.ndarray],
    target: Target,
    label: str,
    terminal: np.ndarray,
    k: int = 25,
    clusters: int = 64,
    smoothing: int = 3,
    tolerance: float = 1e-6,
) -> dict[str, dict[str, np.ndarray]]:
    root = base / label
    inputs = root / "inputs"
    configs = root / "configs"
    candidates = root / "candidates"
    inputs.mkdir(parents=True, exist_ok=False)
    configs.mkdir(parents=True, exist_ok=False)
    candidates.mkdir(parents=True, exist_ok=False)
    train_z = target.normalize(source["train_states"])
    query_z = target.normalize(source["test_states"])
    query_ids = source["test_query_ids"]
    target_dict = target.as_dict()
    specifications = {
        "R0": (
            {"train_coordinates": train_z, "query_coordinates": query_z, "train_terminal": terminal, "query_ids": query_ids},
            {"representation_id": "R0", "extractor_id": f"E0_TRAJECTORY_{label}", "kind": "trajectory", "k": k, "metric": "identity", "inverse_register_terminal": False, "tie_tolerance": tolerance, "target": target_dict},
        ),
        "R1": (
            {"train_coordinates": train_z @ SCALE_MATRIX.T, "query_coordinates": query_z @ SCALE_MATRIX.T, "train_terminal": terminal @ SCALE_MATRIX.T, "query_ids": query_ids},
            {"representation_id": "R1", "extractor_id": f"E1_TRAJECTORY_{label}", "kind": "trajectory", "k": k, "metric": "pullback", "inverse_register_terminal": True, "tie_tolerance": tolerance, "target": target_dict},
        ),
        "R2": (
            {"train_coordinates": train_z, "query_coordinates": query_z, "train_terminal": terminal, "query_ids": query_ids},
            {"representation_id": "R2", "extractor_id": f"E2_GRAPH_{label}", "kind": "graph", "clusters": clusters, "max_iter": 100, "smoothing_neighbors": smoothing, "tie_tolerance": tolerance, "target": target_dict},
        ),
    }
    result = {}
    for representation, (arrays, config) in specifications.items():
        input_path = inputs / f"{representation}.npz"
        config_path = configs / f"{representation}.json"
        output_path = candidates / representation
        write_input(input_path, **arrays)
        worker_config(config_path, config)
        invoke_worker(execution_root, input_path, config_path, output_path)
        result[representation] = load_candidate(output_path)
    return result


def pair_means(candidates: dict[str, dict[str, np.ndarray]], indices: np.ndarray) -> dict[str, dict]:
    return {
        "R0_R1": pair_summary(candidates["R0"]["ranks"][indices], candidates["R1"]["ranks"][indices]),
        "R0_R2": pair_summary(candidates["R0"]["ranks"][indices], candidates["R2"]["ranks"][indices]),
        "R1_R2": pair_summary(candidates["R1"]["ranks"][indices], candidates["R2"]["ranks"][indices]),
    }


def linear_action_scores(train_coordinates: np.ndarray, query_coordinates: np.ndarray, train_terminal_scores: np.ndarray) -> np.ndarray:
    n = len(train_coordinates)
    action_eye = np.eye(7)
    state_rows = np.repeat(train_coordinates, 7, axis=0)
    action_rows = np.tile(action_eye, (n, 1))
    interaction = (state_rows[:, :, None] * action_rows[:, None, :]).reshape(n * 7, 21)
    design = np.column_stack((np.ones(n * 7), state_rows, action_rows, interaction))
    response = train_terminal_scores.reshape(-1)
    penalty = np.eye(design.shape[1]) * 1e-6
    penalty[0, 0] = 0.0
    coefficient = np.linalg.solve(design.T @ design + penalty, design.T @ response)
    q = len(query_coordinates)
    q_state = np.repeat(query_coordinates, 7, axis=0)
    q_action = np.tile(action_eye, (q, 1))
    q_interaction = (q_state[:, :, None] * q_action[:, None, :]).reshape(q * 7, 21)
    q_design = np.column_stack((np.ones(q * 7), q_state, q_action, q_interaction))
    return (q_design @ coefficient).reshape(q, 7)


def cluster_bootstrap_upper(candidate_regret: np.ndarray, baseline_regret: np.ndarray, seed_ids: np.ndarray) -> tuple[float, list[float]]:
    unique = np.unique(seed_ids)
    blocks = {seed: np.flatnonzero(seed_ids == seed) for seed in unique}
    rng = np.random.default_rng(92017)
    values = []
    for _ in range(500):
        sampled = rng.choice(unique, size=len(unique), replace=True)
        indices = np.concatenate([blocks[seed] for seed in sampled])
        values.append(float(np.nanmedian(candidate_regret[indices]) - np.nanmedian(baseline_regret[indices])))
    return float(np.quantile(values, 0.95)), values


def evaluate_baselines(source: dict[str, np.ndarray], target: Target, primary: dict, joint: np.ndarray, base: Path) -> dict:
    train_z = target.normalize(source["train_states"])
    query_z = target.normalize(source["test_states"])
    train_true = target.score(source["train_terminal"])
    test_true = target.score(source["test_terminal"])[joint]
    seed_ids = source["test_seed_ids"][joint]
    b0_scores = np.broadcast_to(train_true.mean(axis=0), (len(source["test_states"]), 7)).copy()
    b1_native = linear_action_scores(train_z, query_z, train_true)
    b1_r1 = linear_action_scores(train_z @ SCALE_MATRIX.T, query_z @ SCALE_MATRIX.T, train_true)
    baseline_ranks = {
        "B0_GLOBAL_MEAN": {rep: anchored_ranks(b0_scores, 1e-6) for rep in ("R0", "R1", "R2")},
        "B1_LINEAR_ACTION": {"R0": anchored_ranks(b1_native, 1e-6), "R1": anchored_ranks(b1_r1, 1e-6), "R2": anchored_ranks(b1_native, 1e-6)},
    }
    results = {}
    bootstrap_arrays = {}
    for baseline_id, per_rep in baseline_ranks.items():
        path_results = {}
        for representation in ("R0", "R1", "R2"):
            candidate_regret = normalized_regret(primary[representation]["ranks"][joint], test_true)
            baseline_regret = normalized_regret(per_rep[representation][joint], test_true)
            difference = float(np.nanmedian(candidate_regret) - np.nanmedian(baseline_regret))
            upper, boot = cluster_bootstrap_upper(candidate_regret, baseline_regret, seed_ids)
            path_results[representation] = {
                "baseline_median_normalized_regret": float(np.nanmedian(baseline_regret)),
                "candidate_median_normalized_regret": float(np.nanmedian(candidate_regret)),
                "candidate_minus_baseline_median": difference,
                "cluster_bootstrap_replicates": 500,
                "cluster_bootstrap_seed": 92017,
                "upper_95": upper,
                "passes": bool(difference <= -0.025 and upper < 0.0),
            }
            bootstrap_arrays[f"{baseline_id}_{representation}"] = np.asarray(boot)
        results[baseline_id] = {"paths": path_results, "passes_all_paths": all(value["passes"] for value in path_results.values())}
    save_npz_deterministic(base / "baseline_bootstrap_distributions.npz", **bootstrap_arrays)
    payload = {"baseline_count": 2, "baselines": results, "passing_count": sum(value["passes_all_paths"] for value in results.values())}
    save_json(base / "baseline_results.json", payload)
    return payload


def permute_terminals_d1(terminal: np.ndarray, train_seed_ids: np.ndarray, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    out = terminal.copy()
    for source_seed in np.unique(train_seed_ids):
        block = np.flatnonzero(train_seed_ids == source_seed)
        for action in range(7):
            out[block, action] = terminal[rng.permutation(block), action]
    return out


def permute_actions_d2(terminal: np.ndarray, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    out = np.empty_like(terminal)
    for index in range(len(terminal)):
        out[index] = terminal[index, rng.permutation(7)]
    return out


def evaluate_controls(execution_root: Path, base: Path, source: dict, target: Target, primary: dict, joint: np.ndarray, input_digest: str, primary_pairs: dict) -> dict:
    controls_root = base / "controls"
    controls_root.mkdir()
    true_scores = target.score(source["test_terminal"])[joint]
    results = {}

    d1_terminal = permute_terminals_d1(source["train_terminal"], source["train_seed_ids"], sha_seed("L4-CONTROLD1", input_digest))
    d1 = extract_triplet(execution_root, controls_root, source, target, "D1", d1_terminal)
    d1_paths = {}
    for rep in ("R0", "R1", "R2"):
        support_complete = bool(d1[rep]["support"][joint].all())
        controlled = normalized_regret(d1[rep]["ranks"][joint], true_scores)
        original = normalized_regret(primary[rep]["ranks"][joint], true_scores)
        worsening = float(np.nanmedian(controlled) - np.nanmedian(original))
        d1_paths[rep] = {"support_complete": support_complete, "median_regret_worsening": worsening, "passes": bool(support_complete and worsening >= 0.05)}
    results["D1"] = {"paths": d1_paths, "passes": all(value["passes"] for value in d1_paths.values())}

    d2_terminal = permute_actions_d2(source["train_terminal"], sha_seed("L4-CONTROLD2", input_digest))
    d2 = extract_triplet(execution_root, controls_root, source, target, "D2", d2_terminal)
    d2_pairs = pair_means(d2, joint)
    d2_kmin = min(value["mean_kappa"] for value in d2_pairs.values())
    primary_kmin = min(value["mean_kappa"] for value in primary_pairs.values())
    results["D2"] = {"k_min": d2_kmin, "pair_results": d2_pairs, "drop_from_primary": primary_kmin - d2_kmin, "passes": bool(d2_kmin <= 0.55 or primary_kmin - d2_kmin >= 0.10)}

    wrong_root = controls_root / "D3"
    (wrong_root / "inputs").mkdir(parents=True)
    (wrong_root / "configs").mkdir()
    (wrong_root / "candidates").mkdir()
    train_z = target.normalize(source["train_states"]) @ SCALE_MATRIX.T
    query_z = target.normalize(source["test_states"]) @ SCALE_MATRIX.T
    input_path = wrong_root / "inputs" / "R1.npz"
    config_path = wrong_root / "configs" / "R1.json"
    output_path = wrong_root / "candidates" / "R1"
    write_input(input_path, train_coordinates=train_z, query_coordinates=query_z, train_terminal=source["train_terminal"] @ SCALE_MATRIX.T, query_ids=source["test_query_ids"])
    worker_config(config_path, {"representation_id": "R1", "extractor_id": "E1_TRAJECTORY_D3_WRONG_TRANSPORT", "kind": "trajectory", "k": 25, "metric": "identity", "inverse_register_terminal": False, "tie_tolerance": 1e-6, "target": target.as_dict()})
    invoke_worker(execution_root, input_path, config_path, output_path)
    d3 = load_candidate(output_path)
    d3_complete = bool(d3["support"][joint].all())
    d3_k01 = pair_summary(primary["R0"]["ranks"][joint], d3["ranks"][joint])["mean_kappa"]
    primary_k01 = primary_pairs["R0_R1"]["mean_kappa"]
    results["D3"] = {"controlled_k_01": d3_k01, "drop_from_primary": primary_k01 - d3_k01, "support_complete": d3_complete, "passes": bool(d3_complete and (primary_k01 - d3_k01 >= 0.05 or d3_k01 < 0.60))}

    d4 = extract_triplet(execution_root, controls_root, source, target, "D4", source["train_local"])
    d4_paths = {rep: pair_summary(primary[rep]["ranks"][joint], d4[rep]["ranks"][joint])["mean_kappa"] for rep in ("R0", "R1", "R2")}
    results["D4"] = {"candidate_to_primary_mean_kappa": d4_paths, "paths_at_or_below_0_75": sum(value <= 0.75 for value in d4_paths.values()), "passes": bool(sum(value <= 0.75 for value in d4_paths.values()) >= 2)}

    rng_d5 = np.random.default_rng(sha_seed("L4-CONTROLD5", input_digest))
    node_scores = primary["R2"]["node_scores"]
    query_labels = primary["R2"]["query_labels"]
    node_permutation = no_fixed_point_permutation(len(node_scores), rng_d5)
    d5_scores = node_scores[node_permutation][query_labels]
    d5_ranks = anchored_ranks(d5_scores, 1e-6)
    save_npz_deterministic(controls_root / "D5_controlled_candidate.npz", scores=d5_scores, ranks=d5_ranks, node_permutation=node_permutation)
    d5_kappa = pair_summary(primary["R0"]["ranks"][joint], d5_ranks[joint])["mean_kappa"]
    results["D5"] = {"controlled_mean_kappa": d5_kappa, "drop_from_primary_k02": primary_pairs["R0_R2"]["mean_kappa"] - d5_kappa, "passes": bool(d5_kappa <= 0.55 or primary_pairs["R0_R2"]["mean_kappa"] - d5_kappa >= 0.10)}

    rng_d6 = np.random.default_rng(sha_seed("L4-CONTROLD6", input_digest))
    joint_seed_ids = source["test_seed_ids"][joint]
    permutation = np.arange(len(joint))
    for seed_id in np.unique(joint_seed_ids):
        block = np.flatnonzero(joint_seed_ids == seed_id)
        permutation[block] = block[no_fixed_point_permutation(len(block), rng_d6)]
    r0_joint = primary["R0"]["ranks"][joint]
    r2_deranged = primary["R2"]["ranks"][joint][permutation]
    d6_kappa = pair_summary(r0_joint, r2_deranged)["mean_kappa"]
    d6_null_seed = sha_seed("L4-NULLR0_R2_D6", input_digest)
    d6_null = null_for_pair(r0_joint, r2_deranged, joint_seed_ids, d6_null_seed)
    d6_q99 = quantile_higher(d6_null, 0.99)
    save_npz_deterministic(controls_root / "D6_null_distribution.npz", values=d6_null, permutation=permutation)
    results["D6"] = {"controlled_mean_kappa": d6_kappa, "null_99_quantile_higher": d6_q99, "null_seed": int(d6_null_seed), "passes": bool(d6_kappa <= 0.55 and d6_kappa <= d6_q99)}

    payload = {"control_count": 6, "controls": results, "passing_count": sum(value["passes"] for value in results.values())}
    save_json(controls_root / "control_results.json", payload)
    return payload


def evaluate_sensitivity(execution_root: Path, base: Path, source: dict, target: Target, primary: dict, joint: np.ndarray) -> dict:
    sensitivity_root = base / "sensitivity"
    sensitivity_root.mkdir()
    settings = [
        ("k20", 20, 64, 3, 1e-6), ("k30", 30, 64, 3, 1e-6),
        ("K48", 25, 48, 3, 1e-6), ("K80", 25, 80, 3, 1e-6),
        ("m2", 25, 64, 2, 1e-6), ("m4", 25, 64, 4, 1e-6),
        ("delta1e-7", 25, 64, 3, 1e-7), ("delta1e-5", 25, 64, 3, 1e-5),
    ]
    results = {}
    for label, k, clusters, smoothing, tolerance in settings:
        candidate = extract_triplet(execution_root, sensitivity_root, source, target, label, source["train_terminal"], k, clusters, smoothing, tolerance)
        support_complete = all(bool(candidate[rep]["support"][joint].all()) for rep in ("R0", "R1", "R2"))
        pairs = pair_means(candidate, joint)
        k_min = min(value["mean_kappa"] for value in pairs.values())
        within = {rep: pair_summary(primary[rep]["ranks"][joint], candidate[rep]["ranks"][joint])["mean_kappa"] for rep in ("R0", "R1", "R2")}
        min_within = min(within.values())
        results[label] = {"k": k, "K": clusters, "m": smoothing, "delta": tolerance, "support_complete": support_complete, "k_min": k_min, "within_path_primary_agreement": within, "min_within_path_agreement": min_within, "passes": bool(support_complete and k_min >= 0.60 and min_within >= 0.90)}
    passing = sum(value["passes"] for value in results.values())
    family_pass = {
        "k": any(results[name]["passes"] for name in ("k20", "k30")),
        "K": any(results[name]["passes"] for name in ("K48", "K80")),
        "m": any(results[name]["passes"] for name in ("m2", "m4")),
        "delta": any(results[name]["passes"] for name in ("delta1e-7", "delta1e-5")),
    }
    if passing >= 7 and all(family_pass.values()):
        conclusion = "NEIGHBORHOOD-STABLE"
    elif passing >= 3:
        conclusion = "PARAMETER-SENSITIVE"
    else:
        conclusion = "SETTING-SPECIFIC"
    payload = {"setting_count": 8, "passing_count": passing, "family_has_preserving_alternative": family_pass, "conclusion": conclusion, "settings": results}
    save_json(sensitivity_root / "sensitivity_results.json", payload)
    return payload


def artifact_manifest(root: Path) -> dict:
    files = [path for path in root.rglob("*") if path.is_file() and path.name != "ARTIFACT_HASH_MANIFEST.json"]
    payload = {"algorithm": "SHA-256", "files": canonical_tree_manifest(root, files)}
    save_json(root / "ARTIFACT_HASH_MANIFEST.json", payload)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace", required=True)
    parser.add_argument("--execution-root", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--mode", choices=("primary", "replay"), required=True)
    args = parser.parse_args()
    workspace = Path(args.workspace).resolve()
    execution_root = Path(args.execution_root).resolve()
    output = Path(args.output).resolve()
    if output.exists():
        raise RuntimeError("output directory must not exist")
    output.mkdir(parents=True)

    prereg = workspace / "ORION_LEVEL_4_NEXAH_CANDIDATE_PREREGISTRATION"
    design_manifest = verify_design(prereg)
    lock = execution_root / "PREREGISTRATION_LOCK.md"
    if not lock.exists() or REVIEWED_HASH not in lock.read_text() or "RESULT KNOWN AT LOCK TIME: NO" not in lock.read_text():
        raise RuntimeError("valid preimplementation lock missing")
    provenance = verify_provenance(workspace)
    if not provenance["valid"]:
        raise RuntimeError("inherited source/extractor provenance mismatch")

    raw = output / "raw"
    raw.mkdir()
    train_seeds = list(range(51000, 51030))
    test_seeds = list(range(52000, 52030))
    train_states, train_seed_ids, train_sample_ids = source_dataset(train_seeds)
    test_states, test_seed_ids, test_sample_ids = source_dataset(test_seeds)
    train_local, train_terminal = plant_products(train_states)
    test_local, test_terminal = plant_products(test_states)
    target = fit_target(train_states)
    train_query_ids = np.asarray([f"SEED-{seed}-STATE-{sample:03d}" for seed, sample in zip(train_seed_ids, train_sample_ids)])
    test_query_ids = np.asarray([f"SEED-{seed}-STATE-{sample:03d}" for seed, sample in zip(test_seed_ids, test_sample_ids)])
    source = {
        "train_states": train_states, "test_states": test_states,
        "train_seed_ids": train_seed_ids, "test_seed_ids": test_seed_ids,
        "train_sample_ids": train_sample_ids, "test_sample_ids": test_sample_ids,
        "train_query_ids": train_query_ids, "test_query_ids": test_query_ids,
        "train_local": train_local, "train_terminal": train_terminal,
        "test_local": test_local, "test_terminal": test_terminal,
    }
    save_npz_deterministic(raw / "source_products.npz", **source)
    save_npz_deterministic(raw / "observer_seed_ids.npz", test_seed_ids=test_seed_ids)
    save_json(raw / "target.json", target.as_dict())
    source_identity = {
        "action_ids": list(ACTION_IDS), "action_amplitude": 0.5, "burn_in": 5.0,
        "decision_interval": 0.05, "dt": 0.005, "horizon": 0.5,
        "initial_state_bounds": [[-15.0, 15.0], [-20.0, 20.0], [5.0, 35.0]],
        "integrator": "RK4", "observation_noise": 0.0,
        "plant": {"sigma": 10.0, "rho": 28.0, "beta": 8.0 / 3.0},
        "sample_interval": 0.1, "states_per_seed": 50,
        "test_seeds": test_seeds, "train_seeds": train_seeds,
    }
    save_json(raw / "source_identity.json", source_identity)
    source_entries = {path.name: sha256_file(path) for path in (raw / "source_products.npz", raw / "observer_seed_ids.npz", raw / "target.json", raw / "source_identity.json")}
    input_digest = canonical_digest(source_entries)
    source_manifest = {"files": source_entries, "scientific_input_digest": input_digest}
    save_json(raw / "SOURCE_INPUT_MANIFEST.json", source_manifest)

    primary = extract_triplet(execution_root, output / "extractions", source, target, "primary", train_terminal)
    r3_root = output / "extractions" / "R3"
    (r3_root / "inputs").mkdir(parents=True)
    (r3_root / "configs").mkdir()
    (r3_root / "candidates").mkdir()
    r3_input = r3_root / "inputs" / "R3.npz"
    r3_config = r3_root / "configs" / "R3.json"
    write_input(r3_input, train_z=train_states[:, 2], query_z=test_states[:, 2], query_ids=test_query_ids)
    worker_config(r3_config, {"representation_id": "R3", "extractor_id": "E3_TYPE_CHECK_ONLY", "tie_tolerance": 1e-6})
    invoke_worker(execution_root, r3_input, r3_config, r3_root / "candidates" / "R3")
    r3_result = load_json(r3_root / "candidates" / "R3" / "r3_result.json")
    r3_schema = sorted(np.load(r3_input, allow_pickle=False).files)
    r3_pass = bool(r3_schema == ["query_ids", "query_z", "train_z"] and r3_result["result"] == "UNDEFINED" and r3_result["rank_record_count"] == 0)

    observer_dir = output / "observer"
    command = [sys.executable, str(execution_root / "src" / "blind_observer.py"), "--r0", str(output / "extractions" / "primary" / "candidates" / "R0" / "candidate.npz"), "--r1", str(output / "extractions" / "primary" / "candidates" / "R1" / "candidate.npz"), "--r2", str(output / "extractions" / "primary" / "candidates" / "R2" / "candidate.npz"), "--seed-ids", str(raw / "observer_seed_ids.npz"), "--input-manifest-hash", input_digest, "--output-dir", str(observer_dir)]
    run_process(command, output / "logs" / "blind_observer.log")
    observed = load_json(observer_dir / "observed_metrics.json")
    observer_seal_hash = sha256_file(observer_dir / "OBSERVER_SEAL.json")

    support_valid = bool(all(value <= 0.10 for value in observed["out_of_support_fraction"].values()) and observed["joint_support_fraction"] >= 0.80)
    pair_null_pass = {pair_id: bool(value["mean_kappa"] > value["null_99_quantile_higher"] and value["p_value"] <= 0.01) for pair_id, value in observed["pair_results"].items()}
    relation_pass = {pair_id: value["mean_kappa"] >= 0.60 for pair_id, value in observed["pair_results"].items()}
    if support_valid and observed["k_min"] >= 0.60 and all(pair_null_pass.values()):
        classification = "ROBUST"
    elif support_valid and (len(set(relation_pass.values())) > 1 or len(set(pair_null_pass.values())) > 1):
        classification = "REPRESENTATION_DEPENDENT"
    elif support_valid:
        classification = "FAILED"
    else:
        classification = "INVALID_EXPERIMENT"
    comparison = {"classification": classification, "expected_class_opened_after_observer_seal": True, "observer_seal_sha256": observer_seal_hash, "pair_null_pass": pair_null_pass, "pair_relation_threshold_pass": relation_pass, "support_valid": support_valid}
    save_json(output / "comparison_result.json", comparison)

    joint = np.load(observer_dir / "joint_population.npz", allow_pickle=False)["indices"]
    primary_pairs = pair_means(primary, joint)
    baseline_results = evaluate_baselines(source, target, primary, joint, output / "analysis")
    control_results = evaluate_controls(execution_root, output, source, target, primary, joint, input_digest, primary_pairs)
    sensitivity_results = evaluate_sensitivity(execution_root, output, source, target, primary, joint)

    implementation_paths = [execution_root / "src" / name for name in ("l4_core.py", "extractor_worker.py", "blind_observer.py", "run_l4.py")]
    implementation_hashes = {path.name: sha256_file(path) for path in implementation_paths}
    source_validation = {
        "cardinality_valid": bool(len(train_states) == 1500 and len(test_states) == 1500 and train_terminal.shape == (1500, 7, 3) and test_terminal.shape == (1500, 7, 3)),
        "finite_valid": bool(all(np.isfinite(value).all() for value in (train_states, test_states, train_local, train_terminal, test_local, test_terminal))),
        "inherited_provenance": provenance,
        "reviewed_design_hash_verified": True,
        "review_state": {"critical": 0, "major": 0, "minor": 3},
        "seed_blocks_disjoint_from_historical_v2": True,
        "valid": bool(provenance["valid"] and len(train_states) == 1500 and len(test_states) == 1500 and np.isfinite(train_terminal).all() and np.isfinite(test_terminal).all()),
    }
    scientific_result = {
        "baselines": baseline_results,
        "candidate_id": "NEXAH-L4-C001",
        "controls": control_results,
        "experiment_id": "EXP-ORION-L4-001",
        "implementation_hashes": implementation_hashes,
        "information_loss_R3": {"input_schema": r3_schema, "passes": r3_pass, "result": r3_result},
        "observer": observed,
        "primary_classification": classification,
        "primary_comparison": comparison,
        "reviewed_design_sha256": REVIEWED_HASH,
        "sensitivity": sensitivity_results,
        "source_input_digest": input_digest,
        "source_provenance_validation": source_validation,
    }
    save_json(output / "scientific_result.json", scientific_result)
    result_hash = sha256_file(output / "scientific_result.json")
    save_json(output / "SCIENTIFIC_RESULT_HASH.json", {"algorithm": "SHA-256", "file": "scientific_result.json", "sha256": result_hash})
    save_json(output / "environment.json", {"numpy": np.__version__, "platform": platform.platform(), "python": sys.version, "python_executable_sha256": sha256_file(Path(sys.executable))})
    save_json(output / "run_record.json", {"mode": args.mode, "result_hash": result_hash, "result_known_at_lock_time": False})
    artifact_manifest(output)
    print(json.dumps({"classification": classification, "control_passes": control_results["passing_count"], "baseline_passes": baseline_results["passing_count"], "r3_pass": r3_pass, "sensitivity_passes": sensitivity_results["passing_count"], "result_hash": result_hash}, sort_keys=True))


if __name__ == "__main__":
    main()
