"""Reference evidence reconstruction. Contract-only; synthetic fixtures only."""
from __future__ import annotations

from bisect import bisect_right
from fractions import Fraction
import hashlib
import json
import math

import numpy as np

from synthetic_raw_bundle import ACTIONS, CARRIERS, CONFIG_ID, FAMILIES, NULL_TOKENS, REPRESENTATIONS, SEEDS, canonical, digest, kendall, signed_permutations


class EvidenceError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise EvidenceError(message)


def finite(value):
    return type(value) in (int, float) and math.isfinite(value)


def forbidden_decisions(value, path=""):
    forbidden = {"P1", "P2", "P3", "P4", "P5", "null_pass", "bootstrap_pass", "n5_pass", "support_pass", "dominance_pass", "sensitivity_complete", "provenance_valid", "classification"}
    if isinstance(value, dict):
        for key, child in value.items():
            if key in forbidden and "NONAUTHORITATIVE" not in path:
                raise EvidenceError(f"producer decision:{path}.{key}")
            forbidden_decisions(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            forbidden_decisions(child, f"{path}[{index}]")


def sigmoid(values):
    clipped = np.clip(values, -35.0, 35.0)
    return 1.0 / (1.0 + np.exp(-clipped))


def fit_logistic(features, labels, iterations=100):
    x = np.asarray(features, dtype=float)
    y = np.asarray(labels, dtype=float)
    require(len(x) == len(y) and len(x) > 0 and len(np.unique(y)) == 2, "model population")
    mean = x.mean(axis=0)
    scale = x.std(axis=0)
    scale[scale == 0] = 1.0
    design = np.column_stack([np.ones(len(x)), (x - mean) / scale])
    beta = np.zeros(design.shape[1])
    penalty = np.eye(len(beta)); penalty[0, 0] = 0.0
    for _ in range(iterations):
        probabilities = sigmoid(design @ beta)
        weights = probabilities * (1.0 - probabilities)
        gradient = design.T @ (probabilities - y) + penalty @ beta
        hessian = design.T @ (design * weights[:, None]) + penalty
        step = np.linalg.solve(hessian, gradient)
        beta -= step
        if np.linalg.norm(step) < 1e-9:
            break
    return {"mean": mean, "scale": scale, "beta": beta}


def predict(model, features):
    x = np.asarray(features, dtype=float)
    design = np.column_stack([np.ones(len(x)), (x - model["mean"]) / model["scale"]])
    return sigmoid(design @ model["beta"])


def log_loss(labels, probabilities):
    y = np.asarray(labels, dtype=float)
    p = np.clip(np.asarray(probabilities, dtype=float), 1e-15, 1 - 1e-15)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))


def brier(labels, probabilities):
    return float(np.mean((np.asarray(labels, dtype=float) - np.asarray(probabilities, dtype=float)) ** 2))


def metric(train_rows, test_rows, train_coherence, test_coherence, carrier, train_ranks=None, test_ranks=None):
    carrier_key = "T_rank" if carrier == "T" else "F_rank"
    if train_ranks is None:
        train_ranks = [row[carrier_key] for row in train_rows]
    if test_ranks is None:
        test_ranks = [row[carrier_key] for row in test_rows]
    train_labels = np.asarray([row["action_success"][rank.index(0)] for row, rank in zip(train_rows, train_ranks)], dtype=int)
    test_labels = np.asarray([row["action_success"][rank.index(0)] for row, rank in zip(test_rows, test_ranks)], dtype=int)
    train_state = np.asarray([[row["state_signal"]] for row in train_rows], dtype=float)
    test_state = np.asarray([[row["state_signal"]] for row in test_rows], dtype=float)
    baseline = fit_logistic(train_state, train_labels)
    augmented = fit_logistic(np.column_stack([train_state[:, 0], train_coherence]), train_labels)
    p0 = predict(baseline, test_state)
    p1 = predict(augmented, np.column_stack([test_state[:, 0], test_coherence]))
    return {
        "coefficient": float(augmented["beta"][2]),
        "gain": log_loss(test_labels, p0) - log_loss(test_labels, p1),
        "brier_baseline": brier(test_labels, p0),
        "brier_augmented": brier(test_labels, p1),
        "labels": test_labels,
        "p0": p0,
        "p1": p1,
    }


