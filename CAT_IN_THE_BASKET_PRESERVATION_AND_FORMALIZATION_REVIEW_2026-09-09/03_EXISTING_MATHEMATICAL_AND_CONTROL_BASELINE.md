# Existing Mathematical and Control Baseline

## Currentness result

The constituent ideas are established. The candidate does not require new mathematics, physics or biomechanics.

| Concept | Baseline | Class | Candidate boundary |
|---|---|---|---|
| configuration and state space | A configuration space encodes positions/configurations; a state may additionally include velocities and other variables. Feasible motion must respect declared constraints. [LaValle, *Planning Algorithms*](https://lavalle.pl/planning/book.pdf) | KNOWN_MATHEMATICS | Do not collapse configuration, state and trajectory spaces. |
| feasible set / constraint manifold | Equalities and inequalities define admissible subsets; smooth equality constraints may form a manifold under regularity conditions. | KNOWN_MATHEMATICS | `B_feasible` is not automatically a manifold or connected. |
| reachable set | States reachable from fixed initial conditions under admissible controls and horizon. | KNOWN_CONTROL_CONCEPT | Feasible does not imply reachable from the selected start. |
| viability kernel | Initial states from which at least one admissible evolution remains in a constraint set. [Aubin et al., viability definition](https://people.eecs.berkeley.edu/~sastry/pubs/OldSastryALL/AubinViability.pdf) | KNOWN_CONTROL_CONCEPT | A basket drawing is not a computed viability kernel. |
| trajectory | Time-indexed state/control evolution satisfying dynamics. | KNOWN_MATHEMATICS | A static curve is not validated dynamics without timing and law. |
| local coordinate chart | A chart maps a neighborhood homeomorphically—and smoothly where applicable—to an open Euclidean subset. [Lee, *Introduction to Smooth Manifolds*](https://edu.fjfi.cvut.cz/studijni-materialy/Ing/4.%20ro%C4%8Dn%C3%ADk/GMF2/John%20M.%20Lee%20%28auth.%29%20-%20Introduction%20to%20Smooth%20Manifolds-Springer%20New%20York%20%282003%29.pdf) | KNOWN_MATHEMATICS | A crop or magnification is a visual patch, not automatically a mathematical chart. |
| occupancy / probability density | A density is defined relative to a measure and data-generating/sampling protocol; time occupancy can be represented by an occupation measure. [Occupation-measure definition](https://doi.org/10.1016/j.ejcon.2024.101088) | KNOWN_MATHEMATICS | Density does not by itself mean stability, preference or causation. |
| motor equivalence / task-relevant variability | Joint-level variability can be decomposed relative to stabilization of a declared task variable. [Scholz & Schöner 1999](https://pubmed.ncbi.nlm.nih.gov/10382616/) | KNOWN_MOTOR_CONTROL_CONCEPT | Comparable return requires a task variable; UCM is not licensed without data/Jacobian analysis. |
| functional degeneracy | Structurally different elements may yield the same function/output in a context. [Edelman & Gally 2001](https://doi.org/10.1073/pnas.231499798) | KNOWN_MOTOR_CONTROL_CONCEPT | Different bodies are not thereby guaranteed a shared corridor. |
| optimal control | A controller minimizes a specified objective under dynamics and constraints. | KNOWN_CONTROL_CONCEPT | Optimum depends on objective/model and need not be unique or Human-preferred. |
| Pareto frontier | Nondominated feasible objective vectors remain when no objective can improve without worsening another. [Boyd & Vandenberghe](https://www.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) | KNOWN_MATHEMATICS | No scalarization or universal optimum is assumed. |
| equivalence class | Equality under a reflexive, symmetric and transitive relation partitions a domain. | KNOWN_MATHEMATICS | Pairwise metric closeness is generally not transitive and must not be mislabeled equivalence. |
| observer projection / fiber | Many-to-one projections merge source states; the preimage/fiber contains compatible sources. | KNOWN_MATHEMATICS | Similar images do not prove dynamical equality. |
| return and residual | Return is a declared task/observer output; residual is a typed difference, information loss or unresolved remainder under a comparator. | NEXAH_COMPOSITE_FORMULATION | Neither term has one universal law across NEXAH. |
| cat/basket/dance imagery | mnemonic for body/system, constraint space and selected path | VISUAL_MNEMONIC | Explanatory only. |
| corridor stability/preference | a corridor or high-density region is stable/preferred | UNTESTED_HYPOTHESIS | Requires topology, dynamics, samples and estimator. |

## Necessary distinctions

`feasible`, `reachable`, `viable`, `optimal`, `frequent` and `selected` are different predicates. A feasible state may be unreachable from the initial state. A reachable state may not permit indefinite constraint satisfaction. A frequent path may be slow, oversampled or projected together with other paths. A Pareto point is not automatically selected.

`EXISTING_MATHEMATICS_COVERAGE=COMPLETE_FOR_BOUNDED_COMPOSITE_SPECIFICATION`

