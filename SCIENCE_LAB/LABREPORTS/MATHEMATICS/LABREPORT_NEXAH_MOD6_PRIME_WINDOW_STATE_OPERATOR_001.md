# LABREPORT_NEXAH_MOD6_PRIME_WINDOW_STATE_OPERATOR_001

| Field | Record |
|---|---|
| LABREPORT_ID | `LABREPORT_NEXAH_MOD6_PRIME_WINDOW_STATE_OPERATOR_001` |
| TITLE | Four-state occupancy and prime-index controls for paired `6k±1` windows |
| DATE | `2026-09-28` |
| RESEARCH_BRANCH | `RP-18 / RD-09 — FIELD_GLYPH_NUMBER_ARCHITECTURE`; Prime/CRT discrete-profile lineage |
| PARENT_QUESTION | Do paired `6k-1,6k+1` prime candidates define a reproducible finite state operator, and do lane direction, prime-index parity or prime-index primality provide a material additional rule? |
| SCOPE | `1 <= k <= 100000`; deterministic sieve through 600001; states `11/10/01/00`; full transition table; exact singleton-orientation test; 100-block lane-density null; one-based prime-index parity and index-primality controls |
| CLAIM_TESTED | Exact reproduction of M-025 occupancy counts, first broken double-prime run, finite transition grammar, directional asymmetry, paired-lane dependence and separation of prime value from prime-index properties |
| PREREGISTRATION | `SCIENCE_LAB/CASE_STUDIES/NEXAH_MOD6_PRIME_WINDOW_STATE_OPERATOR_2026-09-28/00_PREREGISTRATION.md` |
| LOCK_HASH | `1aabd49df777351a7e0f260e765022800dcbc4efe07cfba9c945779d4dfab4b7` |
| IMPLEMENTATION_HASH | `93c7f265fa79ac57c607a712cc2d44d6c70a39d165c40dd795e87579a5b633f3` |
| PRIMARY_RESULT | M-025 counts reproduced exactly: `11=5330`, `10=19242`, `01=19194`, `00=56234`; all 16 transitions occur; singleton orientation not material; matched lane-density independence rejected; index-parity and index-primality associations not material |
| REPLAY_RESULT | Primary and clean replay scientific hashes identical: `d6741bd785923548687c4540a8f535246555b07ba9ae13789c60dfde9cd083ea` |
| FINAL_CLASSIFICATION | `VALIDATED_STANDARD_MOD6_OCCUPANCY_OPERATOR` |
| WHAT_WAS_ESTABLISHED | The two standard `6k±1` candidate lanes admit a deterministic four-state occupancy grammar over the frozen finite range; initial states are `11,11,11,10`; all four states and all transitions occur; `10/01` are directionally balanced; the two lanes are dependent relative to the registered local-density null. |
| WHAT_WAS_NOT_ESTABLISHED | Prime generator, privileged direction, physical bubble/resonance mechanism, universal recurrence, infinite twin-prime theorem, novel number theory or predictive validity outside the frozen range |
| NEGATIVE_RESULT | No material link was found between lane and one-based prime-index parity (`phi=0.0097768`) or between lane and whether the prime index is itself prime (`phi=0.00355094`). |
| NEW_INFRASTRUCTURE | `NONE`; case-local deterministic runner only |
| NEW_SCHEMAS | `NONE_CANONICAL`; four-state notation is a bounded arithmetic representation |
| ARCHITECTURE_CHANGES | `NONE`; no Core, ORION, capability, interface or active research program changed |
| NEXT_ACTION | `NONE`; any predictive or infinite extension requires a new Human Owner gate and preregistration |
| ARTIFACTS | `SCIENCE_LAB/CASE_STUDIES/NEXAH_MOD6_PRIME_WINDOW_STATE_OPERATOR_2026-09-28/` |
| FINAL_REPORT_HASH | `c27224ec284cdd6cb905e421230cbeb350645472b1eb8b11c8f4f8ac72e528ee` |
| CLOSURE_STATUS | `CLOSED` |

## Central conclusion

The state operator is useful because it keeps three namespaces separate:

```text
candidate position k -> candidate values 6k-1 and 6k+1
prime value p       -> one-based prime index pi(p)
index property      -> parity or primality of pi(p)
```

The finite occupancy grammar is positive and reproducible. The proposed
prime-index refinements are negative at the frozen materiality threshold.

