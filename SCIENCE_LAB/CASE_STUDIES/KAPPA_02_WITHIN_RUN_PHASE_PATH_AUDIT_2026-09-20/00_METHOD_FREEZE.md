# KAPPA-02 — Within-Run Phase Path Audit — Method Freeze

Date: `2026-09-20`

Status: `FROZEN_BEFORE_KAPPA02_EMPIRICAL_OUTPUT`

Evidence status: `POST_HOC_EXPLORATORY_WITH_RESPECT_TO_PHX01`

## Question

Do the PHX-01 mean phase differences arise as approximately constant offsets,
or do they change systematically over ordinal position within each recorded
run?

## Sources

The same four SHA-256-bound external E2 CSV records used by PHX-01. The audit
uses raw within-record timestamps, displacement and force for both actuators.

## Recoverable object

Within each file, displacement and force share one relative time axis. A local
relative phase path is therefore recoverable:

```text
theta_k(t) = arg(Z_force,k(t) / Z_displacement,k(t))
```

No sample-wise physical path between separate A and B files is claimed.

## Frozen local estimator

For nominal frequency `f` and sample rate 512 Hz:

1. window length: `round(512/f)` samples, exactly one nominal cycle;
2. window: symmetric Hann;
3. window advance: one eighth cycle;
4. local complex coefficient: weighted demodulation at the declared `f` using
   the raw timestamp vector;
5. displacement is reference, force is response;
6. local phase is wrapped to `[-180°,180°)`;
7. only window centers whose complete window lies within the PHX-01 common
   active-cycle span are retained.

The estimator tracks changes slower than approximately one cycle. It is not a
within-cycle instantaneous constitutive phase.

## A/B path comparison

A and B paths are evaluated on their common normalized ordinal coordinate.
Because the matched files have equal lengths and sampling grids within each
declared pair, matching uses the same window-center sample index. This is an
ordinal profile comparison, not physical simultaneity.

For each `(pair, actuator)`:

```text
kappa_ordinal(u) = wrap(theta_B(u) - theta_A(u))
```

where `u` is normalized from 0 to 1 over retained window centers.

## Frozen path summaries

- circular mean Kappa;
- mean of first quartile and last quartile of the path;
- last-minus-first-quartile change;
- ordinary least-squares slope in degrees per normalized run after phase
  unwrapping;
- constant-model RMSE;
- linear-model RMSE;
- linear RMSE improvement fraction;
- minimum, maximum and peak-to-peak Kappa;
- Janus A/B reversal antisymmetry error.

The same trend summaries are reported separately for theta_A and theta_B.

## Synthetic gates

Before empirical output:

- fixed phase recovery error <= 0.05°;
- linear phase-drift endpoint error <= 0.15°;
- unequal amplitude fixed-phase error <= 0.05°;
- A/B exchange antisymmetry error <= 1e-12°.

Failure of any synthetic gate stops empirical execution.

## Interpretation rule

- `CONSTANT_OFFSET_LIKE`: absolute slope <= 0.1° per normalized run and linear
  RMSE improvement < 10%;
- `ORDINAL_RELAXATION_LIKE`: slope > 0.1° per normalized run, last quartile is
  closer to zero than first quartile, and linear RMSE improvement >= 10%;
- `ORDINAL_DIVERGENCE_LIKE`: slope < -0.1° per normalized run and last
  quartile is farther from zero;
- otherwise `NONLINEAR_OR_MIXED_PATH`.

These are descriptive path-shape labels, not population-level hypothesis
tests. Cycles and overlapping windows are not independent experiments.

## Claim boundary

KAPPA-02 may show within-record phase drift and ordinal A/B profile
differences. It cannot recover the physical path between campaigns, establish
an earthquake cause, separate frequency from amplitude, or establish a
universal Kappa, decimal, modular, prime or morphogenetic mechanism.
