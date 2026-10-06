# Solar Clockwork Application Bridge

Date: `2026-10-06`

Status: `ORIENTATION_AND_TEST_CANDIDATE / NOT_PHYSICAL_CLAIM / NOT_CORE_PROMOTION`

## Decision

`Q° Port — The Conic Gate` and `Saturn–Titan — QRT Record` belong to one
documented SolarSystem Clockwork application family and to the cross-media
Solar-System program route `SOL-10`. They are not two new NEXAH Core modules.

Their place in the Navigator is an **application layer** between method and
domain:

```text
CORE METHOD GRAMMAR
  cut · boundary · gate · trace · return · residual
        ↓ typed application, with explicit assumptions
SOL-10 APPLICATION FAMILY
  Q° Port / Conic Gate · Saturn–Titan / QRT Record · Lorenz gate test
        ↓ only after data, formulas, controls and reproduction
DOMAIN EVIDENCE OR PHYSICAL CLAIM
```

The first arrow is currently supported as documentation and implementation.
The second arrow is not generally established.

## Artifact roles

| Artifact | Navigation role | What it contributes | Claim ceiling |
|---|---|---|---|
| `q-port-conic-gate-standalone.html` | application benchmark | expresses elliptic return, parabolic threshold and hyperbolic pass as a typed gate interface | standard conic/energy classification; displayed astronomical values require source, epoch, frame and uncertainty verification |
| `saturn-titan-qrt-record.html` | application demonstrator | maps carrier, selectable cut, visible/withheld mask, trace and return into one readable sequence | orientation analogy only; no measured Saturn–Titan transfer function |
| `lorenz_gate_test.py` plus results | bounded numerical test | distinguishes a persistent section trace from a step-size-induced corridor | supports the declared local result; explicitly does not support a persistent cone object |

## Method connections

- `MOD:TRANSVERSUM_TWO_CUT`: bounded views, declared cut and return comparison.
- `MOD:ROSETTA_GEODESIC`: shared QRT/record vocabulary; source identity and a
  universal QRT operator are not inferred.
- `MOD:OPERATOR_DEMONSTRATOR`: carrier, cut, gate and return must be typed
  before views are compared.
- `CF:F1`: observation and record.
- `CF:F2`: boundary and admissibility.
- `CF:F3`: transition and operator.
- `CF:F4`: phase and sampling dependence.
- `CF:F7`: validation, provenance and claim control.

## Relation to “One Pattern, Many Maps”

The Solar application family is relevant to thesis route `TM-13`, but its
present status is:

`ORIENTATION_AND_TEST_CANDIDATE_NOT_CONFIRMATION`

It supports the research programme in three bounded senses:

1. the same typed questions can be asked in another domain;
2. the interface makes carrier, cut, gate, trace and return visible;
3. the Lorenz control shows that an apparent object may disappear while a
   declared relation survives.

It does **not** yet show that one physical mechanism governs orbital systems,
Lorenz dynamics and other NEXAH domains. Under `TM-13`, recurrence of shapes,
labels or workflow is motivation. Evidence for an invariant requires two
explicit encodings and a declared preservation map or criterion.

## Navigator treatment

The Master Navigator should display these pages under:

`Applications → Solar System → SOL-10 · Record / Cut / Gate / Return`

Each card should expose:

- application role and evidence state;
- method-module connections;
- source/epoch warning for astronomical values;
- thesis route `TM-13` with the label `candidate support`, not `confirmed`;
- a clear separation between orientation, bounded test and physical claim.

The wider Solar-System register remains a cross-media program with nineteen
working branches. Admission continues per mechanism and evidence class, never
by promoting the Solar family as one global claim.

## Controlling records

- [`Solar System Clockwork custody`](../CASE_STUDIES/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_2026-09-14/00_README.md)
- [`Scientific relevance assessment`](../CASE_STUDIES/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_2026-09-14/REVIEW_BINDING/05_SCIENTIFIC_RELEVANCE_ASSESSMENT.md)
- [`Solar System family map`](../REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/SOLAR_SYSTEM_FAMILY_MAP.md)
- [`Solar media source register`](../REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/SOLAR_MEDIA_SOURCE_REGISTER.csv)
- [`NEXAH thesis evidence matrix`](../../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/14_NEXAH_THESIS_EVIDENCE_MATRIX.md)
