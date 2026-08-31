# 01 — ASY-01 Test Specification

## Frozen geometry

- `S0`: closed unit disk centered at `(0,0)`.
- `B`: one rectangular radial protrusion centered on angle `0°`, attached to
  the disk boundary, radial length `0.25`, tangential width `0.12`, long axis
  aligned with the outward radius.
- `S1=S0∪B`.
- Registered rotations: `{0°,90°,180°,270°}`.
- Orientation identifiable: the registered rotation class is uniquely
  recoverable from static geometry modulo the object's actual symmetry group.
- `S2`: add a second copy of B diametrically opposite the first.
- Static model: `S(t)=S(0)` for every t unless an explicit dynamic operator is
  applied.

No front, motion direction, force, number or glyph meaning is assigned.
