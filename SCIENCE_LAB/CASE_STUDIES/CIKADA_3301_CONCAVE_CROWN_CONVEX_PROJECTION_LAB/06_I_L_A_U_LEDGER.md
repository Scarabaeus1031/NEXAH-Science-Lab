# I–L–A–U Ledger

The established local vocabulary is used narrowly: `I` retained, `L` lost, `A` introduced, `U` unresolved. This ledger does not upgrade I-L-A-U to a new operator or ORION capability.

| Transition | I — retained | L — lost | A — introduced | U — unresolved |
|---|---|---|---|---|
| World circle → orthographic plane | centre, scale, circular seam, anchor relation, order | z-depth | 2D coordinate convention | none inside the synthetic contract |
| Circle → 30° pose → orthographic plane | closure, centre, smoothness, sample provenance | unprojected depth from image alone | ellipse/eccentricity `0.5`; shortened projected needle | pose recovery without metadata |
| Concave/convex surface → front orthographic seam | circular seam, centre, radius, anchor | curvature sign and depth field from the seam silhouette | display shading only | recovery of curvature from silhouette alone |
| Circle → centred radial lens | centre, smoothness, circularity, order | original radius without lens parameters | radius `1.15`; needle/seam scale relation changes non-uniformly | arbitrary off-axis/asymmetric lens behaviour was not tested |
| Circle → raster/threshold | coarse topology and centre | subpixel boundary position and continuous curvature | resolution-dependent staircase; 16 low-resolution candidates at 96 px but insufficient residual amplitude | interpolation/compression families outside the frozen mask pipeline |
| Circle → explicit 12-fold corrugation | centre, mean radius, closed topology, provenance | exact circle | stable 12-peak boundary structure and high mode-12 concentration | no attribution to any historical source |
| Front → back/winding reversal | geometric point set, centre, seam, anchor | original orientation if provenance is omitted | signed winding changes CCW→CW | physical inside/outside meaning is not inferable from winding alone |
| Scissor angle 20°→45°→70° | shared pivot, arm length, four outer tips | prior tip coordinates | new tip positions determined by angle | any relation to a historical spike/seam image |

## Whole-case ledger

- **I — Retained:** operator separation, world scale, exact synthetic inputs, source-to-output provenance, fixed metric thresholds, and deterministic replay.
- **L — Lost:** depth under orthographic projection; subpixel geometry under rasterization; front/back orientation when winding/provenance is discarded.
- **A — Introduced:** pose eccentricity, lens scaling, pixel staircasing, display colour, and — only in the positive control — explicit 12-fold boundary structure.
- **U — Unresolved:** the origin of any historical “Krönchen”; illumination/caustic effects; off-centre or non-radial optics; arbitrary render pipelines; perceptual usefulness to humans.
