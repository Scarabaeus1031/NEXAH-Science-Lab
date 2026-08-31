# 04 — Identity / Orientation Controls

## Same object, different orientation

Let R be an in-place rigid rotation that changes only `ORIENT`:

```text
ID(X0)=ID(R(X0))
OBS_spec(X0)=OBS_spec(R(X0))
ORIENT(X0)≠ORIENT(R(X0))
PROV(X0)=PROV(R(X0))
GEN(X0)=GEN(R(X0))
```

## Different objects, same orientation

Choose distinct instance IDs X1 and X2 and set both marker angles to 90°.
Then `ORIENT(X1)=ORIENT(X2)` while `ID(X1)≠ID(X2)`.

## Same identity, changed observable state

Predeclare in-place update U to change one observable field without creating a
new instance. Then `ID(X)=ID(U(X))` and `OBS(X)≠OBS(U(X))`. This is a formal
convention, not a claim about every real transformation.

These controls preserve ASY-01: orientation information remains distinct from
identity and motion.
