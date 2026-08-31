# Reflection Control

Let reflection across a line with unit normal `n` and offset `c` be

```text
T(x)=x-2((n dot x)-c)n.
```

Set `A'=T(A)`, `B'=T(B)`, `P'=T(P)`, and carry every line and segment by `T` from embedding `E1` to `E2`.

The linear part `Q=I-2nn^T` is orthogonal:

```text
Q^T Q=I, det(Q)=-1.
```

Therefore for displacement vectors `u,v`:

```text
|Qu|=|u|
(Qu) dot (Qv)=u dot v.
```

Distance and unsigned angle magnitude are preserved. Bijectivity preserves incidence, and images of parallel/perpendicular directions remain parallel/perpendicular. The negative determinant reverses orientation/handedness and the sign of oriented angles.

Thus:

```text
|a'|=|a|, |b'|=|b|, |y'|=|y|.
```

`REFLECTION_PRESERVES_INCIDENCE=YES`

`REFLECTION_PRESERVES_PARALLELISM=YES`

`REFLECTION_PRESERVES_PERPENDICULARITY=YES`

`REFLECTION_PRESERVES_DISTANCE=YES`

`REFLECTION_PRESERVES_UNSIGNED_ANGLE=YES`

`REFLECTION_PRESERVES_ORIENTATION=NO`
