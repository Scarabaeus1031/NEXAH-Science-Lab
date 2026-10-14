# A0-BL-053 — Frozen proof and review protocol

Date: `2026-10-11`

Status: `FROZEN_BEFORE_DERIVATION_AND_EXECUTION`

## Theorem candidate

For every `N>=0`, let

```text
P_N = {(a,b,c) in Z^3_>=0 : a+b+c <= N}
Phi(a,b,c) = (a+b+c)1 + ai + bj + ck
u = (1+i+j+k)/2.
```

The review tests the conjunction:

1. `Phi` is injective on `P_N` and on `R^3`.
2. `scalar(Phi(a,b,c))=a+b+c`.
3. `Ad_u(Phi(a,b,c))=Phi(c,a,b)`.
4. `Ad_u^3=id` and `Ad_{u^-1} o Ad_u=id`.
5. Coordinate transpositions preserve `P_N`, multinomial weights and the
   coordinate-edge relation, but have determinant `-1` and are not unit-
   quaternion inner rotations.
6. Consequently the quaternion-realized coordinate-permutation subgroup is
   the proper alternating subgroup `A3=C3`, not all of `S3`.

## Obligatory objections

- Check the cycle direction; `(c,a,b)` and `(b,c,a)` must not be conflated.
- Check `u^3=-1`, not `+1`; conjugation nevertheless has order three.
- Do not infer an algebra homomorphism or quaternion generation of Pascal
  coefficients from an injective linear representation.
- Separate the all-`N` proof from finite clean-room enumeration.
- Preserve the reflection, `Q°`, scalar `Q_432`, `4²/5²`, prime-readout,
  historical and physical non-identity boundaries from A0-BL-052.

## Clean-room controls

The second implementation must use only the definitions above, import no
A0-BL-052 code and use exact rational arithmetic. It enumerates `N=0..14`,
checks all positive identities and proves that the registered opposite-cycle
mutation fails.

## Decision rule

- `INTERNAL_SYMBOLIC_PROOF_PASS`: every proof obligation is discharged, every
  objection is answered, Primary/Replay are byte-identical and the structural
  verifier passes.
- `QUALIFIED_GENERALIZATION`: the finite finding survives but at least one
  all-`N` theorem clause needs narrowing.
- `CHALLENGED_BY_COUNTEREXAMPLE`: an exact counterexample contradicts a frozen
  clause.
- `INVALID_REVIEW`: lock, replay, implementation-lineage or verifier failure.

No result counts as an external independent review.
