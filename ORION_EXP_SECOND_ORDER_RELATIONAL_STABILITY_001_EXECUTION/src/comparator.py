from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from core import M_BAR_DEN, frac, higher_quantile_int, sha256_file, write_json


def read(path: str | Path) -> dict:
    return json.loads(Path(path).read_text("utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-manifest", required=True)
    parser.add_argument("--sources", required=True)
    parser.add_argument("--first-manifest", required=True)
    parser.add_argument("--observer", required=True)
    parser.add_argument("--observer-arrays", required=True)
    parser.add_argument("--relation", required=True)
    parser.add_argument("--fixtures", required=True)
    parser.add_argument("--n4", required=True)
    parser.add_argument("--controls", required=True)
    parser.add_argument("--leakage", required=True)
    parser.add_argument("--n3-distribution")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    source = read(args.source_manifest)
    first_manifest = read(args.first_manifest)
    observer = read(args.observer)
    fixtures = read(args.fixtures)
    n4 = read(args.n4)
    controls = read(args.controls)
    leakage = read(args.leakage)
    obs_arrays = np.load(args.observer_arrays, allow_pickle=False)
    relation = np.load(args.relation, allow_pickle=False)
    observed_num = int(observer["M_bar_raw_numerator"])

    provenance_pass = source.get("provenance_valid") is True and source.get("digits_sha256") == sha256_file(Path(args.sources))
    support_pass = observer.get("complete_support") == 36864
    transport_pass = first_manifest.get("transport_interval_bijection") is True
    informativeness_pass = observer.get("informativeness_pass_90_percent") is True
    nonseparability_pass = fixtures.get("nonseparability_pass") is True
    construction_pass = fixtures.get("construction_audit_pass") is True
    threshold_pass = observed_num * 20 >= M_BAR_DEN
    n4_pass = n4.get("observed_gt_q99") is True and n4.get("p_le_0_01") is True
    leakage_pass = leakage.get("all_pass") is True
    controls_pass = controls.get("all_pass") is True
    invalid = not (provenance_pass and support_pass and transport_pass and leakage_pass)
    if controls["D3"].get("status") == "UNDEFINED_DEGENERATE_REWIRING_ORBIT" or controls["D4"].get("pass") is not True:
        invalid = True
    uninformative = not (informativeness_pass and nonseparability_pass and construction_pass)
    pre_replay_relational = (not invalid) and (not uninformative) and threshold_pass and n4_pass and controls_pass

    n3_result: dict[str, object]
    n3_pass = False
    if args.n3_distribution and Path(args.n3_distribution).exists():
        values = np.load(args.n3_distribution, allow_pickle=False)
        q99 = higher_quantile_int(values, 0.99)
        p_num = 1 + int((values >= observed_num).sum())
        n3_pass = observed_num > q99 and p_num * 100 <= 10000
        n3_result = {
            "observed_gt_q99": observed_num > q99,
            "p_le_0_01": p_num * 100 <= 10000,
            "p_value": frac(p_num, 10000),
            "pass": n3_pass,
            "q99_higher": frac(q99, M_BAR_DEN),
            "q99_raw_numerator": q99,
            "replicates": int(len(values)),
        }
    else:
        n3_result = {"status": "NOT_REACHED_OR_NOT_YET_RUN"}
    pre_replay_lee = pre_replay_relational and n3_pass

    qpre = relation["q_pre"].astype(np.int16)
    qpost = relation["q_post"].astype(np.int16)
    raw_invariant = all(np.array_equal(qpre[:, c], qpre[:, (c + 1) % 6]) for c in range(6))
    transported_equal = np.array_equal(qpre, qpost)
    cvals = obs_arrays["C"].reshape(-1).astype(np.int64)
    c_q99 = higher_quantile_int(cvals, 0.99)
    robust = int(cvals.sum()) * 20 <= 1296 * len(cvals) and c_q99 * 10 <= 1296
    if raw_invariant:
        orion_class = "INVARIANT"
    elif transported_equal:
        orion_class = "EQUIVARIANT"
    elif robust:
        orion_class = "ROBUST"
    else:
        orion_class = "REPRESENTATION_DEPENDENT"

    if invalid:
        provisional = "INVALID_EXPERIMENT"
    elif uninformative:
        provisional = "UNINFORMATIVE"
    elif pre_replay_relational:
        provisional = "RELATIONALLY_STABLE_IF_REPLAY_IDENTICAL"
    else:
        provisional = "NO_RELATIONAL_ADVANTAGE"

    scientific = {
        "construction_audit": fixtures,
        "controls": controls,
        "gates": {
            "construction_pass": construction_pass,
            "controls_pass": controls_pass,
            "informativeness_pass": informativeness_pass,
            "information_leakage_pass": leakage_pass,
            "nonseparability_pass": nonseparability_pass,
            "provenance_pass": provenance_pass,
            "support_pass": support_pass,
            "threshold_pass": threshold_pass,
            "transport_pass": transport_pass,
        },
        "information_boundary": leakage,
        "lee_candidate_pre_replay_gates": pre_replay_lee,
        "n3": n3_result,
        "n4": n4,
        "observations": observer,
        "orion_relation_class": orion_class,
        "primary_class_pre_replay": provisional,
        "relationally_stable_pre_replay_gates": pre_replay_relational,
        "replay_gate": "APPLIED_ONLY_AFTER_PRIMARY_REPLAY_BYTE_COMPARISON",
        "source_contract": {
            "base": source["base"],
            "count": source["count"],
            "digits_sha256": source["digits_sha256"],
            "precision": source["precision"],
        },
    }
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    write_json(out / "scientific_result.json", scientific)
    write_json(out / "comparison_result.json", {"lee_pre_replay": pre_replay_lee, "orion_class": orion_class, "preliminary_class": provisional, "relational_pre_replay": pre_replay_relational})


if __name__ == "__main__":
    main()
