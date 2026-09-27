# KAPPA-02 limitations and claim boundary

## Design limits

1. Before and After are separate recordings. Pairing by normalized ordinal position is descriptive alignment, not physical sample synchronization.
2. Adjacent Hann windows overlap strongly, so the 260 ordinal observations are not 260 independent replicates.
3. The audit uses one existing run per condition/period; it cannot estimate between-run reproducibility.
4. Frequency and displacement amplitude are confounded: 0.5 Hz occurs with 20 mm and 1.0 Hz with 40 mm.
5. A within-run trend can reflect settling, warming, controller behavior, material conditioning, boundary changes, or measurement drift. The current data do not identify which mechanism is responsible.
6. The analysis is post-hoc exploratory even though its estimator and classification rule were frozen before accepting empirical output.

## Allowed claims

- The relative phase is highly stable at the cycle-aggregate level in the earlier PHX audit.
- A small, consistent After-minus-Before mean shift is present in those recordings.
- KAPPA-02 reveals that the shift has ordinal within-run structure and usually relaxes toward zero.
- Janus reversal is an algebraic sign-control and passes exactly.

## Disallowed claims

- The earthquake campaign caused the observed path.
- The path is a universal relaxation law.
- The two acquisition conditions isolate frequency or amplitude effects.
- Decimal digits, digit blocks, primes, palindromes, modulo classes, named constants, or symbolic handles explain the physical result.
- Statistical significance of overlapping windows can be interpreted as independent replication.

## What would strengthen the evidence

- Multiple independent runs per condition and period.
- Shared-clock acquisition and synchronized channels.
- Randomized/counterbalanced run order.
- Independent manipulation of frequency and amplitude.
- Environmental and controller telemetry.
- A preregistered hierarchical model with run, cycle, actuator, condition, and period effects.
- A held-out replication before any digit-based or symbolic transform is examined.

