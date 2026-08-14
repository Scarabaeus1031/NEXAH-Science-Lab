# Decision Rules

## Preconditions

Score H0/H1 only if all fixture, finite-value, candidate/seed correspondence,
serialization and ordering preconditions pass. Otherwise final status is
`PRECONDITION_FAILED_<CODE>` and hypotheses remain unevaluated.

## Baseline and ledger event tables

For each pair/certificate, compare observed equality with the frozen expectation.
A method correctly detects a loss event only if it identifies the affected pair,
  task distinction, certificate and first loss stage without post-hoc interpretation.

## Incremental value

`SUPPORTED_BOUNDED` requires at least one preregistered event for which:

1. the ledger is correct under the construction truth and correspondence audit;
2. all registered conventional baseline conclusions B0–B7 miss the event or place its
   first loss stage incorrectly;
3. the ledger has no additional false event on that pair; and
4. the result persists in both grid controls and both threshold controls.

If baselines identify every relevant event equally well or more simply,
`INCREMENTAL_DIAGNOSTIC_VALUE=NOT_SUPPORTED`. Mixed or sensitivity-dependent
evidence is `INCONCLUSIVE`. There is no significance test or effect-size threshold
for three designed pairs.

## R/D

Report exact numerator/denominator and rate for each certificate. No aggregate
scalar, ranking, Pareto novelty or universal inference is permitted.

## Claims

Permitted: software-check statements about these frozen fixtures and whether a
registered diagnostic was redundant, inconclusive or boundedly incremental.
Prohibited claims listed in `00_SCOPE_AND_BOUNDARIES.md` remain prohibited even
if H1 is supported.
