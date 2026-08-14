"""Second, independent contract-only reconstruction. Does not import the reference path."""
from __future__ import annotations

from bisect import bisect_right
from fractions import Fraction
import hashlib
import math

import numpy as np

import synthetic_raw_bundle as raw


class BadEvidence(Exception):
    pass


def check(value, label):
    if not value:
        raise BadEvidence(label)


def logistic_fit(x, y):
    matrix = np.asarray(x, dtype=float); labels = np.asarray(y, dtype=float)
    check(len(matrix) and len(np.unique(labels)) == 2, "fit population")
    center = np.mean(matrix, axis=0); spread = np.std(matrix, axis=0); spread[spread == 0] = 1.0
    design = np.c_[np.ones(len(matrix)), (matrix - center) / spread]
    weights = np.zeros(design.shape[1]); regularizer = np.eye(design.shape[1]); regularizer[0, 0] = 0
    for _ in range(100):
        probability = 1 / (1 + np.exp(-np.clip(design @ weights, -35, 35)))
        curvature = probability * (1 - probability)
        delta = np.linalg.solve(design.T @ (design * curvature[:, None]) + regularizer, design.T @ (probability - labels) + regularizer @ weights)
        weights -= delta
        if np.linalg.norm(delta) < 1e-9:
            break
    return center, spread, weights


def logistic_predict(model, x):
    center, spread, weights = model
    design = np.c_[np.ones(len(x)), (np.asarray(x, dtype=float) - center) / spread]
    return 1 / (1 + np.exp(-np.clip(design @ weights, -35, 35)))


def loss(y, probability):
    label = np.asarray(y, dtype=float); p = np.clip(probability, 1e-15, 1 - 1e-15)
    return float(np.mean(-label * np.log(p) - (1 - label) * np.log(1 - p)))


def tau(a, b):
    signs = []
    for left in range(5):
        for right in range(left + 1, 5):
            signs.append(np.sign((a[left] - a[right]) * (b[left] - b[right])))
    return float(np.sum(signs) / 10)


def coherence(a, b):
    values = np.asarray([(1 + tau(x, y)) / 2 for x, y in zip(a, b)], dtype=float)
    agreement = float(np.mean([x.index(0) == y.index(0) for x, y in zip(a, b)]))
    return values, float(values.mean()), agreement


def carrier_evaluation(training, testing, c_train, c_test, carrier, ranks_train=None, ranks_test=None):
    key = carrier + "_rank"
    train_ranks = ranks_train or [row[key] for row in training]
    test_ranks = ranks_test or [row[key] for row in testing]
    y_train = np.asarray([row["action_success"][ranking.index(0)] for row, ranking in zip(training, train_ranks)], dtype=int)
    y_test = np.asarray([row["action_success"][ranking.index(0)] for row, ranking in zip(testing, test_ranks)], dtype=int)
    state_train = np.asarray([[row["state_signal"]] for row in training]); state_test = np.asarray([[row["state_signal"]] for row in testing])
    base = logistic_fit(state_train, y_train)
    full = logistic_fit(np.c_[state_train[:, 0], c_train], y_train)
    p0 = logistic_predict(base, state_test); p1 = logistic_predict(full, np.c_[state_test[:, 0], c_test])
    return {"coefficient": float(full[2][2]), "gain": loss(y_test, p0) - loss(y_test, p1), "brier_baseline": float(np.mean((y_test - p0) ** 2)), "brier_augmented": float(np.mean((y_test - p1) ** 2)), "labels": y_test, "p0": p0, "p1": p1}


