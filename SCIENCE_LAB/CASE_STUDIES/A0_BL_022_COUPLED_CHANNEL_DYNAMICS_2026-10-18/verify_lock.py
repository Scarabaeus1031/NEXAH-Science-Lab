#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
R=Path(__file__).resolve().parent
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 x=json.loads((R/'LOCK.json').read_text());bad=[]
 for q in x['files']:
  p=Path(q['path']);p=p if p.is_absolute() else R/p
  if not p.exists() or h(p)!=q['sha256']:bad.append(q['path'])
 print(f"lock: {len(x['files'])-len(bad)}/{len(x['files'])} PASS" if not bad else 'lock FAIL '+str(bad));return bool(bad)
if __name__=='__main__':raise SystemExit(main())
