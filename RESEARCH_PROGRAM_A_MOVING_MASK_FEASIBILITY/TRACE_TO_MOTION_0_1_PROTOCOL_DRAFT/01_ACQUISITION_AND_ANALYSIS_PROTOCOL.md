# Acquisition and Analysis Protocol — Revision 2

Status: `DRAFT — HUMAN ACQUISITION PROHIBITED`

Protocol ID: `TTM-0.1-DRAFT-02`

Revision basis: adversarial protocol review. No Owner scientific decision is
accepted by this revision.

## 1. Governing distinction

> Form, direction, observation window and missing information must be
> experimentally separable before causal claims are permitted.

| Track | Question | Current state |
|---|---|---|
| A — Pipeline Conformance | Does the deterministic pipeline satisfy its contracts? | synthetic self-validation only |
| B — Direction Identifiability | Can direction be recovered from direction-free packets made from one trajectory and its exact reversal? | independent evaluator and decision rule missing |
| C — Mask-Schedule Comparison | How do two predeclared schedules differ in availability and reconstruction? | Human schedules and matching rules unapproved |

Track A cannot provide external scientific evidence. Tracks B and C cannot be
inferred from Track A.

## 2. Bounded objects

- source trajectory: sampled planar positions with monotonic time;
- exact reversal: the same positions and support in reverse temporal order;
- trace-only packet: a declared direction-free derived representation;
- observation schedule: mask geometry and time schedule frozen before Human
  trajectories are observed;
- reconstruction: a declared estimator using visible samples only;
- diagnostic path: analytic fixture exposing pipeline behavior;
- Human F/R samples: separately drawn trajectories, never exact reversals.

No external representation process is present. External representation
preservation is untested and outside Track A.

## 3. Diagnostic paths and coordinates

Candidate domain: `D=[0,200] x [0,200] mm`; origin lower-left; positive `x`
right; positive `y` up. These values remain an Owner decision.

| ID | Definition for `u in [0,1]` | Diagnostic role |
|---|---|---|
| P01 | `x=30+140u`, `y=100` | open zero-curvature baseline |
| P02 | `x=100+70 cos(pi(1-u))`, `y=100+70 sin(pi u)` | smooth open curvature |
| P03 | `x=30+140u`, `y=100+45 sin(2 pi u)` | geometric inflection |
| P04 | `x=30+140u`; piecewise `y=150-200u` / `-50+200u` | tangent discontinuity |
| P05 | `x=100+60 cos(2 pi u)`, `y=100+60 sin(2 pi u)` | simple closed curve |
| P06 | `x=100+65 sin(2 pi u)`, `y=100+45 sin(4 pi u)` | self-intersection topology |

Template parameter `u`, normalized acquisition time `tau` and arc length `s`
are distinct. No equality between them is assumed.

## 4. Acquisition proposal

The V1 proposal contains twelve separately drawn Human samples, P01–P06 in two
instructed directions. It remains `PENDING OWNER DECISION`. If retained, order
must be randomized or counterbalanced by a rule frozen before recruitment. No
sequence is selected here.

Exact reversals for Track B are computational derivatives of one accepted
source, not additional drawings. Analysis populations and attempt handling are
defined in `10_ANALYSIS_AND_EVALUABILITY_SPECIFICATION.md`.

## 5. Track A pipeline

```text
native → calibrated → normalized → trace-only → rendered
       → masked → reconstructed → metrics → statuses → hashes
```

Conformance includes deterministic transformations, identity propagation,
schema enforcement, artifact separation, rendering/parsing, provenance,
leakage rejection and exact status behavior. It does not support a claim that
an independently produced representation preserves geometry.

Normative detail: `06_TRACK_A_PIPELINE_CONFORMANCE.md`.

## 6. Track B design

For an evaluable source `p=(p_0,...,p_n)`, form
`rev(p)=(p_n,...,p_0)`. Process both with the same frozen pipeline. Randomize
packet labels under a sealed mapping.

Prediction target: identify which packet arose from `p`, or return `UNKNOWN`.
Allowed input is limited to the frozen trace-only packet. Time, direction,
velocity, source order, template identity, semantic filenames, pairing,
metadata and Owner explanation are forbidden.