def inspect_raw(bundle):
    check(bundle.get("schema") == "A5XE_SYNTHETIC_RAW_EVIDENCE_V1", "schema")
    banned = {"P1", "P2", "P3", "P4", "P5", "null_pass", "bootstrap_pass", "n5_pass", "support_pass", "dominance_pass", "sensitivity_complete", "provenance_valid", "classification"}
    stack = [bundle]
    while stack:
        item = stack.pop()
        if isinstance(item, dict):
            check(not (set(item) & banned), "producer decision")
            stack.extend(item.values())
        elif isinstance(item, list):
            stack.extend(item)
    identity = bundle["identity"]
    check(identity == {"seed_ids": raw.SEEDS, "splits": raw.SPLITS, "actions": raw.ACTIONS, "carriers": raw.CARRIERS, "representations": raw.REPRESENTATIONS, "rows_per_seed_per_split": 50}, "identity")
    rows = bundle["observed_rows"]
    check(len(rows) == 3000, "rows")
    expected = [f"{split}.{seed}.{index:02d}" for split in raw.SPLITS for seed in raw.SEEDS for index in range(50)]
    ordered = sorted(rows, key=lambda row: (raw.SPLITS.index(row["split"]), raw.SEEDS.index(row["seed_id"]), row["decision_index"]))
    check([row["row_id"] for row in ordered] == expected, "row universe")
    for row in ordered:
        check(sorted(row["T_rank"]) == list(range(5)) and sorted(row["F_rank"]) == list(range(5)), "ranks")
        check(row["T_proposed_action"] == raw.ACTIONS[row["T_rank"].index(0)] and row["F_proposed_action"] == raw.ACTIONS[row["F_rank"].index(0)], "actions")
        check(len(row["action_success"]) == 5 and set(row["action_success"]) <= {0, 1}, "outcomes")
    sections = ["identity", "observed_rows", "model_spec", "null_worlds", "bootstrap", "n5", "attribution", "sensitivities", "authority_binding"]
    ledger = bundle["provenance_ledger"]
    check(len(ledger) == len(sections) and len({entry["artifact_id"] for entry in ledger}) == len(sections), "provenance")
    for section in sections:
        entry = next((entry for entry in ledger if entry["artifact_id"] == section.upper()), None)
        check(entry is not None and entry["sha256"] == raw.digest(bundle[section]), "parent hash")
        check(entry["parent_ids"] == ([] if section in {"identity", "authority_binding"} else ["IDENTITY", "AUTHORITY_BINDING"]), "parents")
    return ordered


def support_result(rows):
    test = rows[1500:]
    t_fail = sum(not row["T_supported"] for row in test); f_fail = sum(not row["F_supported"] for row in test)
    joint = [row for row in test if row["T_supported"] and row["F_supported"]]
    counts = {seed: len([row for row in joint if row["seed_id"] == seed and row["T_proposed_action"] != 0 and row["F_proposed_action"] != 0]) for seed in raw.SEEDS}
    return {"valid": t_fail / 1500 <= .1 and f_fail / 1500 <= .1 and len(joint) / 1500 >= .8 and sum(value >= 20 for value in counts.values()) >= 20, "T_oos": t_fail / 1500, "F_oos": f_fail / 1500, "joint_fraction": len(joint) / 1500, "joint_row_ids": [row["row_id"] for row in joint], "both_nonzero_by_seed": counts}


def generator(family, repetition, suffix):
    family_name = raw.NULL_TOKENS[family]
    namespace = f"{raw.CONFIG_ID}|{family_name}|{repetition}{suffix}".encode()
    number = int.from_bytes(hashlib.sha256(namespace).digest()[0:8], byteorder="big")
    return np.random.Generator(np.random.PCG64(number))


def move_labels(ranking, permutation):
    moved = [None] * 5
    for old, new in enumerate(permutation.tolist()):
        moved[new] = ranking[old]
    return moved


