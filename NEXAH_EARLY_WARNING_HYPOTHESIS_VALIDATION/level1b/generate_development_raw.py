#!/usr/bin/env python3
"""Generate every registered development raw run through frozen Level-1 code."""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path
from typing import Any


BASE_MANIFEST_SHA256 = "d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3"
SIMULATOR_SHA256 = "7cd95b94631aa17b90fc182fa58280ce80103b9de172e88d066519d11c8f6f19"


def load_simulator(path: Path) -> Any:
    import hashlib
    if hashlib.sha256(path.read_bytes()).hexdigest() != SIMULATOR_SHA256:
        raise RuntimeError("FROZEN_SIMULATOR_HASH_MISMATCH")
    module_spec = importlib.util.spec_from_file_location("frozen_level1_simulator", path)
    if module_spec is None or module_spec.loader is None:
        raise RuntimeError("FROZEN_SIMULATOR_IMPORT_FAILED")
    module = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(module)
    return module


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--simulator", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--raw-dir", type=Path, required=True)
    parser.add_argument("--record", type=Path, required=True)
    args = parser.parse_args()

    simulator = load_simulator(args.simulator.resolve())
    manifest, manifest_hash, source_hash = simulator.load_context(args.manifest.resolve())
    if manifest_hash != BASE_MANIFEST_SHA256:
        raise RuntimeError("FROZEN_MANIFEST_HASH_MISMATCH")
    partition = "development"
    primary_dt = float(manifest["numerics"]["primary_dt"])
    sensitivity_dt = float(manifest["numerics"]["convergence_check_dt"])
    entries = []

    requests = []
    for path in manifest["partitions"][partition]["stress_paths"]:
        requests.append((path["path_id"], "deterministic", None, primary_dt, "primary"))
        for seed in manifest["partitions"][partition]["stochastic_seeds"]:
            requests.append((path["path_id"], "stochastic", seed, primary_dt, "primary"))
        requests.append((path["path_id"], "deterministic", None, sensitivity_dt,
                         "deterministic_timestep_sensitivity"))

    for path_id, mode, seed, dt, purpose in requests:
        payload, _ = simulator.build_payload(
            manifest, manifest_hash, source_hash, partition=partition, path_id=path_id,
            mode=mode, seed=seed, dt=dt,
        )
        data = simulator.canonical_bytes(payload)
        output = args.raw_dir / f"{payload['metadata']['run_id']}.json"
        simulator.write_immutable(output, data)
        entries.append({"dt": dt, "mode": mode, "path": str(output),
                        "path_id": path_id, "purpose": purpose, "seed": seed,
                        "sha256": simulator.sha256_bytes(data)})

    record = {
        "artifact_type": "LEVEL1B_DEVELOPMENT_RAW_GENERATION_RECORD",
        "base_manifest_sha256": manifest_hash,
        "evaluation_generated": False,
        "partition": partition,
        "primary_run_count": sum(e["purpose"] == "primary" for e in entries),
        "raw_artifacts": entries,
        "simulator_source_sha256": source_hash,
        "status": "ALL_REGISTERED_DEVELOPMENT_RAW_GENERATED",
        "timestep_sensitivity_run_count": sum(
            e["purpose"] == "deterministic_timestep_sensitivity" for e in entries
        ),
    }
    data = simulator.canonical_bytes(record)
    disposition = simulator.write_immutable(args.record, data)
    print(json.dumps({"output": str(args.record), "sha256": simulator.sha256_bytes(data),
                      "status": disposition}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
