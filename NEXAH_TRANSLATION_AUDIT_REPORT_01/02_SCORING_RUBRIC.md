# Scoring Rubric

Status: `FROZEN BEFORE REVIEW`

## Unit rule

Each required item receives:

- `2` — materially matches the frozen reference without stronger inference;
- `1` — partly correct but incomplete or imprecise;
- `0` — absent, contradicted or unsupported.

`UNDETERMINED` is correct where the packet supplies no evidence. It receives
full credit when the reference also marks the item absent or unknown.

## Categories

| Category | Units | Maximum | Required response |
|---|---:|---:|---|
| Identities | 3 | 6 | distinguish A1, A2 and A3; treat the model file as A3 dependency, not a fourth representation |
| Relations | 3 | 6 | distinguish A1↔A2 association, A1/model→A3 implementation and A2↔A3 sibling presentation |
| Preserved information | 3 | 6 | name information demonstrably retained across the bounded relations |
| Lost or unavailable information | 3 | 6 | name compression, interaction differences and absent derivation history |
| Evidence status | 3 | 6 | distinguish controlled report, associated visual and implementation |
| Authority status | 3 | 6 | retain the local Rödelheim boundary and refuse authority inflation |
| Unsupported inference control | 6 checks | 12 | refuse derivation by resemblance, physical identity, scientific validation, Experience transfer, ORION transfer and universal grammar |

Maximum: `48`.

A4, A5, Experience transfer and ORION transfer remain reference-level negative
findings. They are not required reviewer reconstruction items and do not affect
the bounded A1/A2/A3 score. If a reviewer volunteers either transfer claim, it
is recorded as an unsupported inference.

## Unsupported-inference penalty

In addition to the category score, record every unsupported positive claim.
Subtract `2` for each unique unsupported inference, to a minimum total of zero.
Uncertainty, explicit absence and refusal to infer are not penalized.

## Result bands

| Adjusted score | Reconstruction result |
|---:|---|
| 41–48 | `MATERIALLY COMPATIBLE` |
| 31–40 | `PARTIALLY COMPATIBLE` |
| 19–30 | `WEAK / DEPENDENT` |
| 0–18 | `NOT RECONSTRUCTED` |

These bands apply only after an independent Human response exists for the
admitted A1/A2/A3 packet. A missing reviewer or protocol breach produces `NOT
EXECUTED` or `INVALID`, not a numerical zero.

## Legend information gain

For every category compute:

`Pass B score − Pass A score`

Overall legend information gain is the adjusted Pass B total minus the adjusted
Pass A total. Also record which corrected answers are directly attributable to
the supplied legend. Do not infer causality from a score difference in one
reviewer; report it as observed within-reviewer change only.