def geometry(rows):
    training = rows[:1500]
    target_breaks = np.quantile([row["target_distance"] for row in training], [.2, .4, .6, .8], method="linear").tolist()
    target_bin = {row["row_id"]: bisect_right(target_breaks, row["target_distance"]) for row in rows}
    phase_bin = {}
    phase_edges = [-math.pi + index * math.pi / 4 for index in range(1, 8)]
    for row in rows:
        phase = float(np.arctan2(row["state"][1], row["state"][0])); phase = -math.pi if phase == math.pi else phase
        phase_bin[row["row_id"]] = bisect_right(phase_edges, phase)
    phase_map = {}
    for target in range(5):
        present = {phase_bin[row["row_id"]] for row in training if target_bin[row["row_id"]] == target}
        for phase in range(8):
            candidates = [phase] if phase in present else [(phase - step) % 8 for step in range(1, 8) if (phase - step) % 8 in present]
            check(candidates, "empty phase")
            phase_map[(target, phase)] = candidates[0]
    training_state = np.asarray([row["state"] for row in training]); scale = training_state.std(axis=0); scale[scale == 0] = 1
    z = (training_state - training_state.mean(axis=0)) / scale
    nearest = []
    for index, point in enumerate(z):
        distance = np.sqrt(np.sum((z - point) ** 2, axis=1)); distance[index] = np.inf; nearest.append(float(distance.min()))
    support_breaks = np.quantile(nearest, np.arange(.1, 1, .1), method="linear").tolist()
    support_bin = {row["row_id"]: bisect_right(support_breaks, row["nearest_training_distance"]) for row in rows}
    seed_groups = {(split, seed): [index for index, row in enumerate(rows) if row["split"] == split and row["seed_id"] == seed] for split in raw.SPLITS for seed in raw.SEEDS}
    donor_groups = {}
    for index, row in enumerate(rows):
        donor_groups.setdefault((row["split"], target_bin[row["row_id"]], phase_bin[row["row_id"]]), []).append(index)
    donors = {row["row_id"]: [index for index in donor_groups.get((row["split"], target_bin[row["row_id"]], phase_map[(target_bin[row["row_id"]], phase_bin[row["row_id"]])]), []) if rows[index]["seed_id"] != row["seed_id"]] for row in rows}
    return target_bin, phase_bin, support_bin, seed_groups, donors


def merged_groups(rows, carrier, target_bin, support_bin):
    rank_field = carrier + "_rank"; subgroups = {}
    for index, row in enumerate(rows):
        magnitude = abs(raw.ACTIONS[row[rank_field].index(0)])
        subgroups.setdefault((row["split"], target_bin[row["row_id"]], magnitude), {}).setdefault(support_bin[row["row_id"]], []).append(index)
    answer = []
    for subgroup in sorted(subgroups, key=str):
        source = subgroups[subgroup]; check(sum(map(len, source.values())) >= 10, "N4 subgroup")
        groups = [{key} for key in source]
        def members(group): return [item for key in sorted(group) for item in source.get(key, [])]
        while True:
            undersized = next((group for decile in range(10) for group in groups if decile in group and len(members(group)) < 10), None)
            if undersized is None: break
            higher = [group for group in groups if min(group) > max(undersized)]; lower = [group for group in groups if max(group) < min(undersized)]
            other = min(higher, key=min) if higher else max(lower, key=max) if lower else None
            check(other is not None, "N4 merge")
            undersized.update(other); groups.remove(other)
        for group in groups:
            indexes = members(group); check(len(indexes) >= 10, "N4 size"); answer.append((subgroup, tuple(sorted(group)), indexes))
    return answer


def randomize(rows, family, repetition, context, n4):
    target_bin, phase_bin, support_bin, seed_groups, donors = context
    t = [list(row["T_rank"]) for row in rows]; f = [list(row["F_rank"]) for row in rows]
    if family == "N1":
        for representation, ranks in (("TRAJECTORY", t), ("LEARNED_FIELD", f)):
            for seed in raw.SEEDS:
                permutation = generator("N1", repetition, f"|REP={representation}|SEED={seed}").permutation(5)
                for split in raw.SPLITS:
                    for index in seed_groups[(split, seed)]: ranks[index] = move_labels(ranks[index], permutation)
    elif family == "N2":
        original = [list(value) for value in f]
        for split in raw.SPLITS:
            for seed in raw.SEEDS:
                indexes = seed_groups[(split, seed)]; permutation = generator("N2", repetition, f"|SPLIT={split}|SEED={seed}").permutation(len(indexes))
                for position, selected in enumerate(permutation): f[indexes[position]] = list(original[indexes[int(selected)]])
    elif family == "N3":
        original = [list(value) for value in f]
        for index, row in enumerate(rows):
            pool = donors[row["row_id"]]; check(pool, "N3 donor")
            suffix = f'|SPLIT={row["split"]}|ROW={row["split"]}.{row["seed_id"]}.{row["decision_index"]}'
            selected = int(generator("N3", repetition, suffix).integers(0, len(pool), endpoint=False, dtype=np.int64))
            f[index] = list(original[pool[selected]])
    else:
        carrier = family[-1]; original = [list(value) for value in f]
        for subgroup, deciles, indexes in n4[carrier]:
            split, target, magnitude = subgroup; magnitude_token = {0.: "000", .25: "025", .5: "050"}[magnitude]
            name = f"Q{target};M{magnitude_token};D{','.join(map(str, deciles))}"
            permutation = generator(family, repetition, f"|SPLIT={split}|CARRIER={carrier}|STRATUM={name}").permutation(len(indexes))
            for position, selected in enumerate(permutation): f[indexes[position]] = list(original[indexes[int(selected)]])
    return t, f


