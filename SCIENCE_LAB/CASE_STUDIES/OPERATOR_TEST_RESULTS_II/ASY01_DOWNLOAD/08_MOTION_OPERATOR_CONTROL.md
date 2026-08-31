# 08 — Motion-Operator Control

For every unforced test object define `S(t)=S(0)`. Then position and orientation
are constant, velocity is zero and the trajectory is a single fixed state.
This includes the asymmetric and chiral objects.

Now define an independent translation operator

```text
M_delta(x)=x+(1,0).
```

Applying M to S0 or S1 moves either object by the same displacement. The motion
comes from M, not from symmetry or asymmetry. A separate fixed-angle rotation
operator would likewise change orientation only when applied.

The critical counterexample therefore holds:

```text
S1 has identifiable orientation
S1 has no dynamic operator
S1 has zero motion
```

So `ASYMMETRY→ORIENTATION` is supported in this model, while
`ASYMMETRY→MOTION` is falsified.
