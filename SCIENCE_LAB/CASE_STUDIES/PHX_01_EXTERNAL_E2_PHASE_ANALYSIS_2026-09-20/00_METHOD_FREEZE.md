# PHX-01 — Method Freeze

Date frozen: `2026-09-20`

Status before execution: `FROZEN_BEFORE_NEW_EMPIRICAL_PHASE_OUTPUT`

## Scope

PHX-01 is an additive phase analysis of the four SHA-256-bound CSV records in
`HZ_FZ_PUBLIC_01`. It is external E2 evidence only. It does not modify or admit
the local `HZ_FZ_01` measurement profile.

Prime-number, morphogenesis, microtubule and consciousness hypotheses are not
tested.

## Primary relation

For each actuator and active nominal cycle, displacement is the reference and
force is the response:

```text
D_k(f) = 2/N sum_n (d_k(t_n) - mean(d_k)) exp(-i 2 pi f t_n)
F_k(f) = 2/N sum_n (F_k(t_n) - mean(F_k)) exp(-i 2 pi f t_n)
G_k(f) = F_k(f) / D_k(f)
delta_phi_k = arg(G_k(f))
```

Only relative phase is reported. No absolute phase is defined.

## Frozen segmentation

- authoritative rate: 512 Hz;
- samples per nominal cycle: `round(512 / f)`;
- active threshold: actuator-1 displacement half-range at least 90% of the
  declared displacement amplitude;
- a paired cycle is retained only when active in both before/after cuts;
- primary analysis uses every common active cycle;
- sensitivity analysis removes the first and last common active cycle.

## Frozen statistics

For each cut and actuator:

- circular mean of cycle phase;
- phase-locking value across cycle phase values;
- circular standard deviation;
- magnitude-squared coherence at the declared fundamental, treating active
  cycles as repeated spectral segments.

For each before/after pair and actuator:

- paired circular phase difference, `wrap(phi_after - phi_before)`;
- circular mean of those paired differences;
- deterministic circular moving-block bootstrap interval;
- change after excluding the first and last active cycles.

Bootstrap settings are frozen at 20,000 draws, circular block length 2 and seed
`20260920`.

## Frozen decision thresholds

Synthetic validation passes only if every registered control passes its own
declared tolerance in `protocol.json`.

An actuator-level phase relation is classified `STABLE_EQUIVALENT` only when:

1. both cut-level phase-locking values are at least 0.95;
2. both cut-level fundamental coherences are at least 0.95;
3. the complete 95% bootstrap interval for the mean before/after phase shift is
   inside `[-2 degrees, +2 degrees]`;
4. removing boundary cycles changes the mean phase shift by no more than 0.5
   degree.

A pair is stable only if both actuators pass. The full four-record set is
stable only if both pairs pass.

These are bounded engineering equivalence criteria, not universal constants.

## Interpretation boundaries

- The 0.5 Hz records use 20 mm while the 1.0 Hz records use 40 mm. Frequency
  and amplitude are therefore confounded in the selected four-file set.
- Before/after cuts are not independent same-condition replicates.
- Separate files do not share a continuous absolute timebase.
- Cycles within a run are repeated observations, not independent experiments.
- A stable result may support a descriptive relative-phase invariant in this
  source family only.

