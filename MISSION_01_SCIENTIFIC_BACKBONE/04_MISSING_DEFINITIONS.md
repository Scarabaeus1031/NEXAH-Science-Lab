# Missing Definitions

## Priority 0 — Authority and naming

### 1. Library `operator` versus OLS `primitive operator`

Missing: one explicit cross-system statement that Registry `type: operator` means controlled visual concept, while OLS Operator IDs own primitive semantic behavior.

Risk: the same word creates two apparent canonical inventories.

Minimum addition: a short vocabulary-boundary note and machine-readable semantic reference from each Registry concept to OLS concepts/operators.

### 2. Scientific operator namespace

Missing: a stable namespace for numerical research measurements that are neither OLS primitives nor Library concepts.

Proposed pattern:

```text
RESEARCH-GATE-INSTABILITY-v1
RESEARCH-JANUS-DCO-v0
APP-IEEE-GEOMETRY/<measurement-id>
```

The namespace must encode scope and version. It must not imply OLS ownership.

### 3. JANUS identities

The architecture separates principle, Bridge, and DCO, but historical files continue to reuse `Janus Operator` for several functions.

Minimum definition: a one-page identity table with permitted names, prohibited substitutions, and migration references.

## Priority 1 — Common scientific records

### 4. Typed Transition record

Define a binding candidate record containing:

```text
id, source, target, ordering_semantics, interval,
status_class, evidence_refs, uncertainty, representation_scope
```

Required status classes: observed, computed, declared, interpolated, hypothetical. An optional probability must declare conditioning and normalization and must not imply a Markov kernel.

### 5. Path contract

Define composability, identity, ordering, parameter semantics, interruptions, censoring, evidence lineage, uncertainty, and representation scope. A list of frames is not enough.

### 6. Boundary taxonomy

Separate at minimum:

- solver/computational failure;
- sampling/resolution limit;
- structural cut or reachability boundary;
- censoring or incomplete continuation;
- epistemic unknown;
- representation boundary;
- domain-of-validity boundary;
- governance/authority boundary.

One record may carry several facets. No facet should be silently reinterpreted as a physical bifurcation.

### 7. Representation map contract

Define source and target representation IDs, domain, method, parameters, identity rule, information loss, provenance, uncertainty, failure behavior, and whether a reverse map exists. A reverse map does not imply an inverse.

### 8. Query/focus contract

Define which fields belong to the represented system and which belong to the orientation question: focus, target, constraints, comparison basis, desired scope, and stopping condition.

## Priority 2 — Research measurement contracts

### 9. Gate Instability Measure

Still missing:

- exact estimator and bandwidth contract for density;
- exact coherence sign/range convention;
- curl/rotation behavior outside three dimensions;
- normalization fit domain and leakage controls;
- missing-data and boundary behavior;
- null baselines and calibration targets;
- preregistered relation to observed transitions.

Until defined, `G(x)` is reproducible only relative to a concrete script and dataset.

### 10. Janus Directional Coherence Measure

Still missing:

- one chosen overlap measure;
- exact discrete and continuous definitions;
- orientation/sign convention;
- minimum sampling and neighborhood rules;
- irregular-spacing behavior;
- noise sensitivity and insufficiency status;
- null model;
- distinction from direction-change and curvature;
- preregistered transition-related hypothesis.

### 11. Metric and geometry declarations

Every representation-specific metric needs variables, units, normalization, invariances, fit data, information loss, validity scope, and failure conditions. Geometry must not be inferred from plotted coordinates.

## Priority 3 — Evaluation definitions

### 12. Reader orientation outcome

The repository has strong artifact-level functions but no measured reader behavior. Define tasks such as locating current position, identifying evidence boundaries, preserving asymmetry, and selecting a justified continuation. Do not collapse comprehension, preference, speed, and correctness into one score.

### 13. Independent recurrence

Define independence at author, source, institution, language, domain, and template levels. The current four editorial units correct file dependence but not common authorship or cultural dependence.

### 14. Cross-domain portability

Define a falsifiable criterion for transferring a contract across domains. Shared labels or shapes are insufficient. Input/output compatibility, measurement semantics, and failure behavior must survive the transfer.

### 15. Maturity assignment

Define who assigns `FOUNDATION`, `WORKING`, `SPECULATIVE`, `DUPLICATE`, and `OBSOLETE`, what evidence is required, when re-review occurs, and whether maturity describes semantics, implementation, or empirical support. This report separates those dimensions; the repository should do the same.
