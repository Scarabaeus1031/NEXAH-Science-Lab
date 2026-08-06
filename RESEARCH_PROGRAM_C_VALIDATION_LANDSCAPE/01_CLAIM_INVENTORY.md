# Claim Inventory

## Reading rule

Each claim has exactly one evidence category and one validation result. `Independent source` means a repository source produced through an explicitly separate review or implementation route; `none` is recorded when no such source exists.

Possible validation paths below repeat gates already present in repository records. They are not new experiment designs.

## Exact and modular claims

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-01 | Every prime greater than 3 is 1 or 5 modulo 6. | DERIVATION | `RESEARCH/VALIDATION/wheel_product_reference_spaces_01/{SPEC,RESULTS}.md` | arithmetic replay in same bundle | FOUNDATION | wheel/product study | integer arithmetic | SUPPORTED | none within scope | exact offline replay |
| C-02 | `Z/42Z` and `Z/6Z × Z/7Z` are exactly and invertibly related by the recorded CRT map. | DERIVATION | wheel/product `SPEC.md` | exact bundle replay | FOUNDATION | wheel/product study | CRT assumptions | SUPPORTED | none within scope | exact offline replay |
| C-03 | Tested modular sequences contain held-out transition information beyond frozen training-only baselines. | MEASUREMENT | `prime_modular_residue_comparison_01/{SPEC,RESULTS}.md` | none | WORKING | prime comparison | declared data, folds, metrics | SUPPORTED | external reproduction | frozen offline replay |
| C-04 | Mod 23 had the highest held-out gain among the tested moduli under both declared policies. | MEASUREMENT | prime comparison `RESULTS.md` | none | WORKING | prime comparison | tested set and policies | SUPPORTED | evidence outside tested set | frozen offline replay |
| C-05 | Mod-6 transitions carried positive held-out information relative to the frozen null under both policies. | MEASUREMENT | wheel/product `RESULTS.md` | none | WORKING | wheel/product study | prime data, null, metric | SUPPORTED | external reproduction | frozen offline replay |
| C-06 | Separate Mod-6 and Mod-7 models did not reproduce the joint Mod-42 transition kernel on the frozen data. | SIMULATION | wheel/product `RESULTS.md` | none | WORKING | wheel/product study | factorized models and data | SUPPORTED | other models/data | frozen offline replay |
| C-07 | Mod 280 and Mod 360 differ under the frozen normalized-gain metric despite equal Euler totients. | MEASUREMENT | wheel/product `RESULTS.md` | none | WORKING | wheel/product study | selected metric and data | SUPPORTED | external reproduction | frozen offline replay |
| C-08 | The frozen test did not support uniquely privileged predictive status for Mod 17. | SIMULATION | prime comparison `RESULTS.md` | none | WORKING | Mod-17 hypothesis | specificity rule | SUPPORTED | other questions remain untested | retain negative result |
| C-09 | The predefined `(7*r7+8) mod 17` map did not beat the held-out majority baseline. | SIMULATION | prime comparison `RESULTS.md` | none | WORKING | fixed bridge proposal | mapping, dataset, baseline | SUPPORTED | none for this test | retain negative result |
| C-10 | The predefined 31/32/33 boundary did not meet the top-5% local-curvature threshold. | SIMULATION | wheel/product `RESULTS.md` | none | WORKING | anomaly proposal | boundary and threshold | SUPPORTED | none for this test | retain negative result |
| C-11 | No frozen prime bundle establishes Mod-17 damping, recovery, attraction, error correction, or stabilization. | HYPOTHESIS | Evidence Atlas E-019; prime interpretation boundary | none | SPECULATIVE | historical Mod-17 interpretation | dynamical test absent | UNVALIDATED | adequate dynamical evidence | existing open-hypothesis gate |

