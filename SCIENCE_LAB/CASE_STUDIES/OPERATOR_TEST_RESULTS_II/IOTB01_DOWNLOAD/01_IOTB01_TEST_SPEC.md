# 01 — IOTB-01 Test Specification

IOTB-01 is a synthesis audit only. IPG-01, ASY-01 and ATS-01 are imported as
closed constraints and are not recalculated.

The minimal record is

```text
X=(ID, OBS, ORIENT, PROV, GEN).
```

Operators, executions, traces and derivations are separate typed objects:

```text
F: X→X'
execution e=(F,X,X')
trace τ=(e0,...,en)
derivation d: parent→child
```

No field equality is allowed to imply another field equality unless an explicit
model invariant or operator contract supplies that implication.
