# A2 N1–N4 Null-World Audit

## Verdict

**N1–N4 NULL WORLDS: FAIL.**

A2 resolves the fixed population, support, carrier, outcome, invalidity, and proposition-consumer arrows. It still does not uniquely determine the random transformations, and N3 contradicts frozen V1.

## Shared world

- Rows: canonical original records and stored all-action rollout outcomes.
- Train population: original jointly supported OOF validation row IDs, zero actions included.
- Test population: original jointly supported external-test row IDs, zero actions included.
- Support: original membership is binding; no null intersection, deletion, imputation, or transformed-support selection.
- Failure: any undefined required donor/score/rank/covariate/outcome/model/probability/statistic invalidates the repetition; any invalid repetition invalidates the experiment; no retry or replacement.
- Statistics: test mean coherence, test top-action agreement, and per-carrier standardized coefficient and held-out log-loss improvement.
- P consumers: agreement enters P1; coefficient nulls are P2 diagnostics only; log-loss improvement enters carrier-specific P3.

## Family reconstruction

### N1 — action-label permutation/refit

| Question | A2 answer |
|---|---|
| Randomized | one uniform five-action bijection per representation/training seed/repetition, identity allowed |
| Frozen | raw paths/states, target, actions, support model/flags, row IDs, OOF folds, state/target/phase/support covariates, all-action outcomes |
| Refit | T and F in every OOF fold and on full training |
| Recomputed | scores/ranks/margins, F flow/expansion, coherence/agreement, representation covariates, null carriers/outcomes, null baseline and augmented models |
| Carrier | null T top action or null F top action with frozen tie rule |
| Outcome | corresponding existing all-action terminal; compare with stored zero-action terminal; recompute Delta J/success |
| Simulation | prohibited |
| Undefined | invalid repetition, then invalid experiment |
| P mapping | P1, P2 diagnostic, both matching carrier P3 distributions |

Remaining ambiguity: permutation direction (`π` versus `π^-1`), action-label ordering, namespace derivation, and stream consumption are not frozen.

### N2 — within-seed FIELD-rank permutation

| Question | A2 answer |
|---|---|
| Randomized | complete original F weak-rank vectors without replacement within each OOF validation seed and external test seed; fixed points allowed |
| Frozen | scores/margins/baseline covariates/support/row IDs/T ranks/carrier actions/outcomes/labels and primary baseline |
| Recomputed | coherence, top-action agreement, augmented model/predictions |
| Carrier/outcome | observed carrier and observed recipient outcome remain fixed |
| Simulation | prohibited |
| Undefined | invalid repetition, then invalid experiment |
| P mapping | P1; P2 diagnostic; both carrier P3 distributions |

Remaining ambiguity: canonical row ordering before a seeded permutation is absent, and the extended RNG construction is unspecified.

### N3 — state/representation mismatch

| Question | A2 answer |
|---|---|
| Strata | eight atan2 phase bins plus training-linear target-distance quintiles; training map frozen |
| Randomized | per recipient, uniform with-replacement F-rank donor from a different seed in the same mapped phase/quintile |
| Frozen/recomputed/carrier/outcome | N2 rules |
| No donor | invalid repetition, then invalid experiment |
| P mapping | P1; P2 diagnostic; both carrier P3 distributions |

Blockers: A2 reverses frozen clockwise merging; `atan2(+pi)` normalization is unspecified; equality at quantile/phase boundaries is unspecified; donor candidate ordering and exact RNG derivation are unspecified.

### N4 — support-matched permutation

| Question | A2 answer |
|---|---|
| Strata | split × carrier × target quintile × exact magnitude class × merged support decile |
| Subworlds | N4_T and N4_F share repetition IDs `0..199` |
| Merge | repeated ascending scan, higher current group first, lower only if no higher; minimum 10 |
| Randomized | F weak-rank vectors permuted without replacement in each stored merged stratum |
| Frozen/recomputed/carrier/outcome | N2 rules |
| P mapping | P1 must pass both subworlds; T P3 uses N4_T; F P3 uses N4_F |

Blockers: equality-at-cutpoint assignment is absent; “training metadata” does not identify the exact row universe for N4 cutpoint estimation; stored stratum labels and row ordering used by RNG are not canonicalized; extended RNG derivation is unspecified.

## Nineteen-question completeness result

Rows, populations, support, frozen/refit/recomputed objects, carrier outcomes, simulation prohibition, undefined handling, row immutability, statistics, and P consumers are answerable. The randomization unit and namespace are named but not executable to one unique realization. Therefore questions 6, 12, and 13—and N3/N4 exact stratum construction—still require implementer judgment.

## Fixed-population/support verdict

**FIXED POPULATION / SUPPORT CONTRACT: PASS.** A2 uniquely requires the original jointly supported OOF/test row IDs, original support membership, identical rows for both carriers, no null intersection, no transformed-row deletion, and no retry/replacement. The remaining null defects do not reopen R-02–R-04's population alternatives.

## Monte Carlo and P1–P3 audit

**MONTE CARLO / P1–P3 CONTRACT: PASS.**

- `p=(1+count(T_null>=T_observed))/201` with exactly 200 repetitions.
- Observed-greater direction; ties adverse; `alpha=0.025`.
- `k=3` gives `4/201`, pass; `k=4` gives `5/201`, pass; `k=5` gives `6/201`, fail. Thus the exact gate is `k<=4`.
- P1 requires both observed mean coherence and observed top-action agreement against N1, N2, N3, N4_T, and N4_F.
- P2 remains the frozen positive standardized coefficient with seed-clustered 95% interval above zero for both carriers. Coefficient-null distributions are mandatory diagnostics only.
- P3 requires both carriers, positive observed held-out log-loss improvement, nonworse Brier, N1/N2/N3 log-loss null comparisons, and matching N4 (`T→N4_T`, `F→N4_F`).
- N5 is validity-only and has no Monte Carlo/P1–P3 role.

No hidden extra P2 gate or missing P1/P3 conjunction was found. The accepted A1 descriptive nearest-rank percentile is omitted from A2 machine metadata, but that is a prose/machine preservation defect rather than a changed scientific pass/fail rule.
