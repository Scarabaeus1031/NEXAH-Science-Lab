from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from core import (
    CORE,
    D2_SEED_HEX,
    D3_SEED_HEX,
    M_BAR_DEN,
    block_starts,
    block_sum_field,
    frac,
    phase_offsets,
    shake_permutation,
    write_json,
)


def control_summary(name: str, numerator: int, observed: int, q99: int) -> dict[str, object]:
    degraded = (observed - numerator) * 20 >= M_BAR_DEN
    at_or_below = numerator <= q99
    return {
        "M_bar": frac(numerator, M_BAR_DEN),
        "at_or_below_primary_N4_Q99": at_or_below,
        "decreased_by_at_least_0_05": degraded,
        "name": name,
        "pass": degraded and at_or_below,
        "raw_numerator": numerator,
    }


def random_byte_stream(master: bytes, label: str, length: int = 8192) -> bytes:
    import hashlib

    return hashlib.shake_256(master + label.encode("utf-8")).digest(length)


def rewired_v_slots(c: int, opaque_id: str) -> tuple[np.ndarray | None, dict[str, int]]:
    s2, s3 = phase_offsets(c)
    u = block_starts(2, s2, CORE).astype(int)
    v = block_starts(3, s3, CORE).astype(int)
    original_edges = sorted(set(zip(u.tolist(), v.tolist())))
    edges = list(original_edges)
    edge_slot = {edge: idx for idx, edge in enumerate(original_edges)}
    position_slots = np.asarray([edge_slot[(int(uu), int(vv))] for uu, vv in zip(u, v)], dtype=np.int16)
    e_count = len(edges)
    stream = random_byte_stream(bytes.fromhex(D3_SEED_HEX), f"D3|{opaque_id}|{c}")
    cursor = 0
    accepted = 0
    proposals = 0
    target = 10 * e_count
    cap = 1000 * e_count
    while accepted < target and proposals < cap:
        if cursor + 4 > len(stream):
            return None, {"accepted": accepted, "proposals": proposals}
        e1 = int.from_bytes(stream[cursor : cursor + 2], "big") % e_count
        e2 = int.from_bytes(stream[cursor + 2 : cursor + 4], "big") % e_count
        cursor += 4
        proposals += 1
        if e1 == e2:
            continue
        u1, v1 = edges[e1]
        u2, v2 = edges[e2]
        if u1 == u2 or v1 == v2:
            continue
        candidate1 = (u1, v2)
        candidate2 = (u2, v1)
        remaining = {edge for idx, edge in enumerate(edges) if idx not in (e1, e2)}
        if candidate1 in remaining or candidate2 in remaining or candidate1 == candidate2:
            continue
        edges[e1] = candidate1
        edges[e2] = candidate2
        accepted += 1
    if accepted < target or edges == original_edges:
        return None, {"accepted": accepted, "proposals": proposals}
    new_v_by_slot = np.asarray([edge[1] for edge in edges], dtype=np.int16)
    return new_v_by_slot[position_slots], {"accepted": accepted, "proposals": proposals}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-order", required=True)
    parser.add_argument("--observer-arrays", required=True)
    parser.add_argument("--source-manifest", required=True)
    parser.add_argument("--n4-summary", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    first = np.load(args.first_order, allow_pickle=False)
    obs = np.load(args.observer_arrays, allow_pickle=False)
    ids = json.loads(Path(args.source_manifest).read_text("utf-8"))["opaque_ids"]
    n4 = json.loads(Path(args.n4_summary).read_text("utf-8"))
    q99 = int(n4["q99_raw_numerator"])
    observed = int(obs["M_num"].sum(dtype=np.int64))
    min_term_auth = np.minimum(6 * obs["A"], 4 * obs["B"])

    # D1: fixed G3 phase derangement, with each selected G3 phase's own successor.
    phase_perm = np.asarray([1, 0, 3, 2, 5, 4], dtype=np.int16)
    d1_total = 0
    for c in range(6):
        pc = int(phase_perm[c])
        a = obs["A"][:, c]
        b = np.abs(first["a3_post"][:, pc].astype(np.int32) - first["a3_pre"][:, pc].astype(np.int32)).sum(axis=1)
        qpre = 3 * first["a2_pre"][:, c].astype(np.int32) - 2 * first["a3_pre"][:, pc].astype(np.int32)
        qpost = 3 * first["a2_post"][:, c].astype(np.int32) - 2 * first["a3_post"][:, pc].astype(np.int32)
        cval = np.abs(qpost - qpre).sum(axis=1)
        d1_total += int((np.minimum(6 * a, 4 * b) - cval).sum(dtype=np.int64))

    # D2: one independently keyed correspondence permutation per source/phase.
    d2_total = 0
    d2_master = bytes.fromhex(D2_SEED_HEX)
    for source, opaque_id in enumerate(ids):
        for c in range(6):
            perm = shake_permutation(d2_master, f"D2|{opaque_id}|{c}", 12)
            da2 = 3 * (first["a2_post"][source, c].astype(np.int32) - first["a2_pre"][source, c].astype(np.int32))
            da3 = 2 * (first["a3_post"][source, c, perm].astype(np.int32) - first["a3_pre"][source, c, perm].astype(np.int32))
            cval = int(np.abs(da2 - da3).sum())
            d2_total += int(min_term_auth[source, c]) - cval

    # D3: degree-preserving rewire on G2-attached comparison slots.
    d3_total = 0
    d3_degenerate = 0
    accepted_total = 0
    proposals_total = 0
    for source, opaque_id in enumerate(ids):
        for c in range(6):
            new_v_at_position, counts = rewired_v_slots(c, opaque_id)
            accepted_total += counts["accepted"]
            proposals_total += counts["proposals"]
            if new_v_at_position is None:
                d3_degenerate += 1
                continue
            s3 = phase_offsets(c)[1]
            v_original = block_starts(3, s3, CORE).astype(int)
            representative = {int(node): int(np.where(v_original == node)[0][0]) for node in np.unique(v_original)}
            reps = np.asarray([representative[int(node)] for node in new_v_at_position], dtype=np.int16)
            qpre = 3 * first["a2_pre"][source, c].astype(np.int32) - 2 * first["a3_pre"][source, c, reps].astype(np.int32)
            qpost = 3 * first["a2_post"][source, c].astype(np.int32) - 2 * first["a3_post"][source, c, reps].astype(np.int32)
            cval = int(np.abs(qpost - qpre).sum())
            d3_total += int(min_term_auth[source, c]) - cval

    # D4: translate grids and digit field together on a nonterminal fixture.
    old = (np.arange(18, dtype=np.uint8) % 10)[None, :]
    shifted = np.empty_like(old)
    shifted[:, 0] = 7
    shifted[:, 1:] = old[:, :-1]
    d4_exact = True
    interval_bijection = True
    for c in range(6):
        s2, s3 = phase_offsets(c)
        n2, n3 = phase_offsets((c + 1) % 6)
        pre2 = block_sum_field(old, 2, s2, CORE)[0]
        pre3 = block_sum_field(old, 3, s3, CORE)[0]
        post2 = block_sum_field(shifted, 2, n2, CORE + 1)[0]
        post3 = block_sum_field(shifted, 3, n3, CORE + 1)[0]
        d4_exact = d4_exact and np.array_equal(3 * pre2 - 2 * pre3, 3 * post2 - 2 * post3)
        interval_bijection = interval_bijection and np.array_equal(block_starts(2, s2, CORE) + 1, block_starts(2, n2, CORE + 1))
        interval_bijection = interval_bijection and np.array_equal(block_starts(3, s3, CORE) + 1, block_starts(3, n3, CORE + 1))

    d1 = control_summary("D1_RELATIVE_PHASE_DESTRUCTION", d1_total, observed, q99)
    d2 = control_summary("D2_CORRESPONDENCE_DESTRUCTION", d2_total, observed, q99)
    if d3_degenerate:
        d3 = {
            "accepted_switches": accepted_total,
            "degenerate_or_uncompleted_units": d3_degenerate,
            "name": "D3_RELATION_REWIRING",
            "pass": False,
            "proposals": proposals_total,
            "status": "UNDEFINED_DEGENERATE_REWIRING_ORBIT",
        }
    else:
        d3 = control_summary("D3_RELATION_REWIRING", d3_total, observed, q99)
        d3.update({"accepted_switches": accepted_total, "degenerate_or_uncompleted_units": 0, "proposals": proposals_total})
    d4 = {
        "Delta_R": frac(0, 1) if d4_exact else None,
        "exact_interval_bijection": interval_bijection,
        "name": "D4_POSITIVE_COMMON_TRANSLATION",
        "pass": bool(d4_exact and interval_bijection),
    }
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    write_json(out / "control_results.json", {"D1": d1, "D2": d2, "D3": d3, "D4": d4, "all_pass": all(item["pass"] for item in (d1, d2, d3, d4))})


if __name__ == "__main__":
    main()
