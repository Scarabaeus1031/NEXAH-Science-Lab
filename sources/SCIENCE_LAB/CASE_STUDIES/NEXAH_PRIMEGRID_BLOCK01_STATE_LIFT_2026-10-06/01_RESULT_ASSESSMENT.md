# PRIMEGRID BLOCK 1 — Result assessment

Date: `2026-10-06`

Decision: `SUPPORTED_AS_BINARY_STATE_LIFT_GENERATOR`

## Result

The locked implementation passed all nine preregistered gates.

```text
development: Q1..Q5
state counts: 2, 4, 8, 16, 32
edge counts:  1, 4, 12, 32, 80
holdout Q8:   256 states, 1024 edges, degree 8
unit tests:   8/8 PASS
gates:        9/9 PASS
```

The address mapping is bijective, every lift creates two disjoint child layers,
projection has exactly two children per parent, every carrier is regular and
bipartite, and the binary-reflected Gray traversal forms a Hamiltonian cycle.
Two complete executions were byte-identical.

## Interpretation

The precise continuation is supported:

```text
one independent binary coordinate -> factor 2
three independent binary coordinates -> 2^3 = 8 states
four independent binary coordinates -> 2^4 = 16 states
```

This validates a reusable finite carrier and address generator. It does not yet
validate Fourier shift recovery, prime placement, a coding advantage or error
correction. Those require separately locked blocks and matched controls.

## Next admissible block

`PRIMEGRID BLOCK 2` may freeze a subset of these generated carriers and test
the DFT shift theorem, magnitude collision, phase-address recovery and inverse
return. It must consume the Block 1 carrier contract without changing it.

## Claim ceiling

The result is standard finite hypercube combinatorics implemented and replayed
as a bounded NEXAH laboratory fixture. It is not evidence for a physical
higher-dimensional space, optical mechanism, QR decoder or Primegrid coding
gain.

