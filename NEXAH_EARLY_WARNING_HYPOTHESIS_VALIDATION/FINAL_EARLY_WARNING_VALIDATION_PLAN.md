# Final Early-Warning Validation Plan

Date: 2026-08-13 (Europe/Berlin)

Authority: Science Lab research planning only

Default disposition: `NOT_ADOPTED`

## Executive verdict

The supplied script and plot do not demonstrate early warning. The displayed
65/105/110 event sequence and 40-step advantage are imposed; all three plotted
data families are modified after the raw simulation. The input is preserved as
a `SYNTHETIC_CONCEPT_DEMONSTRATOR`, not validation evidence.

A narrower hypothesis remains scientifically testable: held-out, causally
computed phase coherence may or may not provide useful lead over a fairly
calibrated speed-deviation comparator. The package defines a fail-closed
Level-1 preregistration capable of PASS, FAIL and INCONCLUSIVE. No experiment
has been implemented or run.

## Explicit answers

### 1. What does the supplied script actually simulate?

A manually parameterized four-node, all-to-all coupled stochastic swing-like
phase-oscillator system. Mechanical/input terms are scaled by a hand-set ramp;
Gaussian noise is added directly to angles.

### 2. Is it an IEEE benchmark simulation?

No. It has no IEEE case loader, bus/branch admittance provenance, power-flow
initialization, dynamic machine/load records or IEEE-9/14 identity.

### 3. Is `S_NEXAH` genuinely calculated from states?

Initially yes: it is the magnitude of the standard phase order parameter.
However, every value from imposed step 65 onward is replaced before plotting.
The Cubit constant has no mathematical effect on the magnitude.

### 4. Is warning step 65 emergent or imposed?

Imposed at lines 100–102. A 100-seed diagnostic of the untouched loop found
raw crossings at 50–52 and none at 65.

### 5. Is classical alarm step 105 emergent or imposed?

Imposed at lines 100–102. The raw comparator is then entirely replaced. In the
diagnostic its original 0.15 crossing was step 2 for all 100 seeds.

### 6. Is collapse step 110 measured or imposed?

Imposed. It is a constant with no terminal-event detector.

### 7. Are curves modified after simulation?

Yes. `history_S` is replaced after 65; the full comparator trace is replaced;
and angle suffixes are cumulatively increased after 105.

### 8. Does the supplied visual establish early warning?

No. The conclusion is circular by construction and lacks fair calibration,
held-out evaluation, false-positive analysis, event definition and provenance.

### 9. What remains scientifically interesting?

Phase coherence is a genuine state-derived synchrony statistic. Whether its
causal degradation offers incremental, robust held-out warning information
over conventional speed deviation is an open, falsifiable question.

### 10. What is the exact falsifiable hypothesis?

On preregistered held-out stress paths, a development-calibrated causal phase-
coherence warning yields positive median paired lead over a similarly calibrated
COI-relative speed-deviation comparator without materially worse false-positive
rate or recall.

### 11. What is the cleanest experiment?

First run the transparent synthetic Level-1 swing system with equilibrium
initialization, explicit deterministic/stochastic protocols, disjoint
development/evaluation paths, immutable raw states, an independent sustained
loss-of-synchronism proxy and frozen thresholds. Only later design Level 2.

### 12. What comparator should be used?

Maximum center-of-inertia-relative rotor-speed deviation, with the same
development-only calibration procedure, persistence and false-positive
constraint as the candidate. Power-system Level 2 additionally requires a
domain-reviewed conventional baseline.

### 13. How will false positives be measured?

Warnings on valid event-free runs divided by all valid event-free runs, plus
warning rate per simulated time. Warnings outside the frozen actionable horizon
are not credited. Report confidence intervals by seed and stress path.

### 14. What constitutes PASS?

Adequate held-out event/non-event counts, positive median `Delta_L` with 95%
interval above zero, recall within 0.05 of baseline, FPR ≤0.10 and no more than
0.05 above baseline, robust threshold/stress-path behavior, numerical
convergence and complete provenance.

### 15. What constitutes FAIL?

A valid locked evaluation with no positive robust lead advantage, inferior
recall, excessive false positives or advantage limited to selected thresholds,
seeds or paths.

### 16. What constitutes INCONCLUSIVE?

Insufficient event/non-event counts, no eligible development threshold,
numerical/initialization failure, material drift, broken freeze or uncertainty
too wide under the registered analysis.

### 17. Can existing NEXAH infrastructure support the experiment without changing scientific operators?

Partly. It can support manifests, provenance, replay, failure preservation,
development/evaluation separation and derived briefs. Current canonical IEEE
infrastructure is steady-state geometry, not transient dynamics. Level 1 needs
an isolated experiment runner; Level 2 needs a new experimental transient-data
adapter. Neither requires modifying canonical scientific operators.

### 18. Does Application 001 need to change?

No. Application 001 remains geometry replay/orientation usefulness and keeps
all early-warning/stability/risk/control prohibitions.

### 19. Is any architecture decision required?

No architecture decision is required for isolated preregistration. Explicit
Science Lab/Repository Owner authorization is required before implementation,
execution, adoption or publication.

### 20. What is the single next implementation task after Owner approval?

Freeze the machine-readable Level-1 manifest and implement only the raw-state
simulator with explicit seeds and immutable outputs. Indicator/event analysis
comes later as a separately verified consumer of raw states.

## Final status

EARLY_WARNING_HYPOTHESIS_READY_FOR_PREREGISTERED_TEST
