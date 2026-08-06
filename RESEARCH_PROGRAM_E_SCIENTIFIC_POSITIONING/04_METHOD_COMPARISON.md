# Method Comparison

## Comparison rule

A repository method is comparable only when its input, output, assumptions, and failure behavior match the scientific method being used as a baseline. Similar vocabulary is insufficient.

| ID | Repository object | Established method family | Similarity | Material difference | Required baseline |
|---|---|---|---|---|---|
| E-Q01 | Partial representation map | Sufficient statistics; data-processing inequality; restricted injectivity; inverse problems | Both ask what survives a transformation | Repository has no probability model, named invariant, or loss functional | Rank/null-space and sufficient-statistic analysis on a declared map |
| E-Q02 | Typed Transition and Path records | Labelled transition systems; hybrid automata; attributed/provenance graphs | States, typed edges, traces, and composition are standard | Repository combines temporal, parameter, computed, and hypothetical relations that standard models normally separate | LTS or hybrid-automaton encoding plus W3C PROV side record |
| E-Q03 | BoundaryRecord facets | Missingness/censoring models; set-valued inversion; numerical failure codes | Literature distinguishes mechanisms and observability conditions | No single standard unifies statistical, numerical, physical, and epistemic facets | Separate missingness mechanism, feasible-set/identifiability record, solver status, and domain boundary |
| E-Q04 | Weighted relational state `Q°` | Weighted mean; BLUE/Kalman fusion; Fréchet/Karcher barycenter | Euclidean formula is a standard convex combination | Repository does not define covariance, metric, carrier, or compatibility for generalization | Weighted least squares, robust mean, and Fréchet mean where appropriate |
| E-Q05 | Blind window and projection collapse | Observability tests; regularized inversion; multi-view reconstruction | All test indistinguishability under observation maps | Current Labs are illustrative finite counterexamples, not general observability analyses | Rank/Gramian test, regularized baseline, and explicit equivalence classes |
| E-Q06 | Moving Mask estimator | Kalman filtering with intermittent observations; switched sensing; sensor scheduling | Time-varying observation operators are directly equivalent | “Motion” adds no scientific category; it is one deterministic observation schedule | Fixed Kalman or declared estimator with matched static and moving schedules |
| E-Q07 | Round-trip inconsistency | Cycle consistency; reconstruction residual; inverse consistency | Same forward–reverse discrepancy structure | Cycle consistency is not generally calibrated to information loss | Known-loss synthetic operators, null-space analysis, held-out task error |
| E-Q08 | Field → relation rule → orientation output | Graph invariants; graph-signal statistics; invariant/equivariant learning | Both seek encoding-independent relational quantities | Repository output `g(F,RR)` is undefined; no direct comparison is yet possible | Degree/spectral/path statistics, graph kernels, isomorphism and perturbation tests |
| E-Q09 | Domain/skeleton/spine compression | Graph sparsification, coarsening, lumpability, backbone extraction | Same objective of smaller graph with retained properties | Repository has not named one reduction operator or approximation guarantee | Spectral and cut sparsification, Loukas coarsening, reachability-preserving baselines |
| E-Q10 | Gate and directional-coherence scores | Change-point detection, FTLE/LCS, recurrence analysis, curvature and velocity diagnostics | All generate scores or structures from trajectories | Current Gate is not an event detector; directional statistic is semantically and computationally misaligned | Cost-based change points, recurrence, FTLE/LCS, curvature, shuffled-order nulls |

## Methods already stronger than repository formulations

### Weighted aggregation

Use `weighted mean`, `weighted least-squares estimator`, `multisensor fusion`, or `Fréchet barycenter` according to the carrier and noise model. Retain `Q°` only as historical repository notation.

### Moving Mask

Use `state estimation with a time-varying observation operator` or `intermittent observations`. Retain `Moving Mask` as the name of the repository visual/protocol lineage.

### Round-trip representation loss

Use `cycle-consistency error` for the measured quantity. Do not call it information loss until a relationship to known loss or task error is established.

### Transition/path grammar

Use `labelled transition system`, `hybrid automaton`, `attributed graph`, and `provenance record` according to the source. Do not collapse them into a universal transition object.

### Local transition geometry

Use the exact scalar statistic and the evaluation task. “Gate,” “JANUS,” “aperture,” and “shell” are historical labels, not recognized method classes.

## Existing validation protocols

| Method family | Standard validation pattern |
|---|---|
| Inverse problems | Known forward operator; noise model; regularization fixed on development data; reconstruction error and uncertainty; sensitivity to noise/model mismatch |
| Observability | Rank/Gramian or nonlinear distinguishability analysis; explicit observation map; state equivalence classes; counterexamples |
| State estimation | Frozen state-space model; matched observation schedules; paired noise seeds; error covariance; filter consistency; dropout/recovery analysis |
| Missing data | Missingness mechanism stated; ignorability justified or modeled; sensitivity to MNAR alternatives; coverage and bias |
| Graph invariance | Isomorphism/permutation tests; counterexamples; perturbation stability; simple invariant baselines |
| Graph reduction | Preserved quantities and tolerance predeclared; distortion, reachability, cut, spectral, and runtime measures; diverse graph families |
| Transition diagnostics | Event labels and horizon frozen; held-out systems; ROC/PR and localization error; calibration; ablations; surrogate/null tests |
| Reproducibility | Frozen source and environment; exact-byte and tolerance-based gates kept distinct; independent implementation and fresh replay reported separately |
