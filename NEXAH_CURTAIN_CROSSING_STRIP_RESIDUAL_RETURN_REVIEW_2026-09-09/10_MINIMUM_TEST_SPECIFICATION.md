# Minimum Test Specification — Not Activated

Status: design only; `TEST_EXECUTION = NOT_AUTHORIZED`.

## Frozen input contract

For each of Lorenz, Rössler and Halvorsen separately: governing equations/parameters, initial-condition ensemble, integrator/tolerances, sampling interval, time range, transient removal, seed policy, state scaling, projection, and immutable trajectory hashes.

Predefine one gate family and one primary gate without using outcome labels. Record `g`, `Γ`, regularity, direction, hysteresis, root interpolation and uncertainty. Preserve all crossings, not only displayed ones.

## H1 — Gate-to-strip correspondence

Compare bound crossing times `E_gate` with strip times `E_strip` using a preregistered tolerance and one-to-one matching. Report precision, recall, F1, timing error, unmatched/multiple events, and sensitivity to sampling/window/threshold. A plot match is insufficient.

## H2 — Added information

Target: a separately defined future crossing/transition outcome. Compare the Curtain candidate (full `v⊗n` and every derived scalar separately) against `||v||`, phase, curvature, `v·n`, strain/shear, implemented finite-time stretching, and geometrically matched random gates.

Use held-out trajectories/initial conditions and a locked scoring rule. Report incremental performance and calibration, not only correlation or selected quantile enrichment.

## H3 — Cross-system portability

Apply the same typed grammar and equivalent normalization protocol to each system while retaining system-specific parameters and results. Success means executable schema portability, not equal distributions, equal dynamics or synchronization.

## Controls

Time-shift surrogates; random and geometry-matched gates; alternative projections; threshold, sampling and parameter sweeps; label permutation; simple baselines; negative/blocked outcomes; tangency and multiple-crossing fixtures; color-blind rendering check.

## Advancement criteria

Advance from E only when one candidate visual chain has complete hashes for image, generator, inputs, configuration, intermediates and results, then passes a preflight replay without changing registered capabilities. Test execution still requires separate authorization.

