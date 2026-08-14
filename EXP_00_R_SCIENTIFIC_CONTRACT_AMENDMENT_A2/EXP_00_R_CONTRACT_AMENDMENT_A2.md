# EXP-00-R Authoritative Scientific Contract Amendment A2

## Authority

A2 prospectively repairs rejected A1 defects R-01–R-07. After independent acceptance, the authority order is frozen V1, accepted A1 content, then A2 corrections. A2 does not implement V3.

## R-01 resolution

The signed row-weighted dominance estimand is retained. Scientific equality at 50% is decided with exact rational arithmetic over the stored finite IEEE-754 binary64 per-row log-loss values. No epsilon or tolerance is permitted.

For each row, convert each stored binary64 loss to its exact reduced integer ratio. Sum exact loss differences by seed and divide by the exact integer total row count. Rank exact rational seed contributions. If exact aggregate `G<=0`, fail. Otherwise compare `2*D3 <= G` using arbitrary-precision integer cross multiplication. Equality passes.

Controlling details are in `A2_R01_NUMERICAL_BOUNDARY_CONTRACT.md` and anchor `[A2-R01-COMPARE]`.

## R-02–R-04 resolution

All nulls use the same immutable row-ID universe as observed inference: original jointly supported OOF rows for null-model training and original jointly supported external test rows for null evaluation, both including zero carrier actions. Null support never selects a new population.

- **N1** destroys training action semantics, refits both representations, recomputes scores/rankings/representation covariates and null carrier policies, and selects the null policy's outcome from the already frozen all-action rollout table. No new plant simulation occurs.
- **N2–N4** are alignment nulls. They replace only the LEARNED_FIELD weak-rank vector used to construct coherence/top-action agreement. Observed scores, margins, carrier actions, outcome labels, support, baseline covariates, and row IDs remain fixed.

N1 freezes original support flags. On the fixed original supported rows, its diagnostic scoring path computes scores without applying null-predicted path support as a new selection rule. Any nonfinite or incomplete score/rank invalidates the repetition and therefore the experiment; no row is dropped and no repetition is retried.

N2 permutes field rank vectors without replacement within seed. N3 uniformly samples a different-seed donor with replacement within frozen training-derived phase/target strata. N4 uses carrier-indexed support/difficulty strata; it produces T-indexed and F-indexed subdistributions within one N4 family. P1 must pass both N4 subdistributions, and each P3 carrier uses its matching N4 subdistribution.

Every family has exactly 200 registered repetition indices. Complete family definitions are in `A2_N1_N4_NULL_WORLD_CONTRACT.md`.

## R-05–R-07 resolution

`A2_MACHINE_READABLE_RULES.yaml` is JSON-compatible YAML and encodes every operative A2/A1 rule, including:

- N5 representation parameters and support quantile 0.99;
- exact seed numeric/summation/comparison/edge rules;
- every family-specific null arrow from dependencies through statistic and proposition mapping.

Immutable V1 items are referenced by config ID, composite hash, JSON path, and expected value. The contract-only validator checks required fields, exact enums, prose anchors, and adversarial mutations without importing scientific modules.

## Null/P1–P3 decision retained

The accepted A1 Monte Carlo rule remains:

`p=(1+count(T_null>=T_observed))/201`, passing iff `p<=0.025`, equivalently `k<=4`.

P1 remains agreement; P2 remains coefficient/clustered interval; P3 remains carrier-specific incremental log-loss/Brier plus matching N1–N4 log-loss null comparisons. N5 remains validity-only.

## Outcome-blind change characterization

The N1–N4 row/outcome/support rules are **NEW SCIENTIFIC CHOICES COMPLETING THE DOCUMENTED AMBIGUITY**. They were selected prospectively to preserve fixed populations, avoid support-conditioned null selection, preserve N2–N4 outcome rows as stated in V1, and allow N1 to test action semantics using outcomes already mandated by the shared all-action table.

No choice uses registered outcomes or optimizes likely passage.

## Locality

No frozen component outside A1's ambiguity boundary changes. No scientific scope expansion is required.
