# NEXAH Physics Foundations Glossary

Date: `2026-09-20`

Status: `FOUNDATION_GLOSSARY / ESTABLISHED_PHYSICS_SEPARATED_FROM_NEXAH_READING`

Operational effect: `NONE`

## Purpose and claim classes

This glossary separates established physics, measured or derived results,
representation methods and open hypotheses. Numeric or visual alignment does
not establish a physical mechanism. Physical claims require a named system,
observables, units, calibration, timing, controls and uncertainty.

| Label | Meaning |
|---|---|
| `ESTABLISHED_PHYSICS` | standard physical definition or accepted model |
| `MEASURED_RESULT` | observation with source, method, units and uncertainty |
| `DERIVED_RESULT` | value computed from declared measurements and method |
| `REPRESENTATION_MODEL` | graph, projection or comparison view |
| `OPEN_HYPOTHESIS` | testable proposal not yet established |
| `EXPRESSION_ONLY` | mnemonic or symbolic language without physical authority |

## Mechanics and oscillation

| Term | Meaning and boundary |
|---|---|
| Displacement | change of position relative to a declared reference; unit required |
| Force | calibrated interaction quantity, normally in newtons; frequency is not force |
| Frequency | cycles per unit time, normally hertz; does not identify a mechanism |
| Amplitude | declared oscillation extent; peak, peak-to-peak and RMS must not be mixed |
| Phase | angular cycle position relative to a declared reference |
| Relative phase | phase difference between two named signals under a sign convention |
| Phase-locking value | consistency of cycle phase differences; not causal coupling |
| Coherence | frequency-resolved linear association; not direction or mechanism |
| Resonance | enhanced system response near a frequency under declared forcing and damping |

## Structural dynamics and path terms

| Term | Meaning and boundary |
|---|---|
| Structural dynamics | structures under time-dependent loading and response; primary HZ/FZ subject |
| Damping | dissipation or effective reduction of oscillatory response under a model |
| Shape-memory alloy (SMA) | thermo-mechanical material family; the case does not establish a universal SMA law |
| Hysteresis | path-dependent response loop; loop area and phase are different summaries |
| History dependence | present response depends on prior forcing; mechanism remains to be identified |
| Before/After contrast | difference between ordered records; ordering alone is not causation |
| Relaxation | approach toward a reference under a specified model |
| Ordinal path | values ordered by run/cycle position without reconstructing physical time |
| Kappa path | case-local ordinal phase-contrast path; not a standard field quantity |

## Measurement terms

| Term | Requirement |
|---|---|
| Apparatus identity | sensor, actuator, specimen, wiring, calibration and acquisition configuration |
| Shared clock | common time base for phase-compared signals |
| Run / cycle | bounded acquisition / reproducibly selected periodic segment |
| Replication | genuinely repeated or independent acquisition, not another decimal view |
| Confounding | factors cannot be isolated because they change together |
| External E2 evidence | bounded external data use without local profile admission |

## HZ/FZ reading rule

The empirical phase result comes from external RWTH SMA-damper displacement
and force channels on a shared time axis. It is Physics: structural dynamics,
damping, hysteresis and signal/phase analysis.

The local `HZ_FZ_01` package remains a frequency-to-force admission contract
with real measurement pending. Decimal/11 patterns are representation audits.
Exact identities such as `12^3 +/- 1` belong to Mathematics. Neither explains
the physical cause of the phase behavior.
