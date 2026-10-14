# LABREPORT_A0_BL_035_SPLINTER_LOCAL_EXTRACTION_001

| Field | Record |
|---|---|
| LABREPORT_ID | `LABREPORT_A0_BL_035_SPLINTER_LOCAL_EXTRACTION_001` |
| TITLE | Local seam extraction over the A0 dynamic-boundary history set |
| DATE | `2026-10-10` |
| RESEARCH_BRANCH | `A0-BL-035 — Splinter / B / Inside-Out` |
| PARENT_QUESTION | Does a local seam-and-corner `SPL_LOCAL` signature reduce exact terminal-class ambiguity beyond the 7×8 address without class leakage? |
| SCOPE | Frozen post-hoc extraction over the 100 exact A0-BL-021 histories, 56 two-step addresses and 56 typed terminal classes; radii 0, 1 and 2 only |
| CLAIM_TESTED | A bounded local seam-and-corner representation is sufficient and compressed relative to the address baseline, with no terminal-label leakage |
| METHOD | Deterministic extraction of M0 address, M1 profile, M2 oriented seam, M3 local radii, M4 full-history and excluded-oracle M5 signatures; exact class-collision and conditional-entropy accounting; frozen controls |
| PREREGISTRATION | [`01_PREREGISTRATION.md`](../../CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10/01_PREREGISTRATION.md) |
| LOCK_HASH | `f5b1bd87258f5f1943043b2f79adcf1cf0991185f272f7ce800d3f4765bc8758` |
| IMPLEMENTATION_HASH | `9fb306a171d12423f0121c5fba6c8f768629a412f6d2ed5f37e9e327ca45d3a2` |
| DATA_POPULATION | The complete frozen A0-BL-021 population: 100 histories, 56 address cells and 56 exact typed terminal classes |
| CONTROLS | Frozen predecessor hash; exact record/address/class counts; zero/one indexing invariance; cyclic address-reindex metric invariance; `J²=id` at all radii; terminal oracle excluded; independent structural verifier |
| PRIMARY_RESULT | M0 address has 56 signatures, 54 cross-class collision pairs and conditional entropy `0.950195500087` bits. M2 and every tested M3 radius have zero collisions but 100 signatures for 100 histories. |
| AUDIT_RESULT | All mandatory controls PASS; independent verifier PASS; initial sandboxed launch emitted no result and no interpretation, then the unchanged locked sequence completed under filesystem authorization |
| REPLAY_RESULT | Primary and replay bytes are identical; SHA-256 `e8e05d7a20db80130d8473a02a31d9b5a62604e008d9ac8cedfebf8dc661e1b3` |
| THEORETICAL_RESULT | Local seam orientation joined to address is injective on the frozen history set, but the tested local neighborhoods preserve that one-signature-per-history granularity and therefore do not form a compressed selector |
| FINAL_CLASSIFICATION | `SPLINTER_PARTIAL` |
| WHAT_WAS_ESTABLISHED | Address alone is ambiguous for the typed terminal classes. Oriented seam and all tested `SPL_LOCAL` radii distinguish every frozen history without label leakage in their construction. The exact result is reproducible at R2. |
| WHAT_WAS_NOT_ESTABLISHED | No compressed sufficient Splinter selector, autonomous operator, total class-level `J` map, declared `C5` automorphism of the open K5 carrier, physical inside/outside mechanism, generalization beyond the finite population, PENT-08, canonical vocabulary or publication claim |
| REFUTED_ELIMINATED_CLAIMS | Address alone selects terminal class; zero collisions alone implies compression; `SPL_LOCAL` improves on M2; cyclic reindex invariance establishes carrier `C5`; this finite involution identifies a physical Splinter mechanism |
| NEW_INFRASTRUCTURE | Study-local signature extractor, exact ambiguity/compression metrics and structural verifier |
| NEW_SCHEMAS | Case-local result schema `nexah.a0-bl-035.splinter-local-result/1.0.0`; none canonical |
| ARCHITECTURE_CHANGES | None; A0, SCC-003, A0-BL-021, PENT-01–07, OLS, NEXAH Core and canonical Families unchanged |
| INFORMATION_BOUNDARIES | Complete finite predecessor population and byte-identical local replay; no independent implementation, external replication or evidence outside the frozen A0-BL-021 records |
| OPEN_QUESTIONS | Alternative compressed representations, a separately specified class-level `J` map, transfer to other carriers and independent reimplementation require separate admission |
| DOWNSTREAM_IMPLICATIONS | Preserve address, seam orientation and history as distinct typed information. Retain “Splinter” only as a bounded descriptive corridor term unless a future admitted test establishes more. |
| NEXT_ACTION | `NONE`; any successor requires a new Human Owner admission |
| ARTIFACTS | [Study package](../../CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10/README.md), [`PRIMARY_RESULT.json`](../../CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10/artifacts/PRIMARY_RESULT.json), [`REPLAY_RESULT.json`](../../CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10/artifacts/REPLAY_RESULT.json), [result assessment](../../CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10/02_RESULT_ASSESSMENT.md) |
| HASHES | Lock `f5b1bd…8758`; implementation `9fb306…d3a2`; verifier `d49b5a…5fc`; primary/replay `e8e05d…e1b3`; package manifest recorded in the Study |
| CLOSURE_STATUS | `CLOSED / OWNER_ACCEPTED_2026-10-10` |

## Central conclusion

The bounded extraction succeeds as a description but not as compression. The
address baseline is ambiguous, whereas address plus oriented seam separates
all 100 frozen histories. Adding the tested `SPL_LOCAL` neighborhoods does not
improve that representation: each radius still yields one signature per
history.

The appropriate maintained result is therefore `SPLINTER_PARTIAL`. “Splinter”
may name this bounded local transition description, but it has not been shown
to be a compressed selector, an autonomous operator or a physical mechanism.

## Owner closure

The Human Owner accepted the result on `2026-10-10` with “ergebnis
akzeptiert.” The Study is closed. No successor, PENT-08, vocabulary promotion,
publication or external action is activated by this closure.

