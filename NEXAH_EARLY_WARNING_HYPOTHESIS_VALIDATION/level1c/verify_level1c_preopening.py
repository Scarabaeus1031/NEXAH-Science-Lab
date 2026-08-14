#!/usr/bin/env python3
"""Pre-opening audit of Level-1C orchestration; reads development only."""

from __future__ import annotations

import argparse
import json
import platform
from pathlib import Path

import numpy as np

import run_level1c as runner


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-manifest", type=Path, required=True)
    parser.add_argument("--simulator", type=Path, required=True)
    parser.add_argument("--evaluator", type=Path, required=True)
    parser.add_argument("--development-raw", type=Path, required=True)
    parser.add_argument("--evaluation-raw-dir", type=Path, required=True)
    parser.add_argument("--result", type=Path, required=True)
    args = parser.parse_args()

    require(runner.sha256_file(args.base_manifest) == runner.BASE_HASH, "base hash")
    require(runner.sha256_file(args.simulator) == runner.SIMULATOR_HASH, "simulator hash")
    require(runner.sha256_file(args.evaluator) == runner.EVALUATOR_HASH, "evaluator hash")
    manifest = json.loads(args.base_manifest.read_bytes())
    requests = runner.request_set(manifest)
    primary = [x for x in requests if x["purpose"] == "primary"]
    sensitivity = [x for x in requests if x["purpose"] != "primary"]
    require(len(primary) == 13 * 201 == 2613, "primary request count")
    require(len(sensitivity) == 13, "sensitivity request count")
    require(all(x["seed"] is None for x in primary if x["mode"] == "deterministic"),
            "deterministic seed")
    require(all(x["seed"] in range(200) for x in primary if x["mode"] == "stochastic"),
            "stochastic seed set")
    require(runner.R_THRESHOLD == 0.50 and runner.V_THRESHOLD == 1.00, "frozen thresholds")
    source = Path(runner.__file__).read_text()
    require(".calibrate(" not in source, "retuning path present")
    require("R_THRESHOLD = 0.50" in source and "V_THRESHOLD = 1.00" in source,
            "threshold constants absent")
    require(not list(args.evaluation_raw_dir.glob("*.json")), "evaluation raw pre-exists")

    evaluator = runner.load_module("level1c_preopen_evaluator", args.evaluator,
                                   runner.EVALUATOR_HASH)
    spec = json.loads(Path(args.evaluator.parent / "evaluator_spec_v1.json").read_text())
    raw_before = runner.sha256_file(args.development_raw)
    payload = json.loads(args.development_raw.read_bytes())
    row, _ = runner.one_run_result(evaluator, payload, raw_before, manifest, spec)
    require(row["metadata"]["partition"] == "development", "fixture partition")
    require(runner.sha256_file(args.development_raw) == raw_before, "fixture mutated")
    require(runner.safe_ratio(0, 0) is None, "undefined ratio")
    require(runner.distribution([])["median"] is None, "empty median")
    require(runner.distribution([1.0, 2.0, 3.0])["median"] == 2.0, "median fixture")
    require(runner.sign(None) is None and runner.sign(-1) == -1 and runner.sign(0) == 0
            and runner.sign(1) == 1, "sign fixture")

    result = {
        "artifact_type": "LEVEL1C_PREOPENING_SOFTWARE_VERIFICATION",
        "checks": {
            "controlling_source_hashes": "PASS",
            "development_fixture_immutable": "PASS",
            "evaluation_raw_absent": "PASS",
            "fixed_thresholds": "PASS",
            "no_calibration_call": "PASS",
            "registered_primary_request_count": 2613,
            "registered_sensitivity_request_count": 13,
            "undefined_handling": "PASS",
        },
        "evaluation_opened": False,
        "evaluator_source_sha256": runner.EVALUATOR_HASH,
        "runtime": {"numpy": np.__version__, "python": platform.python_version()},
        "runner_source_sha256": runner.sha256_file(Path(runner.__file__).resolve()),
        "status": "PREOPENING_VERIFICATION_PASS",
        "verifier_source_sha256": runner.sha256_file(Path(__file__).resolve()),
    }
    data = evaluator.canonical_bytes(result)
    disposition = evaluator.write_immutable(args.result, data)
    print(json.dumps({"output": str(args.result), "sha256": runner.sha256_bytes(data),
                      "status": disposition}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