Deleting direction fields is a leakage control, not evidence of
non-identifiability. A scientific result requires a genuinely independent
evaluator or independently authored frozen classifier and an approved decision
rule. They are absent, so Track B is `BLOCKED`.

Normative detail: `07_TRACK_B_DIRECTION_IDENTIFIABILITY.md`.

## 7. Track C design

Every static and moving schedule must be independent of completed Human data
and frozen before acquisition. V1's per-sample static-center selection is
withdrawn. The same schedule applies to F/R members unless a pre-acquisition
design reason is approved.

Each schedule declares ID, geometry, width, center function, boundary rule,
time domain, applicable cases, hash and freeze authority. Human schedule values
remain `UNASSIGNED`.

For each condition report hidden count, gap count and lengths, maximum gap,
endpoint censoring, marker exposure, hidden-region curvature where meaningful,
interpolation-difficulty proxies, observable support and common support.

Keep separate:

1. observability and availability;
2. conditional reconstruction error;
3. common-support reconstruction comparison.

Equal area and hidden-sample count are not sufficient comparability
conditions. Until adequate matching or modelling is accepted, causal
attribution to mask motion alone is prohibited.

Normative detail: `08_TRACK_C_MASK_SCHEDULE_COMPARISON.md`.

## 8. Registration and geometry

Derived records share one calibrated frame, so primary registration is the
identity. Rigid template fitting remains QC only.

Diagnostics must include unordered nearest-neighbour proximity, an
order-sensitive comparison minimized over forward/reverse traversal, endpoint
and connectivity checks, simple-closed status for P05, and self-intersection
count/connectivity for P06. Each metric must state what it cannot establish.

## 9. Markers

Detection may not search near an expected answer. Candidate geometric markers
remain pending: P03 curvature sign change; P04 global interior turning
discontinuity; P06 geometric segment intersection followed by a separately
frozen source-to-curve mapping. Until mapping between `u`, curve position and
`tau` is accepted, temporal marker values are `UNKNOWN` and comparisons are
`BLOCKED`.

## 10. Reconstruction baseline

Coordinate-wise linear interpolation in normalized time remains a proposed
technical baseline. Visible values remain observed; bounded gaps may be
interpolated; unbounded prefix/suffix or total absence is `UNKNOWN`. Templates,
pairs, trace packets, future samples and withheld coordinates are forbidden.

Determinism is a Track A property. Scientific adequacy is not assumed.

## 11. Threshold discipline

Revision 2 introduces no scientific threshold. Every tolerance requires an
error budget, repeatability study, independent noise study, or mathematical or
statistical rationale. Otherwise it is `UNSUPPORTED — OWNER DECISION PENDING`.

The four-of-six rule is removed. Six path families are individual diagnostic
cases. Any future aggregate requires a declared estimand, dependence rationale
and pre-result sensitivity analysis.

## 12. Calibration and device qualification

Human acquisition requires repeated grid measurements, held-out interior
validation, independent scale validation and pre/post drift checks. Device
qualification must cover accuracy, precision, latency, timestamp jitter, clock
drift, packet coalescing, sampling irregularity, contact detection and hidden
smoothing. Nominal resolution is not accuracy.

Normative detail: `11_CALIBRATION_AND_DEVICE_QUALIFICATION.md`.

## 13. Status semantics

- `VALID`: mandatory checks passed;
- `UNKNOWN`: requested quantity is unavailable;
- `INVALID`: artifact violates acquisition or schema contract;
- `BLOCKED`: mandatory authority, integrity, independence, calibration,
  common-support or protocol condition is absent.

No non-valid status may be converted to a number. A blocked track cannot yield
support, null or falsification.

## 14. Current result

```text
PIPELINE_CONFORMANCE: SYNTHETIC SELF-VALIDATION ONLY
DIRECTION_IDENTIFIABILITY: BLOCKED
MASK_SCHEDULE_COMPARISON: BLOCKED
INDEPENDENT_VALIDATION: PENDING
HUMAN_DATA: NONE
SCIENTIFIC_RESULT: NONE
OWNER_APPROVAL: PENDING
HUMAN_ACQUISITION_AUTHORIZED: NO
```

## 15. Exclusions

LANIF, ZERO, Fugenformel, handwriting meaning, golf, body motion and energy are
absent. This protocol creates no OLS term, operator, numbered Lab, general
theory or publication authority.
