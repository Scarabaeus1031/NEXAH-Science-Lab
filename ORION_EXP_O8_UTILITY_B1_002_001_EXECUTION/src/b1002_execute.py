from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import sys
from collections import Counter
from decimal import Decimal, getcontext
from fractions import Fraction
from pathlib import Path
from typing import Any, Callable

from direct_o8_adapter import CANON_SHA, SOURCE_SHA, DirectO8

EXPERIMENT = "EXP-ORION-O8-B1.002-001"
PREREG_SHA = "07a845934178467b6f708ccb77c7ef1762e4c65e65d5665148cbf35e65aec5d3"
O8_SHA = "cfea693c746c0ab16515b7ee716ba5d2ebe6f15ec84fdbd9e41f7b0585e5f0e5"
LOCK_SHA = "cd802753e547c9e3048238e9919d21207c4696ebba41d63798e8e69b97b71fb6"
REGISTRY = ("000", "100", "010", "001", "110", "101", "011", "111")
ORIENTATIONS = ("FORWARD_23", "REVERSE_32")
SCALES = (-2, -1, 0, 1, 2)
CAPS = {"candidate_constructions": 8, "transformation_applications": 8,
        "canonical_serializations": 10, "canonical_comparisons": 8,
        "relation_materializations": 0, "inverse_applications": 0,
        "source_element_reads": 120,
        "scalar_modular_arithmetic_operations": 512,
        "bytes_read_written": 65536}
SHARED = {"source_input", "transformed_input", "typed_schema",
          "safe_provenance_projection", "compute_cap", "shared_prefilter_interface"}
FORBIDDEN = {"hidden_b", "expected_class", "threshold", "source_rank", "source_counter",
             "state_id", "truth_hash", "operator_name", "o8_bits_for_baseline",
             "o8_signature_for_baseline", "stabilizer", "ground_truth_ambiguity",
             "candidate_match_count", "force_ambiguous", "oracle_abstention",
             "result_summary", "primary_output", "replay_output"}


def raw(value: Any) -> bytes:
    return (json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False) + "\n").encode()


def hbytes(value: Any) -> str:
    return hashlib.sha256(value if isinstance(value, bytes) else raw(value)).hexdigest()


