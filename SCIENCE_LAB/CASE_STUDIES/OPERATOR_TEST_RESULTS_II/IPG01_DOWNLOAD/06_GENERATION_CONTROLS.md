# 06 — Generation Controls

## Defined chain

For `O→S→I1`, generation is derivation depth:

```text
generation(O)=0
generation(S)=1
generation(I1)=2
```

## Order without generation

For A, B, C with only `time(A)<time(B)<time(C)` and no derivation edges,
generation is unassigned. Temporal succession does not establish `G0→G1→G2`.

## Generation without visible change

Let `X0→X1` be an explicit derivation edge and let all tested observable fields
be identical. Then `X0 != X1` by unique identity and
`generation(X1)=generation(X0)+1`. Visible change is not required.

## Copy versus transform

- `COPY(x)` creates a new instance ID and provenance child while preserving all
  tested specification fields.
- `TRANSFORM_f(x)` creates a new instance ID and provenance child while changing
  at least one registered field.

Both create a new provenance position and generation. Only TRANSFORM changes
the declared observable specification state.
