# LABREPORT_A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_001

| Field | Record |
|---|---|
| LABREPORT_ID | `LABREPORT_A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_001` |
| TITLE | Typed path dependence in two-face extensions of a depth-six Pascal carrier |
| DATE | `2026-10-10` |
| RESEARCH_BRANCH | `A0-BL-021 — Dynamic Boundary and Confluence` |
| PARENT_QUESTION | Do all admissible two-face extensions of the verified open five-face depth-six Pascal carrier terminate in one typed state? |
| SCOPE | Complete declared enumeration from `f=5` through `f=7`; combinatorial side-profile-compatible gluing only; no metric embedding |
| CLAIM_TESTED | Confluence under exact typed equality preserving oriented boundary profiles, Corner Flags, face-apex/base incidence and the induced weighted Pascal quotient |
| METHOD | Exhaustive deterministic enumeration of 9 six-face and 100 seven-face histories; exact canonical class partition; expanded Pascal quotient invariants; explicit nonisomorphism witness |
| PREREGISTRATION | [`01_PREREGISTRATION.md`](../../CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/01_PREREGISTRATION.md) |
| LOCK_HASH | `773f59f55f00190c8971bb1b15754146cce4c1eab4a5d804d24e3109268f6e5f` |
| IMPLEMENTATION_HASH | `17ca27f66bd7dcdf434c65006272d278542b11d7e41c5c07e8b4dd93ad4a3347` |
| DATA_POPULATION | Finite generated carrier population: one frozen K5 baseline, 9 admissible first extensions, 100 admissible two-step histories |
| CONTROLS | Identity, declared reflection, equal-count, adjacent/nonadjacent seam choice, radial orientation, Corner-Flag mutation and open-boundary growth |
| PRIMARY_RESULT | `100` histories partition into `56` exact typed terminal classes; every terminal has `154` nodes and one component; explicit histories `H011` and `H008` are nonisomorphic under the declared equality |
| AUDIT_RESULT | Result verifier PASS; witness audit PASS; independent count arithmetic confirms `9` and `100`; witness differs in cyclic edge-profile transitions and directed edge count `258` versus `264` |
| REPLAY_RESULT | Primary and replay scientific bytes identical; SHA-256 `e8952baf391f430a6b02d7301461d8392d55bb24f85bb3f8e7415af77dfe4705` |
| THEORETICAL_RESULT | Full-side attachment preserves the recurrence-weight seam and adds exactly `28-7=21` nodes; equal `154` counts cannot establish typed equality. The two-step position-address set is exactly `{1,...,7}×{1,...,8}`, but it is not canonically identical to the 56-class quotient. Their bipartite incidence graph has exactly `56+56=112` typed meta-vertices and 100 history edges. |
| FINAL_CLASSIFICATION | `VALIDATED_NEGATIVE_RESULT / PATH_DEPENDENT_WITH_WITNESS` |
| WHAT_WAS_ESTABLISHED | The frozen `f=5 -> 7`, `d=6` attachment grammar is not confluent under the declared typed equality; seam choice and orientation can remain visible in the terminal state. The 100 histories relate a 56-cell 7×8 address grid to 56 terminal classes through a non-bijective incidence relation, producing an exact 112-vertex meta-graph. |
| WHAT_WAS_NOT_ESTABLISHED | No unrestricted confluence theorem, general `m,d` family, `f=8` result, canonical identification of 7×8 cells with terminal classes, identification of the 112-meta-vertex incidence graph with the 112-Pascal-node preclosure carrier, metric polygon, solid, flow, stability, resonance, MONAD(t), dodecahedron or canonical A0/PENT promotion |
| REFUTED_ELIMINATED_CLAIMS | Equal face count or equal `154` node count determines one terminal quotient; unqualified `5+2=6+1` identifies a state; equal cardinality `56=7×8` alone establishes one product decomposition of the terminal classes |
| NEW_INFRASTRUCTURE | Study-local deterministic attachment, decorated-boundary canonicalization, expanded Pascal accounting, witness audit and post-result address/class crosswalk |
| NEW_SCHEMAS | Case-local result, verification and witness-audit JSON schemas only; none canonical |
| ARCHITECTURE_CHANGES | None; SCC-003, PENT-06, NEXAH Core, OLS and canonical A0 Families unchanged |
| INFORMATION_BOUNDARIES | Full 100-history enumeration and 56-class count have R2 local replay; decisive witness is separately audited; the 7×8 crosswalk is a deterministic read of the frozen result; no independent full reimplementation |
| OPEN_QUESTIONS | Whether the 100-edge, 112-meta-vertex bipartite incidence graph has a principled selector or orbit factorization; whether a typed map to the separate 112-Pascal-node preclosure carrier exists; conditions selecting one class; independent full reimplementation; generalization only under a new admission |
| DOWNSTREAM_IMPLICATIONS | A0-BL-020 must retain history/seam/orientation variables; Angle Nodes are justified as orientation records, not carrier vertices; future 7×8 language must distinguish address grid from terminal-class quotient |
| NEXT_ACTION | `NONE`; any successor requires a new Human Owner admission |
| ARTIFACTS | [Study package](../../CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/README.md), [`PRIMARY_RESULT.json`](../../CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/artifacts/PRIMARY_RESULT.json), [`VERIFICATION.json`](../../CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/artifacts/VERIFICATION.json), [`WITNESS_AUDIT.json`](../../CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/artifacts/WITNESS_AUDIT.json), [7×8 crosswalk](../../CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/07_POST_RESULT_7X8_ADDRESS_CLASS_CROSSWALK.md) |
| HASHES | Primary/replay `e8952b…4705`; verifier `424a47…78e`; witness audit `21c9fc…e94`; package manifest recorded in the Study |
| CLOSURE_STATUS | `CLOSED / OWNER_ACCEPTED_2026-10-10` |

## Central conclusion

Within the declared finite grammar, dynamic-boundary growth retains history.
Node count is conserved across the compared extensions, but the oriented edge
profile word and directed Pascal adjacency need not be. The appropriate result
is therefore a bounded negative confluence finding, not a universal
dynamic-boundary law.

The equality `56 = 7×8` has an exact but narrower role. It counts the complete
two-step boundary-slot address grid. The typed terminal quotient also has 56
classes, yet the 100 histories cross-connect the two sets: one address can
reach multiple classes and one class can be reached by multiple addresses.
Equal cardinality is therefore a discovered crosswalk, not an identity.

Treating the two 56-element sets as opposite vertex parts yields an exact
112-vertex, 100-edge bipartite meta-graph. This 112 is not silently identified
with the separate 112-node Pascal preclosure carrier; a typed map between them
remains an open successor question.

## Owner closure

The Human Owner accepted the final classification on `2026-10-10`. The Study
is closed. No successor, PENT-08, generalized family or publication action is
activated by this closure.
