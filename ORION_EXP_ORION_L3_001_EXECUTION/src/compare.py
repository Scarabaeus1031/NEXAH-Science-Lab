#!/usr/bin/env python3
"""Stage 5: verify blind seal, then and only then open expected registry."""
import argparse,hashlib,json
def load(p):
    with open(p,encoding="utf-8") as f:return json.load(f)
def chash(o):return hashlib.sha256(json.dumps(o,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--observed",required=True);ap.add_argument("--expected",required=True);ap.add_argument("--out",required=True);a=ap.parse_args();sealed=load(a.observed);obs=sealed["observations"]
    verified=chash(obs)==sealed["sealed_observation_hash"]
    if not verified:raise SystemExit("sealed observation mismatch; expected registry not opened")
    expected=load(a.expected);candidates={}
    for e in expected["candidates"]:
        o=obs["candidate_results"][e["candidate_id"]];candidates[e["candidate_id"]]={**o,"expected_class":e["expected_class"],"match":o["observed_class"]==e["expected_class"]}
    controls={k:{**v,"expected_outcome":"TARGET SUCCESSFULLY BROKEN","match":v["passed"] is True} for k,v in obs["destructive_controls"].items()}
    cm=sum(v["match"] for v in candidates.values());dm=sum(v["match"] for v in controls.values());cross_ids=("L3-C02","L3-C03","L3-C05");undef_ids=("L3-C04","L3-C06","L3-C10");xm=sum(candidates[x]["match"] for x in cross_ids);um=sum(candidates[x]["match"] and candidates[x]["observed_class"]=="UNDEFINED" for x in undef_ids);info=not obs["information_boundaries"]["leakage_detected"] and um==3
    if not obs["source_validation"]["passed"]:status="INVALID"
    elif cm==10 and xm==3 and um==3 and dm==7 and info:status="PASS"
    elif cm or dm:status="PARTIAL"
    else:status="FAILED"
    result={"experiment_id":obs["experiment_id"],"preregistration_sha256":obs["preregistration_sha256"],"review_minor_limitations":["C02/C03/C08 partly test translation conformance, not discovery.","kNN resolution and cosine criteria are benchmark criteria, not Lorenz theorems."],"stage_order":["source_generator","representation_generators","blind_observer_classifier","sealed_observation","expected_class_comparator"],"observer_seal_verified":verified,"observer_sealed_hash":sealed["sealed_observation_hash"],"source_validation":obs["source_validation"],"candidates":candidates,"candidates_matched":cm,"candidates_total":10,"cross_language":obs["cross_language"],"cross_language_matched":xm,"cross_language_total":3,"undefined_tests":obs["undefined_tests"],"undefined_correct":um,"undefined_total":3,"destructive_controls":controls,"destructive_controls_matched":dm,"destructive_controls_total":7,"information_boundaries":obs["information_boundaries"],"information_loss_boundaries_pass":info,"false_friends":obs["false_friends"],"overall_l3_status":status}
    with open(a.out,"w",encoding="utf-8") as f:json.dump(result,f,indent=2,sort_keys=True);f.write("\n")
if __name__=="__main__":main()

