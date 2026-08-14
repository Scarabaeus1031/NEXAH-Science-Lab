# A4 Prose ↔ Machine Isomorphism Ledger

| Prose rule | Machine path | Deterministic test |
|---|---|---|
| external authority and hashes | `authority.external_files` | validator external-hash loop |
| N4 LOO source choice | `binning.N4_support_source`, `recipient_distance` | canonical/mutation tests |
| RNG payload/hash/PCG64/draws | `rng.*` | four known answers; RNG mutations |
| canonical/global ordering | `ordering.*` | registry and order mutations |
| 500 seed-cluster bootstrap | `bootstrap.*` | validator canonical checks |
| phase, +π, edges, clockwise | `binning.phase`, `N3_merge` | phase/wrap fixtures and mutations |
| quantile/repeated boundary | `binning.quantiles` | duplicate/equality fixtures |
| N4 deterministic merge | `binning.N4_merge` | higher/lower/invalid fixtures |
| fixed null populations/failure | `shared_null.*` | canonical and mutation tests |
| N1 forward mapping/refit/outcome | `nulls.N1` | non-self-inverse fixture/mutation |
| N2/N3/N4 construction | `nulls.N2`–`N4` | schema checks and mutations |
| Monte Carlo and nearest rank | `monte_carlo` | k=4/5 and rank-195 fixture |
| accepted N5 complete contract | `N5.*` | first-12 construction and mutations |
| exact seed dominance | `seed_dominance.*` | structural/mutation tests |
| per-seed direction | `per_seed_direction.*` | validator fields |
| P1–P5 | `P.P1`–`P.P5` | structural and omission mutations |
| sensitivity values/order/effects | `ordering.sensitivity_axes`, `P.P5` | exact registry check |
| all validity gates | `validity.*` | 25-gate check and omission mutation |
| Rössler precedence | `classification.*` | exhaustive truth table |
| Lorenz-v2 ceiling | `cross_system.*` | ceiling truth-table test/mutation |
| nonexecution | `nonexecution.*` | validator false-only check |

There is no operative prose-only or machine-only rule. Prose summaries defer to exact machine fields; machine enums are explained in the corresponding named prose artifact.