## Architecture, language, and research infrastructure

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-12 | OLS 1.0 is a complete canonical publication with declared integrity manifests. | IMPLEMENTATION | OLS 1.0 publication and manifests | independent release review | FOUNDATION | OLS release | release corpus and hashes | SUPPORTED | semantic validation excluded | checksum/release review |
| C-13 | Publication integrity and semantic authority do not establish implementation conformance or domain validity. | IMPLEMENTATION | OLS publication summary; Architecture boundary | independent release review | FOUNDATION | OLS governance | authority separation | SUPPORTED | particular conformance cases | existing conformance gates |
| C-14 | Repository responsibilities remain separated across Research, OLS, implementations, applications, Library, and editorial operation. | IMPLEMENTATION | `ARCHITECTURE/README.md`; `LIBRARY/README.md` | Constitution/adoption review | FOUNDATION | repository architecture | governance hierarchy | SUPPORTED | integrated-runtime evidence not claimed | architecture review |
| C-15 | The Evidence Atlas supports human navigation from bounded claims to owning evidence and limitations. | IMPLEMENTATION | `docs/evidence/README.md` | Discovery Atlas review | WORKING | Evidence Atlas | maintained links and claim units | PARTIALLY SUPPORTED | reader study; machine-readable links | guided external review |
| C-16 | Independent systems can interoperate using OLS. | HYPOTHESIS | OLS examples and SC-19 | none | SPECULATIVE | OLS interoperability goal | syntax/schema/tooling | UNVALIDATED | normative schema, validators, two implementations | recorded interoperability experiment |
| C-17 | The certified ORION Core deterministically produces bounded structural artifacts for accepted inputs. | IMPLEMENTATION | ORION Core contracts, source, tests | scientific audit rerun | WORKING | ORION Core 1.0 | compatible interpreter and fixtures | PARTIALLY SUPPORTED | clean independent replay; audit errors | existing external-adapter route |
| C-18 | ORION is a stable hosted scientific orchestration service. | UNSUPPORTED | SC-21; certified boundary | none | SPECULATIVE | runtime/deployment work | hosted runtime absent | UNSUPPORTED | deployment, auth, persistence, SLOs, users | none active; certification excludes it |
| C-19 | A local NEXAHEDRON adapter demonstrates a bounded human-to-ORION flow. | IMPLEMENTATION | NEXAHEDRON integration docs and source | none | WORKING | local preview | local gateway | PARTIALLY SUPPORTED | production transport and independent replay | bounded external-adapter review |
| C-20 | Requesting six historical radial sheets yields seven observed labels under the current digitization boundary. | IMPLEMENTATION | Demonstrator README/replay notes | none | WORKING | Demonstrator | digitization rule | SUPPORTED | none for current behavior | deterministic replay |

## Editorial and visual claims

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-21 | Thirteen distinguishable editorial operations recur across the reviewed Orientation Translation corpus. | OBSERVATION | Candidate Grammar Assessment | independent editorial review only | WORKING | Orientation Translation | reviewed corpus | PARTIALLY SUPPORTED | author/source independence and recurrence test | recorded independent reconstruction |
| C-22 | Source records, evidence boundaries, traceability, and bounded publication recur as an inspectability practice. | OBSERVATION | Program Reflection final disposition | none | WORKING | Orientation Translation | reviewed artifacts | PARTIALLY SUPPORTED | independent analysts, domains, scale | recorded program review path |
| C-23 | The editorial corpus establishes a provisional cross-domain grammar or formal system. | UNSUPPORTED | Candidate Grammar Assessment | none | SPECULATIVE | editorial synthesis | stable grammar absent | UNSUPPORTED | formal definitions and independent recurrence | current review rejects promotion |
| C-24 | Orientation Translation practices improve reader orientation, navigation, or learning. | HYPOTHESIS | Program Reflection final disposition | none | SPECULATIVE | application program | reader outcome definition | UNVALIDATED | reader experiment | Mission 01 reader-test roadmap |
| C-25 | Polar, wheel, architecture, and application figures establish common mathematics, capability, or physical truth. | UNSUPPORTED | Evidence Atlas E-028; Architecture and IEEE warnings | multiple documentary warnings | SPECULATIVE | visual corpus | source record and formal map absent | UNSUPPORTED | defined maps and evidence | source-by-source review only |

