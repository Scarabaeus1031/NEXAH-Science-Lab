#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[3]
CASE = Path(__file__).resolve().parent
CORPUS = ROOT / "SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/CIKADA 3301 LATER MARKER CORPUS"
PKG_NAME = "Breathing_Crystal_Package_v0_3"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    d = 3
    while d * d <= n:
        if n % d == 0:
            return False
        d += 2
    return True


def primes_upto(n: int) -> list[int]:
    return [x for x in range(2, n + 1) if is_prime(x)]


def entropy_norm(counts: list[int]) -> float:
    total = sum(counts)
    if total == 0:
        return 0.0
    probs = [x / total for x in counts if x]
    return -sum(p * math.log(p) for p in probs) / math.log(len(counts))


def dispersion(counts: list[int]) -> float:
    mean = sum(counts) / len(counts)
    return sum((x - mean) ** 2 / mean for x in counts) if mean else 0.0


def factorize(n: int) -> dict[str, int]:
    out: dict[str, int] = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            out[str(d)] = out.get(str(d), 0) + 1
            n //= d
        d += 1
    if n > 1:
        out[str(n)] = out.get(str(n), 0) + 1
    return out


def rail_fraction(rows: int, width: int, tau: float) -> float:
    hits = 0
    total = rows * width
    for r in range(rows):
        R = r / (rows - 1)
        for c in range(width):
            C = c / (width - 1)
            ds = []
            for s, op in ((math.sqrt(2), "mul"), (math.sqrt(2), "div"),
                          (math.sqrt(5), "mul"), (math.sqrt(5), "div")):
                target = (R * s if op == "mul" else R / s) % 1.0
                a = abs(C - target)
                ds.append(min(a, 1.0 - a))
            if any(d < tau for d in ds):
                hits += 1
    return hits / total


def initial_prime_run(c: int) -> int:
    k = 0
    while is_prime(k * k + k + c):
        k += 1
    return k


def count_prime_values(c: int, limit: int) -> int:
    k = 0
    count = 0
    while True:
        v = k * k + k + c
        if v > limit:
            return count
        count += int(is_prime(v))
        k += 1


def locate_sources() -> dict[str, Path]:
    packages = sorted(p for p in CORPUS.rglob(PKG_NAME) if p.is_dir())
    if not packages:
        raise RuntimeError("source package not found")
    pkg = packages[0]
    return {name: pkg / name for name in (
        "vendessimal_prime_toolkit.py", "vendessimal_readme.md", "README_EXTENDED.md"
    )}


def text_provenance_search() -> dict[str, list[str]]:
    needles = {
        "Euler-Free Paths": [],
        "12 x 1008": [],
        "12 × 1008": [],
        "Zodiac Trail": [],
        "Euler-Lattice Seeds with 7-Arc": [],
    }
    allowed = {".py", ".md", ".txt", ".html", ".js", ".json", ".csv"}
    for path in CORPUS.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in allowed:
            continue
        if path.name == "_pdf_text_index.json" or path.stat().st_size > 5_000_000:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        rel = str(path.relative_to(ROOT))
        for needle in needles:
            if needle in text:
                needles[needle].append(rel)
    return needles


