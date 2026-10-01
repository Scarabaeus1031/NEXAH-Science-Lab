# POLAR-LOD-EAM-01 — fifth repair execution report

Date: 2026-10-01
Status: `IMPLEMENTED_AND_LOCALLY_VERIFIED / INDEPENDENT_REVIEW_REQUIRED`
Prospective data accessed: `NO`

## Trigger

The independent fourth-repair review accepted every previously known
missingness and domain-custody closure but demonstrated that `int(...)`
coercion mapped float, boolean and string lookalikes into declared B3
horizons. Python mapping-key equivalence exposed the same risk for M2 and the
expected-target map.

## Repair

One shared `is_canonical_horizon` predicate now runs before grouping or map
lookup. It accepts only values whose exact Python type is `int` and whose value
is a member of `{1,3,7,30}`. It explicitly rejects booleans, integral floats,
fractional floats and numeric strings. Invalid B3 rows are excluded from the
canonical row groups; invalid M2 and expectation keys are excluded from the
canonical maps. Each produces an explicit domain violation and therefore
`OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`.

## Verification

- 27/27 tests pass in the fresh locked test environment;
- new regression loops cover `1.0`, `1.5`, `1.9`, `True` and `"1"` separately
  for B3 rows, M2 keys and expected-map keys;
- the sealed historical replay verifies Root 05 and Lock 05;
- core scientific outputs remain byte-identical:
  - predictions: `19ced79bf121227602587e311204170cbd38fbcab6181660e756d8958e0cc51d`;
  - metrics: `47472398cce09e28214739d66e13a63df6082833b7b5b4078ebd069e7e352a02`;
  - vintage ledger: `f96c1ce1390fb6c625b915da286be2f53aaf78159356c28af7020bf85f00d5ab`.

The updated diagnostic result is
`75e240846ed502fac0cb5e42a1d34af5b38563819f4be40e1bff42b0dc07b654`.
Its historical M6 annotation remains `NOT_ASSESSABLE` under the UTC-custody
limit and visible out-of-population M2 domain.

## Disposition

Repair 5 is locally verified but not self-approved. Independent adversarial
review must attempt canonical-type bypasses across all three horizon-bearing
inputs, recheck the prior missingness/domain attacks and reproduce the sealed
replay. No prospective execution or operational-baseline lock is authorized.