def reconstruct_statistics(rows, null_evidence):
    training, testing = rows[:1500], rows[1500:]
    train_c, _, _ = coherence([row["T_rank"] for row in training], [row["F_rank"] for row in training])
    test_c, mean_c, top_c = coherence([row["T_rank"] for row in testing], [row["F_rank"] for row in testing])
    observed = {"mean_coherence": mean_c, "top_action_agreement": top_c, "carriers": {carrier: carrier_evaluation(training, testing, train_c, test_c, carrier) for carrier in raw.CARRIERS}}
    context = geometry(rows); n4 = {carrier: merged_groups(rows, carrier, context[0], context[2]) for carrier in raw.CARRIERS}; row_hash = raw.digest(rows)
    output = {family: [] for family in raw.FAMILIES}
    for family in raw.FAMILIES:
        worlds = null_evidence[family]; check([world["replicate_id"] for world in worlds] == list(range(200)), "null IDs")
        for world in worlds:
            check(world["population_sha256"] == row_hash and world["family"] == family and world["rng_contract_id"] == "A5XE_ACCEPTED_A3_SHA256_PCG64_OBJECT_STREAMS", "null evidence")
            t, f = randomize(rows, family, world["replicate_id"], context, n4); train_t, test_t, train_f, test_f = t[:1500], t[1500:], f[:1500], f[1500:]
            c0, _, _ = coherence(train_t, train_f); c1, average, tops = coherence(test_t, test_f)
            metrics = {}
            for carrier in raw.CARRIERS:
                metrics[carrier] = carrier_evaluation(training, testing, c0, c1, carrier, train_t if family == "N1" and carrier == "T" else train_f if family == "N1" else None, test_t if family == "N1" and carrier == "T" else test_f if family == "N1" else None)
            output[family].append({"replicate_id": world["replicate_id"], "mean_coherence": average, "top_action_agreement": tops, "T_coefficient": metrics["T"]["coefficient"], "F_coefficient": metrics["F"]["coefficient"], "T_gain": metrics["T"]["gain"], "F_gain": metrics["F"]["gain"]})
    return observed, output, train_c, test_c


def bootstrap(rows, evidence, test_coherence):
    check(evidence["cluster_unit"] == "TEST_SEED" and evidence["seed"] == 20260808 and evidence["source_seed_ids"] == raw.SEEDS, "bootstrap")
    testing = rows[1500:]; check(evidence["source_row_sha256"] == raw.digest([row["row_id"] for row in testing]), "bootstrap rows")
    records = evidence["resamples"]; check([record["replicate_id"] for record in records] == list(range(500)), "bootstrap IDs")
    random_generator = np.random.Generator(np.random.PCG64(20260808)); verified = []
    for replicate in range(500):
        sample = random_generator.choice(np.asarray(raw.SEEDS), size=30, replace=True).tolist(); count = {seed: sample.count(seed) for seed in raw.SEEDS}
        check(records[replicate] == {"replicate_id": replicate, "seed_multiplicities": count}, "bootstrap multiplicity"); verified.append(count)
    features = np.c_[[row["state_signal"] for row in testing], test_coherence]; result = {carrier: [] for carrier in raw.CARRIERS}
    for counts in verified:
        selected = [index for seed in raw.SEEDS for _ in range(counts[seed]) for index, row in enumerate(testing) if row["seed_id"] == seed]
        for carrier in raw.CARRIERS:
            labels = np.asarray([row["action_success"][row[carrier + "_rank"].index(0)] for row in testing])
            result[carrier].append(float(logistic_fit(features[selected], labels[selected])[2][2]))
    return result


