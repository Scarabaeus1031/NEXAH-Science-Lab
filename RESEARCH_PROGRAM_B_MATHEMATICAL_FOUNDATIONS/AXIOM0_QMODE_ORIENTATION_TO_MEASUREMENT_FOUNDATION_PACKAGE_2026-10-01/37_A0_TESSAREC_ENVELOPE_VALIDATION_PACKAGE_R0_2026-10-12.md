# A0 Tessarec Envelope Validation Package — R0

Date: `2026-10-12`  
Status: `R0_DESIGN_PACKAGE / NOT ADMITTED / NOT RUNNABLE`  
Lab state: `STRUCTURE_FREEZE`  
Publication status: `NOT AUTHORIZED`  
Scientific result status: `NO RESULT / NO FINDING`  
Owning package: `AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01`  
Reused module identity: `MOD:TESSAREC`

## 1. Purpose

This package turns the conceptual separation in Paper F into an inspectable
pre-run validation design. It freezes the objects, controls, metrics and
failure vocabulary needed for a later owner-authorized test. It does not
activate a Study and does not execute a scientific run during Structure
Freeze.

```text
carrier G
  -> ordered state sequence X
  -> frame rule R
  -> declared window W
  -> aggregator A_W
  -> intrinsic envelope H_W
  -> observer map pi_theta
  -> observed envelope H_(W,theta)
  -> contact classifier C_(Q,theta)
```

## 2. Bounded question

For a frozen `Q4` traversal, can an implementation preserve the distinction
between intrinsic envelope and observer-dependent projection while retaining
enough addresses to replay the frame, view and residual record?

The optional `Q4 x P3` carrier is a secondary engineering fixture. It is not a
new hypercube and does not change the primary question.

## 3. Frozen design objects

| Object | R0 value | Freeze state |
|---|---|---|
| carrier | `Q4`, 16 vertices, 32 edges | established fixture |
| traversal | binary-reflected Gray cycle with closure | established fixture |
| frame | `F_k = [x+y/2-z/4+w/8, x/4-y+z/2-w/8]` for the addressed `{-1,+1}^4` vertex | frozen for R0 engineering verification |
| minimal window | `W3(k) = {F_(k-1),F_k,F_(k+1)}` with cyclic indexing | design candidate |
| primary aggregator | convex hull of the three `W3` frame points | frozen for R0 engineering verification |
| secondary aggregator | union/reachable-set outline | comparison only |
| observer angles | `0, +42, -42, +45, -45, +90, -90, 180` degrees | fixed candidate set |
| contact family | typed Q-line against observed-envelope boundary | classifier not yet frozen |
| format | portrait record surface with declared dimensions | representation condition |

The R0 observer map is

```text
pi_theta([x,y]) =
  [cos(theta)x - 0.5 sin(theta)y,
   0.5 sin(theta)x + cos(theta)y].
```

It is a declared view transform, not a physical camera model or a property of
the tesseract.

The current Atlas hull is schematic. It must not be relabeled as the frozen
convex-hull result until the later implementation actually derives it from
the frame samples.

## 4. Validation gates

| Gate | Input held fixed | Variable | Metric / assertion | Pass condition |
|---|---|---|---|---|
| `G1_CARRIER` | carrier and traversal | step | adjacency | all consecutive states differ in one bit; closure passes |
| `G2_FRAME` | state and conditions | replay | frame digest or numeric coordinates | identical under declared tolerance |
| `G3_INTRINSIC` | `X,R,W,A_W` | observer angle | intrinsic coordinate delta | exactly zero or below frozen tolerance |
| `G4_OBSERVED` | intrinsic envelope | observer angle | projected-coordinate delta | equals the declared projection map |
| `G5_CONTACT` | Q-line, envelope, tolerance | angle and step | contact class | one of the frozen result classes; no raster-only inference |
| `G6_SAMPLING` | sample count and metric | schedule | reconstruction/contact error | Fibonacci has no privilege unless it beats both controls |
| `G7_ABLATION` | state multiset | temporal order | envelope delta | order effect reported, including exact zero |
| `G8_RETURN` | generated record | replay request | address completeness | carrier, frame, view, format and residual remain resolvable |

## 5. Sampling arms

The later comparison must use matched sample counts:

1. `UNIFORM`
2. `SEEDED_RANDOM`
3. `FIBONACCI_INDEXED`

