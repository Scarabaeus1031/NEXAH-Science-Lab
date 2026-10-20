#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> None:
    lock = json.loads((ROOT / "LOCK.json").read_text())
    checks = []
    for record in lock["files"]:
        path = Path(record["path"])
        if not path.is_absolute():
            path = ROOT / path
        actual = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None
        checks.append({"path": record["path"], "expected": record["sha256"], "actual": actual, "pass": actual == record["sha256"]})
    receipt = {"status": "PASS" if all(row["pass"] for row in checks) else "FAIL", "passed": sum(row["pass"] for row in checks), "total": len(checks), "checks": checks}
    print(json.dumps(receipt, indent=2, sort_keys=True))
    if receipt["status"] != "PASS":
        raise SystemExit(1)


if __name__ == "__main__":
    main()

