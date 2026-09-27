# 12 — Interaction Residual / Relation Crosswalk

## Registered operator

For a declared readout functional `R` and two boundary interventions `B1` and
`B2`, the case uses

```text
Delta_12 R = R(B1 union B2) - R(B1) - R(B2) + R(0).
```

This is the mixed second finite difference of `R` over the two interventions.
Equivalently, it is the two-factor inclusion-exclusion or interaction term. It
is zero when the two boundary contributions are additive relative to the
baseline and nonzero when the joint condition cannot be reconstructed from the
two isolated conditions by that additive model.

`Delta_12` is therefore a **diagnostic of non-additivity under a declared
composition**, not an extra object and not automatically a new physical force.

## Crosswalk to the recent report family

| Prior package | What was already present | Relation to `Delta_12` | Classification |
|---|---|---|---|
| `ZERO01_DOWNLOAD/08_SHARED_BOUNDARY_CONTROL.md` | a shared boundary is counted with inclusion-exclusion | same algebraic bookkeeping family | exact formal predecessor |
| `ZERO01_DOWNLOAD/14_ZERO01_FINAL_DECISION.md` | reference -> deviation -> residual -> normalized decision | supplies the typed residual discipline, but only a first residual | methodological predecessor |
| `AREV01/.../03_GRAPH_EMBEDDING_VIEW_CHAIN.md` | graph, embedding and view are distinct; one graph can have different embedded angles | supplies the relation space in which an observable may be compared | compatible type framework, not itself an interaction residual |
| `GARC01/.../16_FINAL_GARC01_DECISION.md` | adjacency/valence can remain fixed while metric angle changes | shows that the readout `R` must name its layer | anti-collapse control |
| `OSR01/.../08_GEOMETRY_PIPELINE_VS_MEASUREMENT_PIPELINE.md` | geometry and measurement are distinct pipelines that may meet only at a typed view | requires `R` to be an observable/readout, not the boundary or graph itself | measurement typing prerequisite |
| `ETRI01/.../09_TRANSFORM_COMPOSITION.md` | ordered transformations can share a final map while retaining different histories | permits an order-specific interaction diagnostic for compositions | compatible extension; union formula not automatically valid |
| `NEXAH_LIGHT_TIME.../05_THREE_REGIME_NONIDENTITY_MODEL.md` | source, propagation boundary and receiver are distinct; latency residuals require a model | a single timing residual is not `Delta_12`; two independently controlled boundaries would be needed | analogous measurement chain only |
| `THE GLASS BOUNDARY` visual/report family | interface changes optical path; residual records measured-minus-model difference | becomes an interaction test only if `B1`, `B2`, joint condition and baseline are all measured | candidate physical application, not existing evidence |

## The geometry connection

The recent geometry reports did contain the structural ingredients, but not
the four-condition operator. They established that:

1. a relation graph `G` is not its embedding `Epsilon(G)`;
2. an embedding is not its view `Omega(Epsilon(G))`;
3. a transform may preserve graph relations while changing metric geometry;
4. a measurement readout must state which layer it observes.

The new useful step is to place a readout on that typed chain and evaluate its
mixed change. For two graph augmentations `A1` and `A2`, for example:

```text
Delta_12 R(G)
  = R(G + A1 + A2) - R(G + A1) - R(G + A2) + R(G).
```

This isolates the part of the readout that appears only when both augmentations
are present. It does **not** imply that the graph has generated a new physical
entity; the answer depends on the chosen `R`, embedding, metric and observation
map.

## Ordered-transform caution

For transforms, order can matter. The safe diagnostic is therefore

```text
Delta_(T1,T2) R(X)
  = R(T2 o T1 X) - R(T1 X) - R(T2 X) + R(X),
```

with a separate reversed-order record. If `T1` and `T2` do not commute, the
two interaction residuals need not agree. Their difference must not be hidden
inside the symmetric boundary-union notation.

## Optical meaning

For linear intensity addition, `Delta_12` should be zero apart from noise,
calibration error and model misspecification. For coherent fields,

```text
I12 = |E1 + E2|^2
    = |E1|^2 + |E2|^2 + 2 Re(E1 conjugate(E2)),
```

so the interaction residual contains the interference cross term after the
baseline convention is applied. That is a known physical mechanism. The value
of this case is the common controlled measurement grammar across boundary
types, not a claim that every nonzero `Delta_12` is interference.

## Decision

```text
INTERACTION_RESIDUAL_IS_STANDARD_MIXED_DIFFERENCE = YES
EXACT_PRIOR_FORM_IN_REPOSITORY = SHARED_BOUNDARY_INCLUSION_EXCLUSION
RECENT_GEOMETRY_REPORTS_SUPPLY_TYPED_RELATION_SPACE = YES
RECENT_GEOMETRY_REPORTS_ALREADY_MEASURED_DELTA_12 = NO
SINGLE_RESIDUAL_EQUALS_INTERACTION_RESIDUAL = NO
NONZERO_DELTA_12_IDENTIFIES_MECHANISM_BY_ITSELF = NO
USEFUL_CROSS_DOMAIN_MEASUREMENT_PATTERN = YES
NEW_MATHEMATICAL_OPERATOR = NO
NEW_PHYSICAL_DISCOVERY = NO
```

