# Collaboration Map

## Recommended collaboration fields

| Priority | Field | Questions | Smallest collaboration object | Entry condition |
|---:|---|---|---|---|
| 1 | Inverse Problems | E-Q01, E-Q05, E-Q07 | Formal review of the Lab 0.4 projection map and indistinguishability classes | Source/target sets, projection matrices, identities, and four views frozen |
| 2 | State Estimation | E-Q06 | Review of a preregistered time-varying observation benchmark | Ordinary state-space model, estimator, schedules, seeds, and recovery metric frozen |
| 3 | Nonlinear Dynamics and Signal Processing | E-Q10 | Baseline design review for one local diagnostic | Directional statistic aligned with code; event labels and held-out cases frozen |
| 4 | Network Science | E-Q09, later E-Q08 | Property-preserving graph-reduction comparison | One graph, reduction map, retained properties, and tolerances frozen |
| 5 | Formal Methods and Provenance | E-Q02, E-Q03 | Minimal heterogeneous transition/provenance encoding review | Transition semantics separated from missingness, solver status, and evidence provenance |
| 6 | Geometric Statistics / Sensor Fusion | E-Q04 | Carrier-and-estimator definition review | Demonstrated need beyond Euclidean weighted mean |

## Best external starting point

`Independent review of the existing Lab 0.4 projection case as a finite inverse problem.`

Reasons:

- the source records and four projections already exist;
- the problem can be stated without project terminology;
- the expected output is a finite set of indistinguishability classes and preserved identities;
- standard rank, null-space, and multi-view language applies;
- no new experiment, operator, or universal claim is required;
- a negative result is useful.

## Collaboration packages not ready

| Question | Blocker |
|---|---|
| E-Q04 | No demonstrated need for aggregation outside a Euclidean comparison space |
| E-Q08 | Observable and encoding equivalence undefined |
| E-Q10 directional statistic | Narrative and implementation not aligned |
| OLS interoperability | Normative machine representation and conformance path absent |
| Operational power decision support | Observed outcomes, baselines, domain validation, and safety case absent |

## Collaboration boundary

External collaboration should ask one conventional question and expose one bounded package. It should not ask collaborators to evaluate NEXAH as a whole.
