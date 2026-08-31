# 06 — Flow Field Audit

## Required separation

- observed trajectory: recorded/simulated ordered states;
- empirical velocity: a numerical derivative inferred from samples;
- model flow field `F(x)`: a rule assigning a tangent vector at states;
- density gradient `∇ρ(x)`: derivative of a scalar density under a metric.

Thus `OBSERVED_TRAJECTORY != VECTOR_FIELD`, `EMPIRICAL_VELOCITY != MODEL_FLOW_FIELD`, and `FLOW_FIELD != DENSITY_GRADIENT`.

An autonomous model `ẋ=F(x)` makes trajectory tangents satisfy the model field for ideal solutions, but this is a model relation—not a relation between `F` and `∇ρ`. Density-gradient ascent is a special additional dynamics choice and cannot be inferred from visual alignment.

V4 shows arrows labeled as density/flow and alignment panels; this is `D`. Without generator code and arrays, neither the vector definition nor numerical comparison is attested. V3’s white line is a represented path, not a recovered vector field.

The separate archive lineage draws a gradient quiver of a static synthetic field. Its previous provenance audit explicitly notes that no supplied trajectory enters that panel. It therefore cannot validate trajectory–flow or gradient–flow alignment here.

`GRADIENT_EQUALS_FLOW=NO`  
`GRADIENT_EQUALS_TRAJECTORY=NO`  
`GRADIENT_ALIGNS_WITH_FLOW=NOT_ESTABLISHED`

