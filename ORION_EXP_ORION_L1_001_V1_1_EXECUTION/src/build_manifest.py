#!/usr/bin/env python3
import argparse
import hashlib
import json
from pathlib import Path


parser = argparse.ArgumentParser()
parser.add_argument("--root", required=True)
parser.add_argument("--out", required=True)
args = parser.parse_args()
root = Path(args.root).resolve()
out = Path(args.out).resolve()
entries = {}
for path in sorted(p for p in root.rglob("*") if p.is_file() and p.resolve() != out):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    entries[str(path.relative_to(root))] = digest.hexdigest()
with open(out, "w", encoding="utf-8") as handle:
    json.dump({"algorithm": "SHA-256", "root": root.name, "files": entries}, handle, indent=2, sort_keys=True)
    handle.write("\n")

