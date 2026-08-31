# Destruction Controls

| # | False collapse | Reason for rejection |
|---:|---|---|
| 1 | re-embedding = augmentation | coordinates change versus registered structure changes |
| 2 | reflection = augmentation | reflection maps existing objects and adds none |
| 3 | graph = embedding | adjacency object differs from coordinate realization |
| 4 | embedding = view | source geometry differs from representation |
| 5 | view = source | a view carries source provenance and may omit/alter appearance |
| 6 | transform = transformed object | rule differs from result embedding |
| 7 | transform history = final embedding | distinct event sequences can share a result |
| 8 | add perpendicular = reflect | the first adds geometry; the second is an isometry |
| 9 | add perpendicular = partition | construction differs from induced relation/result |
| 10 | partition = graph augmentation | partitions need not change a graph; augmentations need not partition |
| 11 | partition of angle = partition of graph | quantity decomposition differs from structural partition |
| 12 | partition of region = partition of set automatically | set coverage/disjointness must be declared |
| 13 | same graph = same coordinates | a graph admits multiple embeddings |
| 14 | same coordinates = same provenance | histories and source identities may differ |
| 15 | same view = same source | identical representations may cite different sources |
| 16 | different view = different source | one source admits multiple views |
| 17 | observation = measurement | map/result differs from execution event/value |
| 18 | measurement event = value | occurrence differs from its outcome record |
| 19 | value = readout | quantity record differs from formatting/display |
| 20 | readout = view | readout is measurement-derived; view is broader |
| 21 | intersection = difference | shared membership differs from exclusion |
| 22 | difference = residual | set operation differs from model-observation discrepancy |
| 23 | masked = absent | hidden content may remain in the source |
| 24 | visual symmetry = structural identity | appearance does not establish source identity |
| 25 | operation order never matters | commutativity requires explicit compatibility/equivariance |

`DESTRUCTION_CONTROLS=25_OF_25_EVALUATED_AND_REJECTED`
