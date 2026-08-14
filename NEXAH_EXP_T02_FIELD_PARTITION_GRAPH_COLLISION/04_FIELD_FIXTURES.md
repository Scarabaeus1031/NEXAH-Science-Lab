# Field Fixtures

## Primary base

```text
BASE seeds:
S0=(-1.0,-0.7)
S1=( 1.0,-0.7)
S2=( 0.0, 1.0)
Z_BASE = N(F_BASE)
```

Domain, normalization and grid are frozen in `02_FORMAL_PIPELINE.md`. Seed
coordinates lie exactly on primary and sensitivity grids.

## Paired fields

| ID | Exact construction | Intended role |
|---|---|---|
| `CF_A_AMPLITUDE` | `Z'=1.25*Z_BASE`; seeds unchanged | value/derivative magnitude changes with critical order and partition geometry preserved |
| `CF_B_GEOMETRY_GRAPH_COLLISION` | `S2` moves from `(0,1.0)` to `(0.4,1.2)`; `Z'=N(F_{S0,S1,S2'})` | field and nearest-seed boundaries change while a three-region complete adjacency is expected to persist |
| `CF_C_ADJACENCY_CHANGE` | add `S3=(0,0)`; `Z'=N(F_{S0,S1,S2,S3})` | number of critical maxima and graph adjacency change |

No alternate fixture exists. For B, the full partition must differ and canonical
binary adjacency must equal BASE. For C, four maxima must be detected and binary
adjacency must differ. Otherwise record `PRECONDITION_FAILED` and stop without
substitution.

The complete field raster, coordinate vectors, analytic formula, seed registry,
normalization scalar and SHA-256 of canonical serialized field values will be
written only during an authorized execution.