def validate_rows(bundle):
    identity = bundle.get("identity")
    require(identity == {"seed_ids": SEEDS, "splits": ["TRAIN_OOF", "TEST"], "actions": ACTIONS, "carriers": CARRIERS, "representations": REPRESENTATIONS, "rows_per_seed_per_split": 50}, "identity")
    rows = bundle.get("observed_rows")
    require(isinstance(rows, list) and len(rows) == 3000, "row count")
    expected_ids = {f"{split}.{seed}.{index:02d}" for split in ["TRAIN_OOF", "TEST"] for seed in SEEDS for index in range(50)}
    ids = [row.get("row_id") for row in rows]
    require(len(set(ids)) == 3000 and set(ids) == expected_ids, "row identities")
    rows = sorted(rows, key=lambda row: (["TRAIN_OOF", "TEST"].index(row["split"]), SEEDS.index(row["seed_id"]), row["decision_index"]))
    for row in rows:
        require(set(row) == {"row_id", "split", "seed_id", "decision_index", "state", "state_signal", "target_distance", "nearest_training_distance", "T_supported", "F_supported", "T_rank", "F_rank", "T_proposed_action", "F_proposed_action", "action_success"}, "row schema")
        require(row["seed_id"] in SEEDS and row["split"] in {"TRAIN_OOF", "TEST"} and type(row["decision_index"]) is int, "row identity fields")
        require(len(row["state"]) == 3 and all(finite(x) for x in row["state"]), "state")
        require(sorted(row["T_rank"]) == list(range(5)) and sorted(row["F_rank"]) == list(range(5)), "rank")
        require(row["T_proposed_action"] == ACTIONS[row["T_rank"].index(0)] and row["F_proposed_action"] == ACTIONS[row["F_rank"].index(0)], "proposal")
        require(len(row["action_success"]) == 5 and set(row["action_success"]) <= {0, 1}, "outcomes")
    return rows


def validate_provenance(bundle):
    section_names = ["identity", "observed_rows", "model_spec", "null_worlds", "bootstrap", "n5", "attribution", "sensitivities", "authority_binding"]
    ledger = bundle.get("provenance_ledger")
    require(isinstance(ledger, list) and len(ledger) == len(section_names), "ledger count")
    by_id = {record.get("artifact_id"): record for record in ledger}
    require(set(by_id) == {name.upper() for name in section_names} and len(by_id) == len(ledger), "ledger ids")
    for section in section_names:
        record = by_id[section.upper()]
        require(record.get("artifact_type") == "RAW_EVIDENCE" and record.get("sha256") == digest(bundle[section]), "ledger hash")
        expected_parents = [] if section in {"identity", "authority_binding"} else ["IDENTITY", "AUTHORITY_BINDING"]
        require(record.get("parent_ids") == expected_parents, "ledger parents")


def derive_support(rows):
    test = [row for row in rows if row["split"] == "TEST"]
    t_oos = sum(not row["T_supported"] for row in test) / len(test)
    f_oos = sum(not row["F_supported"] for row in test) / len(test)
    joint = [row for row in test if row["T_supported"] and row["F_supported"]]
    counts = {seed: sum(row["seed_id"] == seed and row["T_proposed_action"] != 0 and row["F_proposed_action"] != 0 for row in joint) for seed in SEEDS}
    valid = t_oos <= 0.10 and f_oos <= 0.10 and len(joint) / len(test) >= 0.80 and sum(value >= 20 for value in counts.values()) >= 20
    return {"valid": valid, "T_oos": t_oos, "F_oos": f_oos, "joint_fraction": len(joint) / len(test), "joint_row_ids": [row["row_id"] for row in joint], "both_nonzero_by_seed": counts}


def rng(family, replicate, suffix):
    token = NULL_TOKENS[family]
    payload = f"{CONFIG_ID}|{token}|{replicate}{suffix}"
    seed = int.from_bytes(hashlib.sha256(payload.encode()).digest()[:8], "big", signed=False)
    return np.random.Generator(np.random.PCG64(seed))


def relabel_rank(rank, permutation):
    output = [0] * 5
    for original_action in range(5):
        output[int(permutation[original_action])] = rank[original_action]
    return output


