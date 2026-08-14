# Minimum Schema Fields

## Retained fields

| Field | Why indispensable |
|---|---|
| `schema_version` | enables compatible evolution |
| `translation_id` | stable edge identity |
| `source`, `target` | typed representations plus concrete artifact references |
| `operator` | kind, implementation/definition, version, parameters, assumptions |
| `claims` | object-specific preservation, loss, collision, and introduced structure |
| `uncertainty` | typed quantified or explicitly unquantified limitations |
| `invertibility` | separates inverse, recovery, and many-to-one cases |
| `task_relevance` | optional but fail-closed task claims |
| `evidence` | typed support references cited by assertions |
| `provenance` | repository/commit/implementation and chain traceability |
| `status` | edge verification state |
| `negative_results` | durable failed/reduced claims without deletion |

## Folded or removed candidates

- Separate `inputs`/`outputs` duplicate `source.artifacts`/`target.artifacts`.
- `operator_version` and `parameters` belong inside `operator`.
- Free-text `preserved_structure`, `lost_structure`, and `introduced_structure` become typed lists under `claims`.
- `assumptions` belong to the operator and distinguish operational from interpretive assumptions.
- A generic prose `evidence` string is prohibited; assertions cite evidence IDs.

The schema is deliberately edge-centric. It is not a universal registry of concepts.
