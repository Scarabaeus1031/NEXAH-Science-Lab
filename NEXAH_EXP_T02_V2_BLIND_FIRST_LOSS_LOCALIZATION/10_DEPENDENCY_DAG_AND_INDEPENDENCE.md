# Dependency DAG and Independence

```text
public representations ─┬─> B0..B6 independent operators ─> decisions
                        ├─> N0/N1 (baseline decision composition)
public correspondence ──┼─> N2 ─> aligned whole-feature decisions
                        ├─> N3 ─> generic collision ledger
public task query ───────┴─> N4 ─> task projection/collision ledger

sealed truth ───────────────────────────────> scorer only
diagnostic outputs (hashed) ────────────────> scorer only
```

| Comparison | Dependency class | Can support bounded performance H1? | Can support independent-information claim? |
|---|---|---:|---:|
| N4 vs B0–B6 | `SAME_INPUT_DIFFERENT_OPERATOR` | yes, under aggregate criteria | no |
| N4 vs N2/N3 | same public input, additional task projection | yes only if H1-A/B and F5 false | no |
| N0/N1 from B outputs | `DETERMINISTIC_REEXPRESSION` | no | no |
| changed tolerance only | `THRESHOLD_ONLY_DIFFERENCE` | never | never |

The scorer tests empirical baseline-output nonreconstructibility using identical
complete comparator decision vectors with different truths and correct N4
predictions. This proves only nonreconstructibility from the registered decision
outputs on the benchmark—not from their raw inputs or all possible algorithms.

## Self-review correction

The dependency DAG exposes a missing fair edge:

```text
public representations + public correspondence + public task query
  -> conventional exact sequential predicate B7
  -> the same prediction as N4
```

Therefore N4 is deterministically reconstructible from the complete *fair* input
set by a standard direct estimator. Any claimed nonreconstructibility from B0–B6
would be caused by an artificially incomplete comparator registry.