The seed, collision policy, cyclic indexing rule and sample count must be
written into the future Run Contract. The current instrument displays these
as planned arms only; it does not score them.

## 6. Euler role

Euler's complex exponential is permitted only as a coordinate-level phase
parameterization:

```text
z(theta) = exp(i theta).
```

It is not a metric, a positive control or evidence of resonance. Euler fluid
equations, Euler integration, Euler characteristic and Euler prime formulas
remain separate objects.

## 7. Result vocabulary

The future run must return exactly one primary disposition and may attach
secondary observations:

- `SUPPORTED_WITHIN_FROZEN_FIXTURE`
- `VALIDATED_NEGATIVE_RESULT`
- `UNINFORMATIVE_BENCHMARK`
- `INVALID_EXPERIMENT`
- `INFORMATION_LOST`
- `UNDEFINED_CONTRACT`
- `ABSTAIN_INSUFFICIENT_RESOLUTION`

No visual resemblance is a positive result class.

## 8. Stop conditions

Stop before interpretation if any of the following occurs:

- frame rule, window, aggregator, tolerance or projection is not frozen;
- the implementation changes `H_W` when only observer angle changes;
- a sampling arm receives a different sample count or metric;
- contact classification depends on CSS line width or raster resolution;
- a tracked protocol changes after result exposure;
- the Lab remains closed to execution or no Run Contract is owner-authorized.

## 9. R0 deliverables

- Paper F theory draft;
- machine-readable design specification at
  `A0_BOOK/assets/tessarec-envelope-validation-r0.json`;
- Atlas Validation Panel showing design state and non-result diagnostics;
- deterministic `G1`–`G4` engineering verifier at
  `A0_BOOK/assets/tessarec-envelope-g1-g4.mjs`;
- explicit hash-bound future Run Contract candidate;
- no result files.

## 10. Future Run Contract placeholder

```yaml
RECORD_ID: A0_TESSAREC_ENVELOPE_VALIDATION_RUN_001_CANDIDATE
PURPOSE: REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: TO_BE_FROZEN
ENTRYPOINT: A0_BOOK/assets/tessarec-envelope-g1-g4.mjs
WORKING_DIRECTORY: AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01
ENVIRONMENT_SPEC: local shell; Node.js standard library only
RUNTIME_VERSION: Node.js 24.x candidate; exact executable/version to be locked at authorization
DEPENDENCIES: Node.js standard library; no network; no third-party packages
INPUTS: frozen carrier, traversal, frame rule, window, aggregator and projection specification
DATA_ACCESS: repository-local candidate
LICENSE_AND_PRIVACY: no personal or human-subject data expected; repository boundary retained
COMMAND: NOT_AUTHORIZED_DURING_STRUCTURE_FREEZE
EXPECTED_OUTPUTS: result record, replay record, contact ledger and sampling comparison
EXPECTED_HASHES_OR_TOLERANCES: source/spec hashes in the attached lock; observed-map engineering tolerance 1e-15
RESOURCE_BOUNDS: under 5 seconds; under 128 MiB RAM candidate
NETWORK_REQUIRED: false candidate
FILESYSTEM_SIDE_EFFECTS: future outputs only inside an admitted case package
FAILURE_SEMANTICS: use Section 7 vocabulary and fail closed
SCIENTIFIC_CLAIM_BOUNDARY: finite declared fixtures only; no physical or universal law
RESULT_REPORT: TO_BE_CREATED_ONLY_AFTER_AUTHORIZED_RUN
ISSUE_ROUTE: Human Owner through Science Lab Research Director
OWNER: Human Owner
LAST_VERIFIED: NOT_RUN
```

## 11. Authority effect

```text
NEW STUDY: NO
NEW NAVIGATOR ENTITY: NO
NEW RELATION: NO
EXISTING ID REUSED: MOD:TESSAREC
ACTIVE RESEARCH: NO
SCIENTIFIC RUN: NO
RESULT OR FINDING: NO
PUBLICATION AUTHORIZED: NO
R0 DESIGN AND INSTRUMENT EFFECT: YES
```

## 12. Next permitted action

Review the hash-bound Run Contract candidate and decide whether it should be
held, revised or considered for later admission. Do not execute the scientific
sequence until the Science Lab is separately reopened and the run is
authorized.