## Dynamical-system and transition claims

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-26 | Transition-related changes are non-uniform in selected phase representations under tested configurations. | OBSERVATION | Research findings and validation outputs; SC-01 | none | WORKING | phase mismatch program | selected representations/events | PARTIALLY SUPPORTED | unified runner, relevant baselines, representation tests | existing held-out/baseline roadmap |
| C-27 | Phase mismatch estimates transition probability. | UNSUPPORTED | historical findings language; SC-02 | none | SPECULATIVE | phase mismatch program | calibrated labels absent | UNSUPPORTED | calibration, scoring, held-out ground truth | recorded preregistration requirement |
| C-28 | Directional/coherence fields reveal localized structure near internally defined changes. | SIMULATION | Research validation and Demonstrator outputs; SC-03 | none | WORKING | transition geometry | selected systems and projections | PARTIALLY SUPPORTED | FTLE/coherent-set/simple baselines | Mission 01 M2 |
| C-29 | The Demonstrator gate field is a local-instability measure, not a transition detector. | SIMULATION | Demonstrator source/tests; Evidence Atlas E-020 | validation test | WORKING | corrected Gate interpretation | deterministic Lorenz proxy | SUPPORTED | broader validation not claimed | bounded replay and M1 protocol |
| C-30 | The current JANUS narrative intends to compare local forward and backward organization. | HYPOTHESIS | JANUS README/formulation; SC-05 | none | SPECULATIVE | JANUS research | unique operator contract absent | UNVALIDATED | frozen semantics and implementation match | Mission 01 DCO contract |
| C-31 | Current JANUS code computes a local statistic from adjacent trajectory differences. | IMPLEMENTATION | `janus_lorenz_field.py`; SC-06 | scientific audit | WORKING | JANUS implementation | current script | SUPPORTED | stronger meaning not supported | code-level reproduction |
| C-32 | JANUS resonance is stronger in original data than orientation surrogates. | UNSUPPORTED | surrogate script and SC-07 | scientific audit | SPECULATIVE | JANUS finding F-18 | degenerate statistic | UNSUPPORTED | corrected frozen statistic and rerun | existing repair-and-refreeze gate |
| C-33 | JANUS apertures or shells predict shell-crossing events. | HYPOTHESIS | JANUS findings/visuals; SC-08 | none | SPECULATIVE | JANUS motifs | events and prediction horizon undefined | UNVALIDATED | labels, baselines, held-out testing | existing replication proposal |
| C-34 | Selected representations exhibit recurring corridor or bottleneck motifs. | VISUAL EVIDENCE | JANUS and transition-geometry outputs; SC-09 | none | SPECULATIVE | transition visual corpus | selected parameters | PARTIALLY SUPPORTED | representation invariance and frozen protocol | source-linked motif audit |
| C-35 | Dynamical organization possesses an emergent topology. | SPECULATION | research maps/geometry outputs; SC-10 | none | SPECULATIVE | topology language | topology/invariants absent | UNVALIDATED | defined topology and invariant evidence | Program B FQ-01 first |
| C-36 | Certain internally defined regions function as recovery anchors. | HYPOTHESIS | Research findings/visuals; SC-11 | none | SPECULATIVE | recovery-anchor language | intervention/outcome definitions absent | UNVALIDATED | frozen recovery benchmark | existing preregistration gate |
| C-37 | Directional geometry supports generalized control recommendations. | UNSUPPORTED | historical application language; SC-12 | current system-state prohibition | SPECULATIVE | control experiments | safety/control validation absent | UNSUPPORTED | control baselines, guarantees, realistic data | no active validation path |
| C-38 | Related non-uniform structures recur across several internally selected systems. | OBSERVATION | Research findings; SC-13 | none | WORKING | cross-system validation | heterogeneous methods | PARTIALLY SUPPORTED | common protocol and external held-out systems | existing cross-system package |
| C-39 | The historical Structural Theorems document contains testable semi-formal propositions but no proofs or universality result. | HYPOTHESIS | `RESEARCH/FOUNDATION/structural_theorems.md`; E-004 | none | SPECULATIVE | Structural Theorems | heterogeneous evidence | UNVALIDATED | formal statements and proofs/tests | Program B reduction |

