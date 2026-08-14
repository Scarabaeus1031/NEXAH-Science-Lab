# A2 N1–N4 Null-World Contract

## Shared immutable dependencies and populations

Every repetition consumes only sealed upstream artifacts:

- V1/A2 configuration and seed registry;
- original training shared all-action rollout table and target;
- original OOF records from five seed-block folds;
- original full-training representation fits;
- original external-test shared all-action rollout table;
- original representation scores, weak ranks, support flags, baseline covariates, carrier actions, outcomes, and canonical row IDs;
- frozen N3 cutpoints/merge map and N4 strata/merge maps constructed before repetitions.

Define:

- `P_train`: original jointly supported OOF validation row IDs, including zero carrier actions;
- `P_test`: original jointly supported external-test row IDs, including zero carrier actions.

These row-ID sets are frozen before null inspection and are used by every N1–N4 repetition. Null-specific support, intersections, row deletion, imputation, and replacement are prohibited.

Mean coherence/top-action agreement use `P_test`. Null primary models fit on `P_train` and evaluate carrier metrics on `P_test`. Both carriers use identical row IDs.

All test physical outcomes are selected only from the already mandated shared five-action test rollout table. No null may call the plant/integrator to create a new outcome.

## Shared failure and statistic rules

Each family has repetition IDs `0..199`. A required donor, score, complete rank, covariate, outcome, class variation, regression fit, probability, coefficient, or log-loss value that is missing/nonfinite/undefined makes that repetition `INVALID_REPLICATE`. No retry, alternate donor rule, row deletion, or replacement is permitted. Any invalid replicate makes the family incomplete and the registered experiment `INVALID_EXPERIMENT` before P1–P3/classification.

Each complete repetition produces:

- test mean coherence;
- test top-action agreement;
- per carrier standardized coherence coefficient from the null OOF fit;
- per carrier external-test log-loss improvement from baseline to null augmented model.

The accepted A1 Monte Carlo comparison and P1/P2/P3 mapping remain controlling.

## N1 — action-label permutation/refit null

**Classification:** NEW SCIENTIFIC CHOICE COMPLETING AMBIGUITY where outcome/support arrows were previously unspecified.

### Randomization unit

For every repetition, representation (`TRAJECTORY`, `LEARNED_FIELD`), and registered training seed, draw independently one uniform bijection of the five action labels from all `5!` permutations, identity included, using the frozen family/config/repetition/representation/seed RNG namespace. Apply that one bijection to every training state/action record of that seed for that representation.

### Fixed objects

Raw training/test path state arrays; decision states; target/standardizer; scalar physical action set; original support models, thresholds, support flags and `P_train/P_test`; OOF fold assignment; state/target/phase/support baseline covariates; original all-action physical outcome tables.

### Refit/recompute

- TRAJECTORY associates each training path's terminal outcome with its permuted action label and refits in every OOF fold and on full training.
- LEARNED_FIELD associates each training path with its permuted action label, subtracts `B*u_permuted` when constructing derivative labels, and refits in every OOF fold and on full training.
- On every fixed row in `P_train/P_test`, compute both null score vectors and complete weak ranks. Original support membership remains binding; diagnostic null scoring does not apply null-predicted path support as a row-selection rule.
- Recompute null field flow norm/local expansion, both score/margin covariates, coherence, top-action agreement, and carrier action magnitude/sign.
- State, target-distance, phase, original nearest-training-distance and original support-fraction covariates remain fixed.
- Fit both the null baseline and null baseline-plus-coherence logistic models on `P_train` using these N1 covariates/labels, then evaluate both on `P_test`. The coefficient and log-loss improvement come from this paired N1 fit/evaluation; no observed primary model is substituted.

### Carrier action/outcome

Each null representation selects its own null top action with the frozen tie rule. T-carrier uses null TRAJECTORY action; F-carrier uses null LEARNED_FIELD action. For each fixed row, select that action's terminal outcome from the row's already stored all-action rollout table, compare it with the stored zero-action terminal outcome, and recompute `delta_J` and binary success. No simulation occurs.

### Population/support

Both carriers use exactly `P_train` for null-model fitting and `P_test` for null evaluation. If null scoring cannot return a finite complete ranking on any fixed row, the repetition is invalid; the row is not dropped.

## N2 — within-seed field-rank permutation

### Randomization unit

Independently within every OOF validation seed and external test seed, permute without replacement the complete original LEARNED_FIELD weak-rank vectors across the fixed rows of that seed. Use the frozen family/config/repetition/split/seed RNG namespace. Fixed points are allowed.

