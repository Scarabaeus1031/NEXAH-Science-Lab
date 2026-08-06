# Research Mapping

## Scope

The question set is the four foundational questions and six research questions in Program B. Program A supplies the concrete Moving Mask protocol under E-Q06. Programs C and D supply maturity, evidence, and application boundaries.

## E-Q01 — Information preservation under a non-invertible transformation

| Field | Record |
|---|---|
| Original repository wording | FQ-01 — “Under what conditions does a partial map between declared representations preserve identity or selected invariants, and how should its information loss and failure set be characterized?” |
| Reduced scientific wording | For a possibly partial, non-injective transformation, which statistics or equivalence classes remain identifiable from the output, and on what domain is recovery impossible? |
| Primary discipline | `Information Theory` |
| Secondary disciplines | Inverse Problems; Statistics; Applied Mathematics |
| Related terminology | data-processing inequality; sufficient statistic; quotient/equivalence class; identifiability; non-injective forward map; regularization |
| Existing mathematical language | Markov kernels, mutual information, sufficient statistics, fibers/preimages, null spaces, injectivity on a restricted set |
| Comparable methods | mutual-information comparison; rank/null-space analysis; sufficient-statistic tests; controlled synthetic projections |
| Representative literature | Cover and Thomas, [Elements of Information Theory](https://doi.org/10.1002/047174882X); Stuart, [Inverse Problems: A Bayesian Perspective](https://doi.org/10.1017/S0962492910000061) |
| Known benchmark problems | Regularization Tools/AIR Tools II; Middlebury multi-view geometry; controlled linear projections |
| Open research questions | Information preservation for nonlinear, partial, stochastic, or task-specific representations; stability under perturbation |
| Required expertise | Information theory; inverse problems; linear algebra; statistics |
| Potential collaborators | SIAM inverse-problems/imaging researchers; information theorists; numerical analysts |
| Current repository maturity | `WORKING`; deterministic projection counterexample exists |
| Gap between repository and literature | The repository lacks a probability model, named invariant, equivalence relation, loss functional, and restricted domain. “Information loss” is currently broader than the literature permits. |
| Overlap | `PARTIAL` |

## E-Q02 — Compositional semantics for heterogeneous transition systems

| Field | Record |
|---|---|
| Original repository wording | FQ-02 — “What minimal typed structure permits transitions and ordered paths to compose without equating temporal, parameterized, graph-native, computed, and hypothetical relations?” |
| Reduced scientific wording | Define a labelled transition system with explicit state, edge, evidence, and parameter types, then specify when paths are composable and which semantics composition preserves. |
| Primary discipline | `Other — Theoretical Computer Science` |
| Secondary disciplines | Graph Theory; Formal Methods; Hybrid Systems; Scientific Data Provenance |
| Related terminology | labelled transition system; transition relation; trace; path category; hybrid automaton; attributed graph; provenance graph |
| Existing mathematical language | `S × L × S` transition relations, traces, bisimulation, source/target maps, partial composition, hybrid automata |
| Comparable methods | model checking; typed/attributed graphs; trace semantics; W3C PROV; domain standards such as SBGN |
| Representative literature | Baier and Katoen, [Principles of Model Checking](https://mitpress.mit.edu/9780262026499/principles-of-model-checking/); Alur et al., [The Algorithmic Analysis of Hybrid Systems](https://doi.org/10.1016/0304-3975(94)00202-T); [W3C PROV-DM family](https://www.w3.org/TR/prov-overview/) |
| Known benchmark problems | mutual exclusion and protocol traces; hybrid-automata reachability; SBGN Process Description examples |
| Open research questions | Minimal common schema across heterogeneous scientific traces without erasing domain semantics |
| Required expertise | Formal methods; transition systems; graph semantics; provenance standards |
| Potential collaborators | Model-checking researchers; research-data standards engineers; COMBINE/SBGN community |
| Current repository maturity | `WORKING`; proposed record types, no interoperability implementation |
| Gap between repository and literature | Standard semantics already exist for homogeneous transition systems. The repository must state whether it needs LTS traces, hybrid automata, provenance, or a typed interchange profile; one universal “transition” type is not justified. |
| Overlap | `PARTIAL` |

## E-Q03 — Missingness, censoring, identifiability, and failure semantics

| Field | Record |
|---|---|
| Original repository wording | FQ-03 — “What minimal structure distinguishes computational failure, structural boundary, censoring, representation limit, underdetermination, and epistemic unknown without forcing them into one boundary operator?” |
| Reduced scientific wording | Represent the observation process, missingness or censoring mechanism, inverse-problem identifiability, numerical failure, and physical-domain boundary as distinct variables. |
| Primary discipline | `Other — Statistics` |
| Secondary disciplines | Inverse Problems; Numerical Analysis; Reliability Engineering |
| Related terminology | MCAR/MAR/MNAR; censoring; truncation; non-identifiability; missing-not-at-random; solver failure; domain boundary; epistemic uncertainty |
| Existing mathematical language | missingness indicator and mechanism; likelihood ignorability; censored likelihood; set-valued feasible solution; failure code; domain of a partial map |
| Comparable methods | missing-data mechanism models; survival/censoring analysis; interval or set-valued estimation; numerical exception and convergence records |
| Representative literature | Rubin, [Inference and Missing Data](https://doi.org/10.1093/biomet/63.3.581); Schafer and Graham, [Missing Data: Our View of the State of the Art](https://doi.org/10.1037/1082-989X.7.2.147) |
| Known benchmark problems | controlled MCAR/MAR/MNAR simulations; right-censored survival data; failed nonlinear-solver campaigns; blind reconstruction windows |
| Open research questions | Joint semantics when statistical missingness, model non-identifiability, and numerical failure coexist |
| Required expertise | Missing-data statistics; inverse problems; numerical analysis; uncertainty quantification |
| Potential collaborators | Statisticians; numerical analysts; research-software reliability reviewers |
| Current repository maturity | `WORKING`; local finite classification and negative reconstruction result exist |
| Gap between repository and literature | “Boundary” is not one scientific object. The repository taxonomy must map each record to the corresponding statistical, numerical, or physical concept and preserve coexistence. |
| Overlap | `PARTIAL` |

## E-Q04 — Existence, uniqueness, and stability of weighted barycenters

| Field | Record |
|---|---|
| Original repository wording | FQ-04 — “For compatible translated inputs and declared weights, when is a relational aggregate defined, unique, stable, and invariant under admissible changes of representation?” |
| Reduced scientific wording | Under what conditions does a weighted barycenter of transformed observations exist uniquely and depend continuously on the observations, weights, and coordinate representation? |
| Primary discipline | `Applied Mathematics` |
| Secondary disciplines | Statistics; Differential Geometry; State Estimation; Sensor Fusion |
| Related terminology | weighted mean; Fréchet mean; Karcher mean; barycenter; consensus; multisensor fusion; robust aggregation |
| Existing mathematical language | convex combinations in vector spaces; minimizers of weighted squared distance in metric spaces; geodesic convexity; estimator bias and covariance |
| Comparable methods | Euclidean weighted least squares; BLUE/Kalman fusion; robust M-estimators; Fréchet/Karcher means |
| Representative literature | Karcher, [Riemannian Center of Mass and Mollifier Smoothing](https://doi.org/10.1002/cpa.3160300502); Pennec, [Intrinsic Statistics on Riemannian Manifolds](https://doi.org/10.1007/s10851-006-6228-4); Khaleghi et al., [Multisensor Data Fusion](https://doi.org/10.1016/j.inffus.2011.08.001) |
| Known benchmark problems | Euclidean sensor fusion; manifold-valued averaging; consensus networks; adversarial/contaminated aggregation |
| Open research questions | Robust, representation-equivariant aggregation on non-Euclidean or partially compatible spaces |
| Required expertise | Convex analysis; differential geometry; estimation theory; robust statistics |
| Potential collaborators | Applied mathematicians; geometric statisticians; sensor-fusion researchers |
| Current repository maturity | `SPECULATIVE`; Euclidean weighted mean written, general carrier undefined |
| Gap between repository and literature | The Euclidean case is standard. A new label adds nothing. Any non-Euclidean claim requires a metric, carrier, convexity assumptions, uncertainty model, and proof of existence/uniqueness. |
| Overlap | `STRONG` |

## E-Q05 — State identifiability from incomplete multi-view observations

| Field | Record |
|---|---|
| Original repository wording | RQ-01 — “Under what conditions can a source state or transition sequence be identified from incomplete records or a family of lossy projections, and when are distinct sources observationally indistinguishable?” |
| Reduced scientific wording | Characterize observability and identifiability of a state or trajectory under incomplete, masked, or multiple observation operators. |
| Primary discipline | `Inverse Problems` |
| Secondary disciplines | State Estimation; Control Theory; Computer Vision; Signal Processing |
| Related terminology | observability; indistinguishable states; inverse problem; tomography; multi-view reconstruction; sensor placement; null space |
| Existing mathematical language | observability matrices/Gramians; rank conditions; nonlinear observation algebras; forward operators; regularization; posterior uncertainty |
| Comparable methods | Kalman/Hautus tests; Hermann–Krener nonlinear observability; Tikhonov/Bayesian inversion; multi-view geometry |
| Representative literature | Hermann and Krener, [Nonlinear Controllability and Observability](https://doi.org/10.1109/TAC.1977.1101601); Hartley and Zisserman, [Multiple View Geometry in Computer Vision](https://doi.org/10.1017/CBO9780511811685); Stuart 2010 |
| Known benchmark problems | Regularization Tools/AIR Tools II; Middlebury stereo/multi-view; Lorenz partial observation; sensor-placement benchmarks |
| Open research questions | Stable observability for nonlinear high-dimensional systems under structured missingness and model error |
| Required expertise | Inverse problems; control/observability; numerical linear algebra; uncertainty quantification |
| Potential collaborators | SIAM inverse-problems community; control theorists; computational imaging groups |
| Current repository maturity | `WORKING`; two bounded counterexamples, no general identifiability result |
| Gap between repository and literature | The repository must replace visual “collapse” language with observation operators, indistinguishability classes, noise assumptions, and a declared recovery criterion. |
| Overlap | `STRONG` |

## E-Q06 — State estimation with time-varying intermittent observations

| Field | Record |
|---|---|
| Original repository wording | Program A / RQ-02 — “Does temporal motion of an information-matched observation mask change error or reacquisition for one fixed history-dependent estimator relative to a static mask?” |
| Reduced scientific wording | For a fixed state-space model and estimator, how does a deterministic time-varying observation matrix affect estimation error and recovery after observation loss relative to a matched static schedule? |
| Primary discipline | `State Estimation` |
| Secondary disciplines | Control Theory; Signal Processing; Sensor Scheduling; Missing Data |
| Related terminology | intermittent observations; packet dropout; switched observation system; time-varying observability; sensor scheduling; occlusion; filter recovery |
| Existing mathematical language | state-space models; time-varying observation matrix `H_t`; Riccati recursion; estimation-error covariance; uniform/complete observability; dropout process |
| Comparable methods | Kalman filter; extended/unscented filters; particle filters; intermittent-observation analysis; active sensor scheduling |
| Representative literature | Kalman, [A New Approach to Linear Filtering and Prediction Problems](https://doi.org/10.1115/1.3662552); Sinopoli et al., [Kalman Filtering With Intermittent Observations](https://doi.org/10.1109/TAC.2004.834121); Khaleghi et al. 2013 |
| Known benchmark problems | linear constant-velocity tracking with scheduled dropout; Lorenz-63 partial observation; packet-loss estimation; occlusion sequences |
| Open research questions | Optimal schedules, structured moving occlusion, nonlinear recovery, adversarial or informative missingness |
| Required expertise | Estimation theory; stochastic systems; control; experimental statistics |
| Potential collaborators | IEEE Control Systems and Signal Processing communities; sensor-scheduling researchers |
| Current repository maturity | `SPECULATIVE`; feasible design only, no frozen benchmark or result |
| Gap between repository and literature | The question is conventional state estimation. The only repository-specific element is the mask schedule. “Reacquisition” must be defined as a standard error/covariance recovery criterion. |
| Overlap | `STRONG` |

## E-Q07 — Diagnostic validity of cycle consistency for information loss

| Field | Record |
|---|---|
| Original repository wording | RQ-03 — “Under what declared comparison rule does forward-and-reverse representation inconsistency measure known information loss rather than coordinate choice or reconstruction artifact?” |
| Reduced scientific wording | Under which assumptions is forward–inverse cycle error calibrated to known loss of identifiability rather than to model bias, regularization, or coordinate choice? |
| Primary discipline | `Inverse Problems` |
| Secondary disciplines | Machine Learning; Information Theory; Computer Vision |
| Related terminology | cycle consistency; inverse consistency; reconstruction error; posterior predictive check; identifiability; regularization bias |
| Existing mathematical language | `d(x,G(F(x)))`; left/right inverse; pseudoinverse; residual; null space; calibration curve against known loss |
| Comparable methods | forward-model residuals; held-out reconstruction error; cycle-consistency loss; posterior predictive checks; condition-number/null-space analysis |
| Representative literature | Cover and Thomas 2006; Stuart 2010; Zhu et al., [Cycle-Consistent Adversarial Networks](https://arxiv.org/abs/1703.10593) as a method example, not a general theorem |
| Known benchmark problems | synthetic rank-deficient operators; Regularization Tools; known blur/downsampling; unpaired translation benchmarks |
| Open research questions | Conditions under which cycle consistency implies identifiability or bounds task-relevant information loss |
| Required expertise | Inverse problems; information theory; statistical calibration; machine learning |
| Potential collaborators | Inverse-problem methodologists; computational imaging researchers; statistical learning theorists |
| Current repository maturity | `SPECULATIVE`; only a proposed benchmark |
| Gap between repository and literature | Cycle error can be small for a lossy map when the inverse inserts prior information. The repository must not call it “information loss” without a proved or empirically calibrated relationship. |
| Overlap | `PARTIAL` |

## E-Q08 — Invariant graph statistics under relation-preserving transformations

| Field | Record |
|---|---|
| Original repository wording | RQ-04 — “When a field is held fixed, which properties of a declared relational structure determine a derived orientation observable, and which survive an encoding change that preserves those relations?” |
| Reduced scientific wording | Define a graph statistic, then test whether it is invariant under graph isomorphism and stable under specified graph or feature perturbations. |
| Primary discipline | `Network Science` |
| Secondary disciplines | Graph Theory; Graph Signal Processing; Machine Learning |
| Related terminology | graph invariant; isomorphism invariance; equivariance; graph signal; sufficient statistic; perturbation stability |
| Existing mathematical language | attributed graph `G=(V,E,X,W)`; graph isomorphism; permutation-invariant statistic; Lipschitz stability; ablation |
| Comparable methods | standard graph invariants; Weisfeiler–Lehman tests; graph kernels; invariant/equivariant graph networks; graph-signal statistics |
| Representative literature | Shuman et al., [Signal Processing on Graphs](https://doi.org/10.1109/MSP.2012.2235192); Newman, [The Structure and Function of Complex Networks](https://doi.org/10.1137/S003614450342480) |
| Known benchmark problems | graph-isomorphism counterexamples; TUDataset; synthetic relation ablations; attributed-graph perturbations |
| Open research questions | Stable and expressive invariants for attributed, dynamic, uncertain, or partially observed graphs |
| Required expertise | Graph theory; network science; invariant learning; statistics |
| Potential collaborators | Network scientists; graph-signal-processing and geometric-learning groups |
| Current repository maturity | `SPECULATIVE`; output function is undefined |
| Gap between repository and literature | There is no repository observable to position. Once defined, it must be compared with standard graph statistics before any new terminology is retained. |
| Overlap | `WEAK` |

## E-Q09 — Property-preserving graph reduction

| Field | Record |
|---|---|
| Original repository wording | RQ-05 — “Under which graph reductions do reachability, dominant transport, bottlenecks, and vulnerability remain stable when a reconstructed state graph is compressed to domains, skeletons, or spines?” |
| Reduced scientific wording | Construct a sparsified or coarsened graph that preserves predeclared reachability, cut, spectral, flow, or rare-path properties within stated error bounds. |
| Primary discipline | `Network Science` |
| Secondary disciplines | Graph Algorithms; Applied Mathematics; Model Reduction |
| Related terminology | graph sparsification; graph coarsening; quotient graph; lumpability; spectral approximation; cut preservation; backbone extraction |
| Existing mathematical language | Laplacian quadratic-form approximation; cut distortion; reachability preservation; Markov-chain lumpability; restricted spectral approximation |
| Comparable methods | spectral sparsification; cut sparsification; graph coarsening; multilevel partitioning; Markov-state aggregation |
| Representative literature | Spielman and Teng, [Spectral Sparsification of Graphs](https://doi.org/10.1137/08074489X); Loukas, [Graph Reduction with Spectral and Cut Guarantees](https://www.jmlr.org/papers/v20/18-680.html); Fortunato 2010 |
| Known benchmark problems | SNAP networks; SuiteSparse matrices/graphs; TUDataset; synthetic bridge and bottleneck graphs |
| Open research questions | Directed, temporal, uncertain, and rare-event-preserving reduction with interpretable guarantees |
| Required expertise | Spectral graph theory; algorithms; Markov processes; numerical linear algebra |
| Potential collaborators | Network-science and graph-algorithms groups; sparse linear algebra researchers |
| Current repository maturity | `WORKING`; graph hierarchy exists, preservation contract incomplete |
| Gap between repository and literature | “Domain,” “skeleton,” and “spine” should be replaced by the actual reduction operation and preserved property. Existing methods are mandatory baselines. |
| Overlap | `STRONG` |

## E-Q10 — Incremental validity of trajectory-based transition diagnostics

| Field | Record |
|---|---|
| Original repository wording | RQ-06 — “Do the retained local-instability and directional-coherence diagnostics provide stable information beyond simpler density, curvature, direction-change, and rotation measures on held-out systems?” |
| Reduced scientific wording | Does a frozen trajectory-derived diagnostic improve out-of-sample event localization or regime segmentation beyond standard change-point, recurrence, curvature, and coherent-structure baselines? |
| Primary discipline | `Dynamical Systems` |
| Secondary disciplines | Signal Processing; Statistical Learning; Fluid Dynamics |
| Related terminology | change-point detection; regime segmentation; Lagrangian coherent structure; finite-time Lyapunov exponent; recurrence quantification; incremental predictive value |
| Existing mathematical language | predeclared event labels; score function; ROC/precision–recall; localization error; ablation; null surrogate; sensitivity and calibration |
| Comparable methods | CUSUM/PELT and cost-based change points; FTLE/LCS; recurrence plots; curvature and velocity baselines; transfer-operator coherent sets |
| Representative literature | Truong et al., [Offline Change-Point Detection Review](https://doi.org/10.1016/j.sigpro.2019.107299); Haller, [Lagrangian Coherent Structures](https://doi.org/10.1146/annurev-fluid-010313-141322); Marwan et al., [Recurrence Plots](https://doi.org/10.1016/j.physrep.2006.11.001) |
| Known benchmark problems | Lorenz-63; Rössler and Duffing systems; double-gyre/Bickley-jet LCS cases; ruptures synthetic change points |
| Open research questions | Robust diagnostics under noise, partial observation, nonstationarity, representation change, and rare transitions |
| Required expertise | Nonlinear dynamics; statistical signal processing; coherent structures; experimental design |
| Potential collaborators | SIAM dynamical-systems community; IEEE signal processing; nonlinear-dynamics and fluid-transport groups |
| Current repository maturity | `WORKING`; Gate has bounded negative evidence, directional statistic is not aligned with its narrative |
| Gap between repository and literature | A local score is not a transition method until event definition, calibration, baseline comparison, and held-out performance are frozen. Current JANUS wording should not be used scientifically. |
| Overlap | `STRONG` |

## Count

| Overlap | Count |
|---|---:|
| `STRONG` | 5 |
| `PARTIAL` | 4 |
| `WEAK` | 1 |
| `NO OBVIOUS MATCH` | 0 |
| **Total** | **10** |