def bin_context(rows):
    train = [row for row in rows if row["split"] == "TRAIN_OOF"]
    target_cuts = np.quantile(np.asarray([row["target_distance"] for row in train]), [.2, .4, .6, .8], method="linear").tolist()
    phase_bins = {}
    target_bins = {}
    for row in rows:
        angle = float(np.arctan2(row["state"][1], row["state"][0]))
        if angle == math.pi:
            angle = -math.pi
        phase_bins[row["row_id"]] = bisect_right([(-math.pi + i * math.pi / 4) for i in range(1, 8)], angle)
        target_bins[row["row_id"]] = bisect_right(target_cuts, row["target_distance"])
    mapped = {}
    for target_bin in range(5):
        occupied = {phase_bins[row["row_id"]] for row in train if target_bins[row["row_id"]] == target_bin}
        for phase_bin in range(8):
            if phase_bin in occupied:
                mapped[(target_bin, phase_bin)] = phase_bin
            else:
                choices = [(phase_bin - step) % 8 for step in range(1, 8) if (phase_bin - step) % 8 in occupied]
                require(choices, "N3 all empty")
                mapped[(target_bin, phase_bin)] = choices[0]
    # Full-training leave-self-out nearest distances in one frozen standardizer.
    states = np.asarray([row["state"] for row in train], dtype=float)
    mean, scale = states.mean(axis=0), states.std(axis=0)
    scale[scale == 0] = 1.0
    standardized = (states - mean) / scale
    loo = []
    for index in range(len(standardized)):
        distances = np.sqrt(np.sum((standardized - standardized[index]) ** 2, axis=1))
        distances[index] = np.inf
        loo.append(float(np.min(distances)))
    support_cuts = np.quantile(np.asarray(loo), np.arange(.1, 1.0, .1), method="linear").tolist()
    support_bins = {row["row_id"]: bisect_right(support_cuts, row["nearest_training_distance"]) for row in rows}
    by_split_seed = {(split, seed): [i for i, row in enumerate(rows) if row["split"] == split and row["seed_id"] == seed] for split in ["TRAIN_OOF", "TEST"] for seed in SEEDS}
    donor_index = {}
    for i, row in enumerate(rows):
        key = (row["split"], target_bins[row["row_id"]], phase_bins[row["row_id"]])
        donor_index.setdefault(key, []).append(i)
    n3_donors = {}
    for row in rows:
        target_bin = target_bins[row["row_id"]]
        desired_phase = mapped[(target_bin, phase_bins[row["row_id"]])]
        n3_donors[row["row_id"]] = [i for i in donor_index.get((row["split"], target_bin, desired_phase), []) if rows[i]["seed_id"] != row["seed_id"]]
    context = {"target_bins": target_bins, "phase_bins": phase_bins, "mapped": mapped, "support_bins": support_bins, "by_split_seed": by_split_seed, "n3_donors": n3_donors}
    context["n4_groups"] = {carrier: merge_n4_groups(rows, carrier, target_bins, support_bins) for carrier in CARRIERS}
    return context


def merge_n4_groups(rows, carrier, target_bins, support_bins):
    carrier_rank = "T_rank" if carrier == "T" else "F_rank"
    groups_by_subgroup = {}
    for index, row in enumerate(rows):
        magnitude = abs(ACTIONS[row[carrier_rank].index(0)])
        key = (row["split"], target_bins[row["row_id"]], magnitude)
        groups_by_subgroup.setdefault(key, {}).setdefault(support_bins[row["row_id"]], []).append(index)
    final = []
    for subgroup in sorted(groups_by_subgroup, key=str):
        source = groups_by_subgroup[subgroup]
        require(sum(len(v) for v in source.values()) >= 10, "N4 subgroup")
        groups = {decile: {decile} for decile in source}
        def members(deciles):
            return [index for decile in sorted(deciles) for index in source.get(decile, [])]
        changed = True
        while changed:
            changed = False
            for decile in range(10):
                owner = next((key for key, values in groups.items() if decile in values), None)
                if owner is None or len(members(groups[owner])) >= 10:
                    continue
                higher = [key for key, values in groups.items() if min(values) > max(groups[owner])]
                lower = [key for key, values in groups.items() if max(values) < min(groups[owner])]
                target = min(higher, key=lambda key: min(groups[key])) if higher else max(lower, key=lambda key: max(groups[key])) if lower else None
                require(target is not None, "N4 merge")
                groups[owner] |= groups.pop(target)
                changed = True
                break
        for deciles in groups.values():
            indices = members(deciles)
            require(len(indices) >= 10, "N4 group size")
            final.append((subgroup, tuple(sorted(deciles)), indices))
    return final