def main() -> int:
    outdir = Path(sys.argv[1]) if len(sys.argv) > 1 else CASE / "primary"
    outdir.mkdir(parents=True, exist_ok=True)
    src = locate_sources()
    source_hashes = {k: sha256(v) for k, v in src.items()}

    with tempfile.TemporaryDirectory(prefix="vendessimal_cli_") as tmp:
        output = Path(tmp) / "default.png"
        proc = subprocess.run(
            [sys.executable, str(src["vendessimal_prime_toolkit.py"]), "--out", str(output)],
            cwd=tmp, capture_output=True, text=True, timeout=60,
            env={**os.environ, "MPLBACKEND": "Agg"},
        )
        cli = {
            "exit_code": proc.returncode,
            "output_exists": output.exists() and output.stat().st_size > 0,
            "stderr_tail": proc.stderr[-500:],
            "classification": "EXECUTABLE" if proc.returncode == 0 and output.exists() and output.stat().st_size > 0 else "NOT_EXECUTABLE_AS_DOCUMENTED",
        }

    rail = {f"{tau:.2f}": round(rail_fraction(150, 20, tau), 12)
            for tau in (0.05, 0.10, 0.25, 0.50, 0.55)}
    rail_class = "SELECTIVE" if rail["0.55"] < 1.0 else "DEGENERATE_FULL_SUPPORT"

    centers = [3.0, 10.0, 17.0]
    ratios = [0.429, 0.456, 0.487]
    norm_a = [c / 19.0 for c in centers]
    norm_b = [(c + 0.5) / 20.0 for c in centers]
    err_a = [abs(a - b) for a, b in zip(norm_a, ratios)]
    err_b = [abs(a - b) for a, b in zip(norm_b, ratios)]
    triad = {
        "centers": centers, "readme_ratios": ratios,
        "center_over_19": norm_a, "center_midpoint_over_20": norm_b,
        "errors_center_over_19": err_a,
        "errors_midpoint_over_20": err_b,
        "consistent": max(min(max(err_a), max(err_b)), 0.0) <= 0.025,
        "classification": "CONSISTENT" if min(max(err_a), max(err_b)) <= 0.025 else "UNBOUND_SYMBOLIC_OVERLAY",
    }

    constants = [13,41,137,241,367,487,617,751,883,1031,1171,1303,1459]
    euler = {
        str(c): {"initial_prime_run": initial_prime_run(c), "prime_values_le_3000": count_prime_values(c, 3000)}
        for c in constants
    }
    euler41_exact = all(is_prime(k*k+k+41) for k in range(40)) and 40*40+40+41 == 41*41 and not is_prime(41*41)

    primes = primes_upto(5000)
    supplied_13 = [41,137,241,367,487,617,751,883,1031,1171,1303,1459]
    expected_13 = [primes[(13 + 20*j) - 1] for j in range(len(supplied_13))]
    supplied_10 = [29,113,229,349,463,601,733]
    expected_10 = [primes[(10 + 20*j) - 1] for j in range(len(supplied_10))]
    ladder = {
        "lane_13_supplied": supplied_13,
        "lane_13_expected": expected_13,
        "lane_13_mismatches": [
            {"position": j, "prime_index": 13+20*j, "supplied": a, "expected": b}
            for j, (a,b) in enumerate(zip(supplied_13, expected_13)) if a != b
        ],
        "lane_10_supplied": supplied_10,
        "lane_10_expected": expected_10,
        "lane_10_mismatches": [
            {"position": j, "prime_index": 10+20*j, "supplied": a, "expected": b}
            for j, (a,b) in enumerate(zip(supplied_10, expected_10)) if a != b
        ],
    }

    prime_set = {p for p in primes if p <= 3000}
    twin_members = {p for p in prime_set if p-2 in prime_set or p+2 in prime_set}
    widths = {}
    for width in (19,20,21):
        pc = [0] * width
        tc = [0] * width
        for n in range(1,3001):
            col = (n-1) % width
            if n in prime_set: pc[col] += 1
            if n in twin_members: tc[col] += 1
        widths[str(width)] = {
            "prime_counts": pc, "twin_member_counts": tc,
            "prime_dispersion": round(dispersion(pc), 12),
            "twin_dispersion": round(dispersion(tc), 12),
            "prime_entropy": round(entropy_norm(pc), 12),
            "twin_entropy": round(entropy_norm(tc), 12),
        }

    twin_windows = [(p,p+1,p+2) for p in sorted(prime_set) if p+2 in prime_set]
    aligned = [w for w in twin_windows if w[2]+1 <= 3000 and (w[2]+1) % 1064 == 0]
    threshold = {
        "primality": {str(n): is_prime(n) for n in range(1061,1065)},
        "factorizations": {str(n): factorize(n) for n in range(1061,1065)},
        "twin_window_count_le_3000": len(twin_windows),
        "prime_composite_prime_unique": len(twin_windows) == 1,
        "factor_aligned_endpoints_p_plus_3_multiple_1064": aligned,
    }

    provenance = text_provenance_search()
    prov_files = sorted({f for values in provenance.values() for f in values})
    provenance_result = {
        "matches_by_label": provenance,
        "matching_text_source_files": prov_files,
        "classification": "RECONSTRUCTIBLE" if prov_files else "VISUAL_ONLY_UNVERIFIED",
    }

    arithmetic_exact = euler41_exact and not ladder["lane_10_mismatches"]
    if arithmetic_exact:
        classification = "PARTIALLY_RECONSTRUCTED_WITH_REPRESENTATION_ARTIFACTS"
    else:
        classification = "INVALID"

    result = {
        "experiment": "NEXAH_VENDESSIMAL_PRIME_GRID_FORENSIC_AUDIT_2026-09-28",
        "preregistration_sha256": sha256(CASE / "00_PREREGISTRATION.md"),
        "source_hashes": source_hashes,
        "T1_cli": cli,
        "T2_rails": {"fractions": rail, "classification": rail_class},
        "T3_triads": triad,
        "T4_euler": {"constants": euler, "euler41_exact": euler41_exact, "family_classification": "VERTICAL_TRANSLATIONS"},
        "T5_prime_index_ladders": ladder,
        "T6_width_sensitivity": {"widths": widths, "classification": "REPRESENTATION_DEPENDENT"},
        "T7_threshold": threshold,
        "T8_geometric_provenance": provenance_result,
        "overall_classification": classification,
        "scientific_boundary": "FINITE_ARITHMETIC_AND_REPRESENTATION_AUDIT_ONLY",
    }
    canonical = json.dumps(result, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    digest = hashlib.sha256(canonical).hexdigest()
    (outdir / "scientific_result.json").write_bytes(canonical + b"\n")
    (outdir / "result_hash.txt").write_text(digest + "\n", encoding="utf-8")
    print(json.dumps({"hash": digest, "classification": classification, "outdir": str(outdir)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
