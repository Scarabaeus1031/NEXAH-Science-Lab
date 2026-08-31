# Cross-Representation Matrix

| Object | R1 | R2 | Same object? | Transformation | Tested relation | Result | Information loss | Provenance |
|---|---|---|---|---|---|---|---|---|
| F0 scalar array | 2D heatmap F1 | 3D surface F2 | supported | shared source array; value→color / value→height | object identity | `PRESERVED` | exact values not recoverable from rasters | generator code + README |
| F0 scalar array | F1 | F2 | supported | same | zero/sign partition | `PRESERVED` at source level | visual recoverability depends on axes/legend | generator code |
| F0 scalar array | F1 | F2 | supported | color→source→height | magnitude encoding | `TRANSFORMED_BY_DECLARED_RULE` | quantization and rendering | generator code |
| coherence mask | F1 overlay | F2 | same base object, different overlay content | omitted from F2 | mask membership | `LOST` in F2 | full mask absent | generator code |
| timeline T0 | CSV | PNG T1 | conditional | underdefined plotting | sample order | `UNRESOLVED` for exact image lineage | exact numbers lost in PNG | same package/stem |
| integer/residue object G0 | table/code | 20-wide grid G1 | conditional exact run | quotient/remainder + color encoding | ID and position | `TRANSFORMED_BY_DECLARED_RULE` | raster loses exact data | source code, run unsealed |
| nine-cell audit grid | grid | audit graph | supported by audit declaration | cells→nodes; shared boundary→edge | identity/adjacency | `PRESERVED` | metric/order unless attributes retained | audit reconstruction |
| audit graph | graph | polar embedding | supported by audit declaration | row-major order→angle | identity | `PRESERVED`; adjacency `LOST` unless drawn | graph metric absent | audit reconstruction |
| C0 raster | root copy | nested copy | supported | byte copy | file content | `PRESERVED` | none | equal SHA-256 |
| M0 blueprint | SVG | PNG | conditional | rasterization underdefined | vector geometry | `UNRESOLVED` | vector structure lost | same-stem source pair |
| D-node candidate | graph | P0 polar | unknown | none recovered | any graph invariant | `UNDEFINED` | unknown | no shared registry |
| yellow/purple candidate | visual point/region | another view | unknown | none recovered | containment | `UNDEFINED` | unknown | source not recovered |

The matrix does not establish one common historical system.
