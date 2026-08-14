from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np


REVIEWED_HASH = "83811aca6c6c495bc98b3e6de4a8723b4e7452fed16534de92e806957476c4e9"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, indent=2, sort_keys=True, allow_nan=False) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir", required=True)
    parser.add_argument("--mode", choices=("primary", "replay"), required=True)
    args = parser.parse_args()
    root = Path(args.run_dir).resolve()
    source_manifest = json.loads((root / "raw" / "SOURCE_INPUT_MANIFEST.json").read_text())
    candidate_paths = {representation: root / "extractions" / "primary" / "candidates" / representation / "candidate.npz" for representation in ("R0", "R1", "R2")}
    jsonl_paths = {representation: candidate_paths[representation].with_name("candidate.jsonl") for representation in candidate_paths}
    candidates = {representation: np.load(path, allow_pickle=False) for representation, path in candidate_paths.items()}
    supports = {representation: candidates[representation]["support"].astype(bool) for representation in candidates}
    joint = supports["R0"] & supports["R1"] & supports["R2"]
    all_tied = {}
    for representation, candidate in candidates.items():
        ranks = candidate["ranks"][joint]
        all_tied[representation] = int(np.sum(np.all(ranks == ranks[:, [0]], axis=1)))
    if not any(count > 0 for count in all_tied.values()):
        raise RuntimeError("registered zero-denominator failure is not present")
    r3_path = root / "extractions" / "R3" / "candidates" / "R3" / "r3_result.json"
    r3 = json.loads(r3_path.read_text())
    if r3.get("result") != "UNDEFINED" or r3.get("rank_record_count") != 0:
        raise RuntimeError("R3 fail-closed result mismatch")
    result = {
        "baselines": {"passing_count": 0, "registered_count": 2, "status": "NOT_REACHED_PRIMARY_INVALID"},
        "candidate_artifacts": {
            representation: {"candidate_jsonl_sha256": sha(jsonl_paths[representation]), "candidate_npz_sha256": sha(candidate_paths[representation])}
            for representation in ("R0", "R1", "R2")
        },
        "candidate_id": "NEXAH-L4-C001",
        "controls": {"passing_count": 0, "registered_count": 6, "status": "NOT_REACHED_PRIMARY_INVALID"},
        "experiment_id": "EXP-ORION-L4-001",
        "failure": {
            "all_tied_joint_count": all_tied,
            "code": "KENDALL_TAU_B_ZERO_DENOMINATOR",
            "interpretation": "At least one registered jointly supported weak preorder is fully tied; tau_b is undefined and no row removal or synthetic value is permitted.",
            "stage": "BLIND_ORION_OBSERVER_BEFORE_SEAL"
        },
        "information_loss_R3": {"passes": True, "rank_record_count": 0, "result": "UNDEFINED"},
        "joint_query_count": int(joint.sum()),
        "out_of_support_fraction": {representation: float(1.0 - support.mean()) for representation, support in supports.items()},
        "overall_l4_status": "INVALID",
        "pairwise_kendall_tau_b_and_kappa": "UNDEFINED_PRIMARY_INVALID",
        "primary_classification": "INVALID_EXPERIMENT",
        "review_state": {"critical": 0, "major": 0, "minor": 3},
        "reviewed_design_sha256": REVIEWED_HASH,
        "sensitivity": {"passing_count": 0, "registered_count": 8, "status": "NOT_REACHED_PRIMARY_INVALID"},
        "source_input_digest": source_manifest["scientific_input_digest"],
        "source_provenance_validation": "PASS_BEFORE_OBSERVER_FAILURE"
    }
    save(root / "scientific_result.json", result)
    result_hash = sha(root / "scientific_result.json")
    save(root / "SCIENTIFIC_RESULT_HASH.json", {"algorithm": "SHA-256", "file": "scientific_result.json", "sha256": result_hash})
    save(root / "failure_closeout_record.json", {"closeout_created_after_primary_failure_known": True, "mode": args.mode, "scientific_result_sha256": result_hash})
    print(json.dumps({"mode": args.mode, "scientific_result_sha256": result_hash, "status": "INVALID"}, sort_keys=True))


if __name__ == "__main__":
    main()
