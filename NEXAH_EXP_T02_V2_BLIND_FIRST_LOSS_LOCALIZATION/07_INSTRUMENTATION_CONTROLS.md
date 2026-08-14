# Instrumentation Controls

Fourteen fixed controls—two each for `T1`–`T6` and `NO_LOSS`—verify generator,
prediction-label, scorer, correspondence and output wiring. One control in each
pair uses permuted stage aliases. Additional relabel-equivalence checks verify
that alias changes alone do not count as loss.

Controls are always scored and reported, but excluded from E1–E8, hypotheses,
accuracy margins, unique-correct counts and baseline-collision witness groups.

If any method cannot process controls, or N4 fails more than one of 14 controls,
`PROTOCOL_INVALID` takes precedence. Even perfect controls cannot support H1.

```text
INSTRUMENTATION_CONTROLS_CAN_SUPPORT_H1 = NO
```

