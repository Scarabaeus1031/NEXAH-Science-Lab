# WP5 Machine Condition Result

Date: `2026-09-28`  
Case: `CASE-WP5-FAMILY-OFFICE-REFINANCING`  
Decision: `HOLD_AWAITING_INDEPENDENT_BASELINE_AND_BLINDED_ADJUDICATION`

## Outcome

The frozen NEXAH Compare machine condition is valid and replayable. It emitted
five non-invariant residuals for the five frozen seeded defects and retained
the shared refinanced-principal calculation as one invariant relation.

| Frozen defect | Severity | Machine reason | Gate |
|---|---|---|---|
| four-year debt timeline | critical | `FORMULA_MISMATCH` | abstain |
| new-rate scope | critical | `FORMULA_MISMATCH` | abstain |
| free-liquidity evidence | material | `EVIDENCE_MISSING` | abstain |
| cost-stress operation | material | `DOMAIN_INCOMPATIBLE` | abstain |
| reserve-asset decision boundary | material | `EVIDENCE_MISSING` | abstain |

Machine safety-floor observations:

- critical recall: `2/2`;
- total seeded defects: `5/5`;
- material false positives against the frozen key: `0`;
- unsupported truth or recommendation claims: `0`;
- abstentions retained: `5`;
- second run: byte-identical hashes for comparison, report, manifest and
  receipt;
- WP2 contract validation and all 14 WP3/WP4 runtime tests: valid.

## What this does and does not show

It shows that the current deterministic comparator can expose the exact kinds
of disagreement found in the earlier Family Office test: debt timeline, rate
scope, evidence gaps, incompatible operations and an inadmissible premature
recommendation. It also shows that the same structured packet returns the same
machine result twice.

It does not yet show incremental value against a professional reviewer. Route
A and Route B are not evaluable because no independent baseline has been run.
The output has also not been scored by a blinded qualified adjudicator.

## Integrity

- answer key hash before execution:
  `7028e8302ebca3f18fe48ed41d6578fbe14b0353352ec2f0b732062a606a18af`;
- comparison hash:
  `f1b04ad6b9b2ae517e725f85eb5f32598753eca5b6f7577b8576e01af80bb157`;
- package manifest hash:
  `f03048f24a3d301cb2a26670421e5be706564107d525df527c268635d7e51d35`.

The private source case was not admitted. The benchmark is a synthetic
normalized derivative and contains no identity or private document.

The earlier Perplexity, Duck.ai, DeepAI, NEXAH/Codex and CrossChecked results
are retained separately in `HISTORICAL_AI_RETURNS_LINEAGE.md`. They explain the
fixture's origin but are not retroactively treated as scored WP5 inputs because
their raw transcripts and version metadata were not frozen.
