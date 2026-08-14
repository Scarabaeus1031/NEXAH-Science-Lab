# Level-1 Protocol Amendment V1.0.1

Date: 2026-08-13 (Europe/Berlin)  
Status: `FROZEN_PROSPECTIVE_CLARIFICATION / NOT_ADOPTED`  
Base protocol: `NEXAH-EARLY-WARNING-LEVEL1-SYNTHETIC` V1.0.0  
Base manifest SHA-256: `d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`

This amendment resolves the nine ambiguities recorded in
`LEVEL1B_OWNER_REVIEW_REQUIRED.md` (SHA-256
`a5547a5222fba492898cd5f1628df8b7eb2af36169ce42b369b1423992241ec9`).
Before these decisions, zero development indicator trajectories and zero
evaluation trajectories had been evaluated. The clarifications are therefore
prospective and not outcome-dependent.

## Frozen clarifications

1. At primary `dt=0.01`, R warning and V alarm require exactly 10 consecutive
   qualifying sampled states. Detection time is the first state of a sequence
   later confirmed to contain 10 states; confirmation time is its tenth state.
   A failed sequence produces no detection.
2. Event separation is strictly greater than `pi` continuously for 0.2 time
   units. At `dt=0.01`, this means 20 complete intervals and 21 qualifying
   sampled states. Event time is the first state; confirmation time is state
   21. This supersedes only the ambiguous V1.0.0 shorthand
   `primary_dt_terminal_event_samples=20`; V1.0.0 remains unchanged.
3. A detection sequence is eligible only when its first qualifying state is at
   or after stress onset. A sequence beginning before onset is discarded and
   cannot cross the boundary.
4. Calibration recall means actionable recall: a confirmed detection beginning
   at/after onset, an event, and inclusive lead in `[0.2,5.0]`. Missing or
   non-actionable detection on an event run is a false negative. A threshold
   with zero actionable detections has undefined median lead.
5. Preserve the existing calibration order. If still exactly tied, choose the
   lower R threshold and the higher V threshold.
6. Paired stratified bootstrap: 10,000 replicates; NumPy `Generator(PCG64)`;
   seed 1031; paired sampling with replacement independently within each path;
   preserve stratum sizes; 95% percentile interval at 0.025/0.975 with
   `method="linear"`; preserve and count undefined replicates.
7. Directional preservation means the sensitivity effect sign equals the
   nonzero primary effect sign. Zero does not preserve a nonzero direction.
   Apply this only where V1.0.0 already requires directionality.
8. At `dt=0.005`, preserve elapsed persistence spans: primary warning/alarm 10
   states span 9 intervals = 0.09, so sensitivity uses 18 intervals/19 states;
   the event uses 40 intervals/41 states for 0.2. Exact stochastic timestep
   coupling is `NOT_COMPARABLE / OWNER_REVIEW_REQUIRED` if it would require a
   simulator/model change. For nonzero reference median lead use relative
   change; for zero reference report undefined relative and absolute change.
9. Missing R or V detection on an event run is a false negative. Event-free
   runs remain in FPR. Precision with zero predicted positives and median lead
   over an empty set are undefined with raw counts. Undefined is never coerced
   to 0 or 1. Numerical invalidity is not an event.

## Unchanged scientific and architecture boundary

This amendment does not change the raw simulator, raw states, R or V formula,
stress paths, seeds, model parameters, Application 001, or canonical
architecture. It introduces no new metric or claim. Evaluation remains sealed.

```text
DEVELOPMENT_RESULTS_SEEN_BEFORE_AMENDMENT = NO
EVALUATION_PARTITION_OPENED = NO
EVALUATION_PERFORMANCE_INSPECTED = NO
APPLICATION_001_CHANGED = NO
```
