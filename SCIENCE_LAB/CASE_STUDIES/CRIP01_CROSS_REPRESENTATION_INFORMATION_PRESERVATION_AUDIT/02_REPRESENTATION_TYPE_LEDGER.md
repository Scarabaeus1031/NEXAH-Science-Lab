# Representation Type Ledger

| ID | representation type | object/data status | typing note |
|---|---|---|---|
| F0 arrays | `MATRIX_VIEW` / sampled scalar function | formally reconstructable | indices map to declared Δφ and Δβ coordinates |
| F1 | `GRID` + `MATRIX_VIEW` + color encoding | same F0 scalar array, plus a coherence-mask overlay | color is typed by the colorbar; overlay is additional data |
| F2 | `3D_EMBEDDING` / surface view | same F0 scalar array | z-height encodes value; perspective and shading are view properties |
| T0 | `TIME_SERIES` table | 841 parameterized samples | `t` is a numeric parameter; no physical-time claim follows |
| T1 | `TIME_SERIES` raster candidate | conditional relation to T0 | no generating code recovered |
| G0/G1 | `GRID` / `CATEGORICAL_LAYOUT` | integer identities and residue-derived matrix | not a graph until an edge rule is declared |
| C0 | `EXPRESSION_GRAPHIC` / `3D_EMBEDDING`-styled image | underlying object underdefined | title word “Cube” does not establish tensor status |
| M0 SVG | `LABELLED_DIAGRAM` / vector embedding | source geometry recoverable from SVG | semantic claims remain expressions |
| M0 PNG | `LABELLED_DIAGRAM` raster | same-object status conditional | rasterization lineage not sealed |
| P0 | `POLAR_CHART`-styled `EXPRESSION_GRAPHIC` | numeric mapping absent | polar proximity is not a structural relation |
| T/G/Q candidate | `UNKNOWN` | not recovered | labels alone cannot establish a 3×3 object |
| D-node candidate | `UNKNOWN` | not recovered | node names do not establish a graph |

## Tensor control

No selected historical artifact supplies carrier spaces, tensor order, component semantics, index meaning, and a transformation law. Therefore:

`TENSOR_STATUS=LABEL_ONLY_OR_UNDERDEFINED`

`TENSOR_LABEL_SUFFICIENT_FOR_TENSOR=NO`

Likewise, a “dimension” label is not a mathematical dimension without a defined space.
