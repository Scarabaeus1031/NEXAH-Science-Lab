# Mathematical Core

Status: `BOUNDED RESEARCH DEFINITION`

## Scope

The theorem-ready core studies identifiable and invariant structure under
declared representation or observation maps.

The following objects are requirements for future formal work. They do not
assert that a theorem exists.

## Representation system

Declare:

- a source space `X`;
- a representation index set or category `R`;
- a target space `Y_r` for each `r ∈ R`;
- a domain `D_r ⊆ X`;
- an observation or representation map

```math
F_r : D_r \subseteq X \to Y_r.
```

Every map shall state its domain, codomain, regularity, parameters and failure
behavior. A partial, non-injective or non-surjective map shall remain explicit.

## Representation change

For admitted changes between representations, declare:

```math
T_{r\to s} : E_{rs} \subseteq Y_r \to Y_s.
```

The system must define:

- identity maps;
- admissible composition;
- compatibility of domains;
- exact or approximate commutation;
- failure when a composition is undefined.

For source map `F_r`, target map `F_s` and representation change `T_{r→s}`, an
exact compatibility statement has the form:

```math
T_{r\to s} \circ F_r = F_s
```

on a declared domain.

Where equality is not required, define a defect measure, for example:

```math
\delta_{r,s}(x)
= d_{Y_s}\!\left(T_{r\to s}(F_r(x)),F_s(x)\right).
```

The metric, norm or comparison rule must be named. A diagram alone does not
establish commutation.

## Identifiability

For one exact observation map, define observational equivalence by:

```math
x \sim_r x'
\iff
F_r(x)=F_r(x').
```

For a tolerant deterministic comparison:

```math
x \sim_{r,\varepsilon} x'
\iff
d_{Y_r}(F_r(x),F_r(x')) \leq \varepsilon.
```

A noisy or probabilistic form requires a separately declared probability model,
decision rule and error criterion.

For a selected view family `J ⊆ R`, define joint equivalence by:

```math
\sim_J = \bigcap_{j\in J}\sim_j.
```

Identifiability is always relative to the declared source class, view family,
comparison rule and tolerance.

## Invariance and stability

Every invariance question shall name an invariant `I` and the relevant object
class.

The required relation must be identified as one of:

- invariance;
- equivariance;
- naturality;
- descent to an equivalence quotient;
- another established relation with an explicit definition.

Formal work must also declare:

- the admissible transformation class;
- a perturbation model;
- a metric or norm;
- a stability margin or bound;
- an undefined or failure set.

The words `structure preserved` are insufficient without the named structure,
transformation and preservation criterion.

## Uncertainty and failure

Keep the following separate:

| Record | Meaning |
|---|---|
| noise | variation represented by a declared deterministic or probabilistic model |
| missingness | an expected record or component is unavailable |
| censoring | observation is limited by a declared mechanism or threshold |
| non-identifiability | distinct admitted sources produce equivalent observations |
| model error | the declared forward model differs from the source-generating process |
| rejection | an input, result or claim fails a declared acceptance rule |

One condition may coexist with another. None may be silently replaced by
`boundary` or `unknown`.

## Interpretation limits

- Provenance preservation is not mathematical identifiability.
- Structural persistence is not truth.
- Invariance is not causality.
- Representation is not Reality.
- A source label retained outside an observation does not make that source
  identifiable from the observation.
- A visual recurrence does not define an invariant.
