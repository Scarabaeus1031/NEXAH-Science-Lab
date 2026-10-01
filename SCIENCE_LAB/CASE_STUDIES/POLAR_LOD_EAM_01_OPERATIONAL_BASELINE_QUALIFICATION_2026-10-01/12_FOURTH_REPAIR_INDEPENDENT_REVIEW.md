# POLAR-LOD-EAM-01 — independent fourth-repair review

Date: 2026-10-01
Bound commit: `64da2fc8d9013eae42c994982554efc4d88ac4e5`
Disposition: `FAIL / KNOWN DOMAIN GAPS CLOSED / HORIZON TYPE CLOSURE OPEN`
Prospective data accessed: `NO`

## Accepted controls

- expected targets came only from admitted origins, declared horizons and the
  fixed 2025 calendar, independently of observation, B3 and M2 presence;
- joint B3/M2 loss at every horizon and joint observation/B3/M2 loss returned
  `NOT_ASSESSABLE` with the expected missingness counters;
- unexpected B3, unexpected M2 and both together returned `NOT_ASSESSABLE`;
- missing required horizons, integer horizon `2` and exact duplicate B3 keys
  returned `NOT_ASSESSABLE`;
- 24/24 tests, all relevant manifests, Root 04, Lock 04, runtime identity,
  tamper rejection and a byte-identical sealed replay passed.

## Major finding

The evaluator coerced B3 `horizon_days` through `int(...)` both during domain
checking and row selection. Replacing a valid H1 row by the same expected
target carrying `1.5`, `1.9`, `True` or `"1"` produced no domain violation and
could still return `OPERATIONAL_RELEVANCE_SUPPORTED`. Python key equality also
allowed M2 or expected-map keys `True` or `1.0` in place of integer `1`.

## Required repair

Validate horizon identity before coercion through one shared rule. Accept only
exact, non-boolean integer members of `{1,3,7,30}` for B3 rows and M2/expected
map keys. Add regression cases for float, boolean and string lookalikes.

## Claim ceiling

The package remained a hash-verified historical method replay with an explicit
UTC-custody limit. The review did not authorize an operational-baseline lock,
prospective execution or a reliable `OPERATIONAL_RELEVANCE_SUPPORTED` result.

No files were changed, no prospective data were opened and Mission Control
remained untouched during the review.
