# NEXAH-ORI-01 — Method Freeze

Date: 2026-09-26  
State: frozen before execution  
Test class: known-error positive control plus strong-baseline comparison

## Question

Can the minimum NEXAH orientation contract prevent a false closure caused by loss of a declared context variable, and does it detect anything that a strong conventional stratified analysis does not?

## Source and scope

The fixture is the six-department `UCBAdmissions` table for the 1973 Berkeley graduate-admissions example. It contains 4,526 applications classified by admission outcome, recorded gender and department. The case is a didactic positive control, not a new analysis of Berkeley and not a causal audit of admissions.

Primary authority: P. J. Bickel, E. A. Hammel and J. W. O'Connell, “Sex Bias in Graduate Admissions: Data from Berkeley,” *Science* 187 (1975), 398–404, DOI `10.1126/science.187.4175.398`.

Machine-readable table authority: R `datasets::UCBAdmissions`, documented as the six largest departments and 4,526 observations.

## Frozen claims

- `C0_DESCRIPTIVE`: In the aggregate record, the admission rate recorded for women is lower than the rate recorded for men.
- `C1_FALSE_CLOSURE`: The aggregate record alone establishes a department-level admissions bias against women.
- `C2_CONTEXTUAL`: Department composition changes the comparison materially; a context-preserving record is required before interpreting the aggregate difference.

`C0` is a permitted descriptive claim. `C1` must be blocked because the selected record omits the decision-unit context. `C2` is the target orientation result. No causal conclusion about discrimination is permitted from this fixture alone.

## Equal-information comparison

Both arms receive the same twelve source rows.

### Strong conventional baseline

1. Calculate aggregate admission rates by recorded gender.
2. Calculate rates separately in each department.
3. Calculate directly standardized rates using the pooled department distribution as common weights.
4. Block `C1` if the aggregate contrast materially changes after stratification or standardization.

### NEXAH minimum contract

1. Declare `Omega` (the source table), `X` (department), `Q` (the comparison question) and `sigma` (aggregation over department).
2. Preserve the aggregate and department records as distinct cuts.
3. Classify retained, lost, introduced and unresolved content.
4. Compare the records without forcing identity or synthesis.
5. State the allowed claim, blocked claim and residual.

## Gates

- `G1_SOURCE_TOTALS`: totals equal 4,526 applications, 2,691 male and 1,835 female.
- `G2_AGGREGATE_RECORD`: aggregate rates reproduce 1,198/2,691 and 557/1,835.
- `G3_CONTEXT_EFFECT`: direct standardization changes the sign of the female-minus-male contrast.
- `G4_BASELINE_BLOCKS_C1`: the strong baseline blocks the false closure.
- `G5_NEXAH_BLOCKS_C1`: the NEXAH ledger blocks the false closure and names the lost context.
- `G6_INCREMENTAL_DETECTION`: NEXAH detects a critical error missed by the strong baseline.

## Outcome rule

- Method functioning: `G1`–`G5` pass.
- Incremental detection utility: only if `G6` passes.
- If both methods block `C1`, report a tie and no demonstrated incremental error-detection utility.
- The explicit source/selection/claim ledger may remain a representational difference, but it is not a validated usefulness gain without a separate reader or workflow study.
