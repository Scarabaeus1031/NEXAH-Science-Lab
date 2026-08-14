# Claim Audit

All findings are `NOT_ADOPTED`.

| Claim | Classification | Evidence | Problem | Allowed wording |
|---|---|---|---|---|
| “IEEE Multi-Bus Grid” | `UNSUPPORTED` | Four synthetic angles/speeds and a hand-written dense coupling matrix | No IEEE case loader, bus/branch data, admittance derivation, power flow, dynamic machine records or case identity | “Synthetic four-node coupled swing-like model” |
| “NEXAH Warning” | `CIRCULAR_BY_CONSTRUCTION` | Marker at 65 and shaped `S` trace | Raw crossing is overwritten; threshold uncalibrated; indicator is standard phase coherence | “Illustrative imposed marker in a historical concept graphic” |
| “Classical Threshold Crossed” | `CIRCULAR_BY_CONSTRUCTION` | Marker at 105 and replacement curve | Raw comparator crossing is discarded; replacement noise can make plotted step 105 not cross 0.15 | “Illustrative imposed comparator marker” |
| “Grid Collapse” | `UNSUPPORTED` | `step_collapse=110` | No terminal-event formula; solver failure, loss of synchronism or physical collapse is not tested | “Manually labeled reference step 110” |
| “Actionable Warning Window” | `CIRCULAR_BY_CONSTRUCTION` | Shading from 65 to 105 | Both endpoints imposed; no action, utility, costs, false positives or intervention tested | “Illustrative 40-step shaded interval” |
| “Manifold Coherence” | `PARTIALLY_SUPPORTED` | Phase order parameter calculated from angles | Coherence is calculated, but no manifold is defined; Cubit constant cancels | “Phase coherence/order-parameter magnitude” |
| “+40–50 Steps” | `CIRCULAR_BY_CONSTRUCTION` | `105-65=40` | No distribution; text range includes unmeasured 41–50 | “The imposed markers are 40 steps apart” |
| Predictive superiority | `UNSUPPORTED` | Single shaped graphic | Raw diagnostic has classical threshold at step 2 and coherence at 50–52; no fair calibration, event labels, false-positive analysis or holdout | “The underlying state-only coherence idea remains an untested hypothesis” |
| Raw synthetic dynamics exist | `SYNTHETIC_ONLY` | Lines 45–93 | Reproducible only after adding seed; parameters lack domain provenance | “The script contains a stochastic synthetic oscillator simulation” |
| `S_NEXAH` is state-derived before shaping | `SUPPORTED` | Lines 76–80 | Its interpretation/name is overstated; post-65 values are replaced | “A standard phase-coherence statistic is computed from raw simulated angles” |

## Overall visual verdict

The supplied visual does not establish early warning. It shows that a desired
early-warning narrative can be drawn after imposing event times and shaping
curves. Its evidentiary value is provenance for a concept, not validation.

