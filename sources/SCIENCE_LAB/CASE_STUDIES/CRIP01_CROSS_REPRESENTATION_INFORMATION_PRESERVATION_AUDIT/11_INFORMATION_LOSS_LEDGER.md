# Information-Loss Ledger

| transformation | preserved | transformed | discarded | introduced by view | unknown |
|---|---|---|---|---|---|
| F0 matrix → F1 heatmap | grid order, axis orientation, qualitative sign/zero structure | value → color | exact floating-point values in standalone raster | color scale, axes, labels; coherence contour from a second array | environment-specific raster details |
| F0 matrix → F2 surface | domain axes and scalar relation | value → z-height | exact array from PNG; unsampled/render-hidden detail | camera, perspective, occlusion, shading | backend-specific rendering |
| F1 → F2 via F0 | object identity and source formula | color encoding → height encoding | F1 coherence-mask overlay | depth cues | what an image-only viewer can recover exactly |
| T0 CSV → T1 PNG candidate | likely order and curve shape | samples → plotted marks/lines | exact numbers | interpolation, line width, axes | generator parameters |
| integer identity → 20-wide grid | ID, row/column under width rule | linear index → pair `(row,col)` | none in table form | color/overlays in raster | exact run binding for surviving image |
| grid → audit graph | IDs, declared adjacency | cells → nodes, neighbourhood → edges | metric position unless attributes retained | arbitrary layout | none within declared control |
| audit graph → polar view | IDs and declared order | order → angle | adjacency/degree unless drawn | radial distance and proximity | none within declared control |
| SVG → PNG candidate | visible gross geometry | vector primitives → pixels | editability, exact paths, semantic element structure | antialiasing and pixel grid | rasterization command |
| 3D → hypothetical 2D projection | projected coordinates | depth → overlap/order if encoded | depth if unencoded | occlusion | historical mapping absent |

The ledger demonstrates that higher visual fidelity is neither necessary nor sufficient for preservation of a declared relation.
