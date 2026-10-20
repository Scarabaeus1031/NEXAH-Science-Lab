#!/usr/bin/env python3
import argparse, json
from pathlib import Path

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("result"); args=ap.parse_args()
    x=json.loads(Path(args.result).read_text()); checks=[]
    checks.append(x["decision"]=="PASS_GENERAL_CYCLIC_FORMULAS_BOUNDED")
    checks.extend(x["gates"].values())
    rows=x["audit_instances"]
    checks.append(len(rows)==120)
    checks.append(all(r["cyclic_nodes"]==1+r["m"]*r["d"]*(r["d"]+1)//2 for r in rows))
    checks.append(all(r["cyclic_edges"]==r["m"]*r["d"]**2 for r in rows))
    checks.append(all(r["open_nodes"]==r["cyclic_nodes"]+r["d"] for r in rows))
    checks.append(all(r["open_edges"]==r["cyclic_edges"]+r["d"] for r in rows))
    checks.append([r["cyclic_nodes"] for r in x["primary_table"]]==[106,127,148,169])
    checks.append([r["open_nodes"] for r in x["primary_table"]]==[112,133,154,175])
    checks.append(x["boundary"]=="STATIC_QUOTIENT_NOT_DYNAMIC_CONFLUENCE")
    passed=sum(bool(v) for v in checks)
    print(f"verifier: {passed}/{len(checks)} PASS" if passed==len(checks) else f"verifier: {passed}/{len(checks)} FAIL")
    return 0 if passed==len(checks) else 1

if __name__=="__main__": raise SystemExit(main())