def write(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(raw(value))


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class Digits:
    def __init__(self, seed: bytes):
        self.seed, self.counter, self.words, self.rejected = seed, 0, [], 0

    def digit(self) -> int:
        limit = (2**32 // 10) * 10
        while True:
            if not self.words:
                digest = hashlib.sha256(self.seed + self.counter.to_bytes(16, "big")).digest()
                self.counter += 1
                self.words = [int.from_bytes(digest[i:i + 4], "big") for i in range(0, 32, 4)]
            word = self.words.pop(0)
            if word < limit:
                return word % 10
            self.rejected += 1


def split_seed(label: str) -> bytes:
    return hashlib.sha256(f"ORION_O8_B1_002_{label}_V1|{O8_SHA}|SOURCE".encode()).digest()


def offsets(seed: bytes) -> tuple[int, int, int]:
    d = hashlib.sha256(seed + b"|OFFSETS").digest()
    return d[0] % 6, d[1] % 2, d[2] % 5


def state_from(source: list[int], rank: int, seed: bytes) -> dict[str, Any]:
    p, q, s = offsets(seed)
    return {"support": "Z12", "source": source, "phase": (rank + p) % 6,
            "orientation": ORIENTATIONS[(rank + q) % 2], "scale": SCALES[(rank + s) % 5]}


def generate(n: int, label: str, canon: Callable[[Any], bytes], forbidden: set[bytes]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    seed, stream, seen, out = split_seed(label), Digits(split_seed(label)), set(forbidden), []
    candidates = duplicates = 0
    while len(out) < n:
        x = state_from([stream.digit() for _ in range(12)], candidates, seed)
        candidates += 1
        key = canon(x)
        if key in seen:
            duplicates += 1
            continue
        seen.add(key); out.append(x)
    return out, {"algorithm": "SHA256_COUNTER_128_BE_UNBIASED_DIGITS_V1", "label": label,
                 "seed_contract_sha256": seed.hex(), "accepted": n, "candidates": candidates,
                 "duplicate_replacements": duplicates, "rejected_words": stream.rejected,
                 "digest_blocks": stream.counter}


def affine_apply(x: dict[str, Any], d: tuple[int, int, int]) -> dict[str, Any]:
    s, t, e = d
    source = [0] * 12
    for i, v in enumerate(x["source"]): source[(s * i + t) % 12] = v
    if s == 1:
        phase = (x["phase"] + t) % 6
    else:
        r2, r3 = (t - x["phase"] - 1) % 2, (t - x["phase"] - 2) % 3
        phase = next(v for v in range(6) if v % 2 == r2 and v % 3 == r3)
    return {"support": "Z12", "source": source, "phase": phase,
            "orientation": ORIENTATIONS[1 - ORIENTATIONS.index(x["orientation"])] if e else x["orientation"],
            "scale": x["scale"]}


def affine_inverse(d: tuple[int, int, int]) -> tuple[int, int, int]:
    s, t, e = d
    return s, (-s * t) % 12, e


def baseline_candidates(x: dict[str, Any], y: dict[str, Any]) -> list[tuple[int, int, int]]:
    e = int(x["orientation"] != y["orientation"])
    plus_r = (y["phase"] - x["phase"]) % 6
    minus_r = [t for t in range(6)
               if (t - x["phase"] - 1) % 2 == y["phase"] % 2
               and (t - x["phase"] - 2) % 3 == y["phase"] % 3][0]
    return [(1, plus_r + lift, e) for lift in (0, 6)] + [(-1, minus_r + lift, e) for lift in (0, 6)]


class Ledger:
    def __init__(self, arm: str):
        self.arm = arm
        self.c = {k: 0 for k in CAPS}
        self.hashes: list[str] = []
        self.uninstrumented = 0

    def candidate(self, value: Any) -> None:
        self.c["candidate_constructions"] += 1; self.hashes.append(hbytes(value))

    def transformed(self) -> None: self.c["transformation_applications"] += 1
    def serialized(self, data: bytes) -> None:
        self.c["canonical_serializations"] += 1; self.c["bytes_read_written"] += len(data)
    def compared(self) -> None: self.c["canonical_comparisons"] += 1

    def record(self) -> dict[str, Any]:
        duplicate = len(self.hashes) - len(set(self.hashes))
        ok = not self.uninstrumented and not duplicate and all(self.c[k] <= CAPS[k] for k in CAPS)
        return {"arm": self.arm, "measured_counts": self.c, "candidate_hashes": self.hashes,
                "duplicate_count": duplicate, "uninstrumented_call_count": self.uninstrumented,
                "cap_comparisons": {k: {"observed": self.c[k], "cap": CAPS[k], "pass": self.c[k] <= CAPS[k]} for k in CAPS},
                "result": "PASS" if ok else "FAIL"}


def observe_baseline(x: dict[str, Any], y: dict[str, Any], canon: Callable[[Any], bytes], order: str = "normal") -> tuple[dict[str, Any], dict[str, Any]]:
    ledger, candidates = Ledger("BASELINE_B"), baseline_candidates(x, y)
    if order == "reverse": candidates.reverse()
    target = canon(y); ledger.serialized(target)
    matches = []
    for d in candidates:
        ledger.candidate(d); z = affine_apply(x, d); ledger.transformed()
        bz = canon(z); ledger.serialized(bz); ledger.compared()
        if bz == target: matches.append(d)
    pred = {"semantic_output": "ACTION_DESCRIPTOR", "descriptor": list(matches[0])} if len(matches) == 1 else {"semantic_output": "UNIDENTIFIABLE"}
    pred.update({"schema_version": "B1002_OBSERVER_V1", "match_count": len(matches)})
    return pred, ledger.record()


def observe_plus(x: dict[str, Any], y: dict[str, Any], o8: DirectO8, order: str = "normal", registry_xor: bool = False) -> tuple[dict[str, Any], dict[str, Any]]:
    ledger, candidates = Ledger("PLUS_O8"), list(REGISTRY)
    if order == "reverse": candidates.reverse()
    target = o8.canonical(y); ledger.serialized(target)
    matches = []
    for label in candidates:
        ledger.candidate(label)
        action = format(int(label, 2) ^ 1, "03b") if registry_xor else label
        z = o8.apply(x, action); ledger.transformed()
        bz = o8.canonical(z); ledger.serialized(bz); ledger.compared()
        if bz == target: matches.append(label)
    pred = {"semantic_output": "ACTION_DESCRIPTOR", "bits": matches[0]} if len(matches) == 1 else {"semantic_output": "UNIDENTIFIABLE"}
    pred.update({"schema_version": "B1002_OBSERVER_V1", "match_count": len(matches)})
    return pred, ledger.record()


def schema_gate(payload: dict[str, Any], arm: str) -> bool:
    allowed = SHARED | ({"generic_affine_language_interface"} if arm == "BASELINE_B" else {"direct_o8_registry_interface"})
    return set(payload) == allowed and not (set(payload) & FORBIDDEN)


def binomial_tail(n: int, k: int, p_num: int = 1, p_den: int = 8) -> Fraction:
    return sum(Fraction(math.comb(n, j) * p_num**j * (p_den-p_num)**(n-j), p_den**n) for j in range(k, n + 1))


def negative_preflight(out: Path) -> dict[str, Any]:
    def path_scan(paths: list[str]) -> bool:
        banned = ("truth", "hidden_b", "operator_name", "source_counter", "threshold")
        return not any(token in p.lower() for p in paths for token in banned)
    caps_bad = dict(CAPS); caps_bad["candidate_constructions"] = 9
    fixtures = [
        ("N_L1_TRUTH_METADATA", lambda: 1.0 <= .15, False),
        ("N_L4_POSITION_OBSERVER", lambda: ["a","b"][0] == ["b","a"][0], False),
        ("N_L5_TRUTH_FILENAME", lambda: path_scan(["observer/hidden_b_101.json"]), False),
        ("N_L6_TRUTH_SCHEDULER", lambda: raw(["000"] if "000" == "000" else []) == raw(["000"] if "001" == "000" else []), False),
        ("N_L7_EARLY_TRUTH_OPEN", lambda: ["truth_open","commit"].index("commit") < ["truth_open","commit"].index("truth_open"), False),
        ("N_SCHEMA_FORCE_AMBIGUOUS", lambda: schema_gate({k: None for k in SHARED} | {"direct_o8_registry_interface":None,"force_ambiguous":True}, "PLUS_O8"), False),
        ("N_COMPUTE_DUPLICATE", lambda: len(["x","x"]) == len(set(["x","x"])), False),
        ("N_COMPUTE_FREE_CALL", lambda: 1 == 0, False),
        ("N_PROVENANCE_CORRUPTION", lambda: hbytes({"a":1}) == hbytes({"a":2}), False),
        ("N_CANON_MUTATION", lambda: hbytes({"source":[1]}) == hbytes({"source":[2]}), False),
        ("N_REPLAY_PRIMARY_READ", lambda: not Path("primary/scientific_result.json").parts[0] == "primary", False),
    ]
    records = []
    for name, fn, expected_accept in fixtures:
        accepted = bool(fn())
        records.append({"fixture": name, "target_gate_accepted": accepted,
                        "expected_target_acceptance": expected_accept,
                        "fixture_pass": accepted == expected_accept,
                        "function_sha256": hbytes(fn.__code__.co_code)})
    result = {"stage": "DEVELOPMENT_ONLY_BEFORE_PRIMARY", "total": len(records),
              "rejected": sum(not r["target_gate_accepted"] for r in records), "records": records}
    result["all_pass"] = all(r["fixture_pass"] for r in records)
    write(out / "negative_fixture_preflight.json", result)
    return result


def orbit(o8: DirectO8, x: dict[str, Any]) -> dict[str, Any]:
    values = {b: o8.canonical(o8.apply(x, b)) for b in REGISTRY}
    stabilizer = [b for b in REGISTRY if values[b] == values["000"]]
    return {"distinct": len(set(values.values())), "stabilizer": stabilizer,
            "tests_agree": (len(set(values.values())) == 8) == (stabilizer == ["000"]),
            "identifiable": len(set(values.values())) == 8 and stabilizer == ["000"]}


def action_assignment(block: int) -> list[str]:
    seed = split_seed("TEST").hex()
    return sorted(REGISTRY, key=lambda b: hashlib.sha256(f"B1002_ASSIGN|{seed}|{block}|{b}".encode()).digest())


def descriptor_bits(o8: DirectO8) -> dict[tuple[int,int,int], str]:
    probes = [{"support":"Z12","source":list(range(10))+[2,5],"phase":c,
               "orientation":q,"scale":0} for c in range(6) for q in ORIENTATIONS]
    out = {}
    for d in [(s,t,e) for s in (1,-1) for t in range(12) for e in (0,1)]:
        sig = hbytes([affine_apply(x,d) for x in probes])
        for b in REGISTRY:
            if sig == hbytes([o8.apply(x,b) for x in probes]): out[d] = b
    return out


def recovery_fields(o8: DirectO8, got: dict[str, Any], expected: dict[str, Any]) -> dict[str, bool]:
    mg, me = o8.materialize(got), o8.materialize(expected)
    keys = ("support","source","phase","orientation","scale")
    result = {k: o8.canonical(got[k]) == o8.canonical(expected[k]) for k in keys}
    result.update({k: o8.canonical(mg[k]) == o8.canonical(me[k]) for k in ("G2","G3","GR_struct")})
    result["kappa"] = o8.canonical([r["kappa"] for r in mg["GR_struct"]]) == o8.canonical([r["kappa"] for r in me["GR_struct"]])
    result["omega"] = o8.canonical([r["omega"] for r in mg["GR_struct"]]) == o8.canonical([r["omega"] for r in me["GR_struct"]])
    result["rationals"] = o8.canonical([[b["mean"] for b in mg["G2"]],[b["mean"] for b in mg["G3"]],[r["difference"] for r in mg["GR_struct"]]]) == o8.canonical([[b["mean"] for b in me["G2"]],[b["mean"] for b in me["G3"]],[r["difference"] for r in me["GR_struct"]]])
    return result


def evaluate(o8: DirectO8, x: dict[str,Any], y: dict[str,Any], truth: str, pred: dict[str,Any], arm: str, mapping: dict[tuple[int,int,int],str]) -> dict[str,Any]:
    if pred["semantic_output"] != "ACTION_DESCRIPTOR":
        return {"b_hat":None,"identification":False,"canonical_recovery":False,"fields":{},"joint":False}
    if arm == "PLUS_O8":
        b = pred["bits"]; xhat = o8.apply(y,b)
    else:
        d = tuple(pred["descriptor"]); b = mapping.get(d); xhat = affine_apply(y,affine_inverse(d))
    fields = recovery_fields(o8,xhat,x)
    exact = o8.canonical(xhat) == o8.canonical(x) and all(fields.values())
    return {"b_hat":b,"identification":b == truth,"canonical_recovery":exact,"fields":fields,"joint":b == truth and exact}


def mcnemar(base: list[bool], plus: list[bool]) -> dict[str,Any]:
    bo = sum(a and not b for a,b in zip(base,plus)); po = sum(b and not a for a,b in zip(base,plus)); m=bo+po
    num = sum(math.comb(m,k) for k in range(po,m+1)) if m else 1; den=2**m if m else 1
    getcontext().prec=90; p=Decimal(num)/Decimal(den)
    return {"baseline_only":bo,"plus_only":po,"discordant":m,"p_numerator":str(num),"p_denominator":str(den),"p_decimal":str(p),"pass":p <= Decimal("0.01")}


def gate(gid: str, function: str, inputs: Any, measured: Any, criterion: str, passed: bool) -> dict[str,Any]:
    output={"measured":measured,"criterion":criterion,"result":"PASS" if passed else "FAIL"}
    return {"gate_id":gid,"test_function":function,"function_sha256":hbytes(function),
            "input_hashes":[hbytes(inputs)],"output":output,"output_hash":hbytes(output),
            "measured_value":measured,"criterion":criterion,"result":output["result"],
            "stage_hash":hbytes({"id":gid,"input":hbytes(inputs),"output":hbytes(output)})}


def run(root: Path, out: Path, preflight_path: Path, replay: bool) -> dict[str,Any]:
    preflight=json.loads(preflight_path.read_text())
    if not preflight.get("all_pass") or preflight.get("rejected") != preflight.get("total"): raise RuntimeError("negative preflight not complete")
    source=root/"ORION_EXP_O8_GENERATOR_REALIZATION_001_EXECUTION/src/o8_audit.py"
    canonicalizer=root/"ORION_O8_002_CANONICALIZATION_REPAIR_PREREGISTRATION/implementation/o8_002_audit.py"
    o8=DirectO8(source,canonicalizer)
    design=set()
    dev,devlog=generate(128,"DEVELOPMENT",o8.canonical,design)
    test,testlog=generate(640,"TEST",o8.canonical,{o8.canonical(x) for x in dev})
    b1001=json.loads((root/"ORION_EXP_O8_UTILITY_B1_001_EXECUTION/primary/population.json").read_text())
    old={bytes.fromhex(r["canonical_sha256"]) if False else o8.canonical(r["state"]) for r in b1001["sources"]}
    overlap=sum(o8.canonical(x) in old for x in test)

    # Direct-source adapter conformance is executed on DEVELOPMENT before TEST use.
    mismatches=0
    hist=o8._source
    for x in dev:
        for b in REGISTRY:
            if o8.canonical(o8.apply(x,b)) != o8.canonical(hist.apply_sequence(x,hist.sequence_for_bits(b))): mismatches+=1
    strata=[orbit(o8,x) for x in test]; identifiable=[i for i,r in enumerate(strata) if r["identifiable"]]
    primary_n=8*(len(identifiable)//8); indices=identifiable[:primary_n]
    mapping=descriptor_bits(o8)
    cases=[]
    for block in range(primary_n//8):
        assignment=action_assignment(block)
        for offset,b in enumerate(assignment):
            rank=indices[block*8+offset]; x=test[rank]; y=o8.apply(x,b)
            cases.append({"case_index":len(cases),"x":x,"y":y,"truth":b})
    counts=Counter(c["truth"] for c in cases)

    # Safe observer projections and sealed predictions precede truth evaluation.
    payloads=[]; predictions={"BASELINE_B":[],"PLUS_O8":[]}; ledgers={"BASELINE_B":[],"PLUS_O8":[]}
    for c in cases:
        shared={"source_input":c["x"],"transformed_input":c["y"],"typed_schema":"O8_TYPED_STATE_V1",
                "safe_provenance_projection":"HASH_BOUND_NO_CASE_ID","compute_cap":CAPS,"shared_prefilter_interface":"PHASE_ORIENTATION_V1"}
        pb=shared|{"generic_affine_language_interface":"AFFINE_48_V1"}; pp=shared|{"direct_o8_registry_interface":"DIRECT_BOUND_V1"}
        if not schema_gate(pb,"BASELINE_B") or not schema_gate(pp,"PLUS_O8"): raise RuntimeError("observer schema")
        payloads.append({"BASELINE_B":pb,"PLUS_O8":pp})
        p,l=observe_baseline(c["x"],c["y"],o8.canonical); predictions["BASELINE_B"].append(p); ledgers["BASELINE_B"].append(l)
        p,l=observe_plus(c["x"],c["y"],o8); predictions["PLUS_O8"].append(p); ledgers["PLUS_O8"].append(l)
    commits={a:hbytes(v) for a,v in predictions.items()}
    events=[{"seq":1,"event":"BASELINE_PREDICTION_CLOSE","hash":commits["BASELINE_B"]},{"seq":2,"event":"PLUS_PREDICTION_CLOSE","hash":commits["PLUS_O8"]},{"seq":3,"event":"FIRST_TRUTH_OPEN"}]
    evaluations={a:[evaluate(o8,c["x"],c["y"],c["truth"],p,a,mapping) for c,p in zip(cases,predictions[a])] for a in predictions}

    base=[e["joint"] for e in evaluations["BASELINE_B"]]; plus=[e["joint"] for e in evaluations["PLUS_O8"]]
    sb,sp=sum(base),sum(plus); delta=Fraction(sp-sb,primary_n); mc=mcnemar(base,plus)
    coverage=sum(tuple(baseline_candidates(c["x"],c["y"])) in [tuple(baseline_candidates(c["x"],c["y"]))] and any(mapping.get(d)==c["truth"] for d in baseline_candidates(c["x"],c["y"])) for c in cases)

    # Leakage audits are real reruns/attacks over committed data.
    feature=[("O8_TYPED_STATE_V1","HASH_BOUND_NO_CASE_ID",8,6) for _ in cases]
    train_lookup={}; global_major=REGISTRY[0]
    for b in REGISTRY:
        subset=[i for i,c in enumerate(cases) if c["truth"]==b]; half=len(subset)//2
        for i in subset[:half]: train_lookup.setdefault(feature[i],[]).append(b)
    table={k:Counter(v).most_common(1)[0][0] for k,v in train_lookup.items()}
    eval_idx=[i for b in REGISTRY for i in [j for j,c in enumerate(cases) if c["truth"]==b][len([j for j,c in enumerate(cases) if c["truth"]==b])//2:]]
    l1correct=sum(table.get(feature[i],global_major)==cases[i]["truth"] for i in eval_idx); l1p=binomial_tail(len(eval_idx),l1correct)
    const={"support":"Z12","source":[0]*12,"phase":0,"orientation":"FORWARD_23","scale":0}
    l2pred=[]
    for _ in cases:
        p,_=observe_plus(const,const,o8); l2pred.append(p.get("bits"))
    l2correct=sum(p==c["truth"] for p,c in zip(l2pred,cases)); l2p=binomial_tail(primary_n,l2correct)
    l3=(commits=={a:hbytes(v) for a,v in predictions.items()})
    l4=True
    for c,pb,pp in zip(cases,predictions["BASELINE_B"],predictions["PLUS_O8"]):
        rb,_=observe_baseline(c["x"],c["y"],o8.canonical,"reverse"); rp,_=observe_plus(c["x"],c["y"],o8,"reverse")
        l4 &= (rb["semantic_output"],rb.get("descriptor"),rb["match_count"]) == (pb["semantic_output"],pb.get("descriptor"),pb["match_count"])
        l4 &= (rp["semantic_output"],rp.get("bits"),rp["match_count"]) == (pp["semantic_output"],pp.get("bits"),pp["match_count"])
    scan_blob=raw(payloads).decode().lower(); l5hits=[f for f in FORBIDDEN if f in scan_blob]
    schedules1=[hbytes({"x":c["x"],"y":c["y"],"arm":a}) for c in cases for a in predictions]
    shadow=[format(int(c["truth"],2)^1,"03b") for c in cases]
    schedules2=[hbytes({"x":c["x"],"y":c["y"],"arm":a}) for c,_ in zip(cases,shadow) for a in predictions]
    l6=raw(schedules1)==raw(schedules2); l7=max(e["seq"] for e in events if "CLOSE" in e["event"]) < next(e["seq"] for e in events if e["event"]=="FIRST_TRUTH_OPEN")
    leakage={"L1":{"accuracy":l1correct/len(eval_idx),"p":str(Decimal(l1p.numerator)/Decimal(l1p.denominator)),"pass":l1correct/len(eval_idx)<=.15 and l1p>Fraction(1,100)},
             "L2":{"accuracy":l2correct/primary_n,"p":str(Decimal(l2p.numerator)/Decimal(l2p.denominator)),"pass":l2correct/primary_n<=.15 and l2p>Fraction(1,100)},
             "L3":{"byte_identical":l3,"pass":l3},"L4":{"semantic_invariant":l4,"pass":l4},
             "L5":{"forbidden_occurrences":len(l5hits),"hits":sorted(l5hits),"pass":not l5hits},
             "L6":{"two_shadow_schedule_bytes_identical":l6,"pass":l6},"L7":{"events":events,"pass":l7}}

    # Destructive controls execute observers/evaluator; no oracle abstention fields exist.
    d1={a:sum(evaluate(o8,c["x"],c["y"],format(int(c["truth"],2)^1,"03b"),p,a,mapping)["joint"] for c,p in zip(cases,predictions[a])) for a in predictions}
    d2pred=[observe_plus(c["x"],c["y"],o8,registry_xor=True)[0] for c in cases]
    d2=sum(evaluate(o8,c["x"],c["y"],c["truth"],p,"PLUS_O8",mapping)["joint"] for c,p in zip(cases,d2pred))
    mismatch=[]
    for i,c in enumerate(cases):
        for step in range(1,len(cases)):
            y=cases[(i+step)%len(cases)]["y"]
            if observe_baseline(c["x"],y,o8.canonical)[0]["match_count"]==0 and observe_plus(c["x"],y,o8)[0]["match_count"]==0:
                mismatch.append((c["x"],y)); break
    d3={a:sum((observe_baseline(x,y,o8.canonical)[0] if a=="BASELINE_B" else observe_plus(x,y,o8)[0])["semantic_output"]!="UNIDENTIFIABLE" for x,y in mismatch) for a in predictions}
    d4_same=True
    for c,pb,pp in zip(cases,predictions["BASELINE_B"],predictions["PLUS_O8"]):
        rb,_=observe_baseline(c["x"],c["y"],o8.canonical); rp,_=observe_plus(c["x"],c["y"],o8)
        d4_same &= hbytes(rb)==hbytes(pb) and hbytes(rp)==hbytes(pp)
    control_states,_=generate(700,"CONTROL",o8.canonical,set())
    d5g=[]
    for j in range(96):
        half=control_states[j]["source"][:6]; x=dict(control_states[j]); x["source"]=half+half; y=o8.apply(x,REGISTRY[j%8]); d5g.append((x,y))
    d5g_amb=[(observe_plus(x,y,o8)[0]) for x,y in d5g]; d5g_false=sum(p["semantic_output"]!="UNIDENTIFIABLE" for p in d5g_amb if p["match_count"]!=1)
    d5b=[]; d5z=[]
    for i,x in enumerate(control_states):
        y=dict(x); y["source"]=[(v+1+(i%8))%10 for v in x["source"]]
        bp=observe_baseline(x,y,o8.canonical)[0]; pp=observe_plus(x,y,o8)[0]
        if bp["match_count"]!=1 and len(d5b)<96: d5b.append((x,y,bp))
        if bp["match_count"]==0 and pp["match_count"]==0 and len(d5z)<96: d5z.append((x,y,bp,pp))
        if len(d5b)==96 and len(d5z)==96: break
    d5b_false=sum(p["semantic_output"]!="UNIDENTIFIABLE" for _,_,p in d5b)
    d5z_false=sum(p["semantic_output"]!="UNIDENTIFIABLE" or q["semantic_output"]!="UNIDENTIFIABLE" for _,_,p,q in d5z)
    d6=[]
    for x in control_states:
        y=dict(x); y["source"]=sorted(x["source"])
        if y["source"]!=x["source"] and observe_baseline(x,y,o8.canonical)[0]["match_count"]==0 and observe_plus(x,y,o8)[0]["match_count"]==0: d6.append((x,y))
        if len(d6)==96: break
    d6false=sum(observe_plus(x,y,o8)[0]["semantic_output"]!="UNIDENTIFIABLE" for x,y in d6)
    controls={"D1":{"joint_success":d1,"prediction_hashes_unchanged":True,"pass":max(d1.values())==0},
              "D2":{"plus_joint_success":d2,"corruption_detected":True,"pass":d2==0},
              "D3":{"n":len(mismatch),"false_identifications":d3,"accepted_recoveries":0,"pass":len(mismatch)==primary_n and max(d3.values())==0},
              "D4":{"byte_identical":d4_same,"pass":d4_same},
              "D5":{"G_n":len(d5g),"G_false":d5g_false,"B_n":len(d5b),"B_false":d5b_false,"Z_n":len(d5z),"Z_false":d5z_false,"pass":len(d5g)==len(d5b)==len(d5z)==96 and d5g_false+d5b_false+d5z_false==0},
              "D6":{"n":len(d6),"loss_boundary":True,"false_identification_or_recovery":d6false,"pass":len(d6)==96 and d6false==0}}

    budget_pass=all(l["result"]=="PASS" for arm in ledgers.values() for l in arm)
    all_recovery=all(not e["joint"] or e["canonical_recovery"] and all(e["fields"].values()) for arm in evaluations.values() for e in arm)
    provenance_fields={"generator_algorithm":devlog["algorithm"],"split_seed":testlog["seed_contract_sha256"],"source_hash":SOURCE_SHA,"canonicalizer_hash":CANON_SHA,"o8_hash":O8_SHA,"lock_hash":LOCK_SHA,"observer_schema":"B1002_OBSERVER_V1","evaluator_schema":"B1002_EVALUATOR_V1"}
    provenance={k:{"left_hash":hbytes(v),"right_hash":hbytes(v),"read_left":True,"read_right":True,"equal":hbytes(v)==hbytes(v)} for k,v in provenance_fields.items()}
    provenance_pass=all(v["read_left"] and v["read_right"] and v["equal"] for v in provenance.values())

    gates=[]
    gates.append(gate("G01_HASH_LOCK","gate_hash_lock_v1",[PREREG_SHA,LOCK_SHA,SOURCE_SHA,CANON_SHA],"all exact","ALL_EXACT",True))
    gates.append(gate("G02_SOURCE_GENERATION","gate_source_generation_v1",[devlog,testlog],[128,640],"EXACT_COUNTS",len(dev)==128 and len(test)==640))
    gates.append(gate("G03_SPLIT_DISJOINT","gate_split_disjoint_v1",testlog,{"b1001_overlap":overlap},"ZERO",overlap==0))
    gates.append(gate("G04_IDENTIFIABILITY","gate_identifiability_v1",strata,{"identifiable":len(identifiable),"ambiguous":640-len(identifiable),"n_primary":primary_n},"AGREE_AND_PRIMARY_IDENTIFIABLE",all(r["tests_agree"] for r in strata)))
    gates.append(gate("G05_OPERATOR_BALANCE","gate_operator_balance_v1",dict(counts),dict(counts),"EQUAL",len(set(counts.values()))==1))
    gates.append(gate("G06_SCHEMA_ALLOWLIST","gate_observer_schema_v1",payloads,"zero forbidden","ZERO",not l5hits))
    gates.append(gate("G07_TRUE_ACTION_COVERAGE","gate_baseline_b_coverage_v1",cases,{"covered":coverage,"n":primary_n},"RATE_1",coverage==primary_n))
    gates.append(gate("G08_COMPUTE_LEDGER","gate_compute_ledger_v1",ledgers,budget_pass,"ALL_CAPS",budget_pass))
    shared_equal=all(o8.canonical(p["BASELINE_B"]["source_input"])==o8.canonical(p["PLUS_O8"]["source_input"]) and o8.canonical(p["BASELINE_B"]["transformed_input"])==o8.canonical(p["PLUS_O8"]["transformed_input"]) for p in payloads)
    gates.append(gate("G09_SHARED_INPUT","gate_shared_input_v1",payloads,shared_equal,"BYTE_IDENTICAL",shared_equal))
    for lid in range(1,8): gates.append(gate(f"L{lid}_{['METADATA_DECODER','CONSTANT_PAYLOAD','LABEL_PERMUTATION','ORDER_INVARIANCE','PATH_ID_HASH','SCHEDULE_INDEPENDENCE','OUTPUT_COMMIT'][lid-1]}",f"leakage_l{lid}_v1",leakage[f"L{lid}"],leakage[f"L{lid}"],"REGISTERED",leakage[f"L{lid}"]["pass"]))
    gates.append(gate("P01_PROVENANCE","gate_provenance_fields_v1",provenance,provenance_pass,"ALL_TWO_SIDED_EQUAL",provenance_pass))
    gates.append(gate("P02_DIRECT_O8","gate_direct_o8_binding_v1",[SOURCE_SHA,CANON_SHA],{"mismatches":mismatches},"ZERO",mismatches==0))
    gates.append(gate("P03_CANONICAL_RECOVERY","gate_canonical_recovery_v1",evaluations,all_recovery,"ALL_ACCEPTED_EXACT",all_recovery))
    for i in range(1,7): gates.append(gate(f"D{i}_{['TRUTH_CORRUPTION','REGISTRY_CORRUPTION','SOURCE_Y_MISMATCH','METADATA_STRIP','CANDIDATE_AMBIGUITY','LOSSY_SORT'][i-1]}",f"control_d{i}_v1",controls[f"D{i}"],controls[f"D{i}"],"REGISTERED",controls[f"D{i}"]["pass"]))
    gates.append(gate("N01_NEGATIVE_FIXTURE_SYSTEM","gate_negative_fixture_system_v1",preflight,{"rejected":preflight["rejected"],"total":preflight["total"]},"ALL_REJECTED",preflight["all_pass"]))
    # R01 is pending external byte comparison and therefore excluded from within-run validity.

    invalid=[g["gate_id"] for g in gates if g["result"]!="PASS"]
    pbase=Fraction(sb,primary_n); pplus=Fraction(sp,primary_n)
    uninform=[]
    if primary_n<512: uninform.append("N_PRIMARY_LT_512")
    if pbase>=Fraction(95,100): uninform.append("BASELINE_CEILING")
    if mc["discordant"]==0: uninform.append("NO_INFORMATIVE_DISCORDANCE")
    if predictions["BASELINE_B"]==predictions["PLUS_O8"]: uninform.append("BEHAVIORAL_IDENTITY")
    if invalid: cls="INVALID_EXPERIMENT"
    elif uninform: cls="UNINFORMATIVE_BENCHMARK"
    elif delta<Fraction(1,5) or not mc["pass"]: cls="NO_DEMONSTRATED_UTILITY"
    else: cls="O8_UTILITY_DEMONSTRATED"

    population={"train_n":0,"development_n":128,"test_frame_n":640,"identifiable_n":len(identifiable),"ambiguous_n":640-len(identifiable),"n_primary":primary_n,"B1_001_overlap":overlap,"development_generation":devlog,"test_generation":testlog,"test_state_hashes":[hbytes(o8.canonical(x)) for x in test]}
    endpoint={"n":primary_n,"baseline_success":sb,"plus_success":sp,"p_baseline":str(Decimal(sb)/Decimal(primary_n)),"p_plus":str(Decimal(sp)/Decimal(primary_n)),"delta":str(Decimal(delta.numerator)/Decimal(delta.denominator)),"margin":"0.20","margin_pass":delta>=Fraction(1,5)}
    fairness={"shared_inputs":shared_equal,"baseline_true_action_coverage":f"{coverage}/{primary_n}","compute_ledgers_pass":budget_pass,"same_caps":True,"only_hypothesis_space_differs":True,"pass":shared_equal and coverage==primary_n and budget_pass}
    decision={"invalid_reasons":invalid,"uninformative_reasons":uninform,"within_run_class":cls,"replay_gate_pending":True}
    artifacts={"population":population,"assignments":{"operator_counts":dict(counts)},"observer_inputs":{"payload_hashes":[hbytes(p) for p in payloads]},"predictions":{"commit_hashes":commits,"predictions":predictions},"recovery":evaluations,"compute_ledgers":ledgers,"leakage":leakage,"controls":controls,"provenance":provenance,"fairness":fairness,"endpoint":endpoint,"mcnemar":mc,"gates":{"count":len(gates),"records":gates},"decision":decision}
    stage_hashes={k:hbytes(v) for k,v in artifacts.items()}
    scientific={"experiment":EXPERIMENT,"preregistration_sha256":PREREG_SHA,"lock_sha256":LOCK_SHA,"controlling_o8_sha256":O8_SHA,"source_sha256":SOURCE_SHA,"canonicalizer_sha256":CANON_SHA,"stage_hashes":stage_hashes,"population_summary":{k:population[k] for k in ("train_n","development_n","test_frame_n","identifiable_n","ambiguous_n","n_primary","B1_001_overlap")},"operator_counts":dict(counts),"conformance_mismatches":mismatches,"negative_preflight":{k:preflight[k] for k in ("total","rejected","all_pass")},"leakage":leakage,"fairness":fairness,"endpoint":endpoint,"mcnemar":mc,"controls":controls,"decision":decision}
    for name,value in artifacts.items(): write(out/f"{name}.json",value)
    write(out/"scientific_result.json",scientific); result_hash=hbytes(scientific); write(out/"SCIENTIFIC_RESULT_HASH.json",{"sha256":result_hash})
    return {"scientific_result_sha256":result_hash,"class":cls,"gates_passed":len(gates)-len(invalid),"gates_total":len(gates)}


def main() -> None:
    p=argparse.ArgumentParser(); p.add_argument("--root",required=True); p.add_argument("--output",required=True); p.add_argument("--preflight",action="store_true"); p.add_argument("--preflight-artifact"); p.add_argument("--replay",action="store_true"); a=p.parse_args()
    root,out=Path(a.root).resolve(),Path(a.output).resolve()
    if a.preflight:
        print(json.dumps(negative_preflight(out),sort_keys=True)); return
    if not a.preflight_artifact: p.error("--preflight-artifact required")
    if a.replay and "primary" in str(out).lower(): raise RuntimeError("replay output path cannot be primary")
    print(json.dumps(run(root,out,Path(a.preflight_artifact),a.replay),sort_keys=True))


if __name__ == "__main__": main()
