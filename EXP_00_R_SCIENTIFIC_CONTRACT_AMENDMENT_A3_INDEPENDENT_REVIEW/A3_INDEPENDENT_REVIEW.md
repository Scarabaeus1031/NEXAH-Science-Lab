# Independent Adversarial Scientific-Contract Review of A3

**Review date:** 2026-08-08  
**Scope:** contract review only; no implementation, authorization, registered-data access, or registered execution.

## Decision

**REJECT A3.**

A3 correctly repairs clockwise N3 geometry, the N1 forward permutation, stochastic stream construction, most canonical ordering, N5 machine completeness, and nearest-rank null reporting. It does not satisfy the zero-discretion standard for the complete EXP-00-R contract.

## Blocking defects

| ID | Location | Defect | Consequence |
|---|---|---|---|
| A3-R16 | A3 `binning.quantiles` / N4; A2 N4 source prose | A3 identifies the complete training decision-state table as the N4 support-cutpoint population but never defines which nearest-training-distance value each training row contributes: self-inclusive full-support distance, leave-one-out distance used to fit support, or OOF-fold distance. | Self-inclusive distance is zero for every training row; leave-one-out and OOF distances are generally nonzero. N4 deciles, merges, permutations, null statistics, and P1/P3 may differ. |
| A3-R17 | V1 falsification criteria | Classification branches overlap without priority. A valid experiment with both carriers' coefficient/log-loss direction positive but required agreement/predictive null comparison failing satisfies `PARTIALLY REPLICATED` because criterion 6 fails and also `NOT REPLICATED` because observed agreement/predictive gain does not exceed required nulls. | Two teams can issue different Rössler labels from the same completed artifacts. |
| A3-R18 | `A3_MACHINE_READABLE_RULES.yaml` `preserved_contract` | P4, P5, exact sensitivity values/order, support/information-parity/distinctness gates, per-seed direction requirement, full Rössler classification, and classification precedence are absent or represented only by generic strings. Immutable V1 references do not include exact file/JSON paths for these rules. | The proposed controlling machine artifact cannot reconstruct P1–P5 and classification. |
| A3-R19 | A3 ordering contract | Sensitivity-axis/value order is not frozen, and canonical row order is not explicitly applied to every regression/standardization/reduction input. | The current review's ordering requirement is incomplete; floating reductions and artifact dependency order can differ. |
| A3-R20 | A3 validator | The validator seals A3's own JSON/prose digests but does not resolve and hash-check the external V1/A2 rules it claims to preserve. Digest equality cannot detect an operative rule omitted from the canonical object. | Validator PASS cannot establish semantic completeness or external-reference integrity. |

## Integrity/nonexecution

- V1 source/config/test composite independently equals `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05`.
- Pre-review snapshots were recorded for V1, V2, V3, A1/A2/A3, and both earlier reviews.
- A3 pre-review tree composite: `435d40aa5fdd906f558d1291baac126e62237297a8bddf2e960286d81fa5e33c`.
- A3 contains 13 Markdown/YAML contract artifacts and three standard-library-only validation files; no scientific implementation or seed-release mechanism exists.
- No registered seed registry, trajectory, fit, outcome, null result, sensitivity, bootstrap, or classification was accessed or produced.

## Governing answer

Two independent teams are not guaranteed to construct the same N4 strata or final Rössler classification. The governing question is answered **NO**.
