# Experiment Design

## Level 1 — Synthetic dynamical validation

Purpose: determine whether phase coherence carries any measurable anticipatory
information beyond the declared speed-deviation comparator.

```text
FROZEN SYNTHETIC MODEL + STRESS PATH + SEED
  -> RAW STATE INTEGRATION
  -> INDEPENDENT TERMINAL-EVENT DETECTOR
  -> CAUSAL R(t) AND V(t)
  -> FROZEN PERSISTENT THRESHOLDS
  -> RUN-LEVEL WARNING/ALARM/EVENT RECORD
  -> HELD-OUT DISTRIBUTION METRICS
```

Development and evaluation are disjoint. Stable/non-event paths are mandatory.
All plots are generated only from immutable raw/result records; plots never
alter data.

### Required controls

1. Zero stress.
2. Subcritical ramp/hold with no terminal event.
3. Event paths at multiple unseen rates and caps.
4. Deterministic and stochastic runs.
5. Timestep-halving convergence.
6. Indicator ablation: candidate without threshold tuning beyond the frozen
   calibration rule.
7. Threshold sensitivity ±10% and persistence 5/10/20 samples, reported but
   not used to redefine the primary result.

Because phase coherence and the synthetic terminal proxy both use angle state,
report their mathematical/empirical dependence explicitly. Do not describe
Level 1 as independent physical prediction. Add a secondary event definition
based on a preregistered sustained inability to recover after stress removal;
it is sensitivity analysis only and cannot replace the primary endpoint after
results are seen.

## Level 2 — IEEE / power-system validation

Level 2 begins only if Level 1 is methodologically valid; a Level-1 PASS is not
proof of power-system utility.

Requirements:

- a named IEEE transient-stability case with licensed/traceable dynamic
  generator, exciter/governor/load and disturbance data;
- a validated transient-dynamics engine, not only steady-state Pandapower;
- equilibrium power flow and dynamic initialization checks;
- preregistered disturbances, event/non-event cases and domain baselines;
- power-system expert review of event and comparator definitions;
- independent replication and uncertainty/failure reporting.

The current canonical NEXAH IEEE path can supply manifest discipline,
provenance, case identity, failure preservation, development/evaluation
separation, Orientation Briefs and replay conventions. It cannot directly
provide transient rotor trajectories: its current registered computation is an
ordered steady-state load campaign. A future Level-2 experiment therefore
needs an isolated transient-source adapter and experiment runner. It must not
modify canonical scientific operators or call solver nonconvergence collapse.

## No post-hoc operations

Forbidden after any outcome is seen: changing event times, shaping state or
indicator curves, picking favorable seeds, moving thresholds, changing the
warning horizon, deleting non-events, retuning evaluation parameters or
renaming a numerical failure as a physical event.
