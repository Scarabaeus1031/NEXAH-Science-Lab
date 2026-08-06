# Rödelheim Observatory — Thread Loom Projection Test · Lab 0.4

## Status

`CONTROLLED SIDE-CAR · SYNTHETIC PROJECTION TEST`

Lab 0.4 does not alter Lab 0.2 or the frozen Lab 0.3 result.

## Purpose

Lab 0.4 tests one bounded NEXAH question:

> What distinctions remain visible, which collapse under projection, and which
> become unknown only because a representation mask withholds them?

Cosmology is not the subject of the test. Earlier astronomical and planetary
images remain an explanatory model for changing viewpoints. The implemented
object is a deterministic synthetic trace family.

## Formal object

Four source threads retain stable identities:

`S = {A, B, C, D}`

Each thread is a deterministic curve in a bounded synthetic state space:

`γ_s(t) = (x_s(t), y_s(t), z_s(t)),  t ∈ [0,1]`

The observer uses four fixed orthographic projections:

`Θ = {0°, 90°, 180°, 270°}`

For view angle `θ`:

`u = x cos θ + z sin θ`

`v = y`

`d = -x sin θ + z cos θ`

The displayed record is `(u,v)`. Depth `d` remains available for detecting when
distinct source points coincide only in the projection.

## Intentional control

Threads A and B have different `x` values but share their `y,z` path.

- At `0°` and `180°`, A and B remain visibly distinct.
- At `90°` and `270°`, A and B occupy the same projected path.
- Their source identities and three-dimensional separation remain unchanged.

This is an intentional positive control for projection collapse. It establishes
neither physical identity nor coupling.

## Transformation chain

`SYNTHETIC STATE`

`→ RETAINED HISTORY`

`→ FIXED OBSERVER PROJECTION`

`→ SPATIAL REPRESENTATION MASK`

`→ CLASSIFIED RECORD`

The mask is applied after projection. It is not an astronomical occultation,
physical shadow, force or source-space deletion.

## Record classes

- `GENERATED_UNMASKED`
  - generated sample outside the representation mask;
- `GENERATED_MASKED_RECOVERABLE`
  - generated sample inside the mask, available only because the complete
    generated trace has been declared;
- `UNKNOWN`
  - sample inside the mask when no complete trace is declared;
- `BOUNDARY`
  - sample on the numerical tolerance band of the mask edge.

The Full-Trace Gate has real semantic effect. When disabled, no line is rendered
inside the unknown interval.

## What the four views test

The four panels do not create four systems. They are coordinated views of the
same source records.

- `0°` — front reference;
- `90°` — edge projection with intentional A/B collapse;
- `180°` — mirror counterview of `0°`;
- `270°` — mirror counterview of `90°`.

The word “hinge” may remain an explanatory description for movement between
views. No hinge body, orbital mechanism or Outer-Hinge physics is implemented.

## Machine-checked invariants

The deterministic test suite checks:

1. deterministic source generation;
2. four stable source identities;
3. exactly four authorised fixed projections;
4. preservation of identity and sample index;
5. `0° ↔ 180°` mirror relation;
6. `90° ↔ 270°` mirror relation;
7. intentional A/B collapse at `90°`;
8. A/B distinction at `0°`;
9. no merging of source records after coincidence;
10. mask application after projection;
11. complete and exclusive classification coverage;
12. Full-Trace Gate recoverability;
13. true `UNKNOWN` state without a full trace;
14. non-rendering of unknown samples;
15. complement involution within one fixed universe;
16. source invariance under a moving mask;
17. depth-separated coincidence diagnostics;
18. visible scientific boundaries;
19. unique interface IDs and reduced-motion handling.

## Scientific and epistemic boundary

The interface states:

- `SYNTHETIC TRACE FAMILY · ORTHOGRAPHIC PROJECTION TEST`
- `SCHEMATIC · NOT MEASURED ASTRONOMY`
- `PROJECTED COINCIDENCE DOES NOT ESTABLISH PHYSICAL IDENTITY OR COUPLING`

Lab 0.4 does not establish:

- a cosmological model;
- planetary coupling;
- a new orbit;
- a physical Outer Hinge;
- a universal topology;
- a new algebra;
- a measured Rödelheim sky record.

## NEXAH relevance

The useful result is representational:

1. a source state and its displayed record are different objects;
2. one view can preserve a distinction that another view collapses;
3. projected coincidence must not erase provenance or identity;
4. a mask changes availability in the record, not the source;
5. a comparison axis coordinates views without creating the field.

This makes Lab 0.4 a controlled test of orientation through multiple
representations—not a cosmology experiment.

## Stop condition

Stop after confirming the four-view behavior and the epistemic gate. Do not add
planets, calibrated astronomy, Hopf geometry, quaternion assignments, JANUS,
ORION or OLS transfer inside this lab.

Any transfer to another NEXAH layer requires a separate decision and its own
evidence.
