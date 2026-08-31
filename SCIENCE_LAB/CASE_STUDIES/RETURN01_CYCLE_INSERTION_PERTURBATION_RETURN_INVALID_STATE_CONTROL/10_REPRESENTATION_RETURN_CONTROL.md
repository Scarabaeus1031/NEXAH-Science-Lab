# Representation Return Control

Following the frozen CRIP-01 boundary, let `R` be a declared rendering or readout map.

## Same representation, different states

If `X != Y` but `R(X)=R(Y)`, the rendered output has recurred. This is R5 representational return, not state return. Lossy maps, clipping, projection and aggregation can produce this case.

## Same state, different representations

If `R1(X) != R2(X)`, the state can remain identical across different view rules. View identity is not required for state identity.

Therefore:

- `REPRESENTATION_RETURN_DISTINCT_FROM_STATE_RETURN=YES`
- `SAME_RENDERING_IMPLIES_SAME_STATE=NO`
- `STATE_IDENTITY_IMPLIES_REPRESENTATION_IDENTITY=NO`

The control preserves CRIP-01: object identity and transformation provenance must be established before an invariant or return claim is made.

