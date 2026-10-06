# Polar-Janus Evidence Bridge

Date: `2026-10-06`

Status: `TYPED_NAVIGATION_SLICE / HISTORICAL_CLAIMS_NOT_ADOPTED / CURRENT_STUDY_HAS_NO_RESULT`

## Why this layer is needed

The HTML registry answers which interfaces and representations exist. It does
not answer which experiment produced a result, which result survived later
review, or whether a visual belongs to an active study. The Core Navigator
therefore needs a separate evidence graph:

```text
MODULE
  ↕ method relation
SURFACE / HTML / 3D / FIGURE
  ↕ represents or operates
STUDY / TEST
  → RESULT
  → CONTROL OR NULL
  → SUCCESSOR STUDY
  → CLAIM CEILING
  → CONTROLLING RECORD
```

The first typed pilot is
[`POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json`](POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json).
It is deliberately partial: it covers the Polar-Janus chain relevant to Q7,
Q11, Tessarec, phase quadrature, LOD and the current prospective study. It is
not a complete experiment census.

## Fine connections recovered

### Q7 → Q11 → Tessarec packaging

`Test 05 Q7` establishes an exact modular representation, but the same pattern
occurs in 12 of 40 constrained null progressions. Its status is therefore
`ALGEBRAIC PASS / COMMON PATTERN`, not distinctive evidence.

The later Q11 material expands this grammar into an Euler-staircase and
Tessarec packaging narrative. It contains several updated “preregistration”
versions and a constructed 4D simulation. The simulation projects a synthetic
tesseract trace, quantizes it, applies smoothing and then scales the output
into the historical LOD-gain range. It is a useful representation experiment,
not an independent geophysical derivation.

The Q7/Q11 figure should therefore be shown as:

`representation expansion / grid-sensitivity candidate`

and not as:

`Q11 physical stabilization proved`.

### Theta seam and grid interaction

Test 07 has a valuable mixed outcome. The preregistered seam criterion failed;
the later alias-aware robustness test passed. It supports theta as a seam-free
translation coordinate while rejecting the claim that a constant ring replaces
the ephemeris model. This is a strong method connection to Transversum and
Tessarec because it makes loss, translation and return explicit.

### Phase quadrature and Schlieren

Test 09 cleanly separates construction from evidence:

- analytic-signal quadrature: mathematically successful;
- 40-day holdout gain: `+9.361%`;
- circular-shift-null percentile: `27.0%`;
- final verdict: `NO_SUPPORT`.

This is not a failed artifact. It is an important negative boundary showing
that a compelling phase-eye or Schlieren image is not specific predictive
evidence.

### Historical LOD result → current prospective route

Historical Test 08 reports `+10.969%` against its original M1 comparator.
Later qualification found:

- the chronology was not independently sealed;
- the comparison was rolling one-step-ahead, not a year-ahead forecast;
- the original baseline omitted established geophysical structure;
- on the already-known 2025 data, the old candidate did not beat the qualified
  IERS zonal-tide baseline;
- a stronger historical EAM comparator also outperformed the candidate.

The current authority is therefore
[`POLAR-LOD-01`](../CASE_STUDIES/POLAR_LOD_01_PROSPECTIVE_VALIDATION_2026-10-01/00_README.md):

`FILED / NO_RESULT / NO_ACTIVATION`.

The historical result remains a screened predecessor and research motivation,
not a confirmed Core capability.

## Relation to NEXAH Core

Polar-Janus is highly relevant to the Core repository as a **stress-test and
worked-example family** for:

- observer-relative records;
- phase and seam handling;
- grid quantization;
- translation versus transition;
- return and reconstruction residuals;
- negative controls and claim discipline.

It should not currently define the Core ontology or physics. Core owns the
typed method and evidence contract; Polar-Janus supplies cases that may pass,
fail, remain mixed or motivate a successor study.

## Navigator presentation

Recommended route:

`Evidence → Earth Orientation / Polar-Janus`

Each test card must display two statuses:

1. **package-local verdict** — what the original test called itself;
2. **current interpretation** — what later intake, baseline qualification and
   governance allow us to say now.

This dual status prevents a historical `PASS` label from appearing as current
scientific adoption while preserving the actual experimental history.

## Claim boundary

The evidence slice does not establish a 4D geophysical mechanism, Q11
optimality, lunar causality, SU(3) correspondence, production navigation API
or operational forecasting system. It records where exact mathematics,
simulation, representation, historical prediction, negative evidence and
current prospective governance connect—and where they do not.
