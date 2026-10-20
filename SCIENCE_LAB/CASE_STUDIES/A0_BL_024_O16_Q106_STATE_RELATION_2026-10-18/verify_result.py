#!/usr/bin/env python3
import json
import sys
from pathlib import Path

path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent / "artifacts" / "PRIMARY_RESULT.json"
result = json.loads(path.read_text())
assert result["schema"] == "nexah.a0-bl-024.o16-q106-state-relation-result/1.0.0"
assert result["carriers"] == {"bijection_possible": False, "o16_states": 16, "q106_nodes": 106}
assert result["decision"] in {
    "INFORMATION_LOST_RESIDUAL_SUFFICIENT_AND_NO_CANONICAL_MAP",
    "INFORMATION_LOST_RESIDUAL_SUFFICIENT",
    "NON_IDENTIFIABLE_NO_CANONICAL_MAP",
    "PARTIAL", "INVALID_DESIGN", "UNINFORMATIVE"
}
for name in ("P1_BALANCED_INDEX", "P2_TYPED_ATTRIBUTE"):
    audit = result["maps"][name]
    assert audit["states_reached"] == 16
    assert audit["collision_count"] == 90
    assert audit["exact_return_count"] == 106
    assert audit["representative_lift_size"] == 16
    assert audit["representative_lift_surjective"] is False
assert result["maps"]["P1_BALANCED_INDEX"]["fiber_size_histogram"] == result["maps"]["C1_FIXED_SHUFFLED_INDEX"]["fiber_size_histogram"]
assert result["shuffle_assignment_difference"] > 0
assert result["rotation_order_control"] == {"gcd": 1, "nontrivial_homomorphism_possible": False, "o16_cyclic_order": 4, "q106_rotation_order": 5}
assert all(result["gates"].values()) if result["decision"] == "INFORMATION_LOST_RESIDUAL_SUFFICIENT_AND_NO_CANONICAL_MAP" else True
print(json.dumps({"status": "PASS", "checks": 18, "decision": result["decision"]}, sort_keys=True))
