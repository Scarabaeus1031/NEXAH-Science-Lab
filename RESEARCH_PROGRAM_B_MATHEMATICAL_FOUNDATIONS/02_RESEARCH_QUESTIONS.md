# Research Questions

Each question below is independent after its foundational dependencies are met. Project terminology has been removed from the formulation.

## RQ-01 — Reconstruction under incomplete and multiple views

- **One-sentence formulation:** Under what conditions can a source state or transition sequence be identified from incomplete records or a family of lossy projections, and when are distinct sources observationally indistinguishable?
- **Mathematical area:** inverse problems; observability; tomography; multi-view geometry; dynamical reconstruction.
- **Possible existing literature area:** observability theory, missing-data reconstruction, state estimation, multi-view inverse problems.
- **Known variables:** source trajectory, projection maps, masks, available boundaries, retained history, and record classes.
- **Unknown variables:** identifiable components, equivalence classes of sources, minimal view family, and recovery conditions.
- **Minimal notation:** source curves and declared projections already used in Labs 0.3–0.4; no new notation required.
- **Objects:** source state/trajectory, masked records, projected records, reconstruction.
- **Mappings:** source-to-record projection; optional reconstruction map.
- **Constraints:** provenance and source identity persist; withheld truth is isolated; reverse map is not assumed inverse.
- **Desired theorem:** identifiability or impossibility conditions for a declared observation family.
- **Possible counterexample:** Lab 0.4 A/B collapse at selected views; Lab 0.3 misses a hidden double switch under boundary-only interpolation.
- **Possible numerical experiment:** replay or extend only those already defined bounded projection/blind-window tests under separate authorization.
- **Possible proof strategy:** rank/nullspace or indistinguishability analysis is suggested by the existing linear setting; no proof is present.
- **Current maturity:** `WORKING`.

## RQ-02 — Estimation under a moving observation mask

- **One-sentence formulation:** Does temporal motion of an information-matched observation mask change error or reacquisition for one fixed history-dependent estimator relative to a static mask?
- **Mathematical area:** state estimation; time-varying observability; missing data; filtering.
- **Possible existing literature area:** switched observation systems, sensor scheduling, intermittent observations, occlusion-aware filtering.
- **Known variables:** finite-dimensional state, observation operators, static/moving masks, estimator, weights, noise, error, and reacquisition time.
- **Unknown variables:** effect size, equivalence threshold, sensitivity to velocity, and scope across models.
- **Minimal notation:** `x_(t+1)=A_t x_t+η_t`; `y_(i,t)=W_(i,t)H_i x_t+ε_(i,t)`; weighted estimator from the existing handoff.
- **Objects:** synthetic state trajectory, time-varying observation record, estimator output.
- **Mappings:** state transition, masked observation, local estimation, translation, weighted aggregation.
- **Constraints:** same trajectory, estimator, mask width, information exposure, and paired noise seeds across the primary comparison.
- **Desired theorem:** none currently justified; the immediate target is a bounded numerical result.
- **Possible counterexample:** no difference after matching removed information, or complete explanation by sample count.
- **Possible numerical experiment:** the already reviewed minimum Moving Mask benchmark.
- **Possible proof strategy:** not present.
- **Current maturity:** `SPECULATIVE`.

## RQ-03 — Round-trip inconsistency as a loss diagnostic

- **One-sentence formulation:** Under what declared comparison rule does forward-and-reverse representation inconsistency measure known information loss rather than coordinate choice or reconstruction artifact?
- **Mathematical area:** inverse problems; approximation theory; representation comparison.
- **Possible existing literature area:** reconstruction error, cycle consistency, autoencoding, numerical conditioning.
- **Known variables:** `F_(r→s)`, a separately declared reverse map `F_(s→r)`, source item `x`, and a representation-specific comparison rule.
- **Unknown variables:** relationship between round-trip discrepancy and lost distinctions; invariance under admissible coordinates.
- **Minimal notation:** `x → F_(r→s)(x) → F_(s→r)(F_(r→s)(x))` already appears in the framework note.
- **Objects:** paired representation maps and source records.
- **Mappings:** forward and reverse maps; neither assumed inverse.
- **Constraints:** comparison metric, domain, map parameters, provenance, and known loss frozen.
- **Desired theorem:** bounds relating discrepancy to a declared loss model under explicit assumptions.
- **Possible counterexample:** a lossy map with a reconstruction prior can have small round-trip error while erasing distinctions.
- **Possible numerical experiment:** the existing proposed representation-loss benchmark.
- **Possible proof strategy:** not present; source proposes comparison against known synthetic loss.
- **Current maturity:** `SPECULATIVE`.

