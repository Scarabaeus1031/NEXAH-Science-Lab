# Transformation Ledger

| relation | input/output | parameters | deterministic | invertible | loss / view addition | preservation summary |
|---|---|---|---:|---:|---|---|
| F0 → F1 | scalar matrix → heatmap raster | extent `[-π,π]×[-1,1]`, color map, raster size; mask contour | yes | no from PNG | numeric precision discarded; color, axes, and mask styling introduced | domain orientation, sign partition and zero structure recoverable with code/legend |
| F0 → F2 | scalar matrix → perspective surface raster | `rstride=cstride=6`, camera/default projection, shading | yes under environment | no from PNG | sampling/rendering and depth projection discard exact array; perspective/shading introduced | coordinate/value relation represented as x/y/z height |
| F1 ↔ F2 | heatmap ↔ surface | via shared F0 source, not direct image transform | yes through F0 | no image-to-image | mask exists only in F1; height only in F2 | same underlying scalar object; encoding changes by declared rule |
| T0 → T1 | CSV → timeline image | unknown | unresolved | no | raster loses exact values | `TRANSFORMATION_STATUS=UNDERDEFINED` |
| integer x → G0 grid cell | identity/index → `(row,col)` | width 20; `row=(x-1)//20`, `col=(x-1)%20` | yes | yes with width/domain | none before rendering | identity/order reconstructable |
| G0 grid → audit graph | cells → nodes; four-neighbour cells → edges | explicitly declared in CRIP-01 | yes | conditional on stored coordinates | row/column geometry lost if coordinates omitted | `AUDIT_RECONSTRUCTION_NOT_HISTORICAL_MAPPING` |
| audit graph → polar view | node order → angle; fixed radius | row-major order, `θ=2πj/n`, `r=1` | yes | conditional on IDs/order | metric/adjacency not encoded by proximity | `AUDIT_RECONSTRUCTION_NOT_HISTORICAL_MAPPING` |
| M0 SVG → PNG | vector → raster | command absent | underdefined | no | vector primitives and exact text geometry lost | same-object lineage conditional |

No transformation is inferred for C0, P0, the unrecovered T/G/Q object, the D-node candidate, or the yellow/purple candidate.
