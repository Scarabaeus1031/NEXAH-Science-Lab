#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main():
    lock = json.loads((ROOT / "LOCK.json").read_text(encoding="utf-8"))
    checks = []
    for item in lock["files"]:
        path = Path(item["path"])
        if not path.is_absolute():
            path = (ROOT / path).resolve()
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        checks.append({"path": item["path"], "expected": item["sha256"], "actual": actual, "pass": actual == item["sha256"]})
    passed = sum(c["pass"] for c in checks)
    print(json.dumps({"status": "PASS" if passed == len(checks) else "FAIL", "passed": passed, "total": len(checks), "checks": checks}, indent=2, sort_keys=True))
    raise SystemExit(0 if passed == len(checks) else 1)


if __name__ == "__main__":
    main()