def transform_world(rows, family, replicate, context):
    target_bins, phase_bins, mapped, support_bins = context["target_bins"], context["phase_bins"], context["mapped"], context["support_bins"]
    t_ranks = [list(row["T_rank"]) for row in rows]
    f_ranks = [list(row["F_rank"]) for row in rows]
    if family == "N1":
        for representation, output in (("TRAJECTORY", t_ranks), ("LEARNED_FIELD", f_ranks)):
            for seed in SEEDS:
                generator = rng("N1", replicate, f"|REP={representation}|SEED={seed}")
                permutation = generator.permutation(5)
                for split in ["TRAIN_OOF", "TEST"]:
                    for index in context["by_split_seed"][(split, seed)]:
                        output[index] = relabel_rank(output[index], permutation)
    elif family == "N2":
        for split in ["TRAIN_OOF", "TEST"]:
            for seed in SEEDS:
                indices = context["by_split_seed"][(split, seed)]
                permutation = rng("N2", replicate, f"|SPLIT={split}|SEED={seed}").permutation(len(indices))
                donors = [f_ranks[indices[int(position)]] for position in permutation]
                for recipient, donor in zip(indices, donors):
                    f_ranks[recipient] = list(donor)
    elif family == "N3":
        original = [list(rank) for rank in f_ranks]
        for recipient, row in enumerate(rows):
            donors = context["n3_donors"][row["row_id"]]
            require(donors, "N3 donor")
            suffix = f'|SPLIT={row["split"]}|ROW={row["split"]}.{row["seed_id"]}.{row["decision_index"]}'
            selected = int(rng("N3", replicate, suffix).integers(0, len(donors), endpoint=False, dtype=np.int64))
            f_ranks[recipient] = list(original[donors[selected]])
    else:
        carrier = family[-1]
        groups = context["n4_groups"][carrier]
        original = [list(rank) for rank in f_ranks]
        for subgroup, deciles, indices in groups:
            split, target_bin, magnitude = subgroup
            token = {0.0: "000", .25: "025", .5: "050"}[magnitude]
            stratum = f"Q{target_bin};M{token};D{','.join(map(str, deciles))}"
            permutation = rng(family, replicate, f"|SPLIT={split}|CARRIER={carrier}|STRATUM={stratum}").permutation(len(indices))
            for recipient_position, donor_position in enumerate(permutation):
                f_ranks[indices[recipient_position]] = list(original[indices[int(donor_position)]])
    return t_ranks, f_ranks


def agreement(t_ranks, f_ranks):
    coherence = np.asarray([(1.0 + kendall(a, b)) / 2.0 for a, b in zip(t_ranks, f_ranks)], dtype=float)
    top = float(np.mean([a.index(0) == b.index(0) for a, b in zip(t_ranks, f_ranks)]))
    return coherence, float(np.mean(coherence)), top


def observed_and_nulls(rows, evidence):
    train_rows = [row for row in rows if row["split"] == "TRAIN_OOF"]
    test_rows = [row for row in rows if row["split"] == "TEST"]
    train_t, train_f = [row["T_rank"] for row in train_rows], [row["F_rank"] for row in train_rows]
    test_t, test_f = [row["T_rank"] for row in test_rows], [row["F_rank"] for row in test_rows]
    train_coh, _, _ = agreement(train_t, train_f)
    test_coh, mean_coh, top = agreement(test_t, test_f)
    observed = {"mean_coherence": mean_coh, "top_action_agreement": top, "carriers": {carrier: metric(train_rows, test_rows, train_coh, test_coh, carrier) for carrier in CARRIERS}}
    require(set(evidence) == set(FAMILIES), "null families")
    row_hash = digest(rows)
    context = bin_context(rows)
    nulls = {family: [] for family in FAMILIES}
    for family in FAMILIES:
        records = evidence[family]
        require(isinstance(records, list) and [record.get("replicate_id") for record in records] == list(range(200)), "null repetitions")
        for record in records:
            require(record == {"family": family, "replicate_id": record["replicate_id"], "population_sha256": row_hash, "rng_contract_id": "A5XE_ACCEPTED_A3_SHA256_PCG64_OBJECT_STREAMS", "support_rule": "ORIGINAL_FIXED_JOINT_NO_DROP", "outcome_rule": "N1_NULL_TOP_PHYSICAL_OTHERWISE_OBSERVED_FIXED"}, "null evidence")
            t_ranks, f_ranks = transform_world(rows, family, record["replicate_id"], context)
            train_count = len(train_rows)
            train_tn, test_tn = t_ranks[:train_count], t_ranks[train_count:]
            train_fn, test_fn = f_ranks[:train_count], f_ranks[train_count:]
            train_null_coh, _, _ = agreement(train_tn, train_fn)
            test_null_coh, null_mean, null_top = agreement(test_tn, test_fn)
            carrier_metrics = {}
            for carrier in CARRIERS:
                if family == "N1":
                    carrier_metrics[carrier] = metric(train_rows, test_rows, train_null_coh, test_null_coh, carrier, train_tn if carrier == "T" else train_fn, test_tn if carrier == "T" else test_fn)
                else:
                    carrier_metrics[carrier] = metric(train_rows, test_rows, train_null_coh, test_null_coh, carrier)
            nulls[family].append({"replicate_id": record["replicate_id"], "mean_coherence": null_mean, "top_action_agreement": null_top, "T_coefficient": carrier_metrics["T"]["coefficient"], "F_coefficient": carrier_metrics["F"]["coefficient"], "T_gain": carrier_metrics["T"]["gain"], "F_gain": carrier_metrics["F"]["gain"]})
    return observed, nulls, train_coh, test_coh


