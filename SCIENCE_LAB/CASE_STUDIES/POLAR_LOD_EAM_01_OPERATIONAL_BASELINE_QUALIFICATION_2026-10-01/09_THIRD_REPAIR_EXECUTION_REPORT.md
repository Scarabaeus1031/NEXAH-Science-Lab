# POLAR-LOD-EAM-01 — third repair execution report

Date: 2026-10-01
Status: `THIRD_REPAIR_IMPLEMENTED_PENDING_INDEPENDENT_REVIEW`
Prospective data accessed: `NO`
Prospective execution authority: `NO`

## Scope

This bounded repair closes the jointly missing target bypass identified in
`08_SECOND_REPAIR_INDEPENDENT_REVIEW.md` and the remaining runtime-entrypoint
documentation issue. It does not inspect any prospective outcome.

## Frozen expected population

`evaluate_operational_relevance` now requires
`expected_targets_by_horizon` as an explicit input independently constructed
before either prediction map is scored. For every horizon it materializes:

- expected targets absent from B3;
- expected targets absent from M2;
- expected targets absent from observations;
- unexpected B3 or M2 predictions outside the frozen population.

Any missing expected B3, M2 or observed value forces
`OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`; it cannot be hidden by dropping the
same target from both models. The historical expected populations are derived
from the already admitted source-vintage origins before prediction rows are
constructed. Rejected vintages and their reasons remain separately materialized
in the source ledger.

## Adversarial regression

A new synthetic regression test starts with 200 expected targets at every
horizon, removes the same target from B3 and M2 at H1, and retains the observed
value. The repaired evaluator now returns:

- `OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`;
- `paired_n = 199` at H1;
- the removed target explicitly listed under both `expected_without_b3` and
  `expected_without_m2`.

The complete suite now passes 19/19 tests.

## Runtime-entrypoint closure

`02_B3_IMPLEMENTATION_AND_RESULT.md` now documents only
`run_sealed_replay.py`. In addition to the entrypoint check, direct runner use
now verifies the SHA-256 of `sys.executable` against
`RUNTIME_ENVIRONMENT.json`; matching version strings alone cannot satisfy the
execution lock.

## Replay result

A full sealed replay under the independently installed hash-locked environment
passes with:

- status: `HISTORICAL_METHOD_REPLAY_VERIFIED_WITH_UTC_CUSTODY_LIMIT`;
- M6 annotation: `OPERATIONAL_RELEVANCE_NOT_ASSESSABLE` because historical
  UTC custody remains unavailable;
- complete expected historical M6 populations after the declared source-ledger
  exclusions;
- unchanged prediction, metric and vintage-ledger bytes.

Bindings:

- trust root: `c7ed20f6f6821d9522c1783c0f52ed0fd5b5b79de04daa305446202efa38e5de`;
- execution lock: `82dfb253c5f36c918e2cd6258123a91f8bd972992ebfc96513ad3500e838e1fe`;
- runner: `0583671ea92e029a172ed3bf264b385e99b6413822148cc45d280d1b49083e0c`;
- tests: `c799ce0191b6773b3b24ca764fcf3bab702f10cf3daba19727bd2ed6b62fa2bc`;
- machine result: `53d0b387e3418a2f955173da7f0d5cd620fab9d781e1507238c0ab2a218c653c`;
- predictions: `19ced79bf121227602587e311204170cbd38fbcab6181660e756d8958e0cc51d`;
- metrics: `47472398cce09e28214739d66e13a63df6082833b7b5b4078ebd069e7e352a02`;
- source ledger: `f96c1ce1390fb6c625b915da286be2f53aaf78159356c28af7020bf85f00d5ab`.

## Disposition

Repair 3 is implemented and locally verified, not self-approved. A new
independent adversarial review must accept the expected-population closure and
direct-interpreter binding before the operational-baseline lock can close.
