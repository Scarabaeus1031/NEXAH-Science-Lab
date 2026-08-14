# Level-1B Development Observation

Classification: `DEVELOPMENT_OBSERVATION / NOT_SCIENTIFIC_EVALUATION`  
Registered primary trajectories evaluated: 357

## Observed endpoint and calibration state

- terminal-event runs: 0;
- event-free runs: 357;
- seven paths, each with one deterministic and 50 stochastic runs;
- selected R threshold: `tau_R=0.50`;
- selected V threshold: `tau_V=1.00`.

At the selected thresholds, R produced 0 confirmed detections and V produced 0
confirmed detections. Both development FPRs are 0/357 = 0. Event recall,
actionable lead, paired Delta_L, precision for zero predictions, and their
medians are undefined rather than zero. All 10,000 paired-bootstrap replicates
are explicitly undefined because no paired event lead exists.

The thresholds follow the prospective ranking and final conservative tie-break
after all event-dependent criteria are undefined/equal: lower R threshold and
higher V threshold. No definition or code was changed after observing this.

## Timestep sensitivity

Seven matched deterministic paths were compared at `dt=0.01` and `0.005` using
the primary-selected thresholds. Sensitivity persistence uses 19 warning/alarm
states (18 intervals, 0.09 span) and 41 event states (40 intervals, 0.2 span).
Both timesteps have zero event, R-actionable, and V-actionable classifications;
maximum classification-rate change is 0. Lead change remains undefined because
no lead exists.

Stochastic timestep sensitivity is
`NOT_COMPARABLE_OWNER_REVIEW_REQUIRED`: coupled Brownian increments cannot be
introduced without changing the frozen raw-simulator contract. No unregistered
workaround was used.

These development observations neither confirm nor refute the held-out
hypothesis. Only separately authorized sealed evaluation can produce the
scientific outcome.
