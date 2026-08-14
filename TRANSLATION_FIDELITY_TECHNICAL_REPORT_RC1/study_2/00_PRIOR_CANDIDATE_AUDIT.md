# Prior Candidate Audit

Disposition: `RESEARCH / NOT_ADOPTED`  
Prior study role: prior evidence only; its fixture is not reused.

## Integrity verification

All files listed by the prior `HASH_MANIFEST.json` match their recorded hashes.
The prior protocol bundle is
`f8080f2e96f1d7f17a230bf26ce0a24ceacfb0c3a9c03431a693d74cc7993973`;
runner `f436a19a…`; primary/replay result `69aa9f65…`. The two prior result
files were byte-identical. Canonical NEXAH was `923362e…`.

## Exact prior evidence

- **Empirical:** on one three-state plateau fixture and one v0.7 configuration,
  nonlinear-injective, one-step-delay, seeded small-noise and factor-two
  coarsened representations retained the same unlabeled support graph. SCC/WCC
  sizes, weak-articulation count and directed-distance multiset also matched.
- **Definitional/standard:** node relabeling does not change unlabeled graph
  topology. Transition edges mirror adjacent internal labels by construction.
  Affine behavior under per-feature normalization is a standard/software
  control, not novelty.
- **Software verification:** canonical-source identity checks and byte-identical
  replay established deterministic execution in the recorded environment.
- **Failed:** transition-probability values were not invariant under nonlinear,
  delay or coarsened representations. A lossy square map changed coarse
  topology and removed articulation.
- **Critical miss:** an A→C sequence shortcut left coarse support, connectivity,
  articulation and distances unchanged; only weights responded.
- **Unidentified:** public v0.7 output exposes observations and aggregate/raw
  heuristics but not cluster centers or the full label sequence. Cluster IDs are
  local. Source-space bottleneck identity was therefore not identifiable.

The prior claim is not strengthened here: it was a single-fixture
`CANDIDATE_CROSS_REPRESENTATION_INVARIANT`, not a general, physical or useful
invariant.