def validate_bootstrap(rows, evidence, train_coh, test_coh):
    require(evidence.get("cluster_unit") == "TEST_SEED" and evidence.get("seed") == 20260808 and evidence.get("source_seed_ids") == SEEDS, "bootstrap contract")
    test_rows = [row for row in rows if row["split"] == "TEST"]
    require(evidence.get("source_row_sha256") == digest([row["row_id"] for row in test_rows]), "bootstrap population")
    records = evidence.get("resamples")
    require(isinstance(records, list) and [record.get("replicate_id") for record in records] == list(range(500)), "bootstrap repetitions")
    generator = np.random.Generator(np.random.PCG64(20260808))
    expected = []
    for replicate in range(500):
        sampled = generator.choice(np.asarray(SEEDS), size=30, replace=True).tolist()
        multiplicities = {seed: sampled.count(seed) for seed in SEEDS}
        require(records[replicate] == {"replicate_id": replicate, "seed_multiplicities": multiplicities}, "bootstrap draw")
        expected.append(multiplicities)
    coefficients = {carrier: [] for carrier in CARRIERS}
    base_features = np.column_stack([[row["state_signal"] for row in test_rows], test_coh])
    for multiplicities in expected:
        indexes = [index for seed in SEEDS for _ in range(multiplicities[seed]) for index, row in enumerate(test_rows) if row["seed_id"] == seed]
        for carrier in CARRIERS:
            key = "T_rank" if carrier == "T" else "F_rank"
            labels = np.asarray([row["action_success"][row[key].index(0)] for row in test_rows], dtype=int)
            model = fit_logistic(base_features[indexes], labels[indexes])
            coefficients[carrier].append(float(model["beta"][2]))
    return coefficients


def validate_n5(evidence):
    matrices = signed_permutations()
    require(evidence.get("matrix_registry") == matrices, "N5 matrix registry")
    result = {}
    for tier in ["SYNTH", "RUN"]:
        record = evidence.get(tier)
        require(record.get("tier") == f"N5_{tier}" and len(record.get("population_row_ids", [])) >= 20 and record.get("population_sha256") == digest(record["population_row_ids"]), "N5 population")
        transforms = record.get("transforms")
        require(isinstance(transforms, list) and len(transforms) == 12, "N5 transforms")
        all_tau = []
        for transform_id, transform in enumerate(transforms):
            q = np.asarray(matrices[transform_id], dtype=float)
            require(transform.get("transform_id") == transform_id and transform.get("Q") == matrices[transform_id] and round(float(np.linalg.det(q))) == 1, "N5 Q")
            require(np.allclose(q @ np.asarray(transform["B_original"]), transform["B_transformed"], atol=0, rtol=0) and np.allclose(q @ np.asarray(transform["target_original"]), transform["target_transformed"], atol=0, rtol=0), "N5 vectors")
            require(transform.get("refits") == [{"representation": "TRAJECTORY", "status": "COMPLETE", "training_parent_sha256": transform["refits"][0]["training_parent_sha256"]}, {"representation": "LEARNED_FIELD", "status": "COMPLETE", "training_parent_sha256": transform["refits"][1]["training_parent_sha256"]}], "N5 refits")
            query_ids = []
            for query in transform.get("query_inputs", []):
                require(np.allclose(q @ np.asarray(query["original"]), query["transformed"], atol=0, rtol=0), "N5 query transform")
                query_ids.append(query["query_id"])
            require(query_ids == record["population_row_ids"], "N5 query population")
            comparisons = transform.get("comparisons")
            expected_pairs = {(representation, query_id) for representation in REPRESENTATIONS for query_id in record["population_row_ids"]}
            require({(comparison.get("representation"), comparison.get("query_id")) for comparison in comparisons} == expected_pairs and len(comparisons) == len(expected_pairs), "N5 comparison universe")
            for comparison in comparisons:
                require(sorted(comparison["original_rank"]) == list(range(5)) and sorted(comparison["transformed_rank"]) == list(range(5)), "N5 ranks")
                inverse = q.T @ np.asarray(comparison["transformed_terminal"])
                require(np.allclose(inverse, comparison["original_terminal"], atol=1e-12, rtol=0), "N5 inverse")
                all_tau.append(kendall(comparison["original_rank"], comparison["transformed_rank"]))
        result[tier] = min(all_tau) >= 0.99
    return result


