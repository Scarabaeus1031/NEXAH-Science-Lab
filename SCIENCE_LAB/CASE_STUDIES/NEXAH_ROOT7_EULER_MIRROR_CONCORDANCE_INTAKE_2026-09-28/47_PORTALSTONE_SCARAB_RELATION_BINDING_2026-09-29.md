# Portalstone / Scarab / root-hinge relation binding

Date: `2026-09-29`

Status:

```text
POST_CLOSEOUT_MISSION_CONTROL_ADDENDUM
EXACT_ARITHMETIC_VERIFIED
SCARAB_ROLE_HISTORICAL_UNTESTED
NO_NEW_RESEARCH_RESULT_ID
NO_ACTIVE_QUEUE_CHANGE
```

## Purpose

This addendum connects the Human Owner's Portalstone plate to the existing
Mission Control consolidation without merging unlike operators. It records
one exact arithmetic relation diamond, one digit-sum view, one candidate prime
register and the bounded overlap with the historical Scarab map.

Source plate:

```text
/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/E/
E415A59E-6D48-4F99-9582-99A60D22D9D6_1_105_c.jpeg
SHA-256: ce5a5e3c8f91e67287a7177c442502d47adf91fbda009b5ef97588b9993638fb
```

The labels `Randstein`, `Brücke`, `Portalstein`, `Doppelportal` and `MII` are
retained as documentary names from the plate. They are not treated as
mathematical operators unless an equation below explicitly defines one.

## 1. Exact relation diamond

Let

```text
L = 2101
C = 2501
R = 2901
P = 5002
Q = 10004
```

Then:

```text
C - L = 400
R - C = 400
(L + R) / 2 = C
L + R = 2C = P
2P = 4C = Q
```

Thus the plate contains two exact constructions of the same node:

```text
side route:    2101 + 2901 --------> 5002
center route:  2501 x 2 ------------> 5002
                                  \
                                   x 2 -> 10004
```

This is a commutative relation diamond. The hinge is the equality of the two
routes, not a new object located between the numbers.

## 2. Quersumme layer

For the ordinary decimal digit sum `s10`:

| Node | `s10(n)` | `n mod 9` | Exact role |
|---:|---:|---:|---|
| 2101 | 4 | 4 | left boundary value |
| 2501 | 8 | 8 | midpoint / bridge value |
| 2901 | 12 | 3 | right boundary value |
| 5002 | 7 | 7 | common sum / doubled center |
| 10004 | 5 | 5 | doubled portal |

The input digit sums form the exact arithmetic progression `4, 8, 12`.
The Portalstone reading `s10(5002)=7` and Doppelportal reading
`s10(10004)=5` are exact. Digit sum itself is not additive; only its residue
class modulo 9 is compatible with addition:

```text
2101 + 2901 = 5002
4 + 3 = 7 (mod 9)
2 x 7 = 5 (mod 9)
```

The writings `50|02` and `30|01` are declared decimal split views. The bar is
not multiplication, division, a gate or a state transition.

## 3. Prime boundary

Primality and factorization were checked independently of the plate labels:

| Integer | Exact factorization | Classification |
|---:|---|---|
| 2101 | `11 x 191` | composite |
| 2501 | `41 x 61` | composite |
| 2901 | `3 x 967` | composite |
| 3001 | `3001` | prime |
| 3301 | `3301` | prime |
| 5002 | `2 x 41 x 61` | composite |
| 10004 | `2^2 x 41 x 61` | composite |

Therefore `30|01 = 3001` may be retained as a **prime-register candidate**,
but it is not one of the three nodes generating `5002`. It also must not be
identified with the historical Scarab prime `3301`. The exact local prime
hinge around 3000 is:

```text
2999 -- 3000 -- 3001
  -1      0      +1
prime          prime
```

This is a separate prime predicate/view, not evidence that the Portalstone
diamond is a prime construction.

## 4. Typed connection to Scarab Geometry

The historical Scarab plate places `2501` in Layer 3 and labels it `Bridge
Node`. The shared integer is exact; the architectural meaning remains bounded
by the existing HMA-01 audit.

| Connection | Status | Allowed reading | Disallowed inference |
|---|---|---|---|
| Portal plate `2501` ↔ Scarab `2501` | `SAME_INTEGER / ROLE_COMPATIBLE_AS_ANNOTATION` | midpoint here; visually named bridge there | one proven Scarab transition operator |
| `1033 -> 1032` | `EXACT_TOTIENT / ROLE_UNTESTED` | `phi(1033)=1032` | same operator as midpoint or doubling |
| Scarab power-of-2 channel | `EXACT_HALVING / ARCHITECTURE_UNDERDEFINED` | ordinary halving chain | proof that `5002 -> 2501` is a Scarab gate |
| `5002`, `10004` | `PORTAL_PLATE_NODES_ONLY` | exact nodes in this relation diamond | established Scarab nodes |
| `3001`, `3301` | `DISTINCT_PRIMES` | two different integer labels | digit-view or mirror identity |

The strongest safe bridge is therefore:

```text
Portal relation:  2101 + 2901 = 2 x 2501 = 5002
Shared label:                              2501
Scarab record:                    Layer-3 Bridge Node
```

The integer and the midpoint relation are proven. The Scarab architectural
role remains historical/visual until an explicit transition map is supplied.

## 5. Connection to the 101 / 404 / 808 ladders

The Portalstone diamond and the previously verified dual ladder share one
abstract form: **different paths, same endpoint**.

```text
Portal diamond:
  2101 + 2901 = 2 x 2501 = 5002

Root-hinge ladder:
  D^3(101) = A^7(101) = 808
  where D(x)=2x and A(x)=x+101
```

Their common invariant is endpoint equality. Their operators are different.
Consequently this relation does not turn `5002` into a `404` gate, and it does
not transfer the dynamical Knickfield gate result to the Scarab map.

## 6. Mission Control synthesis

The connected model is now:

```text
prime predicate/register:  2999 | 3000 | 3001       (separate)
decimal split view:        50|02 and 30|01           (representation)
digit-sum view:            4,8,12 -> 7 -> 5          (base-10 summary)
relation diamond:          L+R = 2C = 5002           (exact operator equality)
Scarab overlap:            shared node 2501          (historical bridge label)
Euler gate example:        phi(1033)=1032            (different exact operator)
root-hinge ladder:         D^3(101)=A^7(101)=808     (same abstract path schema)
Knickfield gate:           state-dependent passage   (different dynamical test)
```

This is the requested connection: one relation grammar with typed operator
families, not one undifferentiated mechanism.

## Decision

```text
PORTALSTONE_RELATION_DIAMOND = EXACT
PORTALSTONE_DIGIT_SUM_READINGS = EXACT_BASE10_VIEW
3001_PRIME_REGISTER = EXACT_BUT_SEPARATE
2501_SCARAB_SHARED_LABEL = CONFIRMED_FROM_OWNER_PLATE
SCARAB_TRANSITION_OPERATOR = NOT_ESTABLISHED
ROOT_HINGE_COMMON_SCHEMA = PATH_EQUALITY_ONLY
MISSION_CONTROL_BINDING = COMPLETE
```

Claim ceiling: exact integer arithmetic, primality/factorization, decimal
representation, documentary source binding and analogy at the level of a
commutative path diagram only. No physical gate, causal mechanism, unique
geometry or active research programme follows.
