# LABREPORT_A0_BL_046_ROOT_ROOM_537_RECONSTRUCTION_001

| Field | Record |
|---|---|
| LABREPORT_ID | `LABREPORT_A0_BL_046_ROOT_ROOM_537_RECONSTRUCTION_001` |
| TITLE | Root-Room 537 number-to-position reconstruction audit |
| DATE | `2026-10-18` |
| RESEARCH_BRANCH | `A0-BL-046 — Root-Room 537 reconstruction` |
| PARENT_QUESTION | Does frozen plate `ATT-008` determine a reproducible number-to-position grammar distinguishable from controls? |
| SCOPE | Seven label occurrences; one exact historical image; four frozen embeddings; 2,520 shuffles; ten nearby fields; 32 jitter trials |
| CLAIM_TESTED | Number-only spatial determinacy and control selectivity, separate from arithmetic validity |
| METHOD | Exact source lock, declared label-centre pixels, duplicate-value test, pair-distance rank comparison, exhaustive controls, Primary/Replay and structural verifier |
| PREREGISTRATION | [`01_PREREGISTRATION.md`](../../CASE_STUDIES/A0_BL_046_ROOT_ROOM_537_RECONSTRUCTION_2026-10-18/01_PREREGISTRATION.md) |
| LOCK_HASH | Pre-execution source lock `10/10` |
| IMPLEMENTATION_HASH | Retained in frozen `LOCK.json` |
| DATA_POPULATION | All seven visible occurrence anchors on `ATT-008` |
| CONTROLS | all unique label shuffles; common nearby-integer offsets; ±4 px deterministic jitter |
| PRIMARY_RESULT | `UNDERDETERMINED_MULTIPLE_PLACEMENTS_FOR_SAME_VALUE` |
| AUDIT_RESULT | duplicate `57` anchors separated by `519.008670 px`; no model reaches 0.95 shuffle selectivity; nearby fields commonly fit equally or better |
| REPLAY_RESULT | Byte-identical at `af18627120383cc20466ea5f2c2774e7dde8070ce5681eefc0598bd9ec769ce4`; verifier `14/14` twice |
| FINAL_CLASSIFICATION | `VALIDATED_BOUNDED_NEGATIVE_RECONSTRUCTION / OWNER_ACCEPTED` |
| WHAT_WAS_ESTABLISHED | Exact arithmetic survives; number value alone is insufficient to recover plate position under the frozen contract |
| WHAT_WAS_NOT_ESTABLISHED | Historical intent, coordinate grammar, gate roles, pyramid geometry, Base-40 semantics, fractal, Pascal or physical mechanism, novelty, utility or publication |
| REFUTED_ELIMINATED_CLAIMS | Same integer determines one plate position; declared numeric embeddings uniquely select the arrangement; arithmetic supplies geometry |
| NEW_INFRASTRUCTURE | Study-local finite reconstruction runner and verifier only |
| NEW_SCHEMAS | None canonical |
| ARCHITECTURE_CHANGES | None; existing A0-BL-046 and ATT-008 identities reused |
| INFORMATION_BOUNDARIES | `R2_LOCAL_REPLAY` coordinate analysis plus `R1` external-source verification |
| OPEN_QUESTIONS | Whether independently sourced occurrence/gate roles define a separately admissible spatial model |
| DOWNSTREAM_IMPLICATIONS | Repeated numeric labels require typed occurrence roles before spatial reconstruction |
| NEXT_ACTION | `NONE`; any role-augmented model requires new admission |
| ARTIFACTS | [Assessment](../../CASE_STUDIES/A0_BL_046_ROOT_ROOM_537_RECONSTRUCTION_2026-10-18/02_RESULT_ASSESSMENT.md), [evidence map](../../CASE_STUDIES/A0_BL_046_ROOT_ROOM_537_RECONSTRUCTION_2026-10-18/04_EVIDENCE_MAP.md), [Owner closure](../../CASE_STUDIES/A0_BL_046_ROOT_ROOM_537_RECONSTRUCTION_2026-10-18/06_OWNER_CLOSURE_RECORD.md) |
| HASHES | Scientific artifact hash above; closure report hash in Labreport Index |
| CLOSURE_STATUS | `CLOSED / OWNER_ACCEPTED_UNDERDETERMINED_RECONSTRUCTION_2026-10-18` |

## Central conclusion

Exact arithmetic does not recover a unique spatial grammar. The plate needs an
independently sourced occurrence or gate selector before a stronger spatial
model can be tested.

