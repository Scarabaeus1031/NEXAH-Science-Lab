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
| PREREGISTRATION | `01_PREREGISTRATION.md` |
| LOCK_HASH | `773f59f55f00190c8971bb1b15754146cce4c1eab4a5d804d24e3109268f6e5f` |
| IMPLEMENTATION_HASH | `17ca27f66bd7dcdf434c65006272d278542b11d7e41c5c07e8b4dd93ad4a3347` |
| DATA_POPULATION | Finite generated carrier population: one frozen K5 baseline, 9 admissible first extensions, 100 admissible two-step histories |
| CONTROLS | Identity, declared reflection, equal-count, adjacent/nonadjacent seam choice, radial orientation, Corner-Flag mutation and open-boundary growth |
| PRIMARY_RESULT | `100` histories partition into `56` exact typed terminal classes; every terminal has `154` nodes and one component; explicit histories `H011` and `H008` are nonisomorphic under the declared equality |
| AUDIT_RESULT | Result verifier PASS; witness audit PASS; independent count arithmetic confirms `9` and `100`; witness differs in cyclic edge-profile transitions and directed edge count `258` versus `264` |
| REPLAY_RESULT | Primary and replay scientific bytes identical; SHA-256 `e8952baf391f430a6b02d7301461d8392d55bb24f85bb3f8e7415af77dfe4705` |
| THEORETICAL_RESULT | Full-side attachment preserves the recurrence-weight seam and adds exactly `28-7=21` nodes; equal `154` counts cannot establish typed equality |
| FINAL_CLASSIFICATION | `VALIDATED_NEGATIVE_RESULT / PATH_DEPENDENT_WITH_WITNESS` |
| WHAT_WAS_ESTABLISHED | The frozen `f=5 -> 7`, `d=6` attachment grammar is not confluent under the declared typed equality; seam choice and orientation can remain visible in the terminal state |
| WHAT_WAS_NOT_ESTABLISHED | No unrestricted confluence theorem, general `m,d` family, `f=8` result, metric polygon, solid, flow, stability, resonance, MONAD(t), dodecahedron or canonical A0/PENT promotion |
| REFUTED_ELIMINATED_CLAIMS | Equal face count or equal `154` node count determines one terminal quotient; unqualified `5+2=6+1` identifies a state |
| NEW_INFRASTRUCTURE | Study-local deterministic attachment, decorated-boundary canonicalization, expanded Pascal accounting and witness audit |
| NEW_SCHEMAS | Case-local result, verification and witness-audit JSON schemas only; none canonical |
| ARCHITECTURE_CHANGES | None; SCC-003, PENT-06, NEXAH Core, OLS and canonical A0 Families unchanged |
| INFORMATION_BOUNDARIES | Full 100-history enumeration and 56-class count have R2 local replay; decisive witness is separately audited; no independent full reimplementation |
| OPEN_QUESTIONS | Conditions selecting one class; whether the 100-history incidence between the 56-cell `7×8` address grid and 56 typed classes has a principled selector or orbit factorization; independent full reimplementation; later generalization under a new admission |
| DOWNSTREAM_IMPLICATIONS | A0-BL-020 must retain history/seam/orientation variables; Angle Nodes are justified as orientation records, not carrier vertices |
| NEXT_ACTION | `NONE`; any successor requires a new admission and no successor is activated |
| ARTIFACTS | This Study package, especially `artifacts/PRIMARY_RESULT.json`, `VERIFICATION.json`, `WITNESS_AUDIT.json` and `07_POST_RESULT_7X8_ADDRESS_CLASS_CROSSWALK.md` |
| HASHES | Primary/replay `e8952b…4705`; verifier `424a47…78e`; witness audit `21c9fc…e94` |
| CLOSURE_STATUS | `CLOSED / OWNER_ACCEPTED_2026-10-10` |

## Proposed central conclusion

Within the declared finite grammar, dynamic boundary growth retains history.
Node count is conserved across the compared extensions, but the oriented edge
profile word and directed Pascal adjacency need not be. The appropriate
result is therefore a bounded negative confluence finding, not a universal
dynamic-boundary law.

## Owner acceptance

The Human Owner accepted the final classification on `2026-10-10`. This
acceptance closes the bounded cycle and does not activate a successor.
