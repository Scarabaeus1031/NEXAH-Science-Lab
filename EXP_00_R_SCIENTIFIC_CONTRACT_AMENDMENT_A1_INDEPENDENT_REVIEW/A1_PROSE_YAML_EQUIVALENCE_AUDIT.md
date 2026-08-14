# A1 Prose ↔ YAML Equivalence Audit

## Verdict

**PROSE ↔ YAML EQUIVALENCE: FAIL.**

## Rule comparison

| Rule | Prose | YAML | Result |
|---|---|---|---|
| N5 tiers/failure states | SYNTH implementation failure; RUN invalid experiment | same | MATCH |
| Matrix registry | determinant +1, lexicographic, first 12, once/tier | same | MATCH |
| State/B/target transforms | exact formulas and no target reselection | same | MATCH |
| Refitting/inverse registration/support | mandatory | present at shared N5 level | MATCH |
| Registered N5 population | original jointly supported rows incl. zero actions | same | MATCH |
| Kendall threshold/undefined handling | ≥0.99; 1/0 convention | same | MATCH |
| Synthetic representation hyperparameters | frozen T `k=25`, F `k=100`, ridge `1e-6`, dt/horizon; support 0.99 | YAML omits estimator hyperparameters and support quantile | **MISMATCH/OMISSION** |
| Per-seed losses/gain/weights | signed row-weighted exact decomposition | same | MATCH |
| Seed tie break/top count | gain descending, seed ID ascending, top 3 | same | MATCH |
| Dominance equality/numeric rule | equality passes; float64 direct, no tolerance | equality/operator present; float64/no-tolerance absent | **MISMATCH/OMISSION** |
| Fewer than three contributing seeds | invalid | absent | **MISMATCH/OMISSION** |
| N1–N4 names/count/statistics | explicit | same names/count/statistics | MATCH |
| Monte Carlo formula/ties/alpha | `(1+k)/201`, adverse ties, ≤0.025, k≤4 | same | MATCH |
| P1/P2/P3/N5 mapping | explicit | same | MATCH |
| Null evaluation population | prose says ambiguous “applicable fixed primary agreement population” | absent | **INCOMPLETE IN BOTH** |
| Null outcome/support transformation | absent | absent | **INCOMPLETE IN BOTH** |
| Family randomization units/dependencies | inherited by prose reference to V1 | YAML lists names only | machine artifact not self-sufficient |

The machine-readable artifact cannot be implemented without consulting prose and then making additional scientific choices. It therefore fails A1's own completeness requirement.
