# Representation Registry

| ID | Serialized content | Dimensions / identity | Explicitly lost downstream |
|---|---|---|---|
| R0 `SOURCE_FIELD` | `x`, `y`, full `Z`, formula, normalization, seeds | `201x201`, row-major SHA-256 | none at R0 |
| R1 `DERIVATIVES` | full `dx,dy,dxx,dyy,dxy` rasters | five `201x201` arrays, source grid indices unchanged | field offset and direct source values |
| R2 `CRITICAL_CANDIDATES` | row, column, coordinates, ID, class, gradient norm, derivatives, Hessian eigenvalues, threshold margin | variable records linked to R0 indices | all noncandidates and most field geometry |
| R3 `NEAREST_SEED_PARTITION` | full integer/ID raster plus cell→seed mapping | `201x201` | values, gradients, boundary metric except raster geometry |
| R4 `REGION_ADJACENCY_GRAPH` | sorted nodes, node→seed map, sorted edges, boundary counts | variable graph | cell membership, boundary location, field/derivative values; binary variant also loses boundary counts |

R3 is never called an attraction basin. R4 edges mean spatial region contact,
never dynamical transition. All representations are synthetic software objects.

Recoverability expectations: R0→R1, R1→R2, R2→R3 and R3→binary-R4 are
generally non-injective and non-invertible. Exact source correspondence is
preserved as metadata where applicable, not inferred from representation values.

