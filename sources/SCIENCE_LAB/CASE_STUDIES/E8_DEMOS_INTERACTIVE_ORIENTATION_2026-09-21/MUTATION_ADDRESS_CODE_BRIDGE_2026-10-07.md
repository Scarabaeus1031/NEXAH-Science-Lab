# Mutation address code bridge

Status: `EXACT_REPRESENTATION_BRIDGE / NO_CAUSAL_CLAIM`

This bridge adds an address layer to the existing mutation-family graph without
changing its adjacency matrix or local mutation operator.

## Frozen encoding

- A trit is one of `-1, 0, +1`.
- A direction bit is one of `0, 1`.
- Their product gives six states: `code6 = 2 * (trit + 1) + direction`.
- The antipode reverses both components:
  `A(trit, direction) = (-trit, 1-direction)`.
- Consequently the six codes pair as `0<->5`, `1<->4`, `2<->3`.
- A directed prime pair is an ordered address. `5->7` and `7->5` are different
  records and form an antipodal pair.
- For single-digit prime labels, the vigesimal address concatenates the two
  base-20 digits: `5->7 = 57_20 = 107_10`; its antipode is
  `7->5 = 75_20 = 145_10`.

## Carrier examples

The previously tested arithmetic carriers are shown in two coordinate systems:

| decimal | base 20 | base 6 |
|---:|---:|---:|
| 42 | `22` | `110` |
| 1032 | `2BC` | `4440` |

The surrounding gates `(41,42,43)` and `(1031,1032,1033)` both project to
`(5,6,7) mod 9`. This is an exact residue identity and not a derivation of one
gate from the other.

## Boundary

The six-state layer is a reversible representation of `trit x direction`. It
does not turn prime labels into Coxeter weights, does not alter the mutation
operator, and does not promote the quarantined `42 -> 1032` selector candidate.
The cyclic DFT result from PRIMEGRID BLOCK 3 remains a separate control.
