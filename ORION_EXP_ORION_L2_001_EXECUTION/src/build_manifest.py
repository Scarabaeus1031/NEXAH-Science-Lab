#!/usr/bin/env python3
import argparse,hashlib,json
from pathlib import Path
ap=argparse.ArgumentParser();ap.add_argument("--root",required=True);ap.add_argument("--out",required=True);a=ap.parse_args();root=Path(a.root).resolve();out=Path(a.out).resolve();files={}
for p in sorted(x for x in root.rglob("*") if x.is_file() and x.resolve()!=out):files[str(p.relative_to(root))]=hashlib.sha256(p.read_bytes()).hexdigest()
with open(out,"w",encoding="utf-8") as f:json.dump({"algorithm":"SHA-256","root":root.name,"files":files},f,indent=2,sort_keys=True);f.write("\n")
