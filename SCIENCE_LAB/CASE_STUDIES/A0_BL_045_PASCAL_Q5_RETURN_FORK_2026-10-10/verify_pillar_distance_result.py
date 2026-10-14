#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def main(path):
    data = json.loads(Path(path).read_text())
    checks = data.get("checks", {})
    plus = data["operator_separation"]["Qprime_plus"]
    minus = data["operator_separation"]["Qprime_minus"]
    ok = (
        data.get("classification") == "PILLAR_REFLECTION_PASS_QPRIME_NOT_EUCLIDEAN_ISOMETRY"
        and checks
        and all(checks.values())
        and data["scalar_janus_shells"]["center_composition"]["J_second_after_J_first_translation"] == -1216
        and data["pascal_pillars"]["pillar_count"] == 6
        and data["pascal_pillars"]["seam_fixed_point_count"] == 10
        and plus["square"] == [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
        and minus["square"] == [[-1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, -1]]
        and plus["basis_e1_output_norm_squared"] == 89
        and minus["basis_e1_output_norm_squared"] == 89
        and not plus["is_euclidean_isometry"]
        and not minus["is_euclidean_isometry"]
    )
    print("PASS" if ok else "FAIL")
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main(sys.argv[1])