def direction_and_dominance(rows, observed, test_coh):
    test_rows = [row for row in rows if row["split"] == "TEST"]
    result = {}
    for carrier in CARRIERS:
        labels = observed["carriers"][carrier]["labels"]
        directions = {}
        carrier_rows = []
        for seed in SEEDS:
            indexes = [index for index, row in enumerate(test_rows) if row["seed_id"] == seed]
            c = test_coh[indexes]; y = labels[indexes]
            directions[seed] = 0.0 if len(indexes) < 2 or np.std(c) == 0 or np.std(y) == 0 else float(np.corrcoef(c, y)[0, 1])
            carrier_rows.append({"seed_id": seed, "loss0": (-y * np.log(np.clip(observed["carriers"][carrier]["p0"][indexes], 1e-15, 1 - 1e-15)) - (1 - y) * np.log(np.clip(1 - observed["carriers"][carrier]["p0"][indexes], 1e-15, 1 - 1e-15))).tolist(), "loss1": (-y * np.log(np.clip(observed["carriers"][carrier]["p1"][indexes], 1e-15, 1 - 1e-15)) - (1 - y) * np.log(np.clip(1 - observed["carriers"][carrier]["p1"][indexes], 1e-15, 1 - 1e-15))).tolist()})
        dominance = derive_dominance_rows(carrier_rows)
        result[carrier] = {"directions": directions, "at_least_21": sum(value >= 0 for value in directions.values()) >= 21, "dominance": dominance}
    return result


def derive_dominance_rows(carrier_rows):
    if len(carrier_rows) < 3:
        return {"valid": False, "pass": False, "reason": "FEWER_THAN_THREE_SEEDS"}
    total_rows = sum(len(record.get("loss0", [])) for record in carrier_rows)
    if total_rows == 0 or any(len(record.get("loss0", [])) != len(record.get("loss1", [])) for record in carrier_rows):
        return {"valid": False, "pass": False, "reason": "MALFORMED_LOSSES"}
    contributions = []
    for record in carrier_rows:
        contribution = sum((Fraction.from_float(float(a)) - Fraction.from_float(float(b)) for a, b in zip(record["loss0"], record["loss1"])), Fraction()) / total_rows
        contributions.append((record["seed_id"], contribution))
    aggregate = sum((value for _, value in contributions), Fraction())
    top = sorted(contributions, key=lambda item: (-item[1], item[0]))[:3]
    d3 = sum((value for _, value in top), Fraction())
    passes = aggregate > 0 and 2 * d3 <= aggregate
    return {"valid": True, "pass": passes, "reason": "PASS" if passes else "NONPOSITIVE_G" if aggregate <= 0 else "DOMINATED", "G": [aggregate.numerator, aggregate.denominator], "D3": [d3.numerator, d3.denominator]}


