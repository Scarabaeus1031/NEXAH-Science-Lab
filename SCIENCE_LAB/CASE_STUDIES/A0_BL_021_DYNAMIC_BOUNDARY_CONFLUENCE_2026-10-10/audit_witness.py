#!/usr/bin/env python3
"""Post-result audit of the explicit path-dependence witness only.

This script does not import or rerun the scientific implementation. It checks
two isomorphism invariants directly from the frozen primary JSON.
"""

import hashlib
import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PRIMARY = ROOT / "artifacts" / "PRIMARY_RESULT.json"
data = json.loads(PRIMARY.read_text(encoding="utf-8"))
witness = data["witness"]
left = witness["left"]
right = witness["right"]


def outgoing_word(record):
    return [flag["outgoing"] for flag in record["boundary_word"]]


def cyclic_pairs(word):
    return Counter((word[i], word[(i + 1) % len(word)]) for i in range(len(word)))


left_word = outgoing_word(left)
right_word = outgoing_word(right)
checks = {
    "both_terminal_carriers_have_154_nodes": left["expanded"]["nodes"] == right["expanded"]["nodes"] == 154,
    "both_terminal_carriers_are_connected": left["expanded"]["components"] == right["expanded"]["components"] == 1,
    "cyclic_edge_profile_transition_multisets_differ": cyclic_pairs(left_word) != cyclic_pairs(right_word),
    "directed_pascal_edge_counts_differ": left["expanded"]["directed_edges"] != right["expanded"]["directed_edges"],
    "declared_signatures_differ": left["typed_signature_sha256"] != right["typed_signature_sha256"],
}
report = {
    "schema": "nexah.a0-bl-021.witness-audit/1.0.0",
    "status": "PASS" if all(checks.values()) else "FAIL",
    "checks": checks,
    "left_history_id": left["history_id"],
    "right_history_id": right["history_id"],
    "left_boundary_profile_word": left_word,
    "right_boundary_profile_word": right_word,
    "left_cyclic_pair_counts": sorted((list(pair), count) for pair, count in cyclic_pairs(left_word).items()),
    "right_cyclic_pair_counts": sorted((list(pair), count) for pair, count in cyclic_pairs(right_word).items()),
    "left_directed_edges": left["expanded"]["directed_edges"],
    "right_directed_edges": right["expanded"]["directed_edges"],
    "primary_sha256": hashlib.sha256(PRIMARY.read_bytes()).hexdigest(),
    "audit_boundary": "Independent witness-certificate audit only; does not independently recompute all 100 histories or 56 terminal classes.",
}
(ROOT / "artifacts" / "WITNESS_AUDIT.json").write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2, sort_keys=True))
if report["status"] != "PASS":
    raise SystemExit(1)
