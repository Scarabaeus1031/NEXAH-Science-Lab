# Downstream Decision Loss

## Action

For each held-out system, choose one:

- `USE_i`: deploy stage `i` for the frozen binary task;
- `USE_SOURCE`: retain expensive source representation;
- `REMEASURE`: acquire a fixed additional trajectory batch;
- `REJECT`: decline deployment;
- `UNKNOWN`: routed identically to `REMEASURE` for cost.

## External truth and loss

Let `adequate(i)` mean sealed population risk `R_i <= tau`. A candidate loss:

```text
L(USE_i) = storage_cost(i)
           + C_unsafe * 1[not adequate(i)]
           + C_error * R_i
L(USE_SOURCE) = source_cost + C_error * R_0
L(REMEASURE/UNKNOWN) = measurement_cost + optimal_post_measurement_cost
L(REJECT) = rejection_cost
```

All constants, `tau`, predictor class and post-measurement policy require external
justification before a v3 freeze. They cannot be chosen from NEXAH ledgers or
benchmark results. False acceptance and unnecessary rejection are separately
reported even if total loss is primary.

This loss matters operationally: it trades representation/storage cost against
unsafe task degradation and additional measurement. It is not constructed from
the diagnostic vocabulary.

Current design-audit limitation: no real application owner has supplied credible
cost ratios. Therefore the benchmark is possible in principle, but a v3 protocol
must not freeze until an external cost contract exists.

