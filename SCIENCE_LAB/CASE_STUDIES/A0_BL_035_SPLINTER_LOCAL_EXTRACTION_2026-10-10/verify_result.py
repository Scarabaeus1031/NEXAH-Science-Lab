#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def check(path):
    d=json.loads(path.read_text()); failures=[]
    def need(x,m):
        if not x: failures.append(m)
    need(d.get("input")=={"sha256":"e8952baf391f430a6b02d7301461d8392d55bb24f85bb3f8e7415af77dfe4705","histories":100,"addresses":56,"classes":56},"input ledger")
    need(all(d.get("controls",{}).values()),"mandatory controls")
    need(set(d.get("model_metrics",{}))=={"M0_ADDRESS","M1_PROFILE","M2_ORIENTED_SEAM","M3_SPLINTER_LOCAL_0","M3_SPLINTER_LOCAL_1","M3_SPLINTER_LOCAL_2","M4_FULL_HISTORY","M5_TERMINAL_ORACLE"},"model set")
    need(d.get("classification") in {"SPLINTER_SUFFICIENT_COMPRESSED","SPLINTER_PARTIAL","SPLINTER_NOT_IDENTIFIED","UNDEFINED_CONTRACT","INVALID_EXPERIMENT"},"classification")
    need(d["model_metrics"]["M5_TERMINAL_ORACLE"]["collision_pairs"]==0,"oracle ceiling")
    return failures
if __name__=="__main__":
    ap=argparse.ArgumentParser(); ap.add_argument("primary",type=Path); ap.add_argument("replay",type=Path); a=ap.parse_args(); f=check(a.primary)+check(a.replay)
    if a.primary.read_bytes()!=a.replay.read_bytes(): f.append("primary/replay bytes")
    print(json.dumps({"status":"FAIL" if f else "PASS","failures":f},indent=2)); raise SystemExit(bool(f))
