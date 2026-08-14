# EXP-ORION-L1-001 v1.1 — Final Report

```text
REVIEW: PASS
LOCK: YES
EXECUTED: YES
SOURCE BASELINE: PASS
CANDIDATES MATCHED: 14 / 14
DESTRUCTIVE CONTROLS: 5 / 5
PRIMARY HASH: 53ce0a2e0a1901abaa05462e4e7558e4b96113ab5645c81f1e0e3f740c98b84e
REPLAY HASH: 53ce0a2e0a1901abaa05462e4e7558e4b96113ab5645c81f1e0e3f740c98b84e
REPLAY IDENTICAL: YES
OVERALL L1 STATUS: PASS
```

## Key measured results

- Maximum source error against the analytic trajectory: `5.833056071543553e-13` (`<=1e-9`).
- Maximum numerical source-energy drift: `5.88418203051333e-15` (`<=1e-9`).
- R1 independent-trajectory defect: `1.148745569312467e-14` (`<=1e-9`).
- R2 independent-trajectory defect: `0.0` (`<=1e-9`).
- R1/R2 algebraic field defects: `0.0` / `0.0` (`<=1e-12`).
- Maximum numerical polar-radius defect: `5.995204332975845e-15` (`<=1e-9`).
- Maximum signed unwrapped-phase defect: `5.844214001626824e-13` (`<=1e-8`).
- Unique R4 collision pairs: `2047`; all `2047` remain undefined to the x-only claimant.
- Maximum deterministic perturbed-energy defect: `1.4115328886288303e-6` (`<=2e-6`).
- Damped-control final energy drop: `0.7158379341032031` (`>=0.5`).
- Forward/reversed phase slopes: `-0.9999999999999536` / `0.9999999999999536`.

All raw outputs and all destructive-control failure evidence are retained in both `primary/` and `replay/`.

## WHAT L1 ESTABLISHES

For this locked harmonic-oscillator experiment, these frozen numerical representations and transformations behave exactly according to the preregistered taxonomy at the registered tolerances. It establishes the tested distinctions among invariant, equivariant, robust, representation-dependent, and undefined claims; verifies the intended information boundary for the scalar x-only observation; shows that the five destructive controls fail or preserve precisely their registered targets; and demonstrates byte-identical deterministic reproducibility in a clean full replay.

## WHAT L1 DOES NOT ESTABLISH

L1 does not establish a general theorem beyond this source system, grid, integrator, transformations, metrics, observation boundary, perturbation, controls, and thresholds. It does not validate other dynamics, adaptive or stochastic computation, arbitrary coordinate changes, empirical physical systems, navigation, NEXAH interpretation, visual semantics, causal claims, or any L2/L3 proposition.

