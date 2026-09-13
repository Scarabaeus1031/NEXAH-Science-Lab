# Experiment Candidate Comparison

| ID | Candidate | Measurand and independence | Principal limitations | Measurement class | Feasibility / information gain |
|---|---|---|---|---|---|
| A | Laboratory modulated-light time of flight | phase or envelope delay over independently measured path | phase wrapping; channel phase; cable delay; air group index; short delay | direct local measurement if raw timing and calibration exist | high feasibility; moderate ambiguity |
| B | Phase-delay terrestrial path | phase shift at known modulation frequency and surveyed length | integer-cycle ambiguity; multipath; oscillator drift; atmosphere; transmitter/receiver phase | direct measurement only with unwrapping and synchronized/calibrated chain | feasible, but lower fail-closed clarity |
| C | Pulsed-light round trip to reflector, differential two-length design | difference in return times for independently surveyed ΔL; one local clock | pulse/detector response; threshold walk; path definition; air index; alignment | direct local measurement of effective group speed; vacuum inference after n_g correction | **highest expected information gain**; no remote synchronization; selected |
| D | Bounded Rømer reconstruction from published ephemerides/eclipses | fitted timing modulation versus independently sourced orbital geometry | historical timing conventions; ephemeris dependence; eclipse model; parameter covariance | reconstruction from external observations, not a new local light-time measurement | scientifically rich; more model-dependent |
| E | AU/Sun light-time calculation | AU divided by exact c | both quantities are defining/conventional exact inputs; actual Sun–Earth range varies | calculation/reconstruction, not independent measurement | easiest, but zero independent measurement gain |

## Selection rationale

Exactly one minimum experiment is selected: **C, differential pulsed-light round trip**. It removes remote-clock synchronization, cancels common fixed electronic latency to first order, separates surveyed distance from timing, produces a resolvable signal on a modest baseline, and exposes the remaining dominant systematics explicitly.

A and B are not selected because short-path phase and fixed-delay ambiguities are more difficult to close. D is valuable but depends on published observations and orbital/eclipsing models. E merely reconstructs AU/c and cannot answer the independent-measurement question.

## Expected scale

For ΔL = 30.000 m one-way baseline difference, the vacuum differential round-trip interval is
[
2Delta L/c = 200.1384571 mathrm{ns}.
]
In air it is approximately n_g times larger. The exact expected air delay must not be prefilled without wavelength and measured ambient conditions.

