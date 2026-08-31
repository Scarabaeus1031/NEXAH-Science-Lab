# Final Decision

```yaml
case: RETURN_17_MIRROR_RESIDUE_LAB
date: 2026-08-23
primary_category: C_POST_HOC_CONSTRUCTION
arithmetic_calibration: PASS
historical_coupling: POST_HOC_COUPLING_ONLY
local_selectivity: FAIL
modulus_selectivity: FAIL
cycle_semantics: UNRESOLVED_PLUS_ONE
deterministic_replay: PASS
source_files_modified: NO
prior_cases_modified: NO
commit_created: NO
claim_adopted: NO
next_action: NONE
```

## Decision rationale

The congruence and subtraction-order sign reversal are exact. They are not historically independent or selective:

1. `41` and `74` are independently present together only as two export-sequence filenames. The corresponding images do not display or couple those numbers.
2. The retrospective report mentions 17, 33, and 41, but contains no exact 74 token and explicitly treats special number roles as hypotheses.
3. No contemporaneous source fixes 17 as the cycle length for this pair.
4. Eight of 25 neighboring pairs already yield ±1 at modulus 17.
5. Seven moduli in 2–40 yield signed ±1 for the fixed difference -33.
6. Post-hoc modulus selection produces +1 for 88.46% of ordered pairs in the bounded P2 list and at least once in every deterministic random-control set.
7. The archive does not distinguish return-record +1 from an external-anchor +1.

The primary category is therefore `C_POST_HOC_CONSTRUCTION`, rather than merely `B_EXACT_ARITHMETIC_NONSELECTIVE`: both nonselectivity and the lack of independent operand/modulus selection are observed, and the latter is decisive.

## Crown boundary

- `SPATIAL_CROWN`: unchanged completed synthetic result.
- `TEMPORAL_RETURN_CROWN`: not established; only a possible term for a separately declared closed sequence.
- `HISTORICAL_CROWN_ORIGIN`: not established.

```text
EXACT CONGRUENCE DOES NOT BY ITSELF ESTABLISH A PRIVILEGED OPERATOR.
THE LAB TESTS SELECTION, PROVENANCE AND RETURN SEMANTICS.
THE COMPLETED SPATIAL-CROWN DECISION REMAINS UNCHANGED.
NO CROSS-DOMAIN CLAIM IS ADOPTED.
```
