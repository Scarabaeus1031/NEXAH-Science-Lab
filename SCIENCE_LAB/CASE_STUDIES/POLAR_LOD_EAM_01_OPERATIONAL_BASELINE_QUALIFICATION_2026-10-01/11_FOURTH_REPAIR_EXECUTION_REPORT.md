# POLAR-LOD-EAM-01 — fourth repair execution report

Date: 2026-10-01
Status: `FOURTH_REPAIR_ATTEMPT / SUPERSEDED_BY_12_REVIEW_FAIL`
Prospective data accessed: `NO`

## Trigger

The independent third-repair review accepted the sealed runtime, canonical
trust root, replay identity and closure of the jointly missing B3/M2 path. It
found four remaining input-domain gaps: the production expectation could still
depend on present observations, extra predictions did not affect assessability,
undeclared horizons were ignored and duplicate B3 horizon-target rows were not
rejected.

## Repair

The expected population is now derived only from admitted forecast origins,
the declared horizon set `{1,3,7,30}` and the fixed inclusive 2025 evaluation
calendar. It is not filtered through the observation, B3 or M2 maps.

The M6 evaluator now returns `OPERATIONAL_RELEVANCE_NOT_ASSESSABLE` when it
finds any of the following before scoring:

- an expected target missing from observations, B3 or M2;
- a B3 or M2 target outside the frozen population;
- an undeclared B3, M2 or expectation horizon;
- a missing required M2 or expectation horizon;
- a duplicate B3 `(horizon_days, target_mjd)` key.

The machine-readable result exposes input-domain violations and all five
missingness/extra-target categories per horizon.

## Verification

- 24/24 tests pass in the fresh locked test environment;
- regression cases include common B3/M2 outage at every horizon, joint
  observation/B3/M2 loss, separate and combined unexpected B3/M2 targets,
  undeclared horizons and duplicate B3 keys;
- the canonical runner verifies Trust Root `ROOT-04`, Execution Lock `LOCK-04`,
  the runtime receipt, dependency lock and interpreter binary hash;
- sealed historical replay succeeds from the private hash-verified cache;
- core scientific outputs remain byte-identical:
  - predictions: `19ced79bf121227602587e311204170cbd38fbcab6181660e756d8958e0cc51d`;
  - metrics: `47472398cce09e28214739d66e13a63df6082833b7b5b4078ebd069e7e352a02`;
  - vintage ledger: `f96c1ce1390fb6c625b915da286be2f53aaf78159356c28af7020bf85f00d5ab`.

The updated diagnostic result is
`b9cd891e2096c9aade6bbeb97b533c00e14270c107de6482f48b6681c0a3f7ce`.
Its historical M6 annotation remains `NOT_ASSESSABLE`, as required by the
unproven UTC custody limit and the now-visible out-of-population M2 domain.

## Disposition

Repair 4 was locally verified but not self-approved. The subsequent review in
`12_FOURTH_REPAIR_INDEPENDENT_REVIEW.md` accepted the missingness, extra-target
and integer-domain closures but found a horizon-type coercion bypass. Repair 5
supersedes this attempt. Independent adversarial review must reproduce the
strict fail-closed domain behavior and the sealed replay before the historical
B3 comparator can be considered operationally locked.
This work does not authorize prospective execution, inspect prospective
outcomes or create a Research Result.
