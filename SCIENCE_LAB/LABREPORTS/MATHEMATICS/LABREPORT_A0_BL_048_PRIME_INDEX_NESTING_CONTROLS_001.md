# LABREPORT_A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_001

| Field | Record |
|---|---|
| LABREPORT_ID | `LABREPORT_A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_001` |
| TITLE | Prime-index nesting matched-permutation control audit |
| DATE | `2026-10-18` |
| RESEARCH_BRANCH | `A0-BL-048 — Prime-index nesting controls` |
| PARENT_QUESTION | Do `717717`, `4774` and `1771` show prime-index nesting selective against complete digit-multiset controls and stronger than reversal/palindrome baselines? |
| SCOPE | Three target strings; unique permutation classes `15/6/6`; Cartesian null population `540` |
| CLAIM_TESTED | Selectivity of a frozen contiguous-substring prime-index nesting score |
| METHOD | Complete enumeration; exact tail multiplicities; reversal closure; palindrome fixed-point comparator |
| PREREGISTRATION | [`01_PREREGISTRATION.md`](../../CASE_STUDIES/A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_2026-10-18/01_PREREGISTRATION.md) |
| LOCK_HASH | Pre-execution source lock `10/10` |
| IMPLEMENTATION_HASH | Retained in frozen `LOCK.json` |
| DATA_POPULATION | All 540 matched target tuples |
| CONTROLS | digit-multiset permutations, reversal membership, palindrome fixed points, exact 4774/4114 source arithmetic excluded from score |
| PRIMARY_RESULT | `FAIL_PRIME_INDEX_SELECTIVITY_PALINDROME_BASELINE_DOMINATES` |
| AUDIT_RESULT | Prime score `5`, tail `228/540`; three-palindrome target score, tail `12/540`; reversal-membership failures `0/540` |
| REPLAY_RESULT | Byte-identical at `a14ad110ed00ee9f1b5616328427b1fb3fb02527b9bc10cb054201c2a5fd083f`; verifier `15/15` twice |
| FINAL_CLASSIFICATION | `VALIDATED_BOUNDED_NEGATIVE_SELECTIVITY_RESULT / OWNER_ACCEPTED` |
| WHAT_WAS_ESTABLISHED | The frozen prime-index score is not selective within the complete matched finite population; palindrome fixedness is the stronger representation baseline |
| WHAT_WAS_NOT_ESTABLISHED | Independent palindrome discovery significance, prime law, recurrence, `40/3` cycle, mechanism, prediction, natural privilege, novelty or publication readiness |
| REFUTED_ELIMINATED_CLAIMS | The selected decimal strings are distinguished by the registered prime-index nesting score; reversal closure is selective |
| NEW_INFRASTRUCTURE | Study-local exact permutation enumerator and verifier only |
| NEW_SCHEMAS | None canonical |
| ARCHITECTURE_CHANGES | None; existing A0-BL-048 and Number View identities reused |
| INFORMATION_BOUNDARIES | `R2_LOCAL_REPLAY`; finite selected decimal strings only |
| OPEN_QUESTIONS | None under the exposed score; a different rule requires independent motivation and new admission |
| DOWNSTREAM_IMPLICATIONS | Matched digit controls and multiplicity reporting are mandatory before interpreting decimal motif recurrence |
| NEXT_ACTION | `NONE`; do not repair the exposed score |
| ARTIFACTS | [Assessment](../../CASE_STUDIES/A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_2026-10-18/02_RESULT_ASSESSMENT.md), [evidence map](../../CASE_STUDIES/A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_2026-10-18/04_EVIDENCE_MAP.md), [Owner closure](../../CASE_STUDIES/A0_BL_048_PRIME_INDEX_NESTING_CONTROLS_2026-10-18/06_OWNER_CLOSURE_RECORD.md) |
| HASHES | Scientific artifact hash above; closure report hash in Labreport Index |
| CLOSURE_STATUS | `CLOSED / OWNER_ACCEPTED_PRIME_INDEX_SELECTIVITY_FAIL_2026-10-18` |

## Central conclusion

The chosen decimal motifs are not selectively explained by the frozen
prime-index nesting rule. A simpler palindrome property is stronger in the
matched ensemble but remains conditioned on the supplied visual selection.

