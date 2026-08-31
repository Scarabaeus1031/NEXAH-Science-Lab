# Object Identity Ledger

| comparison | identity result | evidence | permitted comparison |
|---|---|---|---|
| F0 scalar array → F1 heatmap | `SAME_OBJECT_SUPPORTED` | same code variables feed `imshow`; output filename fixed in code | full preservation test |
| F0 scalar array → F2 surface | `SAME_OBJECT_SUPPORTED` | same `PHI`, `BETA`, `E_flow` feed `plot_surface`; README says same field | full preservation test |
| F1 heatmap ↔ F2 surface | `SAME_OBJECT_SUPPORTED` | shared generator and array | full preservation test |
| T0 CSV ↔ T1 PNG | `SAME_OBJECT_CONDITIONAL` | same stem, timestamp, package, and 42-second title family; generator absent | limited source comparison only |
| G0 integer/residue data ↔ G1 grid | `SAME_OBJECT_CONDITIONAL` | code produces named grid family; exact invocation/output binding absent | rule-level comparison, not exact replay claim |
| M0 SVG ↔ M0 PNG | `SAME_OBJECT_CONDITIONAL` | same stem and folder; no rasterization trace | descriptive comparison only |
| C0 root copy ↔ nested C0 copy | `SAME_OBJECT_SUPPORTED` | identical SHA-256 | duplicate-representation identity only |
| historical grid ↔ historical D-node graph | `UNKNOWN` | no shared source data, IDs, or transformation recovered | `CROSS_OBJECT_COMPARISON_ONLY` |
| historical D-node graph ↔ P0 polar image | `UNKNOWN` | no node-to-angle/radius rule | `CROSS_OBJECT_COMPARISON_ONLY` |
| all selected historical artifacts | `DIFFERENT_OBJECTS_OR_UNKNOWN` | no common registry or transformation chain | no system-wide invariant test |

Object identity is a gate. Visual resemblance, shared color, repeated labels, and matching counts never pass it alone.
