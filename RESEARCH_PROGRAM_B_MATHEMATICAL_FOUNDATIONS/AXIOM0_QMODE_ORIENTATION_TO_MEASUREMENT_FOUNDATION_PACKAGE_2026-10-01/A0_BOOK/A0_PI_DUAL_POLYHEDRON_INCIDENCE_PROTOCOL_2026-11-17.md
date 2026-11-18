# A0 PI dual-polyhedron incidence protocol

Date: 2026-11-17
Scope: bounded mathematical audit of the existing Platinum–Iridium PI Lens
Source: `A0_PLATINUM_IRIDIUM_PI_LENS.html` and `a0-platinum-iridium-pi-lens.js`

## Question

Do the two displayed shells form a combinatorial dual-polyhedron pair, or are
they two scaled copies of the same polyhedron?

## Frozen input

The audit reads the exported `INNER`, `SHELL_EDGES`, `scalePoints` and
`edgeIndex` values from the existing PI Lens module. It does not alter source
geometry, indexing, layer roles or the visible instrument.

## Acceptance criteria

For closed convex polyhedral boundary graphs A and B to be combinatorial
duals, the audit requires all of the following:

1. `V(A) = F(B)` and `F(A) = V(B)`;
2. `E(A) = E(B)`;
3. the vertex-degree multiset of A equals the face-size multiset of B, and
   conversely;
4. a reference construction made from A's face-incidence graph passes the
   same checks.

The audit also tests whether B is merely a homothetic copy of A by fitting the
single declared scale factor to identically indexed vertices.

## Outcomes

- `PASS_COMBINATORIAL_DUAL`: all source-pair criteria pass.
- `VALIDATED_NEGATIVE_RESULT_NOT_COMBINATORIAL_DUAL`: the source pair fails,
  while the independently constructed incidence-dual control passes.
- `INCONCLUSIVE`: the graph or face reconstruction is not sufficient to run
  the test.

## Claim boundary

“Dual Polyhedron” remains a historical/view label unless this incidence test
passes. A negative result does not invalidate the PI Lens as a two-shell,
inner/outer, phase or display instrument. It only rejects the stronger claim
that the two current shell meshes are mutually dual polyhedra.

No new Navigator identity, relation, study activation, finding promotion or
publication authorization is created by this audit.
