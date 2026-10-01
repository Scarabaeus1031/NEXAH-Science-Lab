# POLAR-LOD-EAM-01 — independent third-repair review

Date: 2026-10-01
Bound commit: `eac4b9c0003dfca495049028ed9a1032c85c4897`
Disposition: `FAIL / EXPECTED-MISSING CLOSED / DOMAIN CLOSURE OPEN`
Prospective data accessed: `NO`

## Accepted controls

- all manifests, Trust Root and Execution Lock verified;
- 19/19 tests passed;
- bound CPython, package versions and actual interpreter hash verified;
- sealed replay reproduced all four core outputs byte-identically;
- cache tamper and alternative-lock arguments failed closed;
- jointly removing one expected B3/M2 target at H1, H3, H7 or H30 with
  249 pairs remaining was reported and returned `NOT_ASSESSABLE`;
- direct runner use enforced the interpreter-binary hash;
- only `run_sealed_replay.py` was documented as replay entrypoint.

## Remaining domain findings

The evaluator reported B3 and M2 predictions outside the frozen population but
did not include them in the assessability decision. Strong supported fixtures
with an extra B3 target, extra M2 target or extras in both maps still returned
`OPERATIONAL_RELEVANCE_SUPPORTED`.

The production expected-target comprehension also filtered targets through
the actually present observation map. Removing the same target from observed,
B3 and M2 before that comprehension caused the target to disappear from the
expectation itself. With 249 remaining pairs, all missingness counts were zero
and the evaluator again returned `SUPPORTED`.

A B3 row with undeclared `horizon_days=2` was ignored. Duplicate B3
`(horizon, target)` rows were not rejected before dictionary materialization.

## Required repair

1. derive expected targets solely from admitted forecast origins, declared
   horizons and a frozen evaluation calendar, never from present observations;
2. make any expected missing component or prediction outside the frozen
   population not assessable;
3. require the exact horizon set `{1,3,7,30}`;
4. reject duplicate B3 horizon-target keys;
5. add regression cases for joint observed/B3/M2 loss, unexpected B3, unexpected
   M2, both unexpected maps, undeclared horizons and duplicates.

## Claim ceiling

The package remained a hash-verified historical method replay with an explicit
UTC-custody limit. The review did not authorize an operational-baseline lock,
prospective execution or a reliable `OPERATIONAL_RELEVANCE_SUPPORTED` result.

No files were changed, no prospective data were opened and Mission Control
remained untouched during the review.
