# A0-BL-052 — Frozen preregistration

Date: `2026-10-11`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Declared construction

For `(a,b,c)` in the finite trinomial carrier

```text
P_N = {(a,b,c) in Z^3_{>=0}: a+b+c <= N},  N=0..11,
```

define

```text
Phi(a,b,c) = (a+b+c)1 + ai + bj + ck.
```

The quaternion has exactly four basis slots `{1,i,j,k}`. `Q°` is a separate
controller role and is not admitted as a fifth quaternion coordinate.

## Frozen tests T1–T10

1. `T1_PHI_INJECTIVE`: `Phi` has zero collisions on every `P_N`.
2. `T2_SCALAR_DEPTH`: the scalar slot of `Phi(a,b,c)` equals `a+b+c`.
3. `T3_C3_EQUIVARIANCE`: exact conjugation by
   `u=(1+i+j+k)/2` fixes the scalar slot and maps `(a,b,c)` to `(c,a,b)`;
   three applications return exactly.
4. `T4_S3_REFLECTION_BOUNDARY`: swapping two coordinates preserves carrier,
   weights and recurrence but has determinant `-1`, so it is not an inner
   unit-quaternion rotation.
5. `T5_GENERIC_VIEW_CONTROL`: the declared `37°` turn about `(1,2,3)` is a
   valid Euclidean view but not an integer-lattice carrier automorphism for
   every nontrivial tested depth.
6. `T6_QUATERNION_RETURN`: conjugation by `u` followed by conjugation by
   `u^-1` returns every embedded point exactly.
7. `T7_Q432_RETURN`: for every declared nonzero rational scalar sample,
   `Q_432(Q_432(x))=x` where `Q_432(x)=432/x`.
8. `T8_Q_DEGREE_SEPARATION`: the quaternion-state schema accepts exactly
   `{scalar,i,j,k}` and rejects `q_degree` as a fifth component; controller
   metadata remains separately valid.
9. `T9_16_VS_25_TYPED`: the ordered quaternion basis product table has
   `4^2=16` addresses while the controller-augmented role grid has `5^2=25`;
   their typed domains are non-identical.
10. `T10_PRIME_READOUT_BOUNDARY`: the 16th and 25th primes are `53` and `97`,
    with off-by-one controls; both remain readouts and do not select or
    generate the connector.

## Decision rule

- `EXACT_FOUR_CHANNEL_CONNECTOR_PASS`: T1–T10 all pass, Primary/Replay bytes
  match and the independent verifier passes.
- `PARTIAL_PASS`: at least one positive exact test fails but the run remains
  interpretable.
- `FORMAL_NEGATIVE_RESULT`: the declared connector is contradicted by an exact
  control.
- `UNDEFINED_CONTRACT`: a required map or type cannot be evaluated.
- `INVALID_EXPERIMENT`: protocol lock, count, tolerance, replay or verifier
  failure.

## Claim ceiling

The Study can validate an explicit finite representation connector and its
typed boundaries. It cannot establish that quaternion multiplication generates
Pascal coefficients, that `Q°` is a quaternion basis element, that `4^2` and
`5^2` are one algebra, that prime indices drive the construction, that
`Q_432` is quaternion conjugation, that a historical source intended this map,
or that a physical mechanism exists.
