# Preservation and Loss Review

## Preservation

The schema requires object, prose assertion, prose scope, evidence refs, and level, but no equivalence relation, metric/test, or tolerance. Two reviewers can both produce valid records while choosing “grid coordinates,” “candidate class,” “adjacency,” or “selected structure” as the preserved object.

| Case | Defensible preservation | Classification |
|---|---|---|
| A | emitted coordinate equals source grid coordinate at selected index | `OBJECTIVE`, but narrow/tautological |
| B | returned pair occurred under implemented scan/equality criterion | `OBJECTIVE` |
| C | E3 reconstructed state falls within frozen max-error tolerance | `OBJECTIVE`; record-field copying is `CONVENTION_DEPENDENT` |
| D | no single preservation claim; certificate-specific rates are empirical | `CONVENTION_DEPENDENT` on certificate/decoder |

## Loss

The kind vocabulary partially distinguishes structural possibility (`POTENTIAL`) and observed instance loss (`OBSERVED`), but `PROVEN` is ambiguous between mathematical global non-injectivity and a proven omission in an output contract. It lacks source-distinction criterion and witness requirements outside collisions.

Cases A/B clearly omit source values/geometry from targets. This is structural output reduction. Whether two actual inspected instances collide is not established for the legacy images. Case D collisions are observed under a declared decoder equivalence; no external task loss exists.

Preservation and loss are therefore `PARTIAL`: reviewable when the reviewer supplies precise prose, but not consistently constrained by the schema.

