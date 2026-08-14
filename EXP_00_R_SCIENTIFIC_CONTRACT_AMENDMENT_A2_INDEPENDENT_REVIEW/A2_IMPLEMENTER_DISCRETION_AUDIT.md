# A2 Implementer-Discretion Audit

## Verdict

**ZERO IMPLEMENTER SCIENTIFIC DISCRETION: FAIL.**

## Two-team challenge

The following paired implementations can each cite A2 yet produce different registered null values.

| Choice | Team A | Team B | Scientific effect |
|---|---|---|---|
| N3 merge direction | literal A2 increasing-index/CCW | frozen V1 clockwise | different donor strata |
| RNG tuple encoding | UTF-8 pipe-joined fields, SHA-256 first 64 bits, PCG64 | length-prefixed fields, full SeedSequence, default generator | different draws for all null families |
| N1 bijection direction | original label `a` becomes `π(a)` | label `a` receives original record `π(a)` (`π^-1` relabeling) | different refits/actions/outcomes |
| Quantile equality | right-closed lower bin | left-closed upper bin | different N3/N4 strata |
| `atan2` at positive π | normalize `+π` to `-π` | clip into final bin | different phase bin |
| Candidate ordering | canonical row-ID sort before sampling | stored table order | same random integer selects different donor |
| N4 training metadata | all registered training decision states | frozen OOF primary rows | different cutpoints/merge labels |
| N5 transform subset from machine | first 12 | another 12 then lexicographically order | different validity result |

These are not performance-only implementation details. With exactly 200 repetitions and a hard `k<=4` boundary, changing realized null draws can change P1/P3 and final classification.

## Fixed-population challenge

A2 successfully blocks the old R-02–R-04 alternatives:

- null-specific support: prohibited;
- transformed/null intersections: prohibited;
- dropping unsupported null rows: prohibited;
- donor outcomes in N2–N4: prohibited;
- retaining observed outcomes in N1: prohibited; N1 selects from the existing all-action table;
- retry/replacement: prohibited.

Thus the remaining failure is not population/support discretion. It is transformation and deterministic-randomization discretion.

## Acceptance question

Could two independent implementers construct N5, seed dominance, and N1–N4 decision logic without another scientifically meaningful choice? **No.**
