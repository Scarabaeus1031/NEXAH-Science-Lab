#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> None:
    result = json.loads(Path(sys.argv[1]).read_text())
    checks = {
        "registered_decision": result["decision"] == "PASS_TYPED_EXTENSION_FAMILY_WITH_NONCANONICAL_PAIRING",
        "all_gates": all(result["gates"].values()),
        "ten_variants": len(result["variants"]) == 10,
        "all_variants_C6": all(row["is_C6"] for row in result["variants"]),
        "all_returns": all(row["exact_contraction_return"] for row in result["variants"]),
        "twenty_pairs": len(result["pair_records"]) == 20,
        "pair_overlap": all((row["shared_vertices"], row["shared_edges"]) == (5, 3) for row in result["pair_records"]),
        "pair_union": all((row["union_vertices"], row["union_edges"]) == (7, 9) for row in result["pair_records"]),
        "twelve_abstract_maps": all(row["abstract_C6_isomorphisms"] == 12 for row in result["pair_records"]),
        "two_unoriented_maps": all(row["D5_undirected_edge_correspondences"] == 2 for row in result["pair_records"]),
        "one_oriented_map": all(row["D5_oriented_edge_correspondences"] == 1 for row in result["pair_records"]),
        "identity_not_cross_map": all(not row["identity_on_base_is_isomorphism"] for row in result["pair_records"]),
        "controls_fail": all(not row["is_C6"] for row in result["controls"].values()),
        "four_bit_residual": result["information_ledger"]["uniform_fixed_width_bits"] == 4,
        "claim_boundary": len(result["claim_boundary"]) == 3,
    }
    receipt = {"status": "PASS" if all(checks.values()) else "FAIL", "checks": checks, "passed": sum(checks.values()), "total": len(checks)}
    print(json.dumps(receipt, indent=2, sort_keys=True))
    if receipt["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()

