#!/usr/bin/env python3
"""EXP-00-R entry point. Default mode is validation and never touches seeds."""
from __future__ import annotations

import argparse
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "src"))

from exp00r.config_loader import load_config
from exp00r.execution_guard import require_authorization
from exp00r.pipeline import run_registered_pipeline
from exp00r.provenance import environment, verify_freeze_lock


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("validate", "registered", "full"), default="validate")
    parser.add_argument("--config", type=Path, default=ROOT / "EXP_00_R_FROZEN_CONFIG.yaml")
    parser.add_argument("--authorization-file", type=Path)
    parser.add_argument("--output-dir", type=Path)
    args = parser.parse_args(argv)
    config = load_config(args.config)
    frozen_composite = verify_freeze_lock(ROOT, ROOT / "EXP_00_R_FREEZE_LOCK.json")
    require_authorization(args.mode, config, args.config, args.authorization_file)
    if args.mode == "validate":
        print(f"STATIC VALIDATION ONLY: {config['config_id']}")
        print(f"source/config/test composite: {frozen_composite}")
        print(f"environment: {environment()}")
        print("REGISTERED RÖSSLER EXPERIMENT NOT EXECUTED")
        return 0
    if args.output_dir is None:
        parser.error("registered/full mode requires a new --output-dir")
    run_registered_pipeline(config, args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
