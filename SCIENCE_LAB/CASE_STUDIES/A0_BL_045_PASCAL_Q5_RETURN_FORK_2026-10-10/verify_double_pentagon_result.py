#!/usr/bin/env python3
import json
import sys
from pathlib import Path


def main(path):
    data = json.loads(Path(path).read_text())
    checks = data.get("checks", {})
    ok = (
        data.get("classification") == "SIGNED_DOUBLE_RETURN_IDENTIFIED"
        and checks
        and all(checks.values())
        and data["candidate_operators"]["reciprocal_bridge_Qprime_plus"]["square"] == [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
        and data["candidate_operators"]["reciprocal_bridge_Qprime_minus"]["square"] == [[-1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, -1]]
        and not data["candidate_operators"]["same_direction_bridge"]["is_involution"]
    )
    print("PASS" if ok else "FAIL")
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main(sys.argv[1])