def sensitivity_metrics(bundle, rows):
    records = bundle.get("sensitivities")
    require(isinstance(records, list) and len(records) == 12 and len({record.get("sensitivity_id") for record in records}) == 12, "sensitivity records")
    expected_ids = {item[0] for item in __import__("synthetic_raw_bundle").sensitivity_registry()}
    require({record.get("sensitivity_id") for record in records} == expected_ids, "sensitivity IDs")
    train_rows = [row for row in rows if row["split"] == "TRAIN_OOF"]
    test_rows = [row for row in rows if row["split"] == "TEST"]
    output = {}
    for record in records:
        require(record.get("contributing_seed_ids") == SEEDS and record.get("rows_per_seed") == {seed: 50 for seed in SEEDS}, "sensitivity population")
        require(record.get("test_row_ids") == [row["row_id"] for row in test_rows], "sensitivity rows")
        require(len(record.get("train_coherence", [])) == len(train_rows) and len(record.get("test_coherence", [])) == len(test_rows), "sensitivity evidence")
        output[record["sensitivity_id"]] = {carrier: metric(train_rows, test_rows, np.asarray(record["train_coherence"]), np.asarray(record["test_coherence"]), carrier) for carrier in CARRIERS}
    return output


def monte_carlo(observed, values):
    require(len(values) == 200 and all(finite(value) for value in values), "Monte Carlo values")
    count = sum(value >= observed for value in values)
    return {"k": count, "p": (1 + count) / 201, "pass": count <= 4}


def classify(valid, propositions, observed, bootstrap):
    cores = {carrier: observed["carriers"][carrier]["coefficient"] > 0 and observed["carriers"][carrier]["gain"] > 0 for carrier in CARRIERS}
    resolved_negative = {carrier: float(np.quantile(bootstrap[carrier], .975, method="linear")) < 0 for carrier in CARRIERS}
    if any(cores[carrier] and resolved_negative[carrier] for carrier in CARRIERS):
        valid = False
    if not valid:
        return "INVALID EXPERIMENT"
    if all(propositions.values()) and all(cores.values()) and not any(resolved_negative.values()):
        return "REPLICATED"
    if any(cores.values()) and not any(resolved_negative.values()):
        return "PARTIALLY REPLICATED"
    return "NOT REPLICATED"


