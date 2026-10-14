# SCC-003 — Pascal–Pentagon 106-node quotient

Date: `2026-10-10`

Status: `POTENTIAL_COMBINATORIAL_CONSTRUCTION_CANDIDATE / EXTERNAL_REVIEW_OWNER_AUTHORIZED / AWAITING_NAMED_REVIEWER / NOT_ACTIVE`

Reused evidence identity: `A0OE:PASCAL_PENTAGON_D5_TEST`

## Candidate contribution

A finite binomially weighted pentagonal face complex obtained by cyclically
gluing five depth-six Pascal carriers. The open construction has node counts

```text
28 -> 49 -> 70 -> 91 -> 112
```

and the declared cyclic seam closure identifies six non-apex nodes to produce
a connected 106-node quotient admitting the tested `C5` rotations and `D5`
reflection action.

The same finite carrier has separately tested representations as a regular
metric pentagon, a ten-face pentagonal bipyramid with exact 106-node
hemisphere projection, and the standard root completion `H2 direct-sum A1`.
Those representations contextualize the construction; they are not separate
novelty claims.

## What is established now

- PENT-01 through PENT-07 are bounded finite replay records.
- The 106-node quotient, seam rule, connectivity and `D5` action are explicit.
- The open-to-closed sequence `28,49,70,91,112 -> 106` is reproducible.
- Metric, 3D-lift, root-completion and C5/C6 phase-cover claims retain their
  separate carrier and non-identity boundaries.
- The Core explorer is a view over these records, not PENT-08.
- The implementation-independent specification now defines `P_6`, the open
  complexes, cyclic seam quotient, weights, directed adjacency, facewise
  recurrence and typed `D_5` action.
- A deterministic reference package exports the 106 nodes, 180 directed
  edges, weights, seam classes, face incidences, adjacency matrix, graph6
  serialization, typed automorphism permutations, expected metrics and
  SHA-256 manifest.
- Its separate union-find verifier reconstructs the quotient without importing
  the generator and passes `177/177` checks. Graph6 is retained as a declared-
  order serialization, not overstated as a canonical-label certificate for
  arbitrary untyped relabelings.

Reference package:

- [`SCC_003_REFERENCE`](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/SCC_003_REFERENCE/README.md>)

External review packet:

- [`SCC003-ERP-2026-10-13`](../../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/56_SCC_003_EXTERNAL_REVIEW_PACKET_2026-10-13/README.md) — Owner-authorized, frozen and validated; not sent, not public, recipient pending.

## Systematic bounded prior-art result

The frozen 2026-10-10 protocol has been executed against accessible primary
sources. Its controlled result is:

```text
CLOSE_BASELINE_FOUND_NO_EQUIVALENCE_ESTABLISHED
SEARCH_INCOMPLETE_ACCESS_OR_COVERAGE_LIMIT
```

The strongest located baseline is the Hilton–Pedersen Pascal-Hexagon line:
ordinary binomial values are extended across six triangular sextants and
cross-sector patterns are studied. Quint's infinite Pascal graph is the
closest literal graph-joining baseline: two parity-derived triangular graphs
are joined at their apex vertices. Neither source supplies five finite
depth-six copies, complete side-chain gluing, the declared cyclic seam
equivalence, or the `112 -> 106` quotient.

The audit also compared binary Pascal/Steinhaus symmetry, Pascal divisibility
networks, Pascal hyper-pyramids and generic quotient-polynomial graphs. No
inspected source passed all five controlling-predecessor features. This is not
proof of worldwide novelty: MathSciNet and zbMATH could not be preserved as
complete result exports in the present environment, and no independent
reviewer has repeated the search.

Useful starting references:

- <https://doi.org/10.3390/math8020254>
- <https://doi.org/10.1016/S0166-218X(00)00211-0>
- <https://doi.org/10.1016/j.laa.2015.09.053>
- <https://arxiv.org/abs/math/0311035>
- <https://www.mi.sanu.ac.rs/vismath/hpe/hpe1.htm>
- <https://doi.org/10.1016/j.jfa.2009.01.011>

Full frozen protocol, comparison table and audit:

- [SCC-003 prior-art audit](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/SCC_003_REFERENCE/PRIOR_ART_AUDIT_2026-10-10.md>)

## Precise novelty candidate

> A cyclic five-face quotient of depth-six binomially weighted Pascal
> carriers with explicit `D5` automorphisms and an open-to-closed node sequence
> `28,49,70,91,112 -> 106`.

This sentence is a candidate contribution statement, not a priority,
publication or discovery claim.

## Completed preparation gates

These completions organize and verify the existing bounded construction. They
do not activate the candidate or promote its novelty status.

1. compact implementation-independent definition;
2. proofs of the fixed depth-six node counts, seam closure, connectivity,
   facewise recurrence preservation and exact typed `D_5` action;
3. canonical adjacency/weight/incidence data, declared-order graph6
   serialization, SHA-256 manifest and independent union-find verifier.
4. narrow source-bound paper draft and separate A0 Paper View that compact the
   construction, proofs, reproducibility object, contextual representations,
   bounded literature comparison and claim ceiling without changing the
   evidence identity.

Paper surfaces:

- [source paper draft](../../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/25_A0_SCC_003_PASCAL_PENTAGON_PAPER_DRAFT_2026-10-10.md)
- [A0 Paper View](../../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/A0_BOOK/A0_SCC_003_PASCAL_PENTAGON_PAPER.html)

## Remaining gates

1. name a qualified independent reviewer and transmit the frozen packet;
2. complete independent mathematical and literature review, including direct
   MathSciNet/zbMATH coverage where available;
3. Human Owner decision, after review, on whether the existing internal note
   should remain internal, be revised as a technical note or enter a separate
   submission/publication workflow.

## Stop and downgrade rule

An equivalent published construction stops the novelty lane. The record may
remain useful as an independent derivation, reproducibility object, teaching
fixture or NEXAH integration example. Failure of a replay, count, symmetry or
projection check returns the candidate to the owning PENT record and blocks
any novelty wording.

## Authority and activation boundary

This candidate reuses the existing Core evidence and Navigator node. The Human
Owner authorized the bounded external-review lane on 2026-10-13. That decision
creates no new Family, experiment, PENT test, active Lab cycle, publication
authorization or canonical mathematical theorem. Source and result authority
remain in the PENT-01–PENT-07 packages.