## IEEE and power-system claims

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-40 | The frozen IEEE-9/IEEE-14 method ran without evaluation retuning and preserved declared provenance and failure boundaries. | IMPLEMENTATION | IEEE Geometry V1 manifest, outputs, tests; E-022 | G3 independent operator implementation | WORKING | IEEE Geometry V1 | pinned benchmark protocol | SUPPORTED | external scientific reproduction | external-replay gates |
| C-41 | Six IEEE geometry operators were independently reimplemented and matched frozen IEEE-9/14 artifacts within the G3 tolerance. | IMPLEMENTATION | `G3_EQUIVALENCE_REPORT.md` | separate standard-library implementation | WORKING | SR-1 G3 | approved protocol and frozen artifacts | SUPPORTED | external party; fresh-source replay | G4/G6 route, currently stopped |
| C-42 | The frozen IEEE canonical artifacts are byte-reproducible in the G4 clean environment. | UNSUPPORTED | `G4_CLEAN_REPLAY_REVIEW.md`; instrumented findings | one authorized diagnostic replay | WORKING | SR-1 G4 | exact-byte gate | UNSUPPORTED | canonical binary environment or approved equivalence rule | official G4 failure preserved |
| C-43 | IEEE geometry detects operational power-system transitions, early warning, or supports control decisions. | UNSUPPORTED | V1 prohibited claims; SC-15/16; E-023 | scientific audit | SPECULATIVE | historical power claims | operational data/baselines absent | UNSUPPORTED | observed outcomes, classical baselines, external review | recorded SR-1 comparison gates; no control gate |

## Rödelheim and current research-program claims

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-44 | Lab 0.2 deterministically separates phase state, temporal cut, projection, retained history, representation mask, and classified record under its synthetic contract. | IMPLEMENTATION | Rödelheim Double Cut Lab 0.2 record/tests | none | WORKING | Rödelheim Lab 0.2 | generated model | SUPPORTED | empirical data not claimed | 19-test deterministic replay |
| C-45 | Boundary-only linear reconstruction missed both persistent hidden switches in the frozen Lorenz double-switch window. | SIMULATION | Rödelheim Lab 0.3 record/results | none | WORKING | Rödelheim Lab 0.3 | frozen Lorenz protocol | SUPPORTED | wider reconstruction comparison not claimed | retain frozen negative result |
| C-46 | Distinct source threads collapse in selected orthographic views while source identity remains separate. | SIMULATION | Rödelheim Thread Loom Lab 0.4 record/tests | none | WORKING | Rödelheim Lab 0.4 | synthetic thread family | SUPPORTED | general identifiability theorem absent | deterministic replay; Program B review |
| C-47 | Information-matched moving mask motion changes error or reacquisition for a fixed estimator. | HYPOTHESIS | Program A review and incoming handoff | none | SPECULATIVE | Moving Mask proposal | protocol not frozen | UNVALIDATED | benchmark, estimator, thresholds, owner | Program A protocol-design gate |
| C-48 | Relational structure adds explanatory power for a defined orientation observable beyond field distribution alone. | HYPOTHESIS | FP/RR/OE handoff; Program B H-01 | none | SPECULATIVE | incoming experiment handoff | output and relation rule undefined | UNVALIDATED | definitions and baseline implementation | Program B FQ-04/RQ-04 |

## Blocked evidence chains

| ID | Claim | Evidence type | Evidence location / primary source | Independent source | Maturity | Historical origin | Dependencies | Validation status | Missing evidence | Existing validation path |
|---|---|---|---|---|---|---|---|---|---|---|
| C-49 | Requested POA, NTO, and controlled DERIS/HYDRA evidence chains are absent from the inspected checkout/history. | OBSERVATION | Evidence Chain Audit; E-025–E-027 | reproducible repository search | SPECULATIVE | discovery audit intake | repository-addressable sources absent | UNVALIDATED | primary artifacts | source admission and separate evidence review |

## Count

`49` unique claim units.
