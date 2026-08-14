from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from core import write_json


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-manifest", required=True)
    parser.add_argument("--relation-manifest", required=True)
    parser.add_argument("--null-manifest", required=True)
    parser.add_argument("--first-fields", required=True)
    parser.add_argument("--null-fields", required=True)
    parser.add_argument("--src-dir", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    first_manifest = json.loads(Path(args.first_manifest).read_text("utf-8"))
    relation_manifest = json.loads(Path(args.relation_manifest).read_text("utf-8"))
    null_manifest = json.loads(Path(args.null_manifest).read_text("utf-8"))
    first = np.load(args.first_fields, allow_pickle=False)
    null = np.load(args.null_fields, allow_pickle=False)
    observer_text = (Path(args.src_dir) / "blind_observer.py").read_text("utf-8")
    null_text = (Path(args.src_dir) / "null_engine.py").read_text("utf-8")
    checks = {
        "first_order_schema_only": set(first.files) == {"a2_pre", "a2_post", "a3_pre", "a3_post"},
        "first_manifest_forbidden_absent": first_manifest.get("forbidden_fields_absent") is True,
        "null_authentic_kappa_absent": null_manifest.get("authentic_kappa_available") is False,
        "null_schema_only": set(null.files) == {"a2_pre", "a2_post", "a3_pre", "a3_post"},
        "null_engine_does_not_read_relation_artifact": "relation_fields" not in null_text,
        "observer_expected_labels_absent": "RELATIONALLY_STABLE" not in observer_text and "LEE_CANDIDATE" not in observer_text,
        "observer_threshold_literals_absent": "0.05" not in observer_text and "0.01" not in observer_text,
        "relation_layout_absent": relation_manifest.get("layout_used") is False,
        "relation_schema_authorized": relation_manifest.get("schema") == "RELATION_INPUT",
        "transport_bijection": first_manifest.get("transport_interval_bijection") is True,
    }
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    write_json(out / "information_boundary_audit.json", {"all_pass": all(checks.values()), "checks": checks})


if __name__ == "__main__":
    main()
