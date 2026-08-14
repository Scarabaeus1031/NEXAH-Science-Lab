# Candidate Translation Invariants

## Admitted candidates

| ID | Relation | Forced by definitions? | Test status before execution |
|---|---|---|---|
| H1 | Unlabeled directed transition-support graph is isomorphic for scalar and nonlinear injective representations of the same trajectory | No. Per-feature normalization, window flattening and KMeans can change partitions | POTENTIALLY_NONTRIVIAL; test |
| H2 | Same support topology is preserved under a one-step delay representation | No. Delay changes dimension, metric and boundary windows | POTENTIALLY_NONTRIVIAL; test |
| H3 | Weak articulation count and SCC/WCC size patterns are preserved across faithful representations | No; depends on H1 and can survive even when full graphs differ | CROSS_REPRESENTATION_TEST |
| H4 | Ordering/multiset of empirical transition probabilities is preserved across nonlinear/delay representations | No. Occupancy and boundary assignments can change | CROSS_REPRESENTATION_TEST |
| H5 | H1/H3 survive small seeded observational noise | No | adversarial empirical-stability test |
| H6 | H1/H3 survive factor-two sampling coarsening | No | adversarial sampling test |
| C1 | A deliberately lossy `x→x²` projection may destroy support topology or structural summaries | Not guaranteed either way; loss of sign makes failure plausible | falsification control, not candidate invariant |
| C2 | A true sequence change introducing an A→C jump changes at least one transition-graph relation | Not guaranteed because clustering/windowing may absorb it | structural responsiveness control |

## Excluded as novelty

- Affine translation/positive scaling under the adapter's per-feature
  normalization is a known preprocessing property and only a software control.
- Cluster-label equality is meaningless because IDs are local to each fit.
- Transition edges faithfully reflecting adjacent internal labels is true by
  construction.
- Graph reachability after a declared edge list is ingested is computed from
  that same edge list and is not cross-representation discovery.

## Correspondence rule

Representations are compared as **unlabeled directed graphs**. The certificate
minimizes the binary adjacency matrix over every node permutation (three local
clusters), including self-loops. Weighted comparison analogously minimizes a
rounded probability matrix. Additional label-free summaries are SCC/WCC size
multisets, weak articulation count, all-pairs finite-distance multiset and
sorted transition-probability multiset.

No source-state-to-cluster location claim is possible because the public v0.7
result does not expose the label sequence or cluster centers. Consequently
"bottleneck location" is NOT_IDENTIFIABLE; only label-free bottleneck count can
be compared.
