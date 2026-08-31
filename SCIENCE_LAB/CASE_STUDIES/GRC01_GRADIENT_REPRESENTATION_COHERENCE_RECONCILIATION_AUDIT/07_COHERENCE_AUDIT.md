# 07 — Coherence Audit

## Bounded mathematical reading

If a declared score is

`C(x) = <u,v> / (||u|| ||v||)`,

then, where both norms are nonzero and one inner product is specified, it measures normalized local directional alignment (cosine similarity). This is `A` as a definition. It does not by itself measure stability, causation, reliability, identity, or transition likelihood.

An implementation must state what `u` and `v` are, the metric, sampling point/time alignment, smoothing, numerical differentiation, and the policy for `||u||=0` or `||v||=0` (undefined, masked, or explicitly regularized). An epsilon regularizer changes the quantity and must be registered.

## Repository status

V2 and V8 visibly plot a quantity labeled coherence. V4 labels a “Coherence Field alignment with flow.” Those labels and curves are `D`; no matching formula, arrays, zero-vector policy, or run record was recovered. The displayed word therefore does not establish that the normalized-alignment formula was used.

Later EXP-00 coherence is a different quantity—agreement among action rankings—and is not imported into this local vector-alignment lineage.

`COHERENCE_DEFINITION_STATUS=UNDERDEFINED_FOR_HISTORICAL_VISUALS`  
`COHERENCE_EQUALS_ALIGNMENT=CONDITIONAL_ON_EXPLICIT_FORMULA`  
`COHERENCE_EQUALS_STABILITY=NO`  
`ALIGNMENT_EQUALS_CAUSAL_COHERENCE=NO`

