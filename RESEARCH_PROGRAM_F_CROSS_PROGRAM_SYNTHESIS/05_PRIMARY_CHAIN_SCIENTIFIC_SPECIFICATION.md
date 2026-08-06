# Primary Chain Scientific Specification

## 1. Scientific title

`Finite Identifiability Classification Under Four Orthographic Projections`

Repository provenance title: `Rödelheim Observatory — Thread Loom Projection Test · Lab 0.4`.

## 2. Research question

For four fixed orthographic observation maps applied to four deterministic source curves, which source identities are observationally indistinguishable from the displayed records, and which views distinguish them?

## 3. Null or comparison statement

Comparison statement: compute the partition of source identities induced by displayed-record equality under each authorized view and compare the four partitions while retaining source identity independently of projection.

Null statement: no authorized view induces a non-singleton indistinguishability class among distinct source identities under the frozen criterion.

## 4. Mathematical objects

- source identity set `S={A,B,C,D}`;
- parameter domain `T=[0,1]` or one frozen finite grid `T_N`;
- deterministic source curves `γ_s:T→R³`;
- authorized view set `Θ={0°,90°,180°,270°}`;
- displayed-record space `R²`;
- depth diagnostic in `R`;
- view-specific equivalence relation on `S`;
- post-projection availability classes and mask, excluded from the primary identifiability comparison unless separately declared.

## 5. Forward or observation maps

For `θ∈Θ`:

```text
P_θ(x,y,z) = (u,v)
u = x cos(θ) + z sin(θ)
v = y
```

The retained depth diagnostic is:

```text
d_θ(x,y,z) = -x sin(θ) + z cos(θ)
```

`d_θ` is not part of the displayed observation used to define indistinguishability. The representation mask is applied after `P_θ` and must remain outside the primary map comparison.

## 6. Known data

- exact deterministic formulas for source curves A–D in the Lab 0.4 model;
- stable source identity and sample index;
- four authorized projections;
- A and B share their `y,z` path and differ in `x`;
- model defaults and test fixtures, including the recorded 121-sample test family;
- existing pairwise projection and source-distance functions;
- existing nineteen-check test record;
- C-46 bounded support and the Lab 0.4 non-claims.

## 7. Unknowns

- whether the scientific result is analytic over `T` or finite over `T_N`;
- the canonical sample grid if finite;
- whether equality is exact or tolerance-based;
- the admissible tolerance and its numerical justification;
- whether indistinguishability applies to whole paths, matched samples, or individual points;
- the minimum additional observation required to separate each non-singleton class;
- external replay behavior.

## 8. Equivalence or identifiability criterion

Protocol-design candidate:

```text
s ~_θ s'  iff  P_θ(γ_s(t)) = P_θ(γ_s'(t))
for every declared t in T or T_N.
```

If numerical tolerance replaces equality, the protocol must name the norm, threshold, parameter correspondence, and aggregation rule. Source identities remain distinct even when `s ~_θ s'`.

This criterion is the critical definition to freeze. This document does not freeze it.

## 9. Failure conditions

- analytic and sampled claims are mixed;
- tolerance changes after inspection;
- pointwise coincidence is reported as whole-path equivalence;
- source IDs are merged after projection;
- depth is used both to define and diagnose displayed indistinguishability;
- the post-projection mask is treated as part of the source map;
- unauthorized view angles enter;
- implementation and protocol formulas differ;
- source, test, or environment snapshot is not identifiable;
- a finite result is generalized beyond the four curves and views.

## 10. Existing evidence

- Lab 0.4 model implements four deterministic curves and the declared projection equations;
- the test record contains nineteen deterministic checks, including A/B collapse at `90°`, distinction at `0°`, identity preservation, and depth-separated coincidence diagnostics;
- the Lab documentation states that `180°` mirrors `0°` and `270°` mirrors `90°`;
- Program C records C-46 as supported within this synthetic scope;
- Program D records the Labs 0.2–0.4 family as a demonstrated synthetic observation-boundary instrument;
- Program E places the bounded identifiability question in established inverse-problems and multi-view language.

No test was rerun by Program F.

## 11. Missing evidence

- frozen scientific protocol and signed authority record;
- canonical source snapshot and file-level hashes;
- independent analytic derivation of all four partitions;
- clean replay of the exact frozen package;
- independent review record;
- explicit result record using the four Program F result classes.

## 12. Benchmark or finite case

The benchmark is the existing Lab 0.4 finite control case. External datasets are unnecessary for the first chain. Regularization Tools and Middlebury remain later comparators only if the scope expands under separate authority.

## 13. Baselines

- direct pairwise comparison of displayed `(u,v)` paths;
- direct pairwise comparison of source curves in `R³`;
- kernel/rank description of each linear projection;
- view-specific partition of `S`;
- depth diagnostic used only to show source separation after displayed coincidence;
- unmasked projection as the primary record baseline.

## 14. Required validation

1. freeze continuous or sampled scope;
2. freeze source formulas, grid, equality rule, norm, tolerance, and pair matching;
3. derive the expected partition under every authorized view;
4. bind formulas to a hashed source snapshot;
5. verify implementation output against the analytic or finite derivation;
6. preserve source identity and post-projection mask separation;
7. record failures and non-claims;
8. obtain independent inverse-problems and reproducibility review.

## 15. Expected result classes

Exactly one:

| Result | Meaning |
|---|---|
| `positive` | At least one predeclared non-singleton indistinguishability class is established and the full four-view partition record passes the frozen checks. |
| `negative` | The predeclared collapse or separation statement is contradicted under the frozen criterion, with protocol integrity intact. |
| `inconclusive` | The evidence does not distinguish the comparison because of numerical sensitivity, insufficient sampling, or unresolved equivalence interpretation, while the protocol remains valid. |
| `invalid protocol` | A failure condition prevents interpretation, including source drift, criterion drift, map mismatch, identity loss, or unavailable evidence. |

## 16. External review field

Primary: `Inverse Problems`.

Secondary: Applied Linear Algebra; Multi-view Geometry; Scientific Reproducibility.

## 17. Required expertise

- finite-dimensional inverse problems and identifiability;
- linear algebra and projection geometry;
- numerical tolerance and reproducibility review;
- repository provenance sufficient to verify the source snapshot.

## 18. STOP conditions

Stop protocol design if authority, source snapshot, analytic-versus-sampled scope, equivalence criterion, tolerance, result classes, or review owner is absent.

Stop later execution if any frozen input changes, if source identity is merged, if the mask is conflated with the source, or if the result is generalized beyond the finite case.

## 19. Provenance appendix requirements

- repository title and Lab 0.4 identity;
- source file paths and hashes;
- model, test, HTML, and Lab note versions;
- Mission 02, Programs B–E, and C-46 references;
- historical terms and their scientific replacements;
- source/record/mask distinction;
- all prohibited physical, cosmological, universal, OLS, JANUS, ORION, and application transfers;
- prior results preserved without rewriting.

## 20. Next authorized design action

After owner approval, authorize one documentation-only protocol-design package that freezes the finite object, equivalence criterion, source snapshot, hashes, baselines, validation checks, result classes, and external-review gate.

Do not run the model, modify Lab 0.4, contact reviewers, publish, or adopt the result through this action.
