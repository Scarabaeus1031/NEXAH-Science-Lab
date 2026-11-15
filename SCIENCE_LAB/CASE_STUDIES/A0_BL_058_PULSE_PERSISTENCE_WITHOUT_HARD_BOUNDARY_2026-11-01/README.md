# A0-BL-058 · Pulse Persistence Without Hard Boundary

Status: `CLOSED / OWNER_ACCEPTED_BOUNDARY_LOCKED_SMOOTH_EVENT / ACTIVE_SLOT_RELEASED`

The frozen deterministic test asked whether the strongest local event remains
at one carrier time after replacing the previous hard cutoff with translated
and widened smooth logistic boundaries.

Result: `BOUNDARY_LOCKED_SMOOTH_EVENT`, with the descriptive qualifier
`PHASE_COHERENT_ONLY`.

The event follows the smooth boundary rather than remaining fixed to one
carrier time. Sampling and high-order Fourier reconstruction are stable, while
a fixed-amplitude phase control materially changes the event. This is an
analytic/synthetic classification, not evidence of physical breathing or
resonance.

The Human Owner accepted this bounded disposition on `2026-11-15`. No
successor run, publication or claim promotion follows from the closure.

## Reproduce

```bash
python3 verify_lock.py
python3 run_experiment.py --output artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
```

## Records

- [Preregistration](01_PREREGISTRATION.md)
- [Run Contract](RUN_CONTRACT.md)
- [Primary result](artifacts/PRIMARY_RESULT.json)
- [Assessment](02_RESULT_ASSESSMENT.md)
- [Result projection](artifacts/PULSE_PERSISTENCE_RESULT.svg)
- [Integration receipt](03_POST_RUN_INTEGRATION_RECEIPT.md)
- [Owner closure](06_OWNER_CLOSURE_RECORD.md)
