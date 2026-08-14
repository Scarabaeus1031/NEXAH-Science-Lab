# EXP-ORION-L3-001 — Immutable Preregistration Lock

UTC lock timestamp: 2026-08-10T17:38:06Z

```text
EXPERIMENT ID: EXP-ORION-L3-001
SOURCE: Lorenz-63
PREREGISTRATION VERSION: 1.0
PREREGISTRATION SHA-256: 7fe94684ce294018423547a9c9fd25ee93b4111a3127eadbdb8aee3d0cf4230b
REPRESENTATION LEDGER SHA-256: 79f748e527e316ce72a96c0e78679487ef5a4aa3ec4535df56d7fa8eb54b2964
CANDIDATE REGISTRY SHA-256: 2266164bbb38fd994c048b8991a43ba96905f71483abdc03a844c262071d60d5
CLASS-FREE OBSERVER RULES SHA-256: 821e883015491fd250b06b9089d0495928afe164088642a03b7aead6dd49ac97
REVIEW: PASS
CRITICAL: 0
MAJOR: 0
MINOR: 2
CANDIDATES: 10
CROSS-LANGUAGE CANDIDATES: 3
EXPLICIT UNDEFINED TESTS: 3
DESTRUCTIVE CONTROLS: 7
EXECUTION AUTHORIZED: YES
RESULT KNOWN AT LOCK TIME: NO
```

The two MINOR limitations remain binding: (1) C02/C03/C08 partly test declared translation conformance rather than discovery; (2) kNN resolution and cosine criteria are frozen benchmark criteria, not mathematical Lorenz bounds.

## Frozen source and software

Lorenz-63 uses `sigma=10`, `rho=28`, `beta=8/3`, `s(0)=(1,1,1)`, classical fixed-step simultaneous RK4, binary64, `h=0.001`, duration 20, saved interval 0.01, post-transient window `[5,20]`, and the independent L2 half-step source gate on `[0,2]`. Software is CPython 3.9.6 standard library on macOS arm64, mantissa 53/radix 2. There is no randomness.

## Frozen representation stack

- R0: full state and ordered trajectory.
- R1: invertible scaling `(2x,0.5y,1.5z)` and approved pullback metric.
- R2: 1,501-vertex oriented sampled polyline with centered tangents.
- R3: z-only projection with strict single-scalar claimant view.
- R4: frozen directed transition and mutual-8NN recurrence graph.
- R5: 32NN Gaussian field estimator using centered sample velocities at 64 queries and no equations.
- R6: frozen graph incidence, two layouts, seven bins, two palettes, and O/C+/C− style fixtures.

Every map, extraction operator, domain, codomain, resolution, graph rule, field-estimation rule, source correspondence, loss boundary, undefined condition, schema, and translation law is frozen exactly by the reviewed preregistration and representation ledger.

## Frozen claims, controls, and boundaries

The 10 candidate definitions, expected classes, metrics, thresholds, three cross-language chains, three required UNDEFINED views, seven destructive controls, false-friend tests, and replay rule are frozen exactly by the reviewed preregistration and candidate registry.

Generator, representation generators, blind observer/classifier, sealed observation, and comparator remain separate. Observer receives the class-free rules only. R3, graph-only, field-only, and color-only claimants receive no source state, hidden coordinates, time, step, source ID, neighbors/history beyond their declared view, equations, or generator intermediates.

After lock there are no changes to representations, translation operators, graph construction, estimator, sampling, resolution, candidates, expected classes, thresholds, information boundaries, controls, undefined conditions, schemas, or interpretation. Any scientific change requires a new version.

```text
LOCKED: YES
EXECUTED AT LOCK TIME: NO
RESULT KNOWN AT LOCK TIME: NO
```