### Fixed objects

All original scores, margins, baseline covariates, support, row IDs, TRAJECTORY ranks, carrier actions, physical outcome labels, and probabilities' target labels.

### Recomputed objects

Only coherence and top-action agreement are recomputed from the recipient row's original TRAJECTORY rank and donor LEARNED_FIELD rank. For each carrier, refit only the augmented logistic model on `P_train` with null coherence and evaluate it on `P_test`; the corresponding baseline model/data remain the frozen primary baseline.

### Carrier/outcome/support

Observed carrier actions and outcome labels remain fixed even if the donor rank has a different top action. Support and populations remain `P_train/P_test`. This implements V1's instruction that outcome rows remain fixed and isolates statewise ranking alignment.

## N3 — state/representation mismatch

### Frozen strata construction

Using registered training decision-state metadata only and before null repetitions:

- phase is `atan2(y,x)` in eight equal bins on `[-pi,pi)` numbered counterclockwise `0..7`;
- target-distance quintile cutpoints are training empirical 20/40/60/80 percentiles using NumPy's `linear` quantile method, matching the frozen V1 executable primitive;
- within each target quintile, an empty phase bin maps to the first nonempty bin encountered by increasing bin index modulo 8; nonempty bins map to themselves. Store this training-derived map and use unchanged for OOF/test rows.

### Randomization unit

For each recipient row independently, select uniformly with replacement one donor LEARNED_FIELD weak-rank vector from a different seed in the same mapped phase bin and target-distance quintile. Use the frozen family/config/repetition/split/recipient-row-ID RNG namespace. No donor means invalid replicate.

### Fixed/recomputed objects

The N2 fixed/recomputed, carrier, outcome, support, population, and model rules apply exactly. Only the donor-selection constraint differs.

## N4 — support-matched rank permutation

**Classification:** NEW SCIENTIFIC CHOICE COMPLETING AMBIGUITY for symmetric carrier indexing.

### Frozen bin cutpoints/classes

Training metadata fix nearest-training-distance decile cutpoints at probabilities 0.1 through 0.9 and target-distance quintile cutpoints at 0.2/0.4/0.6/0.8 using NumPy's `linear` quantile method, matching the frozen V1 executable primitive. Carrier action-magnitude classes are exact primary magnitudes `{0.0,0.25,0.5}` from each carrier's original action.

N4 contains two carrier-indexed subworlds, `N4_T` and `N4_F`, under each common repetition ID. `N4_T` strata use original T-carrier magnitude; `N4_F` use original F-carrier magnitude.

### Deterministic small-stratum merge

Construct merge labels separately for split (`P_train`,`P_test`), carrier index, target quintile, and magnitude class before repetitions. Within each such subgroup:

1. initialize one group per support decile `0..9` containing its rows;
2. scan original deciles ascending `0..9`;
3. if the current group containing that decile has fewer than 10 rows, merge it with the current group containing the smallest strictly higher original decile not already in the group;
4. if none exists, merge with the current group containing the greatest strictly lower original decile;
5. continue until the scan ends; repeat full ascending scans until every nonempty group has at least 10 rows;
6. if the entire subgroup has fewer than 10 rows or no merge can satisfy the rule, null construction is undefined and the experiment is invalid before repetitions.

Store merge labels; they never depend on repetition results.

### Randomization unit

Within each stored merged stratum, permute LEARNED_FIELD weak-rank vectors without replacement using family/config/repetition/split/carrier-index/stratum RNG namespace. Fixed points are allowed.

### Fixed/recomputed/carrier/outcome/support rules

The N2 rules apply exactly and separately to `N4_T` and `N4_F`. Carrier actions/outcomes remain observed and fixed. `N4_T` produces the null coefficient/log-loss distribution for T-carrier; `N4_F` produces it for F-carrier.

For P1, observed mean coherence and top-action agreement must pass separately against both `N4_T` and `N4_F` agreement distributions. Both are subdistributions of the one frozen N4 family, not additional null families or repetitions.

## Monte Carlo mapping

For every required statistic/distribution, `k=count(T_null>=T_observed)` and `p=(1+k)/201`. Pass iff `k<=4`. Ties are adverse. P1 requires all agreement comparisons. P2 coefficient-null p-values are diagnostic only. P3 requires each carrier's log-loss improvement to pass N1, N2, N3, and its matching N4 subworld.
