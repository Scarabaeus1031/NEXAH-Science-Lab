# A3 N1–N5 Null-World Reconstruction

| Item | N1 | N2 | N3 | N4 | N5-SYNTH | N5-RUN |
|---|---|---|---|---|---|---|
| Purpose | destroy training action semantics | destroy statewise T/F alignment within seed | mismatch F state while preserving coarse location | test support/difficulty explanation | implementation coordinate-equivariance gate | registered-pipeline coordinate-validity gate |
| Fixed population | A2 fixed P_train/P_test | same | same | same | original jointly supported synthetic queries, ≥20 | fixed original jointly supported held-out rows incl. zero actions |
| Randomized/transformed | forward action labels separately by representation/seed | F weak-rank vectors within split/seed | F donor rank per recipient | F ranks within carrier-indexed merged strata | deterministic Q transform | deterministic Q transform |
| Nonrandom objects | states, target, original support/populations, all-action outcomes | scores/margins/T ranks/carrier outcomes/support | N2 objects | N2 objects | scalar actions and original objective | scalar actions and original objective/outcomes unused |
| Support membership | frozen original; null path support cannot select | frozen | frozen | frozen | refit transformed support; fixed comparison queries | refit transformed support; transformed abstention invalid |
| Carrier action/outcome | null top physical action; corresponding existing all-action outcome | observed recipient action/outcome | observed recipient action/outcome | observed recipient action/outcome | none; ranking diagnostic | none; ranking diagnostic |
| Representation refit | T/F OOF and full | none | none | none | both per Q | both per Q |
| Unit/strata | representation × training seed | split × seed | recipient; mapped phase × target quintile; different seed | split × carrier × target quintile × magnitude × merged support group | one run per explicit Q | one run per explicit Q |
| Merge | none | none | clockwise first occupied bin | higher support group first, lower only if none; minimum 10 | none | none |
| RNG namespace | config/family/rep/representation/seed | config/family/rep/split/seed | config/family/rep/split/row | config/family/rep/split/carrier/stratum | none | none |
| Canonical order | row/action/neighbor keys | rows | recipient/donor rows | carrier/stratum/rows | explicit Q/query/neighbor order | explicit Q/query/neighbor order |
| Repetitions | 200 | 200 | 200 | 200 common IDs for T/F subworlds | deterministic 12 once | deterministic 12 once |
| Invalid behavior | no retry; any invalid replicate invalidates experiment | same | no donor: invalid, no draw/retry | undefined subgroup/rank: invalid | implementation failure | invalid experiment |
| Outputs | agreement, coefficients, log-loss gains | same | same | same | minimum tau per tier | minimum tau per tier |
| Consumer | P1; P2 diagnostic; P3 | same | same | P1 both; matching carrier P3 | preauthorization integrity | validity only |

## Reconstruction verdict

N1, N2, N3, and both N5 tiers are uniquely reconstructive within their stated inputs. N4 is not: its support-cutpoint input values are not typed. All N1–N4 families require 200 complete values; invalid repetitions cannot be dropped, retried, or replaced. N5 remains deterministic and is not a 200-repetition null.
