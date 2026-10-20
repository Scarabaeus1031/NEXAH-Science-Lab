#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    lock=json.loads((ROOT/"LOCK.json").read_text()); bad=[]
    for row in lock["files"]:
        p=Path(row["path"])
        if not p.is_absolute(): p=ROOT/p
        if not p.exists() or sha(p)!=row["sha256"]: bad.append(row["path"])
    print(f"lock: {len(lock['files'])-len(bad)}/{len(lock['files'])} PASS" if not bad else "lock FAIL: "+", ".join(bad))
    return 1 if bad else 0
if __name__=="__main__": raise SystemExit(main())
