# NEXAH Translation Map

Canonical source inspected: NEXAH `923362e141170f06f2f0f26992136b5979047c42`.
No canonical source was changed.

## Novelty filter

| Proposed check | Class | Disposition |
|---|---|---|
| R common-phase invariance; V common-speed invariance | A — MATHEMATICALLY_TRIVIAL / DEFINITIONAL | Analytic note only; no battery compute |
| Euclidean displacement/angle under isometries; graph isomorphism invariance | B — KNOWN_STANDARD_PROPERTY | Analytic note only |
| SourceBatch round trip, transition probability sums, deterministic seed replay | C — SOFTWARE_IMPLEMENTATION_CHECK | Minimal verification supporting study integrity only |
| Same trajectory through scalar, redundant affine, nonlinear injective and delay representations, compared as unlabeled transition graphs | D — CROSS_REPRESENTATION_TEST | Admit to minimal experiment |
| Preservation of unlabeled graph topology, articulation count or edge-rank pattern under nonlinear/delay representation | E — POTENTIALLY_NONTRIVIAL_NEXAH_RESULT | Candidate only if it survives frozen adversarial checks; never universal |
| Sequential trajectory samples converted directly to a chain graph | A — INVARIANT_BY_CONSTRUCTION | Exclude as discovery |
| Declared graph encoded as adjacency then decoded by GraphBackend | A/C — construction plus software check | Inventory only |
| IEEE physical frames to frozen geometry | C/D, but domain-bound | No execution under IEEE firewall |

## Actual translations found

| Source representation | Existing adapter / transformation | Target representation | Preserved by construction | Discarded | Preservation unknown |
|---|---|---|---|---|---|
| Numeric 1D/2D array | `nexah/sources/array.py::ArraySourceAdapter` | typed `SourceBatch` | finite numeric values, row order, optional times/IDs, feature names/units | original array dtype/layout; 1D expanded to one feature | none material inside declared contract |
| Numeric trajectory | `nexah/backends/v07.py::V07BackendAdapter` → `nexah/core.py::NEXAH` | local-fit `OrientationState`, empirical typed `Transition`s and raw heuristics | original observations/provenance in state; window alignment metadata; transition probabilities produced by the fit | public result omits embedded vectors, KMeans centers and full label sequence; cluster IDs local; last raw sample is not represented by historical window behavior | cross-representation transition topology, bottleneck/articulation roles, weighted edge ordering, segmentation stability |
| Numeric trajectory | v0.7 preprocessing → per-feature normalization → sliding flattened windows → KMeans | local cluster sequence internally | window ordering and deterministic config | absolute coordinate scale/offset after normalization; source-to-cluster semantic identity | relations across nonlinear, delayed, projected or resampled representations |
| Declared graph mapping | `nexah/sources/graph.py::GraphSourceAdapter` | entity-indexed adjacency `SourceBatch` | declared node order/identity, directed edges and optional weights | undeclared metadata, regime/risk/action semantics | external source completeness |
| Graph SourceBatch | `nexah/backends/graph.py::GraphRepresentationBackend` | reachability, paths, SCC/WCC, weak articulation, typed transitions and OrientationState | nonzero adjacency entries are explicitly edges; topology is computed directly | domain meaning, causality, external completeness | none of the core topology is a translation discovery; it follows the declared graph |
| Graph analysis | `nexah/applications/network_orientation.py` | `OrientationReport` / Brief | computed structural facts, evidence IDs and claim boundaries | numerical adjacency matrix presentation | reader usefulness and domain validity |
| IEEE physical snapshots | `nexah/power_systems/ieee_geometry.py`, `ieee_geometry_operators.py` | aggregate frame → standardized projection → steps/turns | manifest features, ordered load scale, failures; declared formulas | bus/line identity in 7-feature projection; many physical variables | whether geometric rank/order survives alternative admissible projections; not tested here |
| IEEE geometry | `ieee_geometry_probes.py`, `ieee_geometry_brief.py` | Orientation findings / Brief | selected extrema, insufficiency and provenance | most raw geometry detail from prose | usefulness; no IEEE execution here |
| Historical dynamic adapter | `APPLICATIONS/adapters/examples/lorenz_adapter.py` | sampled-node chain graph | sample order is explicitly written as consecutive edges | continuous between-sample geometry | none: path adjacency is definitional, regime labels heuristic |
| Historical signature adapter | `APPLICATIONS/adapters/signature_adapter.py` | threshold labels and transition graph | input sequence and hard-coded threshold rule | within-class magnitude, geometry, uncertainty | robustness to representation; current evidence absent |
| Editorial orientation translation | `APPLICATIONS/orientation_translation/` | human-authored maps, matrices and neighborhoods | admitted/rejected relations as documented | no uniform computational source model | cross-document scientific preservation is unvalidated and not suitable for this numeric experiment |

## Architectural finding

There is no current canonical adapter that takes the IEEE/local geometric
operators and then constructs a GraphBackend graph while retaining an explicit
source-to-node correspondence. Building such a bridge here would invent the
translation under test and make preservation partly definitional. The minimal
study therefore uses the one existing canonical nontrivial translation:
trajectory → sliding-window/KMeans local states → empirical transition graph.
