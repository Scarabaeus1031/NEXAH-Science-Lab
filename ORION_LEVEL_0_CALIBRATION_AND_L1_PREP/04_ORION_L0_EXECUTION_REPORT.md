# ORION Level-0 Execution Report

Status: `PASS`

Calibration ID: `ORION-L0-Z365-V1`

Code version: `1.0.0`

## Execution environment

| Field | Recorded value |
| --- | --- |
| Python | CPython 3.12.13 |
| Dependencies | Python standard library only |
| Random seed | none |
| Deterministic | yes |
| Execution timestamp | `2026-08-10T16:39:22+00:00` |

## Registered hashes

| Object | SHA-256 |
| --- | --- |
| source `src/orion_l0.py` | `19513f33df50cc6ba52c093021550c8636e69c7cf25646162eac0c966b834c1c` |
| input fixture | `290d62edb6550977e930b10676357767afb934027f99fbef7232b9e7c70aaa1f` |
| claim fixture | `a6a520ede830f1bce40fdd5360742c131f83b8f29d2ef2b075ef9c23d6e5d93b` |
| deterministic result | `251a7f30a8da9628a2682f2b9d429dc11899a05b8e0ab912de4dea04af22af36` |

## Results

```text
TOTAL CLAIMS:                  27
CORRECT CLASSIFICATIONS:      27
INCORRECT CLASSIFICATIONS:     0
FALSE FIXTURES REJECTED:        6 / 6
LEVEL 0 PASS:                 YES
```

Observed transformation classifications:

| Classification | Count |
| --- | ---: |
| `INVARIANT` | 13 |
| `EQUIVARIANT` | 3 |
| `ROBUST` | 1 |
| `REPRESENTATION_DEPENDENT` | 3 |
| `FAILED` | 6 |
| `UNDEFINED` | 1 |

## False-fixture rejection evidence

| Fixture | Result | Recorded failure evidence |
| --- | --- | --- |
| global Janus identity | `FAILED` | `k=1`: `T_64=64`, `J=364` |
| integer antipode | `FAILED` | no nonzero solution of `2h=0 mod 365` |
| absolute-angle invariance | `FAILED` | `k=1`: approximately `0.9863° -> 63.1233°` |
| rendered-color invariance | `FAILED` | state 0: `violet -> red` between declared palettes |
| wrong orbit census | `FAILED` | exhaustive census differs |
| non-unit automorphism | `FAILED` | multiplier 5: only 73 unique images; `0` and `73` collide |

## Repeatability check

The runner was executed a second time into temporary output files without
changing inputs or source. Both deterministic result files had SHA-256:

```text
251a7f30a8da9628a2682f2b9d429dc11899a05b8e0ab912de4dea04af22af36
```

The run-record timestamp is intentionally excluded from the deterministic
result object and therefore does not contaminate the result hash.

## Failures

No registered Level-0 classification failed. `failure_messages` is empty.

This does not imply that ORION is validated beyond this fixture. The current
pass establishes only that the executable classifier correctly handles its
registered finite truths, negative fixtures, representation laws, bounded
perturbation, and undefined case.
