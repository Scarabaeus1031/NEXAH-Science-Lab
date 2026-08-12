# Board XXIII — Z3885 Algebraic Scaling Proof Certificate

## 1. Scope

This certificate proves a statement about two finite modular dynamical
systems. For `T_a(x) = ax mod n`, it verifies the complete orbit structure of
`T_524` on `Z_777`, the complete orbit structure of `T_1301` on `Z_3885`, and
the claimed fivefold CRT fiber scaling between them.

It does **not** prove physical truth, power-grid scaling, IEEE-9 to IEEE-14
behavior, general NEXAH validity, navigation, control, domain transfer, or
universality. No physics or power-grid experiment was authorized or performed.

The original historical Board XXIII source was not located. The theorem
certified here is therefore precisely the finite-algebra statement defined in
the supplied task, whose expected counts were treated as tests rather than
inputs to the computation.

## 2. Definitions

For a positive integer `n` and integer `a`, define

`T_a : Z_n -> Z_n`, with `T_a(x) = ax mod n`.

The orbit of `x` is the sequence obtained by repeated application of `T_a`.
Its exact period is the least positive `d` for which `T_a^d(x) = x`. A fixed
point has exact period one. When `gcd(a,n)=1`, `T_a` is a permutation, so every
state belongs to exactly one closed cycle and no transient states occur.

The verifier canonicalizes each cycle by rotation to its smallest member and
sorts cycles by `(period, canonical members)`.

## 3. CRT decomposition

The arithmetic conditions are

- `3885 = 5 * 777`;
- `gcd(777,5) = 1`;
- `1301 mod 777 = 524`;
- `1301 mod 5 = 1`.

The Chinese Remainder Theorem gives the bijection

`phi : Z_3885 -> Z_777 × Z_5`, `phi(x) = (x mod 777, x mod 5)`.

Its inverse as implemented is

`phi^-1(b,r) = b + 777 * (3(r-b) mod 5) mod 3885`,

because `777 = 2 mod 5` and `2^-1 = 3 mod 5`. Therefore

`phi(T_1301(x)) = (T_524(x mod 777), x mod 5)`.

The program checked the CRT round trip, uniqueness of all CRT images, and this
commuting relation for every one of the 3,885 states. It found 3,885 distinct
images and zero failures. Hence

`T_1301 ≅ T_524 × id_Z5`.

## 4. Base-system result

System: `Z_777`, `T_524`.

| Exact period | Orbit count | State count |
|---:|---:|---:|
| 1 | 1 | 1 |
| 2 | 10 | 20 |
| 4 | 189 | 756 |
| **Total** | **200** | **777** |

All 777 states occur exactly once in the enumerated partition.

## 5. Scaled-system result

System: `Z_3885`, `T_1301`.

| Exact period | Orbit count | State count |
|---:|---:|---:|
| 1 | 5 | 5 |
| 2 | 50 | 100 |
| 4 | 945 | 3,780 |
| **Total** | **1,000** | **3,885** |

All 3,885 states occur exactly once in the enumerated partition.

## 6. Orbitwise scaling theorem

Under the CRT conjugacy, the second coordinate is invariant. For each base
cycle `O` and each `r in Z_5`, the states `phi^-1(x,r)` for `x in O` form a
scaled cycle. Projection returns `O`, the `Z_5` coordinate is constant, and
the period is unchanged. Distinct residues give disjoint cycles.

The program did not infer this property from aggregate counts. It indexed every
scaled orbit by its canonical `Z_777` projection and constant `Z_5` residue,
then checked every base orbit individually:

| Check | Result |
|---|---:|
| Base orbits tested | 200 |
| Expected lifts | 1,000 |
| Verified unique lifts | 1,000 |
| Constant-coordinate failures | 0 |
| Period/projection/residue failures | 0 |
| Unaccounted scaled orbits | 0 |

Both `AGGREGATE_COUNT_SCALING` and the stronger
`ORBITWISE_CRT_FIBER_SCALING` pass.

Exact count identities are:

- period 1: `5 = 5 * 1`;
- period 2: `50 = 5 * 10`;
- period 4: `945 = 5 * 189`;
- total: `1000 = 5 * 200`.

## 7. Representative verification data

