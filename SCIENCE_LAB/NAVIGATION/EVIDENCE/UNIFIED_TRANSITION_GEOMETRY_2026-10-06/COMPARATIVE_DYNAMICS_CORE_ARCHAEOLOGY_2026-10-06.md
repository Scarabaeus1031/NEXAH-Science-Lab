# Comparative Dynamics — NEXAH Core Archaeology

Date: 2026-10-06  
Status: integrated orientation record; no cross-system validation claim  
Core snapshot: `5adbe3da65535c1ae001e2af0e82474dea513f9a`

## Decision

Lorenz, Rössler, Halvorsen and Kuramoto are admitted to the Navigator as distinct comparative carriers. They are not admitted as instances of one already validated gate mechanism.

The integration preserves four evidence labels:

1. `FORMAL CONTROL`
2. `COMPUTATIONAL CANDIDATE`
3. `HISTORICAL VISUAL`
4. `MEASUREMENT LAYER`

## Recovered material

The complete Core census found 34 GIF files and 32 unique hashes. Two pairs are
byte-identical duplicates: `phase_mismatch.gif` and
`nexah_transition_navigation_v13.gif`. The Navigator retains one canonical copy
of each selected artifact.

### Lorenz

The Core contains trajectories, switch and return maps, density and flow fields, separatrix candidates, FTLE views and navigation prototypes under `APPLICATIONS/dynamical_systems/lorenz/`.

The controlling formal result remains `UTG-FORMAL-01`, which passed 8 of 8 acceptance gates for one oriented Lorenz-63 crossing classifier. Historical Lorenz visuals do not inherit that verdict.

### Rössler

The Core contains an executable simulation and validation suite plus phase and transition comparisons. It does not currently contain a first-class `APPLICATIONS/dynamical_systems/rossler/` package with a preregistered UTG event contract.

### Halvorsen

The Core contains RK4 simulation, grid discretization, transition extraction, coarse graining, reachability, graph policies and two tracked GIFs.

The legacy gate detector defines a gate as an off-diagonal transition satisfying `P(i→j) / P(i→i) > 0.2`. That definition is a graph-edge heuristic. It is not equivalent to the oriented geometric crossing gate used in `UTG-FORMAL-01`.

The gate-aware policy damps diagonal probabilities, boosts selected edges and renormalizes matrix rows. It does not apply an intervention to the continuous Halvorsen state equations and therefore does not demonstrate controlled state-space navigation.

The dual Lorenz/Halvorsen GIF uses Halvorsen cluster residues to color both displayed points. The shared color is a visualization device, not evidence of aligned state semantics or dynamical coupling.

### Kuramoto

The Core contains parameter sweeps, field projections, order-parameter outputs and a simple adapter with named synchronization regimes. Because Kuramoto is an oscillator network rather than another three-dimensional attractor, it requires a separate observable and event contract.

## Lyapunov / FTLE boundary

Lyapunov and FTLE quantities are measurements, not dynamical carriers. The legacy representation audit found that at least one historically labeled Lyapunov visual computed a log-transformed local slope magnitude rather than a Lyapunov exponent. Any future use must expose tangent or perturbation evolution, normalization, interval and convergence checks.

## Registered next test

`UTG-FORMAL-02 — Cross-System Gate Contract` is planned but not preregistered and not executed.

Its purpose is to determine whether one event-contract schema can be instantiated on Lorenz, Rössler and Halvorsen while preserving carrier-specific semantics. Each carrier must declare its own event function, direction, transversality, sampling, interpolation and return rule. Raw event-count similarity is not an acceptance criterion.

Kuramoto remains outside this test and is reserved for a later network-specific contract.

## V69 classification

`Field` is treated as a representation layer, not as an additional connection
family. Baseline V69 reconstructs a map `F̂(c, dc)` by assigning each grid point
the tangent of the nearest observed trajectory location plus a fixed return
vector toward the trajectory.

Its connection-family roles are:

- primary: `CF:F4 · Phase / Drift`, because the represented object is local
  directional flow;
- method: `CF:F3 · Transition / Operator`, because a reconstruction operator
  extends observed trajectory directions into a surrounding field;
- source: `CF:F1 · Observation / Record`, because the construction depends on
  the recorded `(c, dc)` trajectory and generated V68 cloud;
- conditional downstream: `CF:F5` only after corridors or topology are
  extracted, and `CF:F6` only after an intervention is evaluated.

V68 does not measure independent off-manifold dynamics. It adds fixed offsets
around normalized trajectory samples and copies `d2c` into the generated cloud.
V69 is therefore a useful reconstructed extension field, not directly observed
off-manifold ground truth. Historical claims about unique physical fields,
geodesics or minimum-energy paths are not adopted by this binder.

## Curated animation collections

The Navigator groups selected GIFs into five claim-bounded collections:

1. Dynamics Core — trajectory, field, graph, multilayer and phase explainers.
2. IEEE Field — V68/V69 reconstruction and hybrid navigation.
3. Cross-System Archaeology — Lorenz/Halvorsen comparators.
4. Extended Carriers — prime residues, Julia path and torus slicing.
5. Network Extension — Kuramoto as a separately contracted carrier.

## Claim ceiling

The recovered code and media establish repository presence, executable candidates and historical development lineage. They do not establish a universal gate geometry, shared mechanism, predictive superiority, invariant orientation or transferable control law.
