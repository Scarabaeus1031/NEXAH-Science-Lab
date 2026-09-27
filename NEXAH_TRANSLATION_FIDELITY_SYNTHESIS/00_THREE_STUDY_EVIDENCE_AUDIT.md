# Three-Study Evidence Audit

Scope: three completed synthetic translation studies; no new experiment.

## Source integrity

| Study | Protocol | Runner | Result/replay | Verification |
|---|---|---|---|---|
| 1 — minimal Translation Study | `f8080f2e…3973` | `f436a19a…2e44` | `69aa9f65…2055` | manifest entries matched |
| 2 — v0.7 replication | `98c7856c…4eb8` | `407513c6…784` | `589c2195…af1` | manifest matched; 576/576 raw cells `OK` |
| 3 — independent fidelity experiment | `f9a71253…0ad2` | `1576d97b…4ee9` | `36657449…d0d9` | 11 manifest entries matched; 178/180 cells `OK` |

The two Study-3 failures were retained preregistered lossy sign-projection
controls for the near-degenerate family. All 120 faithful cells completed.
Byte-identical replay is software evidence, not independent scientific
replication.

Study 2's `family_outcomes.*.structural` convenience field has a disclosed
global-accumulator defect. It is neither repaired nor used here. Aggregate
`certificate_summary` and family claims recomputed from raw `records` remain
the evidentiary sources.

## Claim classification

Every claim below has exactly one evidence class.

| Major claim | Class | Boundary |
|---|---|---|
| Common phase shift leaves the declared phase-coherence magnitude unchanged | **A. MATHEMATICAL / DEFINITIONAL** | elementary property of complex magnitude |
| Common speed offset leaves the declared centered maximum deviation unchanged | **A. MATHEMATICAL / DEFINITIONAL** | follows from centering definition |
| Euclidean distances/angles have their standard isometry behavior | **A. MATHEMATICAL / DEFINITIONAL** | standard geometry, not a NEXAH result |
| Graph relabeling preserves isomorphism-invariant topology | **A. MATHEMATICAL / DEFINITIONAL** | standard graph theory |
| Cluster-to-state bijective relabeling can align anonymous node IDs | **A. MATHEMATICAL / DEFINITIONAL** | does not guarantee correct clustering |
| Each frozen runner reproduced byte-identical local output | **B. SOFTWARE / REPRODUCIBILITY** | verifies deterministic execution only |
| Study 1 support survived its five faithful transformations | **C. EMPIRICAL_SINGLE_STUDY** | one fixture, one v0.7 configuration |
| Study 1 weights changed under nonlinear, delay and coarsening maps | **C. EMPIRICAL_SINGLE_STUDY** | same narrow setting |
| v0.7 support was robust across eight families/four configurations | **D. EMPIRICALLY_REPLICATED** | Study 2 replicated the Study-1 support candidate within v0.7 |
| The support candidate is robust *and structurally faithful* | **F. FALSIFIED / NOT_REPLICATED** | Study 1 missed A→C; Study 2 support missed 65.625% |
| The earlier A→C shortcut weakness recurred | **D. EMPIRICALLY_REPLICATED** | Study 2: support detected only 6/24; weights 24/24 |
| Coarser certificates tend to be more robust and less discriminative than richer ones | **E. EMPIRICALLY_REPLICATED_WITH_QUALIFICATION** | pattern appears in v0.7 and independent decoder, but exact hierarchy/rates differ |
| The exact v0.7 HIGH/LOW support versus LOW/HIGH weight hierarchy is decoder-independent | **F. FALSIFIED / NOT_REPLICATED** | Study 3 support was MEDIUM/MEDIUM, not HIGH/LOW |
| SCC/WCC/component summaries can appear robust through saturation | **D. EMPIRICALLY_REPLICATED** | Study 2: 100%/0%; Study 3 components: 0.990/0.017 and only 2/20 R0 values |
| Rich weighted structure is more discriminative but less representation-robust in these fixtures | **E. EMPIRICALLY_REPLICATED_WITH_QUALIFICATION** | consistent direction; magnitudes and decoder behavior differ |
| Explicit correspondence separates label permutation from state/edge loss | **C. EMPIRICAL_SINGLE_STUDY** | implemented only in Study 3; delay exposed real collisions |
| Delay embedding preserves support | **F. FALSIFIED / NOT_REPLICATED** | strong in Studies 1–2 v0.7; zero support preservation in Study 3 |
| Lossy maps must destroy observed structure | **F. FALSIFIED / NOT_REPLICATED** | Study 3 sign/factor-five controls sometimes preserved structure |
| Faithful maps must preserve decoded structure | **F. FALSIFIED / NOT_REPLICATED** | Study-3 delay was formally faithful yet damaging |
| Count ranks are a useful intermediate certificate on the frozen Study-3 matrix | **C. EMPIRICAL_SINGLE_STUDY** | R=0.760, D=0.950; not externally replicated |
| No tested certificate reached the preregistered HIGH/HIGH region | **D. EMPIRICALLY_REPLICATED** | no HIGH/HIGH in Studies 2 or 3 |
| The Study-3 rank correlations characterize a universal relationship | **H. NOT_SUPPORTED** | seven frozen operational levels, not universal constants |
| The ladder is a Shannon-information or entropy scale | **H. NOT_SUPPORTED** | it is only an ordered operational detail scale |
| A mathematical or physical invariant was discovered | **H. NOT_SUPPORTED** | synthetic empirical studies do not establish either |
| The result supplies prediction, early warning, risk or control capability | **G. NOT_TESTED** | no domain/application test was run |
| The pattern transfers to IEEE/PEGASE or power systems | **G. NOT_TESTED** | firewall excluded those systems |
| The candidate generalizes to independent external teams, decoders and fixtures | **G. NOT_TESTED** | requires external replication |
| The framework is novel relative to prior literature | **G. NOT_TESTED** | no literature review was performed |

## Evidentiary boundary

The strongest cross-study evidence is synthetic and methodological: robustness
can be caused by compression, and robustness must be measured separately from
counterfactual discrimination. The evidence supports neither structural truth
in an external domain nor a general information-theoretic law.
