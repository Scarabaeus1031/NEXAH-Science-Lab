# Foundational Questions

These questions must be resolved sufficiently to state later problems. They are definition problems, not claims of novelty.

## FQ-01 — Representation maps and information loss

- **One-sentence formulation:** Under what conditions does a partial map between declared representations preserve identity or selected invariants, and how should its information loss and failure set be characterized?
- **Mathematical area:** representation theory in the broad structural sense; inverse problems; information theory; applied category-theoretic comparison where justified.
- **Possible existing literature area:** partial maps, sufficient statistics, quotient maps, inverse problems, model reduction, data-processing inequalities.
- **Known variables:** source space `X_r`, target space `X_s`, declared domain `D_rs`, and map `F_(r→s)` already occur in the framework note.
- **Unknown variables:** preserved invariant, equivalence relation, loss measure, failure set, and conditions for a reverse map.
- **Minimal notation:** `F_(r→s): D_rs ⊆ X_r → X_s`.
- **Objects:** representation-indexed state sets; source and target records.
- **Mappings:** partial, possibly non-injective and non-surjective representation maps.
- **Constraints:** identities, provenance, domain, parameters, uncertainty, and failure behavior remain explicit; reverse does not imply inverse.
- **Desired theorem:** a scoped characterization of when a named property is preserved and when recovery is impossible. No such theorem is present.
- **Possible counterexample:** Rödelheim Lab 0.4 gives distinct source threads that coincide in selected projections.
- **Possible numerical experiment:** the existing four-view projection test or the proposed round-trip representation-loss benchmark.
- **Possible proof strategy:** not present; the sources identify injectivity, rank, and round-trip comparison as candidate tools only.
- **Current maturity:** `WORKING`.

## FQ-02 — Typed transitions and path composability

- **One-sentence formulation:** What minimal typed structure permits transitions and ordered paths to compose without equating temporal, parameterized, graph-native, computed, and hypothetical relations?
- **Mathematical area:** transition systems; graph theory; path categories; hybrid and labelled systems.
- **Possible existing literature area:** labelled transition systems, attributed graphs, hybrid systems, path categories, provenance graphs.
- **Known variables:** representation-indexed states `X_r`, relations `T_r`, typed transition record `τ`, finite path `γ`.
- **Unknown variables:** identity scope, cross-representation composition rule, interruption/censoring semantics, and minimal common fields.
- **Minimal notation:** `T_r ⊆ X_r × X_r`; `γ=(τ_1,…,τ_n)` with matching endpoints where scopes agree.
- **Objects:** states, transition records, ordered paths, path families.
- **Mappings:** source/target maps and selected representation bridges.
- **Constraints:** order, parameter semantics, evidence, uncertainty, boundaries, and representation identity must survive composition.
- **Desired theorem:** necessary and sufficient conditions for well-defined composition within a declared scope. No theorem is present.
- **Possible counterexample:** two paths with identical state sets but different order, censoring, evidence, or representation are not identical.
- **Possible numerical experiment:** the existing proposed interoperability encoding across one graph, one IEEE campaign, one cluster transition, and one censored continuation branch.
- **Possible proof strategy:** not present; the source suggests typed records and explicit composability predicates.
- **Current maturity:** `WORKING`.

## FQ-03 — Boundary, unavailable information, and failure

- **One-sentence formulation:** What minimal structure distinguishes computational failure, structural boundary, censoring, representation limit, underdetermination, and epistemic unknown without forcing them into one boundary operator?
- **Mathematical area:** partial systems; inverse problems; topology only where a topology is declared; logic of partial information.
- **Possible existing literature area:** partial functions, set-valued analysis, viability/reachability boundaries, censored data, missing-data semantics.
- **Known variables:** state, transition, path segment, parameter interval, representation, query, and boundary facets.
- **Unknown variables:** compatibility, overlap, hierarchy, and propagation rules among facets.
- **Minimal notation:** no canonical boundary-operator notation exists in the sources; retain a typed `BoundaryRecord`.
- **Objects:** scoped boundary/failure records and classified samples.
- **Mappings:** attachment of one or more facets to a scoped object.
- **Constraints:** no solver failure becomes a physical bifurcation; unknown is not zero; multiple facets may coexist.
- **Desired theorem:** a consistency result for classification coverage and propagation under declared maps. No general theorem is present.
- **Possible counterexample:** Rödelheim Lab 0.3 shows large reconstruction error and missed events; neither alone defines a physical boundary.
- **Possible numerical experiment:** existing Lab 0.2 classification invariants and Lab 0.3 blind-window test.
- **Possible proof strategy:** finite partition/exclusivity checks exist locally; no general strategy is present.
- **Current maturity:** `WORKING`.

## FQ-04 — Well-posed relational aggregation

- **One-sentence formulation:** For compatible translated inputs and declared weights, when is a relational aggregate defined, unique, stable, and invariant under admissible changes of representation?
- **Mathematical area:** estimation; convex/affine geometry; barycenters; aggregation on structured spaces.
- **Possible existing literature area:** weighted means, Fréchet means, consensus and sensor fusion, robust aggregation.
- **Known variables:** translated estimates `z_i`, nonnegative weights `w_i`, normalized weights `λ_i`, Euclidean aggregate `Q°=Σ_i λ_i z_i`.
- **Unknown variables:** admissible non-Euclidean carrier, compatibility rule, stability constant, ambiguity under translations, and encoding-invariance class.
- **Minimal notation:** use only the weighted estimator already present: `Q°=Σ_i λ_i z_i`, `Σ_i λ_i=1`.
- **Objects:** local records or estimates in one declared comparison space.
- **Mappings:** explicit translations `T_i` followed by weighted aggregation.
- **Constraints:** total weight positive; inputs compatible; meaning of weights fixed; undefined and underdetermined cases retained.
- **Desired theorem:** existence/uniqueness/stability under a declared carrier and aggregation rule. The Euclidean weighted mean case is established mathematics; the general project claim is not defined.
- **Possible counterexample:** ambiguous inverse estimates or incompatible coordinates yield multiple legitimate aggregates or no valid aggregate.
- **Possible numerical experiment:** existing FP/RR/OE ablation proposal and Moving Mask estimator benchmark.
- **Possible proof strategy:** the source names existence, uniqueness, continuity, and invariance questions; no proof is supplied.
- **Current maturity:** `SPECULATIVE`.
