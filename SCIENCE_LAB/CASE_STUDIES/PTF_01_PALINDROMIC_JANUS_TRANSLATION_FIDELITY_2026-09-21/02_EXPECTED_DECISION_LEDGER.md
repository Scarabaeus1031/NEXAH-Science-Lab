# PTF-01 Expected Decision Ledger

Status: `FROZEN_BEFORE_IMPLEMENTATION`

These are theorem-derived fixture expectations, not observed results.

## Baseline counts

| Fixture | States | Fixed orbits | Two-orbits | Quotient orbits | View-only collision pairs |
|---|---:|---:|---:|---:|---:|
| `X_111, J_111` | 12321 | 111 | 6105 | 6216 | 6105 |
| `X_11, J_11` | 121 | 11 | 55 | 66 | 55 |
| `X_10, J_10` | 100 | 0 | 50 | 50 | 50 |
| `X_11, H_11` | 121 | 1 | 60 | 61 | 60 |

## Expected preservation and loss

| Relation | Under `J` | In quotient record | In each of the three views | With valid `+1` binder |
|---|---|---|---|---|
| orbit identity | retained | retained | retained | retained |
| fixed status / orbit size | retained | retained | retained through `k` | retained |
| induced quotient adjacency | retained | retained | retained through ledger | retained |
| raw grid geometry | reflected | not fully represented | not implied by drawing | recoverable only through bound source contract |
| quotient edge multiplicity | retained in multigraph ledger | retained if recorded | not visible from point placement | retained through ledger |
| absolute side | exchanged | lost | lost | restored |
| exact source state | changed by `J` | not identifiable on two-orbits | not identifiable on two-orbits | reconstructed exactly |

## Expected counterfactual signature

Legend: `D` detected, `N` not necessarily detected by that field, `I`
invalidates the contract.

| Counterfactual | orbit/fixed counts | adjacency/degree | multiplicity | side/return | involution |
|---|---:|---:|---:|---:|---:|
| CF-01 remove side | N | N | N | D | N |
| CF-02 even grid | D | D | N | D | N |
| CF-03 half-turn | D | D | N | D | N |
| CF-04 delete one edge | N | D | D | N | N |
| CF-05 collapse multiplicity | N | N | D | N | N |
| CF-06 break operator | I | I | I | I | D |

The table is deliberately nonuniform. A coarse stable field is not called a
failure merely because a more detailed field detects the intervention. The
purpose is to expose which certificate can and cannot see each change.

## Frozen interpretation

If the expected ledger is reproduced, PTF-01 is a valid bounded demonstrator
of collision, information loss and keyed return. If it is not reproduced, the
implementation or the specification fails. Neither outcome changes the
scientific status of the general Translation Fidelity line or establishes a
special universal effect of `12321`.
