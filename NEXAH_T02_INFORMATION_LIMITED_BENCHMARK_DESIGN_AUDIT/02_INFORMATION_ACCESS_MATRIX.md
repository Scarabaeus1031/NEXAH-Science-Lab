# Information Access Matrix

Legend: `Y` available, `N` unavailable, `S` scorer only, `C` common constrained.

| Method | raw stage observations | source observations | paired time samples | state correspondence | task identity | train labels | state count | map identity | training cases | ground truth | held-out future | compute budget |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| NEXAH candidate | Y | Y as stage 0 | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| task-risk direct estimator | Y | Y | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| reconstruction baseline | Y | Y | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| conditional-information baseline | Y | Y | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| Markov/lumping diagnostic | Y | Y | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| graph-expressivity baseline | derived graphs from same O | same | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| approximate-bisimulation baseline | empirical models from same O | same | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| simple statistical estimator | Y | Y | Y | N | Y | Y | N | N | Y | N | unlabeled only | C |
| scorer | Y | Y | Y | S | Y | train+test | S | S | S | S | labeled | unconstrained validation |

No diagnostic receives privileged correspondence, task semantics, labels,
preprocessing or tolerances. The scorer's extra access is used only after all
outputs are sealed. Any method-specific preprocessing time counts against the
same resource budget.

Potential asymmetry: some baselines may be inapplicable because empirical states
are not Markov or reconstruction is not defined. Inapplicability must produce
`UNKNOWN`, not exclusion. Applicability is frozen by mathematical preconditions,
not observed performance.

