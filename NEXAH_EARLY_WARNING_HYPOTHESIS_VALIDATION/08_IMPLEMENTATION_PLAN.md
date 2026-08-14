# Implementation Plan

This plan does not authorize implementation.

## Phase 0 — Owner freeze

1. Review equations, parameter provenance, stress grid, seeds, event rule,
   thresholds, metrics and PASS/FAIL/INCONCLUSIVE criteria.
2. Approve an isolated Science Lab experiment identity and exact file allowlist.
3. Freeze a machine-readable preregistration manifest and hashes before any
   development outcome is generated.

## Phase 1 — Minimal Level-1 implementation

1. Implement a pure raw simulator that writes immutable states; no plotting or
   warning logic inside the integrator.
2. Implement independent event, candidate and comparator evaluators consuming
   only raw records and causal prefixes.
3. Implement development-only threshold calibration, then cryptographically
   freeze evaluation code/config.

## Phase 2 — Verification before evaluation

1. Unit-test equations, equilibrium, COI coordinates, persistence, event and
   missingness rules with hand-checkable fixtures.
2. Verify deterministic replay per seed, manifest identity, no evaluation
   access during calibration and timestep convergence.
3. Have an independent reviewer inspect the exact freeze; preserve rejection.

## Phase 3 — Locked evaluation

1. Execute every registered seed/path, including non-events and failures.
2. Generate metrics from immutable run records; plots are derived last.
3. Return exactly PASS, FAIL or INCONCLUSIVE without threshold or horizon
   changes.

## Phase 4 — Level-2 decision gate

Only after Level 1 closes, decide whether transient IEEE validation is worth a
separate protocol. It requires dynamic case data and a transient engine; the
current steady-state NEXAH IEEE runner is not silently repurposed.

## Single next implementation task after Owner approval

Create the isolated Level-1 machine-readable preregistration manifest plus a
raw-state-only simulator that implements the frozen equations, explicit seeds
and immutable output schema. Do not implement plots, thresholds or claims in
that first task.

