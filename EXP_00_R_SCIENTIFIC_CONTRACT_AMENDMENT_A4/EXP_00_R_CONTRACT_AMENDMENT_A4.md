# EXP-00-R Contract Amendment A4

## Authority and scope

A4 is an additive, outcome-blind closure contract. It responds to A3-R16 through A3-R20 and the consequential failed review categories. Exact upstream files and SHA-256 values are machine-bound under `authority.external_files`.

No scientific scope changes. N5 is copied structurally without redesign. All stochastic, boundary, null, proposition, validity, and classification rules are machine encoded.

## Prospective choices

1. **NEW PROSPECTIVE SCIENTIFIC CHOICE — N4 cutpoint covariate.** The complete original training decision-state table contributes its leave-one-out nearest-neighbor distance in the single frozen training-standardized state space. The diagonal/self match is excluded. Cutpoints use that vector. Each OOF or held-out recipient is assigned using its already frozen original nearest-training-distance covariate; no null refit or null rank changes it.
2. **NEW PROSPECTIVE SCIENTIFIC CHOICE — classification precedence.** After validity, `REPLICATED` has first scientific priority. Otherwise a valid experiment is `PARTIALLY REPLICATED` iff at least one carrier has both positive primary coefficient and positive primary held-out log-loss gain and neither carrier is statistically resolved negative. All other valid states are `NOT REPLICATED`. Required-null failure therefore cannot overlap labels: it prevents `REPLICATED` but is partial only when the positive-core condition holds.

## Closure rule

The prose files explain the contract; the JSON-compatible YAML file controls implementation. Every operative prose rule has a machine path and test. Missing, conflicting, or nonfinite mandatory objects fail closed. No completed outcome can be classified until every validity gate is true and P1–P5 are computed.

