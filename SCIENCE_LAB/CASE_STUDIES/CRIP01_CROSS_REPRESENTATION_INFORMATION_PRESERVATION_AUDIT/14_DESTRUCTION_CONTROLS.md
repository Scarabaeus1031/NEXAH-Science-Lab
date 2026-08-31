# Destruction Controls

| control | operation | result |
|---|---|---|
| A: permute positions | retain IDs but randomly move displayed nodes | identity survives; spatial order, angle and distance do not unless attributes retain them |
| B: remove colors | remove heatmap and grid colors | F0 values remain in source matrix; raster-only magnitude becomes unrecoverable; color is not type without legend |
| C: change graph layout | preserve node and edge sets | topology, degree and path existence survive; displayed angles/distances change |
| D: project 3D to 2D | remove/decode z as color or overlap | z is lost if not re-encoded; if color encodes z by declared scale it is transformed, not identical |
| E: remove expression | delete historical metaphors | scalar function, CSV data and indexing code survive; expression-only objects do not |
| F: similar appearance, altered data | hold style/layout fixed and modify one matrix cell or edge | visual similarity can conceal changed sign, value, adjacency or path structure |
| G: fixed object, radical re-view | render F0 as heatmap versus perspective surface | object/formula and zero/sign structure survive; encoding and view cues change |

At least one supported example exists for `PRESERVED`, `TRANSFORMED_BY_DECLARED_RULE`, `LOST`, and `UNDEFINED`. None establishes a new mathematical structure.