def derive(bundle):
    try:
        forbidden_decisions(bundle)
        require(bundle.get("schema") == "A5XE_SYNTHETIC_RAW_EVIDENCE_V1", "schema")
        require(bundle.get("authority_binding") == {"v1_composite": "971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05", "config_id": CONFIG_ID, "registered_data": False, "fixture_identity": "SYNTHETIC_ONLY"}, "authority binding")
        validate_provenance(bundle)
        rows = validate_rows(bundle)
        support = derive_support(rows)
        require(support["valid"], "support validity")
        n5 = validate_n5(bundle.get("n5", {}))
        if not n5["SYNTH"]:
            return {"execution_state": "IMPLEMENTATION_FAILURE", "release_permitted": False, "classification": None, "reason": "N5_SYNTH"}
        if not n5["RUN"]:
            return {"execution_state": "INVALID_EXPERIMENT", "release_permitted": False, "classification": None, "reason": "N5_RUN"}
        observed, nulls, train_coh, test_coh = observed_and_nulls(rows, bundle.get("null_worlds", {}))
        bootstrap = validate_bootstrap(rows, bundle.get("bootstrap", {}), train_coh, test_coh)
        attribution = direction_and_dominance(rows, observed, test_coh)
        require(all(attribution[carrier]["dominance"]["valid"] for carrier in CARRIERS), "dominance population")
        attribution_contract = bundle.get("attribution", {})
        test_ids = [row["row_id"] for row in rows if row["split"] == "TEST"]
        require(attribution_contract.get("eligible_test_row_ids") == test_ids, "attribution population")
        require(set(attribution_contract.get("mandatory_report_only", {})) == {"TRAJECTORY_ONLY_OUTCOME_PREDICTION", "LEARNED_FIELD_ONLY_OUTCOME_PREDICTION", "EQUAL_SCORE_FUSION_CARRIER"}, "report-only diagnostics")
        sensitivities = sensitivity_metrics(bundle, rows)
        p1_tests = {f"{stat}:{family}": monte_carlo(observed[stat], [record[stat] for record in nulls[family]]) for stat in ["mean_coherence", "top_action_agreement"] for family in FAMILIES}
        P1 = all(record["pass"] for record in p1_tests.values())
        P2 = all(observed["carriers"][carrier]["coefficient"] > 0 and float(np.quantile(bootstrap[carrier], .025, method="linear")) > 0 for carrier in CARRIERS)
        p3_tests = {}
        for carrier in CARRIERS:
            for family in ["N1", "N2", "N3", f"N4_{carrier}"]:
                p3_tests[f"{carrier}:{family}"] = monte_carlo(observed["carriers"][carrier]["gain"], [record[f"{carrier}_gain"] for record in nulls[family]])
        P3 = all(observed["carriers"][carrier]["gain"] > 0 and observed["carriers"][carrier]["brier_augmented"] <= observed["carriers"][carrier]["brier_baseline"] for carrier in CARRIERS) and all(record["pass"] for record in p3_tests.values())
        P4 = all(observed["carriers"][carrier]["coefficient"] > 0 and observed["carriers"][carrier]["gain"] > 0 and attribution[carrier]["at_least_21"] and attribution[carrier]["dominance"]["pass"] for carrier in CARRIERS)
        amplitude_ids = ["ACTION_AMPLITUDE_0.25", "ACTION_AMPLITUDE_1.0"]
        P5 = all(sensitivities[sensitivity_id][carrier]["coefficient"] > 0 and sensitivities[sensitivity_id][carrier]["gain"] > 0 for sensitivity_id in amplitude_ids for carrier in CARRIERS)
        propositions = {"P1": P1, "P2": P2, "P3": P3, "P4": P4, "P5": P5}
        label = classify(True, propositions, observed, bootstrap)
        cross_system = "PARTIAL CROSS-SYSTEM REPLICATION" if all(propositions[f"P{i}"] for i in (1, 2, 3)) and label in {"REPLICATED", "PARTIALLY REPLICATED"} else "NON-REPLICATION"
        derived_ledger = [
            {"artifact_id": "DERIVED_SUPPORT", "parent_ids": ["OBSERVED_ROWS", "IDENTITY"], "sha256": digest(support)},
            {"artifact_id": "DERIVED_NULLS", "parent_ids": ["NULL_WORLDS", "OBSERVED_ROWS", "MODEL_SPEC"], "sha256": digest(nulls)},
            {"artifact_id": "DERIVED_BOOTSTRAP", "parent_ids": ["BOOTSTRAP", "OBSERVED_ROWS", "MODEL_SPEC"], "sha256": digest(bootstrap)},
            {"artifact_id": "DERIVED_N5", "parent_ids": ["N5"], "sha256": digest(n5)},
            {"artifact_id": "DERIVED_ATTRIBUTION", "parent_ids": ["ATTRIBUTION", "OBSERVED_ROWS"], "sha256": digest(attribution)},
            {"artifact_id": "DERIVED_SENSITIVITIES", "parent_ids": ["SENSITIVITIES", "OBSERVED_ROWS"], "sha256": digest({key: {carrier: {field: value for field, value in metric_record.items() if field in {"coefficient", "gain"}} for carrier, metric_record in value.items()} for key, value in sensitivities.items()})},
            {"artifact_id": "DERIVED_P1_P5", "parent_ids": ["DERIVED_NULLS", "DERIVED_BOOTSTRAP", "DERIVED_ATTRIBUTION", "DERIVED_SENSITIVITIES"], "sha256": digest(propositions)},
            {"artifact_id": "FINAL_CLASSIFICATION", "parent_ids": ["DERIVED_P1_P5", "DERIVED_SUPPORT", "DERIVED_N5"], "sha256": digest({"classification": label, "cross_system": cross_system})},
        ]
        normalized_observed = {"mean_coherence": observed["mean_coherence"], "top_action_agreement": observed["top_action_agreement"], "carriers": {carrier: {key: observed["carriers"][carrier][key] for key in ["coefficient", "gain", "brier_baseline", "brier_augmented"]} for carrier in CARRIERS}}
        return {"execution_state": "VALID_SCIENTIFIC_RESULT", "release_permitted": False, "support": support, "n5": n5, "observed": normalized_observed, "nulls_sha256": digest(nulls), "bootstrap_ci": {carrier: [float(np.quantile(bootstrap[carrier], .025, method="linear")), float(np.quantile(bootstrap[carrier], .975, method="linear"))] for carrier in CARRIERS}, "attribution": attribution, "sensitivities": {key: {carrier: {field: value for field, value in record.items() if field in {"coefficient", "gain"}} for carrier, record in value.items()} for key, value in sensitivities.items()}, "P": propositions, "classification": label, "cross_system": cross_system, "derived_provenance": derived_ledger}
    except (EvidenceError, KeyError, TypeError, ValueError, np.linalg.LinAlgError) as error:
        return {"execution_state": "INVALID_EXPERIMENT", "release_permitted": False, "classification": None, "reason": str(error)}
