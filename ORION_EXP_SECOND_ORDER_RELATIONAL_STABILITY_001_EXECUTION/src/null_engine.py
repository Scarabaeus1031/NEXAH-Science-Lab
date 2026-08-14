from __future__ import annotations

import argparse
import hashlib
import json
import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np

from core import M_BAR_DEN, N3_SEED_HEX, N4_SEED_HEX, frac, higher_quantile_int, shake_permutation, write_json


def _n4_worker(payload: tuple[int, int, np.ndarray, np.ndarray, np.ndarray, list[str]]) -> list[tuple[int, int]]:
    first, last, x2, y3, min_term, opaque_ids = payload
    master = bytes.fromhex(N4_SEED_HEX)
    units = x2.shape[0]
    results: list[tuple[int, int]] = []
    for replicate in range(first, last):
        total = 0
        for unit in range(units):
            source = unit // 6
            phase = unit % 6
            label = f"N4|{replicate}|{opaque_ids[source]}|{phase}"
            perm = shake_permutation(master, label, 12)
            c_null = int(np.abs(x2[unit] - y3[unit, perm]).sum(dtype=np.int32))
            total += int(min_term[unit]) - c_null
        results.append((replicate, total))
    return results


def run_n4(null_input: Path, observer_arrays: Path, source_manifest: Path, output: Path, workers: int) -> None:
    first = np.load(null_input, allow_pickle=False)
    obs = np.load(observer_arrays, allow_pickle=False)
    manifest = json.loads(source_manifest.read_text("utf-8"))
    opaque_ids = manifest["opaque_ids"]
    da2 = (first["a2_post"].astype(np.int16) - first["a2_pre"].astype(np.int16)).reshape(-1, 12)
    da3 = (first["a3_post"].astype(np.int16) - first["a3_pre"].astype(np.int16)).reshape(-1, 12)
    x2 = 3 * da2
    y3 = 2 * da3
    min_term = np.minimum(6 * obs["A"].reshape(-1), 4 * obs["B"].reshape(-1)).astype(np.int16)
    spans = []
    for w in range(workers):
        lo = (9999 * w) // workers
        hi = (9999 * (w + 1)) // workers
        spans.append((lo, hi, x2, y3, min_term, opaque_ids))
    pairs: list[tuple[int, int]] = []
    with ProcessPoolExecutor(max_workers=workers) as pool:
        for result in pool.map(_n4_worker, spans):
            pairs.extend(result)
    pairs.sort()
    values = np.asarray([value for _, value in pairs], dtype=np.int64)
    observed_num = int(obs["M_num"].sum(dtype=np.int64))
    q99 = higher_quantile_int(values, 0.99)
    exceed = int((values >= observed_num).sum())
    p_num = 1 + exceed
    output.mkdir(parents=True, exist_ok=True)
    np.save(output / "n4_distribution.npy", values, allow_pickle=False)
    write_json(
        output / "n4_summary.json",
        {
            "duplicates_retained": True,
            "null_max": frac(int(values.max()), M_BAR_DEN),
            "null_mean": frac(int(values.sum(dtype=np.int64)), M_BAR_DEN * len(values)),
            "null_min": frac(int(values.min()), M_BAR_DEN),
            "observed": frac(observed_num, M_BAR_DEN),
            "observed_gt_q99": observed_num > q99,
            "p_le_0_01": p_num * 100 <= 10000,
            "p_value": frac(p_num, 10000),
            "q99_higher": frac(q99, M_BAR_DEN),
            "q99_raw_numerator": q99,
            "replicates": 9999,
            "seed": N4_SEED_HEX,
        },
    )


def _derangement(master: bytes, replicate: int, n: int) -> np.ndarray:
    attempt = 0
    while True:
        perm = shake_permutation(master, f"N3|{replicate}|{attempt}", n)
        if np.all(perm != np.arange(n, dtype=np.int16)):
            return perm
        attempt += 1


def run_n3(first_order: Path, output: Path) -> None:
    first = np.load(first_order, allow_pickle=False)
    a2pre = first["a2_pre"].astype(np.int16)
    a2post = first["a2_post"].astype(np.int16)
    a3pre = first["a3_pre"].astype(np.int16)
    a3post = first["a3_post"].astype(np.int16)
    da2 = a2post - a2pre
    a = np.abs(da2).sum(axis=2, dtype=np.int32)
    b_all = np.abs(a3post - a3pre).sum(axis=2, dtype=np.int32)
    master = bytes.fromhex(N3_SEED_HEX)
    values = np.empty(9999, dtype=np.int64)
    for replicate in range(9999):
        perm = _derangement(master, replicate, a2pre.shape[0])
        b = b_all[perm]
        qpre = 3 * a2pre.astype(np.int32) - 2 * a3pre[perm].astype(np.int32)
        qpost = 3 * a2post.astype(np.int32) - 2 * a3post[perm].astype(np.int32)
        c = np.abs(qpost - qpre).sum(axis=2, dtype=np.int32)
        values[replicate] = (np.minimum(6 * a, 4 * b) - c).sum(dtype=np.int64)
    output.mkdir(parents=True, exist_ok=True)
    np.save(output / "n3_distribution.npy", values, allow_pickle=False)
    write_json(output / "n3_raw.json", {"replicates": 9999, "seed": N3_SEED_HEX})


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--kind", choices=["N4", "N3"], required=True)
    parser.add_argument("--first-order", required=True)
    parser.add_argument("--observer-arrays")
    parser.add_argument("--source-manifest")
    parser.add_argument("--output", required=True)
    parser.add_argument("--workers", type=int, default=max(1, min(8, os.cpu_count() or 1)))
    args = parser.parse_args()
    if args.kind == "N4":
        run_n4(Path(args.first_order), Path(args.observer_arrays), Path(args.source_manifest), Path(args.output), args.workers)
    else:
        run_n3(Path(args.first_order), Path(args.output))


if __name__ == "__main__":
    main()
