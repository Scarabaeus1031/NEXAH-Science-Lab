# LABREPORT_PROT_FOLD_01_MOVING_FRAME_ORIENTATION_001

| Field | Record |
|---|---|
| LABREPORT_ID | `LABREPORT_PROT_FOLD_01_MOVING_FRAME_ORIENTATION_001` |
| TITLE | 1XQQ moving-frame fidelity, local backbone orientation and Hopf-view boundary |
| DATE | `2026-09-22` |
| RESEARCH_BRANCH | `PROT-FOLD-01 / OBSERVER_GEOMETRY_APERTURES_AND_CUTS` |
| PARENT_QUESTION | Can global frame motion be separated from conformer and local backbone-orientation variation on one source-bound protein ensemble, and what information is lost by the declared Hopf view? |
| SCOPE | RCSB PDB entry 1XQQ; 128 submitted solution-NMR models; chain A; residues 1–76; Phase A C-alpha body-frame fidelity; Phase B N–CA–C local frames, SO(3), scalar-first quaternions and one declared Hopf projection |
| CLAIM_TESTED | Proper rigid-frame nuisance removal, preservation of internal geometry, residual conformer variability, local orientation variability, quaternion double-cover identity and noninjectivity of the declared Hopf view |
| METHOD | Source-hash-locked PDB parsing; centering and proper Kabsch alignment; pair-distance, reconstruction, determinant, contact and chirality checks; translation, proper-rotation, reflection and identity-corruption controls; local right-handed N–CA–C frames; SO(3) angles; canonical `q ~ -q`; frozen S1 Hopf-fiber action; missing/degenerate-input rejection |
| PREREGISTRATION | Phase A `04_PHASE_A_EXECUTION_PREREGISTRATION.md`; Phase B `07_PHASE_B_ORIENTATION_PREREGISTRATION.md`; both frozen before their respective executions |
| LOCK_HASH | Phase-A protocol `da67c121a7476f01aa072f004dd5c375952e9375952734c51949b41ecc2de9f8`; Phase-B protocol `76ca2e3b22b9f078d4e515ee07c624b02f30642cdc9807994155da44763e5024`; source `88182fc83c2c5081f993ccdad6f4b628c1b52d39b3aea601bf568a0b6f4d45c1` |
| IMPLEMENTATION_HASH | Phase-A runner `8932a3e9c06df2156586c81e41504e46901d69b3a54dd6fdb1c2932f0c5d4ac6`; Phase-B runner `06b8ae320472dbf3d3e76c66b76ed61141f42e4e03313948888e9973a895cd68` |
| DATA_POPULATION | 128 conformers × 76 C-alpha addresses in Phase A; 9,728 complete N–CA–C local frames in Phase B; model index explicitly not treated as time |
| CONTROLS | Synthetic translation and proper rotation; reflection/chirality control; reversed residue identity; `q/-q` equivalence; S1 Hopf-fiber action; missing C atom; degenerate N=CA frame |
| PRIMARY_RESULT | Phase A passed 11/11 gates: pair distances, reconstruction, proper-rotation determinant and contacts were preserved to numerical tolerance while reflection and identity corruption were detected. Phase B passed 12/12 gates: all local frames and quaternion contracts were valid; global rotation changed local angles by at most `4.33e-15 rad`; the Hopf view remained fixed to `6.66e-16` while the underlying SO(3) rotation changed by `1.46 rad`. |
| AUDIT_RESULT | The result is relevant as a bounded empirical method case for moving frames, residuals and projection loss. It is not evidence for protein-folding dynamics, a causal Hopf mechanism, E8, AXIS08, Mod7/11 or biological operator identity. |
| REPLAY_RESULT | Phase-A and Phase-B generated outputs were each reproduced byte-identically; both phase manifests validate. This is deterministic local replay of the same implementation, not independent replication. |
| THEORETICAL_RESULT | Proper Euclidean frame removal preserves internal distances; unit quaternions double-cover SO(3); the declared Hopf map is many-to-one along an S1 fiber. These are standard mathematical properties, experimentally checked here as implementation boundaries. |
| FINAL_CLASSIFICATION | `VALIDATED_POSITIVE_RESULT` at the bounded representation/method scope; `INFORMATION_LOST` for Hopf view used alone; `REPLICATION_CONFIRMED` only for local deterministic replay |
| WHAT_WAS_ESTABLISHED | Global translation/proper rotation can be separated from nonrigid conformer differences on the bound 1XQQ ensemble; measurable local backbone-orientation variability remains after body alignment; the controlling SO(3)/quaternion record retains distinctions that the declared Hopf view erases. |
| WHAT_WAS_NOT_ESTABLISHED | Time order, folding path, kinetics, causal mechanism, energetic model, protein prediction, cross-protein generalization, external replication, biological novelty, AXIS08 admission, Mod7/11 relevance or a new NEXAH capability |
| REFUTED_ELIMINATED_CLAIMS | Global spatial travel does not by itself explain internal protein geometry; a Hopf point is not a persistent complete orientation address; visual/topological resemblance does not establish biological operator identity; conformer index must not be read as time. |
| NEW_INFRASTRUCTURE | Two deterministic case-local runners and machine-readable Phase-A/Phase-B outputs; retained as research fixtures only |
| NEW_SCHEMAS | `phase_a_protocol.json`, `phase_a_results.json`, `phase_b_protocol.json`, `phase_b_results.json`; case-local, noncanonical |
| ARCHITECTURE_CHANGES | `NONE` — no Core operator, capability registry, Mission Control queue, product, ORION or THE EYE contract changed |
| INFORMATION_BOUNDARIES | Phase A separates the global SE(3) frame from body-frame residuals. Phase B retains SO(3) matrices plus canonical quaternion classes as controlling records. The Hopf view discards an S1 fiber coordinate and is not inverted. |
| OPEN_QUESTIONS | External replay; second protein family; sensitivity to reference model and local-frame definition. AXIS08 requires a natural biological pair and remains unresolved; Mod7/11 remains on hold. |
| DOWNSTREAM_IMPLICATIONS | Preserve as a bounded positive example under observer geometry/apertures/cuts and as a teaching/control case for view loss. Do not promote to folding mechanism, biology discovery, operator identity, capability or publication claim without a new gate. |
| NEXT_ACTION | `NONE`; optional independent replay or separately preregistered cross-protein replication only after a new Human Owner authorization |
| ARTIFACTS | `SCIENCE_LAB/CASE_STUDIES/PROT_FOLD_01_MOVING_FRAME_QRR_2026-09-22/`; Phase-A results and validation; Phase-B results and validation; separate phase manifests |
| HASHES | Phase-A result `c3bdb52c6c31d434cb71d8ee5386522e9a702ec9848fca03041eabbf48829df8`; Phase-B result `1692ee71057aebe5b215c88f2d07204429a3c58e6830bd47f498dc1026f0565e`; source `88182fc83c2c5081f993ccdad6f4b628c1b52d39b3aea601bf568a0b6f4d45c1` |
| CLOSURE_STATUS | `CLOSED` |

## Central conclusion

The useful finding is a disciplined decomposition, not a new folding theory:

```text
observed protein coordinates
  = removable global rigid frame
  + body-frame conformer residual
  + local backbone-orientation field
```

The Hopf projection is a valid view of that orientation carrier, but not its
complete address. The case closes with no active follow-on and no architecture
or capability promotion.