def n5_check(evidence):
    matrices = raw.signed_permutations(); check(evidence["matrix_registry"] == matrices, "N5 matrices"); decisions = {}
    for tier in ("SYNTH", "RUN"):
        tier_record = evidence[tier]; check(tier_record["population_sha256"] == raw.digest(tier_record["population_row_ids"]) and len(tier_record["population_row_ids"]) >= 20, "N5 population")
        check(len(tier_record["transforms"]) == 12, "N5 count"); comparisons = []
        for index, item in enumerate(tier_record["transforms"]):
            matrix = np.asarray(matrices[index], dtype=float); check(item["Q"] == matrices[index] and item["transform_id"] == index and round(np.linalg.det(matrix)) == 1, "N5 transform")
            check(np.array_equal(matrix @ np.asarray(item["B_original"]), np.asarray(item["B_transformed"])) and np.array_equal(matrix @ np.asarray(item["target_original"]), np.asarray(item["target_transformed"])), "N5 vector")
            check({(record["representation"], record["query_id"]) for record in item["comparisons"]} == {(representation, query) for representation in raw.REPRESENTATIONS for query in tier_record["population_row_ids"]}, "N5 universe")
            for query in item["query_inputs"]: check(np.array_equal(matrix @ np.asarray(query["original"]), np.asarray(query["transformed"])), "N5 query")
            for record in item["comparisons"]:
                check(np.allclose(matrix.T @ np.asarray(record["transformed_terminal"]), record["original_terminal"], atol=1e-12, rtol=0), "N5 inverse")
                comparisons.append(tau(record["original_rank"], record["transformed_rank"]))
        decisions[tier] = min(comparisons) >= .99
    return decisions


def attribution(rows, observed, test_coherence):
    testing = rows[1500:]; answer = {}
    for carrier in raw.CARRIERS:
        metric = observed["carriers"][carrier]; labels = metric["labels"]; directions = {}; contribution_rows = []
        for seed in raw.SEEDS:
            indexes = [index for index, row in enumerate(testing) if row["seed_id"] == seed]; c = test_coherence[indexes]; y = labels[indexes]
            directions[seed] = 0. if np.std(c) == 0 or np.std(y) == 0 else float(np.corrcoef(c, y)[0, 1])
            p0 = np.clip(metric["p0"][indexes], 1e-15, 1-1e-15); p1 = np.clip(metric["p1"][indexes], 1e-15, 1-1e-15)
            contribution_rows.append((seed, (-y*np.log(p0)-(1-y)*np.log(1-p0)).tolist(), (-y*np.log(p1)-(1-y)*np.log(1-p1)).tolist()))
        decision=dominance_decision([{"seed_id":seed,"loss0":l0,"loss1":l1} for seed,l0,l1 in contribution_rows])
        answer[carrier]={"directions":directions,"at_least_21":sum(value>=0 for value in directions.values())>=21,"dominance":decision}
    return answer


def dominance_decision(records):
    if len(records)<3:return {"valid":False,"pass":False,"reason":"FEWER_THAN_THREE_SEEDS"}
    total=sum(len(record.get("loss0",[])) for record in records)
    if total==0 or any(len(record.get("loss0",[]))!=len(record.get("loss1",[])) for record in records):return {"valid":False,"pass":False,"reason":"MALFORMED_LOSSES"}
    values=[]
    for record in records:
        amount=sum((Fraction.from_float(float(a))-Fraction.from_float(float(b)) for a,b in zip(record["loss0"],record["loss1"])),Fraction())/total
        values.append((record["seed_id"],amount))
    aggregate=sum((value for _,value in values),Fraction()); d3=sum((value for _,value in sorted(values,key=lambda pair:(-pair[1],pair[0]))[:3]),Fraction()); passes=aggregate>0 and 2*d3<=aggregate
    return {"valid":True,"pass":passes,"reason":"PASS" if passes else "NONPOSITIVE_G" if aggregate<=0 else "DOMINATED","G":[aggregate.numerator,aggregate.denominator],"D3":[d3.numerator,d3.denominator]}


