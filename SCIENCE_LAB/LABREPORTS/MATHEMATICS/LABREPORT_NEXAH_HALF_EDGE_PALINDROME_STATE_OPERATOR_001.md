# LABREPORT — NEXAH Half-Edge Palindrome State Operator 001

Date: `2026-09-28`

Status: `CLOSED`

Final class: `VALIDATED_EVEN_BASE_HALF_EDGE_STATE_OPERATOR`

## Question

Does `P(a,b,z)=a*b^2+z*b+a`, reflected by `z->b-1-z`, define an exact
palindrome-state grammar with a state-free 0.5 edge in even bases?

## Result

Yes, within the complete frozen domain of bases 2 through 36. All 15,540
carrier/state combinations passed. Reflection is involutive, sends normalized
coordinate `u` to `1-u`, preserves a constant carrier-pair sum and swaps the
two sides in every even base.

Even bases have no fixed state and place the half-edge between two adjacent
states. Odd bases have exactly one fixed center state, which is the registered
negative boundary on any universal half-edge claim. Ordinary `+b` lift and
cyclic state wrap agree only away from the terminal boundary and remain typed
as distinct operations.

The decimal examples `232<->262`, `282<->212`, `292<->202` and edge
`242|252` with virtual midpoint 247 are exact. `10/12=5/6` is only an alphabet
cardinality ratio. Riemann and coordinate-shear 0.5 labels remain unbound
structural analogies.

## Reproducibility

- scientific hash:
  `497faac105252ae7d953e2129fdd6e040aa8ddf11d34132297f2ac2fd6c46804`
- clean replay: `IDENTICAL`

Canonical evidence:

`SCIENCE_LAB/CASE_STUDIES/NEXAH_HALF_EDGE_PALINDROME_STATE_OPERATOR_2026-09-28/FINAL_REPORT.md`

## Boundary

Exact finite representation grammar only; no physical, Riemann, universal,
semantic, navigation, Core or product claim. No architecture or capability
change.
