# SOLAR-L63-01 — Scope and preregistration

**Date:** `2026-10-01`
**Authority:** Human Owner authorization in Mission Control
**State at freeze:** `AUTHORIZED_NOT_YET_EXECUTED`
**Maximum cycles:** `1`

## Question

Does the bounded Lorenz-63 finding survive a fresh implementation with a
second integrator and an independent event locator?

The target distinction is:

```text
finite-step raw post-crossing corridor = sampling dependent
exact x=0 Poincare-section relation    = retained under independent replay
```

## Frozen model and interval

- canonical Lorenz-63: `sigma=10`, `rho=28`, `beta=8/3`;
- initial state: `(1,1,1)`;
- integration interval: `0 <= t <= 500`;
- burn-in: `t < 50` excluded;
- original reference: fixed-step RK4, `dt=0.001`, strict x-sign change and
  linear interpolation;
- independent replay: adaptive Dormand-Prince 5(4), `rtol=1e-9`,
  `atol=1e-11`, `h_initial=0.01`, `h_max=0.02`, `h_min=1e-8`;
- independent event locator: cubic-Hermite state interpolation plus bracketed
  bisection on `x(theta)=0`, at most 80 iterations and time bracket
  `<=1e-12`.

No SciPy dependency is permitted. The replay uses Python standard-library
arithmetic only so that the unavailable historical dependency does not become
part of the result.

## Frozen metrics and gates

The run is `PASS_BOUNDED` only when every gate passes:

1. **Reference reproduction:** RK4 produces exactly 247 post-burn strict
   x-crossings, matching the supplied controlled reference record.
2. **Independent event validity:** at least 200 post-burn crossings, both
   directions represented, and maximum event-state `abs(x) <= 1e-9`.
3. **Cross-integrator section agreement:** relative crossing-count difference
   `<=0.15`; normalized 199-quantile RMSE is `<=0.20` separately for section
   `y` and `z`, normalized by the RK4 reference standard deviation.
4. **Sampling-width scaling:** uniform observations of the independent
   trajectory at `dt=(0.02,0.01,0.005,0.0025)` yield a log-log slope of the
   95th-percentile raw post-crossing `abs(x)` in `[0.80,1.20]`.
5. **Raw-sampling negative control:** coarse raw width is nonzero
   (`p95(abs(x)) >= 0.10` at `dt=0.02`) and the finest raw width is less than
   half the coarse width.
6. **Return-order null:** the absolute observed lag-1 correlation of section
   `z_n -> z_(n+1)` exceeds the 99th percentile of 2,000 deterministic
   successor-permutation nulls (`seed=20261001`).

`FAIL_BOUNDED` is a valid result if execution is valid but one or more gates
fail. `INVALID` is reserved for numerical failure, fewer than 200 independent
events, a missing direction, a non-finite metric or a broken frozen input.

## Outputs

- `outputs/metrics.json` — parameters, metrics, gates and final disposition;
- `outputs/independent_crossings.csv` — independently located event states;
- `outputs/raw_sampling_metrics.csv` — frozen-grid raw-width controls;
- `02_RESULT_REPORT.md` — bounded scientific interpretation;
- `SHA256_MANIFEST.txt` — package receipt after execution.

## Claim ceiling

The maximum permitted conclusion is a numerical-method result about the
canonical Lorenz-63 fixture: whether a finite-step rendered corridor is
sampling-induced while a declared x=0 section relation persists under one
independent replay.

No astronomy, Solar-System dynamics, cone object, new attractor, new physical
law, general chaos theorem, predictive capability, product capability or
external scientific novelty claim is permitted.

## STOP

Stop after the first frozen execution and report the outcome. Do not tune
thresholds, change the integrator, add visual variants or start a successor
because of the observed result.
