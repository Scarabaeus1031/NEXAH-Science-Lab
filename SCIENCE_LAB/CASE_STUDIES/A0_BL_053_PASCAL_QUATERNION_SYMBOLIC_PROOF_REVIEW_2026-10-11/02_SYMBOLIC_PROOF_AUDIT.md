# A0-BL-053 — Symbolic proof and adversarial audit

Date: `2026-10-11`

Status: `INTERNAL_PROOF_COMPLETE / N0_SUBGROUP_QUALIFIER_REQUIRED`

## Definitions

Let

```text
P_N = {(a,b,c) in Z^3_>=0 : a+b+c <= N}
Phi(a,b,c) = (a+b+c)1 + ai + bj + ck
u = (1+i+j+k)/2.
```

Write `Ad_u(q)=uqu^-1`. Because `u` is a unit quaternion,
`u^-1=conj(u)=(1-i-j-k)/2`.

## P1 — Injectivity

If `Phi(a,b,c)=Phi(a',b',c')`, equality of the `i`, `j` and `k`
coefficients gives

```text
a=a', b=b', c=c'.
```

Therefore `Phi` is injective on `R^3`, hence on every `P_N`. The scalar
coordinate is redundant for injectivity; it records depth rather than rescuing
collisions.

## P2 — Scalar depth

By definition,

```text
scalar(Phi(a,b,c)) = a+b+c.
```

Because `P_N` contains every depth up to `N`, the scalar slot records the local
depth, not necessarily the outer bound `N`.

## P3 — Exact C3 basis action

Direct quaternion multiplication gives

```text
Ad_u(i)=j,
Ad_u(j)=k,
Ad_u(k)=i,
Ad_u(1)=1.
```

Thus

```text
Ad_u(Phi(a,b,c))
 = (a+b+c)1 + ci + aj + bk
 = Phi(c,a,b).
```

The opposite cycle `(a,b,c)->(b,c,a)` belongs to `Ad_{u^-1}`, not `Ad_u`.
The registered mutation control correctly rejects it for `Ad_u`.

## P4 — Order and inverse Return

Exact multiplication gives

```text
u^2 = (-1+i+j+k)/2,
u^3 = -1.
```

Although `u` has quaternion order six, conjugation by the central quaternion
`-1` is the identity. Hence `Ad_u` has order three:

```text
Ad_u^3 = Ad_{u^3} = Ad_{-1} = id.
```

Associativity and `u^-1 u=1` also give

```text
Ad_{u^-1}(Ad_u(q)) = q
```

for every quaternion `q`, not merely for embedded Pascal states.

## P5 — Reflection boundary

Coordinate permutations preserve nonnegativity, total depth, the multinomial
weight `d!/(a!b!c!)` at depth `d=a+b+c`, and the coordinate-edge relation.

The three transpositions are permutation matrices with determinant `-1`.
Conjugation by a unit quaternion restricts on the imaginary subspace to an
element of `SO(3)`, hence determinant `+1`. No unit-quaternion inner rotation
can equal a transposition as an ambient linear map on `R^3`.

For `N>=1`, `P_N` contains `0,e1,e2,e3`; agreement on the carrier would force
agreement on the three basis vectors and therefore the impossible determinant
`-1` matrix. Thus no transposition is realized by an inner rotation on the
restricted carrier for `N>=1`.

## P6 — Subgroup classification and the N=0 qualifier

The even coordinate permutations are `{id,(123),(132)}`. They are realized by
`Ad_1`, `Ad_u` and `Ad_{u^2}`. For `N>=1`, the coordinate action is faithful,
and the realized permutation subgroup is exactly

```text
A3 = C3.
```

For `N=0`, however, `P_0={(0,0,0)}`. Every coordinate permutation restricts
to the same identity map on that singleton. Therefore the phrase “the
restricted realized subgroup is exactly C3” is not identifiable at `N=0`.
The ambient linear classification remains `A3=C3`; the faithful carrier-action
classification requires `N>=1`.

This is a genuine statement qualifier, not a counterexample to injectivity,
equivariance or Return.

## P7 — Claim ceiling

`Phi` is an injective linear representation of coordinate data. Nothing above
makes it a homomorphism from a Pascal multiplication algebra, derives Pascal
coefficients from quaternion multiplication, introduces a fifth quaternion
component, identifies scalar `Q_432` with conjugation, or supplies historical
or physical causation.

## Adversarial verdict

P1–P5 and P7 are proved at their declared scope. P6 is proved after separating
the ambient classification from the degenerate restricted action at `N=0`.
The correct frozen decision class is therefore `QUALIFIED_GENERALIZATION`:
the connector theorem generalizes to all `N>=0`, while the faithful subgroup
wording requires `N>=1`.