def sensitivity_results(bundle, rows):
    records=bundle["sensitivities"]; check(len(records)==12 and len({record["sensitivity_id"] for record in records})==12,"sensitivity set")
    expected={item[0] for item in raw.sensitivity_registry()}; check({record["sensitivity_id"] for record in records}==expected,"sensitivity IDs")
    training,testing=rows[:1500],rows[1500:]; test_ids=[row["row_id"] for row in testing]; result={}
    for record in records:
        check(record["contributing_seed_ids"]==raw.SEEDS and record["rows_per_seed"]=={seed:50 for seed in raw.SEEDS} and record["test_row_ids"]==test_ids,"sensitivity population")
        check(len(record["train_coherence"])==1500 and len(record["test_coherence"])==1500,"sensitivity raw")
        result[record["sensitivity_id"]]={carrier:carrier_evaluation(training,testing,np.asarray(record["train_coherence"]),np.asarray(record["test_coherence"]),carrier) for carrier in raw.CARRIERS}
    return result


def mc(observed, values):
    check(len(values)==200 and all(math.isfinite(value) for value in values),"MC")
    k=sum(value>=observed for value in values); return {"k":k,"p":(1+k)/201,"pass":k<=4}


def derive(bundle):
    try:
        rows=inspect_raw(bundle); support=support_result(rows); check(support["valid"],"support")
        n5=n5_check(bundle["n5"])
        if not n5["SYNTH"]: return {"execution_state":"IMPLEMENTATION_FAILURE","release_permitted":False,"classification":None,"reason":"N5_SYNTH"}
        if not n5["RUN"]: return {"execution_state":"INVALID_EXPERIMENT","release_permitted":False,"classification":None,"reason":"N5_RUN"}
        observed,nulls,train_c,test_c=reconstruct_statistics(rows,bundle["null_worlds"]); boot=bootstrap(rows,bundle["bootstrap"],test_c); attr=attribution(rows,observed,test_c)
        check(all(attr[carrier]["dominance"]["valid"] for carrier in raw.CARRIERS),"dominance population")
        contract=bundle["attribution"]; check(contract["eligible_test_row_ids"]==[row["row_id"] for row in rows[1500:]],"attribution rows"); check(set(contract["mandatory_report_only"])=={"TRAJECTORY_ONLY_OUTCOME_PREDICTION","LEARNED_FIELD_ONLY_OUTCOME_PREDICTION","EQUAL_SCORE_FUSION_CARRIER"},"diagnostics")
        sens=sensitivity_results(bundle,rows)
        p1=all(mc(observed[stat],[row[stat] for row in nulls[family]])["pass"] for stat in ["mean_coherence","top_action_agreement"] for family in raw.FAMILIES)
        p2=all(observed["carriers"][carrier]["coefficient"]>0 and float(np.quantile(boot[carrier],.025,method="linear"))>0 for carrier in raw.CARRIERS)
        p3=all(observed["carriers"][carrier]["gain"]>0 and observed["carriers"][carrier]["brier_augmented"]<=observed["carriers"][carrier]["brier_baseline"] for carrier in raw.CARRIERS) and all(mc(observed["carriers"][carrier]["gain"],[row[f"{carrier}_gain"] for row in nulls[family]])["pass"] for carrier in raw.CARRIERS for family in ["N1","N2","N3",f"N4_{carrier}"])
        p4=all(observed["carriers"][carrier]["coefficient"]>0 and observed["carriers"][carrier]["gain"]>0 and attr[carrier]["at_least_21"] and attr[carrier]["dominance"]["pass"] for carrier in raw.CARRIERS)
        p5=all(sens[sid][carrier]["coefficient"]>0 and sens[sid][carrier]["gain"]>0 for sid in ["ACTION_AMPLITUDE_0.25","ACTION_AMPLITUDE_1.0"] for carrier in raw.CARRIERS)
        propositions={"P1":p1,"P2":p2,"P3":p3,"P4":p4,"P5":p5}; cores={carrier:observed["carriers"][carrier]["coefficient"]>0 and observed["carriers"][carrier]["gain"]>0 for carrier in raw.CARRIERS}; negative={carrier:float(np.quantile(boot[carrier],.975,method="linear"))<0 for carrier in raw.CARRIERS}
        valid=not any(cores[carrier] and negative[carrier] for carrier in raw.CARRIERS)
        label="INVALID EXPERIMENT" if not valid else "REPLICATED" if all(propositions.values()) and all(cores.values()) and not any(negative.values()) else "PARTIALLY REPLICATED" if any(cores.values()) and not any(negative.values()) else "NOT REPLICATED"
        cross="PARTIAL CROSS-SYSTEM REPLICATION" if all(propositions[f"P{i}"] for i in [1,2,3]) and label in {"REPLICATED","PARTIALLY REPLICATED"} else "NON-REPLICATION"
        observed_clean={"mean_coherence":observed["mean_coherence"],"top_action_agreement":observed["top_action_agreement"],"carriers":{carrier:{key:observed["carriers"][carrier][key] for key in ["coefficient","gain","brier_baseline","brier_augmented"]} for carrier in raw.CARRIERS}}
        sens_clean={sid:{carrier:{key:value for key,value in record.items() if key in {"coefficient","gain"}} for carrier,record in carriers.items()} for sid,carriers in sens.items()}
        ledger=[{"artifact_id":"DERIVED_SUPPORT","parent_ids":["OBSERVED_ROWS","IDENTITY"],"sha256":raw.digest(support)},{"artifact_id":"DERIVED_NULLS","parent_ids":["NULL_WORLDS","OBSERVED_ROWS","MODEL_SPEC"],"sha256":raw.digest(nulls)},{"artifact_id":"DERIVED_BOOTSTRAP","parent_ids":["BOOTSTRAP","OBSERVED_ROWS","MODEL_SPEC"],"sha256":raw.digest(boot)},{"artifact_id":"DERIVED_N5","parent_ids":["N5"],"sha256":raw.digest(n5)},{"artifact_id":"DERIVED_ATTRIBUTION","parent_ids":["ATTRIBUTION","OBSERVED_ROWS"],"sha256":raw.digest(attr)},{"artifact_id":"DERIVED_SENSITIVITIES","parent_ids":["SENSITIVITIES","OBSERVED_ROWS"],"sha256":raw.digest(sens_clean)},{"artifact_id":"DERIVED_P1_P5","parent_ids":["DERIVED_NULLS","DERIVED_BOOTSTRAP","DERIVED_ATTRIBUTION","DERIVED_SENSITIVITIES"],"sha256":raw.digest(propositions)},{"artifact_id":"FINAL_CLASSIFICATION","parent_ids":["DERIVED_P1_P5","DERIVED_SUPPORT","DERIVED_N5"],"sha256":raw.digest({"classification":label,"cross_system":cross})}]
        return {"execution_state":"VALID_SCIENTIFIC_RESULT","release_permitted":False,"support":support,"n5":n5,"observed":observed_clean,"nulls_sha256":raw.digest(nulls),"bootstrap_ci":{carrier:[float(np.quantile(boot[carrier],.025,method="linear")),float(np.quantile(boot[carrier],.975,method="linear"))] for carrier in raw.CARRIERS},"attribution":attr,"sensitivities":sens_clean,"P":propositions,"classification":label,"cross_system":cross,"derived_provenance":ledger}
    except (BadEvidence,KeyError,TypeError,ValueError,np.linalg.LinAlgError) as error:
        return {"execution_state":"INVALID_EXPERIMENT","release_permitted":False,"classification":None,"reason":str(error)}
