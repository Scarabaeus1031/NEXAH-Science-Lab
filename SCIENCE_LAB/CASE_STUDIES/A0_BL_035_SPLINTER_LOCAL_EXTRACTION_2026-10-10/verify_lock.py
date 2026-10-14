#!/usr/bin/env python3
import hashlib, json
from pathlib import Path
here=Path(__file__).resolve().parent
lock=json.loads((here/'LOCK.json').read_text())
failures=[]
for name,want in lock['files'].items():
    p=here/name
    got=hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
    if got!=want: failures.append(f'{name}: {got} != {want}')
p=(here/lock['input']['path']).resolve()
got=hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None
if got!=lock['input']['sha256']: failures.append(f'input: {got} != {lock["input"]["sha256"]}')
print(json.dumps({'status':'FAIL' if failures else 'PASS','failures':failures},indent=2))
raise SystemExit(bool(failures))
