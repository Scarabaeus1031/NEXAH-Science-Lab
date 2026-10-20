# ORION REF02 result

Date: `2026-10-01`

Decision: `REFERENCE_PASS / MATHEMATICS_ONLY`

## Outcome

All eight registered classifications matched:

- reciprocal roundtrip: `EQUIVARIANT` — 4/4 exact;
- vertical-line/circle relation: `INVARIANT` — 6/6 exact residual zero;
- reciprocal quadratic conjugacy: `EQUIVARIANT` — 4/4 exact;
- pointwise raw-coordinate identity claim: `FAILED` — 0/4 identical;
- reciprocal at zero: `UNDEFINED`;
- robustness arbitrarily near zero: `FAILED` — output separation `1,000,000`;
- raw coordinate views: `REPRESENTATION_DEPENDENT` — 4/4 different;
- declared perturbation away from zero: `ROBUST` — observed change
  `1.99999920000028e-07` below `1e-06`.

Unit/integrity tests passed `6/6`. Primary and replay are byte-identical with
SHA-256:

`08b76c6a29c114b5bc3e71dbcc5012e63fab226292c2dec54178a8fa9723df4c`

## Interpretation

The Q-Mirror is useful as an ORION reference because it shows three things at
once: structure can transport exactly while raw coordinates change; a valid
map can still have an undefined point; and conditioning depends on distance
from that point. The result validates the finite reference fixture only.

No zeta function or zero was evaluated. This is not evidence about Riemann,
prime distribution, physics, cosmology, navigation or production capability.
