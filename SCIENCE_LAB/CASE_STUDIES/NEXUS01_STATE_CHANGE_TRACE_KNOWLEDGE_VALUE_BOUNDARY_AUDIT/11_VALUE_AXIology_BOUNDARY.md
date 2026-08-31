# Value / Axiology Boundary

## Required split

```text
MeasurementValue(voltage=0.95 V) ≠ NormativeValue(good/bad/safe/preferred)
fact ≠ preference
evidence ≠ goal
knowledge claim ≠ decision
decision ≠ physical truth
```

A measurement becomes decision-relevant only through a separately registered
criterion. Example:

```text
measurement: voltage = 0.95 V
policy: PASS when calibrated voltage >= 0.90 V in declared conditions
authority: registered owner/standard
decision result: PASS under that policy
```

The result says the measurement satisfies the policy. It does not make `0.95`
intrinsically good, prove the system safe outside the policy scope, or change the
physical state.

Without criterion, scope and authority, the system may retain the measurement
but must not issue a normative classification.

`NORMATIVE_CRITERION_STATUS=COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT`
