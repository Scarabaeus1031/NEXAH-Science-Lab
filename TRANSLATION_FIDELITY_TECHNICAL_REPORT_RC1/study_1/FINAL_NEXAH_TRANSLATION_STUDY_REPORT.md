# Final NEXAH Translation Study Report

Disposition: `RESEARCH / NOT_ADOPTED`  
Scope: minimal controlled cross-representation study; full operator battery not executed

## Primary answer

What survived that was not guaranteed by definition?

The **unlabeled directed support topology** of the canonical v0.7 local
transition graph, together with its SCC/WCC sizes, one weak articulation count
and directed distance multiset, survived nonlinear injective `[x,x³]` and
one-step-delay representations of the same controlled trajectory. It also
survived one seeded small-noise realization and factor-two coarsening.

That preservation is not explicitly encoded as an invariant and is not a
general mathematical property of preprocessing + sliding windows + KMeans.
It is therefore a **candidate cross-representation invariant**, not a NEXAH
discovery, universal invariant or physical invariant.

## What did not survive?

- Transition probability values/rank multisets changed under nonlinear,
  delay and coarsened representations.
- Lossy `x²` projection changed the support topology, eliminated the weak
  articulation and changed graph distances.
- A genuine sequence change adding an A→C shortcut did **not** change coarse
  topology/articulation/distances; only weights changed.
- Source-space bottleneck location could not be compared because cluster IDs
  are local and the public output omits label sequence and cluster centers.

## Interpretation

NEXAH's coarse local transition support can be more representation-robust than
its weighted transition information on this fixture. The two layers are
complementary:

- support topology carries a robust but lossy structural skeleton;
- weights carry finer sequence/occupancy information but are sensitive to
  representation and sampling.

The strongest falsification is that robustness of the skeleton did not imply
sensitivity to a controlled structural shortcut. Thus `invariance !=
informativeness` and `structural sensitivity != prediction`.

## Novelty firewall

Common-phase, common-speed, Euclidean and graph-isomorphism invariances remain
known/definitional properties, not NEXAH results. The affine representation is
only an implementation control. Deterministic replay is software evidence.

No information was shown to survive beyond the declared synthetic trajectory,
adapter configuration and local-fit graph representation. No physical,
predictive, early-warning, stability, risk, failure or control capability was
demonstrated. IEEE/PEGASE was not executed.

## Repository translation limitation

Current canonical NEXAH does not expose a geometry→graph translation with an
explicit source-to-graph correspondence. Historical sequential adapters often
write adjacency directly, making ordering preservation definitional. A new
bridge was intentionally not invented here.

## Single most informative next experiment

Independently preregister a small family of controlled trajectories with known
but varied branch/bottleneck structures, freeze several admissible
representations and v0.7 configurations, and test whether the unlabeled support
certificate discriminates structural shortcuts while remaining stable across
faithful representations. Require a source-to-cluster correspondence artifact
or explicitly retain only label-free claims. This is replication/falsification,
not IEEE escalation.

```text
CANONICAL_OPERATORS_CHANGED = NO
APPLICATION_001_CHANGED = NO
LEVEL1C_CHANGED = NO
IEEE_EARLY_WARNING_RERUN = NO
POST_RESULT_RETUNING = NO
```

NEXAH_TRANSLATION_STUDY_NONTRIVIAL_CANDIDATE_FOUND
