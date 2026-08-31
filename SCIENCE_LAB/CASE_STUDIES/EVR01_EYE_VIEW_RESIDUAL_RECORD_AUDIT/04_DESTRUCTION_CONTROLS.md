# Destruction Controls

| Control | Operation | Result | Diagnostic |
|---|---|---|---|
| 1 — Untyped collapse | replace all present kinds with `REST` | `FAILS_ABLATED_SCHEMA` | arithmetic offset, reaction product, biological response and representation difference become falsely interchangeable; zero state becomes ambiguous. `UNTYPED_REST_SCHEMA=INFORMATION_LOSS` |
| 2 — Domain-label removal | remove domain names but retain typed fields | `PASS_WITH_CONDITIONS` | cases remain distinguishable through kind, boundary, reference, units/applicability, evidence and claim boundary. Removing those typed fields as well causes collapse. Poetic labels are unnecessary. |
| 3 — Orientation reversal | change arithmetic reference from lower bound to upper bound | `PASS` | source position 8451 is unchanged; representation changes from `+3` (`+3/4`) to `−1` (`−1/4`). Sign/value are reference-bound. |
| 4 — Unit removal | remove units from a dimensional physical value | `DETECTS_INVALID_OR_AMBIGUOUS_RECORD` | a quantitative material/biological record without its unit is incomplete. Qualitative and dimensionless records legitimately use `NOT_APPLICABLE`; they are not assigned zero. |
| 5 — Observation/mechanism swap | upgrade observed growth to proven radiosynthesis or corrosion presence to universal boundary law | `PASS_DETECTS_CLAIM_UPGRADE` | `observation`, `evidence_status`, `unresolved` and `claim_boundary` disagree with the upgraded mechanism claim. |
| 6 — Trace/provenance swap | exchange what was recorded with where the record came from | `FAILS_ABLATED_SCHEMA` | experimental/calculation history and source custody become indistinguishable. The swap destroys `TRACE_NE_PROVENANCE`. |
| 7 — Forced residual | apply schema to reversible `S→S` control | `PASS` | `residual_present=false`; kind/value/sign/unit are `NOT_APPLICABLE`; no trace or loss is invented. |

## Ablation summary

```text
DOES_THE_SCHEMA_PRESERVE_DIFFERENCE_WITHOUT_POETIC_LABELS = YES_WITH_TYPED_FIELDS
INFORMATION_LOSS_UNDER_UNTYPED_REST = MATERIAL
INFORMATION_LOSS_UNDER_DOMAIN_ONLY_ABLATION = CONTROLLED
INFORMATION_LOSS_UNDER_REFERENCE_OR_UNIT_ABLATION = MATERIAL_WHERE_APPLICABLE
OBSERVATION_MECHANISM_UPGRADE_DETECTED = YES
TRACE_PROVENANCE_SWAP_DETECTED = YES
FORCED_RESIDUAL_REJECTED = YES
```

The controls support a shared documentary core only when the record preserves domain, kind, reference/boundary, applicability, evidence and claim limits. This rules out Outcome A.
