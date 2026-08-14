#!/usr/bin/env python3
"""L2 comparator: opens expected registry only after checking observer seal."""
import argparse,hashlib,json
from pathlib import Path

def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def chash(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--observed",required=True);ap.add_argument("--expected",required=True);ap.add_argument("--out",required=True);a=ap.parse_args()
    sealed=load(a.observed);obs=sealed["observations"]
    seal_verified=chash(obs)==sealed["sealed_observation_hash"]
    if not seal_verified:raise SystemExit("observer seal verification failed before expected registry access")
    expected=load(a.expected)
    candidates={}
    for e in expected["candidate_claims"]:
        o=obs["candidate_results"][e["id"]]
        candidates[e["id"]]={**o,"expected_class":e["expected_class"],"expected_observed_match":o["observed_class"]==e["expected_class"]}
    controls={}
    for e in expected["destructive_controls"]:
        o=obs["destructive_controls"][e["id"]]
        controls[e["id"]]={**o,"expected_outcome":"PASS TARGET DESTRUCTION","expected_observed_match":o["passed"] is True}
    cm=sum(v["expected_observed_match"] for v in candidates.values());dm=sum(v["expected_observed_match"] for v in controls.values())
    source=obs["source_validation"]["passed"]
    if not source:status="INVALID"
    elif cm==13 and dm==6 and obs["correspondence_preserved"] and seal_verified:status="PASS"
    elif cm>0 or dm>0:status="PARTIAL"
    else:status="FAILED"
    result={"experiment_id":obs["experiment_id"],"preregistration_sha256":obs["preregistration_sha256"],"review_minor_limitation":"Exact transport identities are conformance tests, not discoveries of new Lorenz mathematics.","stage_order":["generator","blind_observer_classifier","sealed_observation","comparator"],"observer_seal_verified":seal_verified,"observer_sealed_hash":sealed["sealed_observation_hash"],"source_validation":obs["source_validation"],"coordinate_transformation_defect":obs["coordinate_transformation_defect"],"chaotic_long_horizon_pointwise_gate_used":False,"correspondence_preserved":obs["correspondence_preserved"],"candidates":candidates,"candidates_matched":cm,"candidates_total":13,"destructive_controls":controls,"destructive_controls_matched":dm,"destructive_controls_total":6,"information_loss_test":{"candidate":"L2-C12","passed":candidates["L2-C12"]["expected_observed_match"],"claimant_information":"z_only","hidden_information_access":False},"overall_l2_status":status}
    with open(a.out,"w",encoding="utf-8") as f:json.dump(result,f,indent=2,sort_keys=True);f.write("\n")
if __name__=="__main__":main()

