# Conformance Fixtures

`RID01_FIXTURES.json` contains exactly 20 schema-level documents.

| ID | Control | Expected |
|---|---|---|
| C1 | geometry-only source/view | valid |
| C2 | measurement-only source/view | valid |
| C3 | composite view | valid |
| C4 | same graph, different embeddings | valid |
| C5 | same state/value source, multiple readouts | valid |
| C6 | equal rendered readouts, different value sources | valid |
| C7 | transform rule/event/result lineage | valid |
| C8 | augmented graph with source/event | valid |
| C9 | transform spec substituted for result | invalid |
| C10 | measurement value without event | invalid |
| C11 | ambiguity with candidates/causes | valid |
| C12 | abstain without coerced decision | valid |
| C13 | reconstruction distinct from original | valid |
| C14 | equal returned state criterion, different history | valid |
| C15 | reset retaining history | valid |
| C16 | restart with new execution ID | valid |
| C17 | repeat with distinct event ID | valid |
| C18 | provenance erased | invalid |
| C19 | zero/null/unknown/absent distinction | valid |
| C20 | ordered event provenance | valid |

Validation executed for RID-01 is schema/fixture and declarative reference consistency only. It is not Rust/runtime conformance and does not execute ORION V1 C1–C18.

`CONFORMANCE_FIXTURE_COUNT=20`

`JSON_SYNTAX_VALID=YES`

`JSON_SCHEMA_LOCAL_REFS_VALID=YES`

`FIXTURE_EXPECTATIONS_MATCH=20_OF_20`

`VALID_FIXTURES_ACCEPTED=17_OF_17`

`EXPECTED_INVALID_FIXTURES_REJECTED=3_OF_3`

`REFERENCE_ID_ORDER_CHECKS=PASS`

