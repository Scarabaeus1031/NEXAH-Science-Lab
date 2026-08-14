# Chain Composition Rules

Edges may form a path when the upstream target type/artifact is compatible with the downstream source and all context inputs are declared. A composite record cites ordered component IDs and retains their provenance.

Composition does not automatically compose scientific claims:

- Loss can accumulate, interact, or become irrelevant to a later task; it is not assumed additive.
- A later representation cannot recover information absent from its immediate predecessor unless it consumes an additional source, prior, or side channel. Such input must be explicit.
- Uncertainty propagation is `UNKNOWN` unless an operator-specific rule or evidence supports it.
- Exact preservation is transitive only for the same defined relation under compatible assumptions.
- Provenance composes as an ordered trace; one unknown component makes end-to-end reproducibility partial.

For the legacy path, the partition step also consumes grid coordinates and the field shape, so it is not a pure feature-set-only transformation. The ledger exposes this context rather than drawing a deceptively simple arrow.

`CHAIN_COMPOSITION_REPRESENTABLE = YES`, while automatic preservation/loss/uncertainty inference remains postponed.

