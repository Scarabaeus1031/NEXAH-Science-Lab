# A0 Ullinium Closing Receipt — frozen engineering preregistration

Date: `2026-11-11`
Status: `FROZEN BOUNDED ENGINEERING VERIFICATION / NOT A LAB RUN`

## Question

Does an explicitly retained layer-and-seam receipt permit exact reconstruction
of two labelled six-cycles from their shared-edge display composite, and does it
outperform two declared negative controls?

## Frozen object and selector

- Source object: two labelled copies of `C6`.
- Selector: identify exactly one edge, including its two endpoint occurrences.
- Display: `12` source vertex occurrences become `10` displayed vertices;
  `12` source edge occurrences become `11` displayed edges.
- Trial randomization: display-vertex permutation, source-layer swap, independent
  rotation and reflection of both source cycles.
- Seed: `20261111`.
- Population: `10,000` trials.

## Conditions

1. `FULL_RECEIPT`: layer membership, local occurrence index and seam-preimage
   map are retained.
2. `NO_TAGS`: only the anonymous composite graph is retained. The decoder uses
   a fixed lexicographic cycle decomposition; it may not consult the source.
3. `WRONG_SEAM`: the receipt is present but one source occurrence is bound to a
   declared non-source position.
4. `PHANTOM_REMOVE`: a separately tagged closure edge is added to a random
   six-vertex open path and then removed.

## Metrics and frozen gates

- Exact labelled reconstruction rate over all 12 source occurrences.
- Full-receipt advantage over `NO_TAGS`.
- Exact open-path return after removal of the tagged phantom edge.

The bounded contract passes only if:

- `FULL_RECEIPT = 1.0000`;
- `PHANTOM_REMOVE = 1.0000`;
- `NO_TAGS ≤ 0.0100`;
- `WRONG_SEAM = 0.0000`;
- `FULL_RECEIPT − NO_TAGS ≥ 0.9800`.

## Falsifier and outcomes

The proposed receipt advantage is falsified if any gate fails. Allowed outcomes
are `PASS_BOUNDED_INFORMATION_RETURN`, `FALSIFIED`, or `INVALID_RUN`.

## Claim ceiling

This benchmark tests information retained by a declared graph encoding. It does
not test physical fusion, resonance, geometry in nature, a LEE mechanism, or
Ullinium as a scientific theory. It creates no Study, Finding, Navigator
identity, relation, paper result or publication authority.
