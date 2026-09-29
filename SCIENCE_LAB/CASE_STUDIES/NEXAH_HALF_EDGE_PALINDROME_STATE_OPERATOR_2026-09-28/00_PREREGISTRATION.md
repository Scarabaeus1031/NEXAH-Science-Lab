# NEXAH 0.5 Half-Edge Palindrome State Operator — preregistration

Date: `2026-09-28`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Question

Does the proposed carrier/state grammar define an exact base-parametric
palindrome operator, with a true half-edge in even bases and a fixed center
state in odd bases?

## Frozen definitions

For bases `b=2..36`, outer carrier digit `a in {1,..,b-1}` and inner state
`z in {0,..,b-1}` define

```text
P(a,b,z) = a*b^2 + z*b + a
R_b(z)   = b-1-z
u_b(z)   = (z+1/2)/b
```

`P(a,b,z)` must have base-`b` digits `(a,z,a)`. `R_b` is a state reflection,
not decimal string reversal of the integer value.

Define side state:

```text
H_b(z)=0 if u_b(z)<1/2
       1 if u_b(z)>1/2
       CENTER if u_b(z)=1/2.
```

## Tests

### T1 — complete finite carrier round trip

Enumerate every `(a,b,z)` in the frozen domain. Require exact base-`b` digit
round trip `(a,z,a)` and palindrome reversal identity.

### T2 — reflection laws

Require for every state:

```text
R_b(R_b(z)) = z
u_b(R_b(z)) = 1-u_b(z)
P(a,b,z)+P(a,b,R_b(z)) = 2*a*(b^2+1)+b*(b-1)
```

### T3 — even-base half-edge

For every even base, require no integer fixed state, exactly `b/2` states on
each side, side toggling under reflection, adjacent edge states
`z_L=b/2-1`, `z_R=b/2`, and numeric midpoint

```text
M = (P(a,b,z_L)+P(a,b,z_R))/2.
```

Require `M` to be an integer but not a member of the carrier family for any
integer state `z`.

### T4 — odd-base negative control

For every odd base, require exactly one fixed center state `z=(b-1)/2` with
`u=1/2`. Therefore the claim “0.5 is always an edge” must fail outside even
bases.

### T5 — bounded lift versus cyclic wrap

Require `P(a,b,z+1)-P(a,b,z)=b` for `z<b-1`. At `z=b-1`, ordinary `+b` must
leave the three-digit carrier family. The separately defined cyclic operator
`C_b(z)=(z+1) mod b` must return to state zero and must not be identified with
integer addition by `b` at the boundary.

### T6 — exposed decimal and duodecimal examples

Require exactly:

```text
base 10, a=2: 232<->262, 282<->212, 292<->202,
               edge 242|252, midpoint 247
base 12, a=2: edge values 350|362 (decimal values), midpoint 356
```

Record `10/12=5/6` only as the cardinality ratio of the decimal digit alphabet
to the duodecimal digit alphabet. It is not a state-coordinate identity.

### T7 — external 0.5-label separation

Record that `Re(s)=1/2` and a coordinate expression `X+0.5Z` are mathematically
well-formed but no source-bound map to `P`, `R`, `u` or `H` is supplied.
Classification: `STRUCTURAL_ANALOGY_ONLY / IDENTITY_NOT_TESTABLE`.

## Decision

`VALIDATED_EVEN_BASE_HALF_EDGE_STATE_OPERATOR` requires T1–T6 all pass. T4
must demonstrate the odd-base boundary. T7 can never promote an external
Riemann, quantum, physical or projection claim.

No outcome establishes physics, the Riemann hypothesis, a universal 0.5 law,
or privileged decimal semantics.

## Reproducibility

Primary and clean replay execute in separate directories. Canonical sorted
compact JSON and its SHA-256 must match exactly.
