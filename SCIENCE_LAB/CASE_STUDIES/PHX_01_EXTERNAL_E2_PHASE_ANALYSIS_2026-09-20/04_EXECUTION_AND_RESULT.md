# PHX-01 — Execution and Result

Date: `2026-09-20`

## Execution sequence

1. `00_METHOD_FREEZE.md` and `protocol.json` were written and SHA-256 sealed.
2. The implementation passed syntax compilation.
3. The synthetic validation battery ran before the new empirical output.
4. All ten synthetic controls passed.
5. The first empirical invocation reached result construction but stopped
   before writing an empirical artifact because the implementation used the
   JavaScript literal `false` instead of Python `False` in one output field.
6. Only that literal was corrected. Syntax compilation and the complete
   synthetic battery were rerun before the empirical retry.
7. The successful empirical run was repeated; its synthetic JSON, empirical
   JSON and cycle CSV were byte-identical across the two successful runs.

No source or prior HZ/FZ result was modified.

## Synthetic validation

Classification: `PASS`

All registered controls passed their frozen thresholds:

- fixed 0, 90 and 180 degree relations;
- unequal amplitudes;
- slow drift;
- known phase jump;
- nearby-frequency beating;
- noisy phase locking;
- equal-spectrum phase-randomized surrogate;
- missing samples;
- clock jitter;
- common time translation, channel exchange and time reversal.

Selected diagnostics:

| Control | Result |
|---|---:|
| Maximum fixed-phase circular error | `3.41e-13°` |
| Slow-drift endpoint error | `0.0160°` |
| Known jump detection | exact cycle |
| Beating cycle-phase PLV | `0.6245` |
| Noisy locked PLV | `0.999708` |
| Phase-randomized band PLV | `0.01928` |
| Missing-sample phase error | `0.1497°` |
| Clock-jitter phase error | `0.000163°` |

## Baseline reproduction

Whole-record force-relative-to-displacement phases were recomputed for both
actuators in all four source files. The maximum circular difference from the
retained `SOURCE_INTAKE_RESULT.json` was exactly `0.0°`.

## Empirical result

All phase values below are force relative to the corresponding displacement.

| Pair | Actuator | Cut A mean | Cut B mean | B − A mean | 95% block-bootstrap interval | Decision |
|---|---:|---:|---:|---:|---:|---|
| 0.5 Hz / 20 mm | 1 | `5.431°` | `4.735°` | `−0.696°` | `[−0.777°, −0.638°]` | stable equivalent |
| 0.5 Hz / 20 mm | 2 | `4.880°` | `4.439°` | `−0.441°` | `[−0.488°, −0.397°]` | stable equivalent |
| 1.0 Hz / 40 mm | 1 | `5.584°` | `5.318°` | `−0.267°` | `[−0.363°, −0.188°]` | stable equivalent |
| 1.0 Hz / 40 mm | 2 | `5.393°` | `5.134°` | `−0.259°` | `[−0.370°, −0.167°]` | stable equivalent |

All eight cut-level phase-locking values exceed `0.99998`. All eight
fundamental coherence estimates exceed `0.99987`. Boundary-cycle exclusion
changes the paired mean shift by at most `0.0316°`, below the frozen `0.5°`
limit.

## Interpretation

The phase extension is empirically supported for these external E2 records.
It reveals a stable force-to-displacement lag of roughly 4.4–5.6 degrees and a
small negative before/after phase shift that frequency-only or gain-only
summaries do not encode.

The word invariant is bounded here. The relation is equivalent within the
preregistered ±2 degree engineering margin; it is not exactly unchanged. All
four bootstrap intervals exclude zero, so the small negative shift should be
retained rather than rounded away.

## Decisions

```text
PRIMARY_DECISION = A — PHASE_EXTENSION_EMPIRICALLY_SUPPORTED
RELATIVE_PHASE_INVARIANT = BOUNDED_STABILITY_SUPPORTED_NOT_EXACT_IDENTITY
ORDER_SENSITIVITY = INDETERMINATE_SOURCE_NOT_BOUND
PRIME_DECISION = P0 — NOT_TESTED / NOT_TESTABLE_FROM_THIS BOUND EVIDENCE
SAFE_TO_PROMOTE = NO
SAFE_TO_PAUSE = YES
```

