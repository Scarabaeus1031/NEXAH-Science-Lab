# Final report — NEXAH 0.5 Half-Edge Palindrome State Operator

Date: `2026-09-28`

Classification: `VALIDATED_EVEN_BASE_HALF_EDGE_STATE_OPERATOR`

Disposition: `CLOSED_BOUNDED / FILED / NO_ACTIVATION`

## Result

All 15,540 carrier/state combinations for bases 2 through 36 passed the exact
round-trip, palindrome, reflection, normalization and invariant-sum tests.

For

```text
P(a,b,z)=a*b^2+z*b+a
R_b(z)=b-1-z
u_b(z)=(z+1/2)/b
```

the following identities hold throughout the frozen domain:

```text
digits_b(P(a,b,z)) = (a,z,a)
R_b(R_b(z)) = z
u_b(R_b(z)) = 1-u_b(z)
P(a,b,z)+P(a,b,R_b(z)) = 2*a*(b^2+1)+b*(b-1).
```

## Even versus odd bases

For every even base:

- there is no integer state at normalized coordinate 0.5;
- exactly half the states lie on either side;
- the edge lies between `b/2-1` and `b/2`;
- reflection swaps the two sides;
- the numeric midpoint of the adjacent carrier values is an integer but is not
  itself a member of the discrete carrier family.

For every odd base, the negative control found exactly one fixed center state
`z=(b-1)/2` at normalized coordinate 0.5. Therefore “0.5 is always an edge” is
false; it is specifically an even-base property.

## Lift and wrap

For every nonterminal state,

```text
P(a,b,z+1)-P(a,b,z)=b.
```

At `z=b-1`, ordinary addition by `b` leaves the carrier family. The cyclic
state operation `(z+1) mod b` instead returns to state zero. Arithmetic lift
and cyclic wrap are therefore distinct operators.

## Bound examples

Base 10, outer carrier 2:

```text
232 <-> 262
282 <-> 212
292 <-> 202
242 | 252, virtual midpoint 247
```

Base 12, outer carrier 2, values written in decimal:

```text
350 | 362, virtual midpoint 356
```

`10/12=5/6` is retained only as the cardinality ratio between digit
alphabets. It is not a state-coordinate identity.

## External half-label boundary

The Riemann critical line `Re(s)=1/2` and the coordinate expression
`X+0.5Z` are well-formed independent uses of one half. No source-bound map to
this discrete operator was supplied. Their status is
`STRUCTURAL_ANALOGY_ONLY / IDENTITY_NOT_TESTABLE`.

## Reproducibility

- preregistration SHA-256:
  `5d91f5fdb408ec5356a5aa91ada3bfd5b960f84eabb43869eaca77cd2dbbeef9`
- primary scientific hash:
  `497faac105252ae7d953e2129fdd6e040aa8ddf11d34132297f2ac2fd6c46804`
- replay scientific hash:
  `497faac105252ae7d953e2129fdd6e040aa8ddf11d34132297f2ac2fd6c46804`
- replay: `IDENTICAL`

## Boundary

This validates a finite exact representation grammar. It does not establish
physics, the Riemann hypothesis, a universal half-law, privileged decimal
semantics, navigation or a new NEXAH capability.

