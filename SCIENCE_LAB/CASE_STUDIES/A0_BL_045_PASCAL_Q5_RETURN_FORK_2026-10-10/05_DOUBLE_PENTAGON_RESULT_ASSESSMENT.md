# A0-BL-045 — Double-Pentagon Q' result assessment

Date: `2026-10-10`

Classification: `SIGNED_DOUBLE_RETURN_IDENTIFIED`

Reproducibility: `R2_LOCAL_REPLAY / PRIMARY_REPLAY_BYTE_IDENTICAL / VERIFIER_PASS`

## Exact result

The completed first run remains the local one-pentagon control:

```text
M = Q^5 = [[8,5],[5,3]],  tr(M)=11, det(M)=-1,
M00 = 8 = 2^3.
```

Ten sequential steps do not return:

```text
Q^10 = [[89,55],[55,34]],  tr(Q^10)=123, det(Q^10)=+1.
```

Two parallel copies `M direct-sum M` have trace `22` and determinant `+1`,
but contain no bridge.  Swapping two equal-direction copies returns the
pentagon label after two half-orbits while accumulating `Q^10` on each state;
therefore it is not a state return.

Let the reciprocal, signed bridge be

```text
Q'_epsilon(a,b) = (epsilon M^-1 b, M a),  epsilon in {+1,-1}.
```

Then the exact joint law is

```text
(Q'_epsilon)^2 = epsilon I.
```

| Level sign | Two half-orbits | Four half-orbits |
|---:|---|---|
| `+1` | exact oriented-state return, `+I` | exact return |
| `-1` | anti-return, `-I`; projective return only if global sign is quotiented | exact oriented-state return, `+I` |

Primary and replay results are byte-identical with SHA-256
`2fa814b742161e770501a586a477984f3cd78b0f939d36539e0c4a90dc027155`.

## Interpretation

The Owner correction is substantive: `Q^5` is the local half-orbit, not the
complete double-pentagon operator.  A valid `Q'` needs three typed pieces:

1. the local monodromy `M=Q^5`;
2. a bridge that exchanges the two pentagon state spaces;
3. an independently declared reciprocal orientation and level sign.

The exact `8=2^3` is retained as a matrix-entry fact.  It does not by itself
derive the bridge, the sign, a Pascal layer law or a physical level.

## Claim boundary

This is a conditional algebraic return theorem for the explicitly defined
operator.  It does not show that the reciprocal leg is forced by two
pentagons, by ten positions, by Pascal weights, by a Möbius image, by
archaeology or by a physical mechanism.  The map from the Pascal carrier into
the two-component state remains open.