## RQ-04 — Relation-derived observables and encoding invariance

- **One-sentence formulation:** When a field is held fixed, which properties of a declared relational structure determine a derived orientation observable, and which survive an encoding change that preserves those relations?
- **Mathematical area:** graph invariants; network statistics; representation invariance; stability analysis.
- **Possible existing literature area:** graph isomorphism invariants, graph signal processing, sufficient statistics, network robustness.
- **Known variables:** finite field, relation rule or weighted graph, candidate coherence/direction/persistence/stability/navigability outputs.
- **Unknown variables:** exact observable, equivalence of encodings, minimal relation structure, stability norm, and nontriviality.
- **Minimal notation:** `G=(V,E,W)` and `OE=g(F,RR)` occur in the incoming handoff; `g` is not defined.
- **Objects:** finite fields, weighted relation graphs, candidate output vector.
- **Mappings:** relation construction and an undefined derived-output map.
- **Constraints:** field distribution controlled; relation changes independently; output components defined separately rather than hidden in one score.
- **Desired theorem:** existence/uniqueness, stability under relation perturbation, or invariance under an explicitly defined encoding equivalence.
- **Possible counterexample:** two encodings preserve a named relation but change the output because `g` depends on coordinate artifacts.
- **Possible numerical experiment:** existing 20×20 field relation-ablation and encoding-invariance proposals.
- **Possible proof strategy:** the handoff suggests counterexample, perturbation, and invariance analysis; no proof is present.
- **Current maturity:** `SPECULATIVE`.

## RQ-05 — Structure-preserving transport compression

- **One-sentence formulation:** Under which graph reductions do reachability, dominant transport, bottlenecks, and vulnerability remain stable when a reconstructed state graph is compressed to domains, skeletons, or spines?
- **Mathematical area:** graph theory; spectral graph methods; network reduction; dynamical systems.
- **Possible existing literature area:** graph sparsification, lumpability, coarse graining, community detection, network backbones.
- **Known variables:** state graph, weighted directed edges, coherent domains, shortest paths, supergraph, skeleton, spine, perturbation profile.
- **Unknown variables:** preserved property set, approximation bounds, stability to sampling, and generality beyond the recorded benchmark.
- **Minimal notation:** `G=(V,E,W)` is sufficient; the source provides experimental hierarchy rather than a formal reduction map.
- **Objects:** weighted state/transport graphs and their reductions.
- **Mappings:** clustering, aggregation, edge reduction, backbone extraction.
- **Constraints:** evaluation properties and tolerances declared before reduction; generated graph remains tied to source trajectories.
- **Desired theorem:** error or preservation bounds for declared reachability/transport quantities under a specified reduction.
- **Possible counterexample:** removal of a low-weight bridge disconnects rare but valid transport, preserving average paths while destroying reachability.
- **Possible numerical experiment:** existing EXP_44Q–EXP_44S reduction and perturbation sequence.
- **Possible proof strategy:** not present; graph sparsification or lumpability results are possible literature areas, not adopted methods.
- **Current maturity:** `WORKING`.

## RQ-06 — Distinctness of local dynamical diagnostics

- **One-sentence formulation:** Do the retained local-instability and directional-coherence diagnostics provide stable information beyond simpler density, curvature, direction-change, and rotation measures on held-out systems?
- **Mathematical area:** nonlinear dynamics; statistical diagnostics; model comparison.
- **Possible existing literature area:** change-point detection, coherent structures, finite-time stability diagnostics, recurrence and curvature methods.
- **Known variables:** current Gate composite components; candidate forward/backward local statistic; simple baseline measures.
- **Unknown variables:** unique formula for the directional statistic, calibration, noise behavior, effect size, and representation sensitivity.
- **Minimal notation:** retain only the existing Gate composite and the repository's candidate local forward/backward comparison; no new formula is introduced.
- **Objects:** trajectories, reconstructed local fields, scalar diagnostic fields, declared events or held-out labels.
- **Mappings:** estimator components to diagnostic score; score to preregistered comparison outcome.
- **Constraints:** formulas and parameters frozen; held-out cases; nulls and ablations; no transition-probability or causal interpretation.
- **Desired theorem:** none currently justified; empirical distinctness is the first requirement.
- **Possible counterexample:** either score reduces to direction change, curvature, density, or tuning artifacts.
- **Possible numerical experiment:** Mission 01 M1 and M2 validation protocols.
- **Possible proof strategy:** not present.
- **Current maturity:** `WORKING`.
