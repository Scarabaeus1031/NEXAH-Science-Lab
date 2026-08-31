# Rotation Operator Requirements

A replayable planar rotation must minimally bind:

`R(carrier, center, angle, orientation, input object) -> output object`.

| Requirement | S1 local SVG | S2 meridians | S3 phase equations | Outerborn candidate |
|---|---|---|---|---|
| Carrier/coordinate space | SVG viewport/group | polar convention stated | time/phase functions | unverified |
| Center | translated local origin `(700,495)` | implied origin, no action | not a geometric center | unverified |
| Angle | 120°, 240° | 0°,120°,240° | +120°, +240° | unverified |
| Orientation | SVG transform semantics | CCW from +X | sign present; convention incomplete | unverified |
| Object/state | nine tick-line group | meridian labels | waveform phase | unverified |
| Output | deterministic 27-tick rendered group | layout only | three-phase superposition | unverified |
| Replayable action | yes | no | equations replayable as phases, not as the same SVG action | no |

Thus a rotation operator is historically defined **locally in S1**, not as a corpus-wide common operator. No new operator or OLS primitive is needed: ordinary SVG/planar rotation suffices.

