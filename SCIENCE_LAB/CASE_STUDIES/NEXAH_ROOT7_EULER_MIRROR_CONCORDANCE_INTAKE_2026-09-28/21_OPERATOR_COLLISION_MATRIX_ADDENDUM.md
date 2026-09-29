# 404 operator-collision matrix — addendum

Date: `2026-09-29`

Status: `17/17 PASS / SINGLE COLLISION / TYPED PATHS SEPARATE`

## Question answered

The test compared five independently typed maps on the primary arc and control
marks:

```text
A404(x)=x+404
D(x)=2x
Rev(x)=decimal reversal
J(x)=1100-x
R(x)=12320-x
```

It also recorded modulo `7`, `11`, `77`, `112`, `1232`, the `111 x 111` and
`112 x 110` addresses, decimal-palindrome status and dyadic-101 membership.

## Primary matrix

| `x` | `A404(x)` | `D(x)` | `Rev(x)` | `J(x)` | `R(x)` | mod 7 | mod 11 | mod 77 | 111-grid `(i,j)` |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| 404 | 808 | 808 | 404 | 696 | 11916 | 5 | 8 | 19 | `(71,3)` |
| 808 | 1212 | 1616 | 808 | 292 | 11512 | 3 | 5 | 38 | `(31,7)` |
| 1212 | 1616 | 2424 | 2121 | -112 | 11108 | 1 | 2 | 57 | `(102,10)` |
| 1616 | 2020 | 3232 | 6161 | -516 | 10704 | 6 | 10 | 76 | `(62,14)` |

## Collision decision

The equation

```text
A404(x)=D(x)
x+404=2x
```

has the unique integer solution `x=404`. Hence

```text
A404(404)=D(404)=808
```

is a single operator collision, not an identity of the two maps.

At the next node the paths separate:

```text
A404(808)=1212
D(808)=1616.
```

They meet again only after comparing paths of different lengths:

```text
A404^2(808)=D(808)=1616.
```

This is an endpoint agreement between a two-step additive path and a one-step
dyadic path. It does not make their internal state or trace identical.

## Exact role of 1212

```text
1212=3*404=12*101=(808+1616)/2.
```

The test confirms that `1212` is not in the pure set `{101*2^k}`. It is the
affine midpoint of the declared additive subdivision. It also leaves the
bounded `J_1100` window (`J(1212)=-112`) and is not a decimal reversal fixed
point (`Rev(1212)=2121`).

## Mirror and grid separation

`J(x)=1100-x` and the finite-grid half-turn `R(x)=12320-x` induce the same
modulo-11 inversion because both constants are divisible by 11. They remain
different integer maps, separated by the constant offset `11220`.

This is another concrete example of the rule that equality after projection
does not establish equality of the source operators.

## Gate readiness

The six historical Knickfield control points reproduce the bound truth table:

```text
(0,0)   PASS
(5,5)   PASS
(5,6)   FAIL
(6,6)   FAIL
(-4,4)  FAIL
(-3,4)  PASS
```

Thus the regulator-space gate is executable. No source-bound map from the
integer marks to `(a,b)` exists, so every integer-to-gate entry is correctly
recorded as

`NOT_EVALUABLE_WITHOUT_INDEPENDENT_SOURCE_BOUND_H`.

The accompanying preregistration shell states the minimum information needed
before this bridge may be run. No parameters were fitted to 404, 808, 1212,
1616 or 292.

## Decision

Classification:

`SINGLE_OPERATOR_COLLISION_AT_404_TYPED_PATHS_SEPARATE`

The result explains why the older visual vocabulary can make the operations
look connected: several projections and one exact value collision coincide.
But the typed maps diverge immediately afterward. This strengthens the need to
retain operator provenance in Ghostgrid/QRT records.

## Reproducibility

- checks: `17/17`;
- repetitions: `3`, byte-identical;
- scientific hash:
  `511b691bcbc3d32dfcb1e7415f2b5b00a27a0e9e236802627cb565edc5dad295`;
- result-file SHA-256:
  `0f587856b9107042f7d1245599b9e69cfc5d1e6f5d535182840a868f74385fde`.

Claim ceiling: finite arithmetic and representation taxonomy only; no SCN/NCS
switch, physical transition, historical generator, cryptographic mechanism or
M-Class promotion.