All scaled period-1 orbits / fixed points (Gold Sparkles / Gold Fixpoints):

`{0, 777, 1554, 2331, 3108}`.

First five canonical scaled period-2 orbits (Janus Mirrors / Gold Chords):

1. `(37, 1517)`
2. `(74, 3034)`
3. `(111, 666)`
4. `(148, 2183)`
5. `(185, 3700)`

First three canonical scaled period-4 orbits (Cyclic Fields / Amber Lattices):

1. `(1, 1301, 2626, 1511)`
2. `(2, 2602, 1367, 3022)`
3. `(3, 18, 108, 648)`

## 8. Independent analytic checks

### Permutation status and orders

`gcd(524,777)=1` and `gcd(1301,3885)=1`, so both maps are permutations.

Successive modular powers were derived rather than assumed:

| System | `a^1` | `a^2` | `a^3` | `a^4` modulo `n` | Order |
|---|---:|---:|---:|---:|---:|
| `(524,777)` | 524 | 295 | 734 | 1 | 4 |
| `(1301,3885)` | 1301 | 2626 | 1511 | 1 | 4 |

Thus exact state periods must divide four. Enumeration observed exactly
periods 1, 2, and 4.

### Fixed-point equations

For `cx = 0 mod n`, the number of solutions is `gcd(c,n)`.

- Base: `gcd(524-1,777)=gcd(523,777)=1`, giving `{0}`.
- Scaled: `gcd(1301-1,3885)=gcd(1300,3885)=5`, giving the five multiples
  of `3885/5=777`: `{0,777,1554,2331,3108}`.

The analytic sets equal the enumerated fixed-point sets.

### Period-two check

`T_a^2(x)=x` is `(a^2-1)x=0 mod n`.

- Base: `gcd(524^2-1,777)=gcd(274575,777)=21`. Removing the one fixed
  point leaves 20 exact period-2 points, hence 10 cycles.
- Scaled: `gcd(1301^2-1,3885)=gcd(1692600,3885)=105`. Removing the five
  fixed points leaves 100 exact period-2 points, hence 50 cycles.

The analytic point sets equal the enumerated period-two point sets.

### Period-four remainder

Because the operator order is four, all points not fixed by `T^2` have exact
period four. The remainders are `777-21=756` and `3885-105=3780`, producing
`756/4=189` and `3780/4=945` cycles. Enumeration agrees exactly.

## 9. Reproducibility

- Python: CPython 3.9.6
- Script: `BOARD_XXIII_Z3885_VERIFICATION/verify_board_xxiii_z3885.py`
- Script SHA-256: `f7a461fb56ca304e496458246dbd22394479ffcb70d500dae7a19e7e0f0242d0`
- Results SHA-256: `36163109ff338665b893aacb6870e5d72f4940c66adfb7ed7a72dc098f1ec766`
- Orbit summary SHA-256: `b5ad311f9c7a6421c76080fc9f25fe83c4fa2bfe8b98d0cce30c78989d02d62f`

Command, from the Science Lab repository root:

```text
python3 BOARD_XXIII_Z3885_VERIFICATION/verify_board_xxiii_z3885.py \
  --source task_spec=/absolute/path/to/pasted-text.txt \
  --source lab_closure=LAB_SESSION_CLOSURE_2026-08.md \
  --source lab_master_status=SCIENCE_LAB_MASTER_STATUS.md \
  --source lab_portfolio=SCIENCE_LAB_PORTFOLIO.json
```

Two consecutive runs with identical inputs produced byte-identical
`verification_results.json` and `orbit_summary.csv`. A standard-library
compile check also passed. Outputs use sorted JSON keys, fixed indentation,
canonical cycle order, and fixed CSV line endings.

The source/provenance map records hashes of all supplied controlling/context
inputs. `HASH_MANIFEST.json` records final package hashes and a package digest.

## 10. VERDICT

**PASS — EXACT_5X_CRT_ORBIT_SCALING_PROVEN**

Every required algebraic invariant, exhaustive partition check, all-state CRT
relation, analytic cross-check, historical expectation test, and individual
five-lift test passed. There are no unaccounted scaled orbits.

This verdict applies only to the task-defined finite modular systems. The
historical Board source remains unlocated, and no IEEE or physical scaling
claim follows.
