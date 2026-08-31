# Test Genealogy

`COLLECTION_STRUCTURE = MULTIPLE_BOUNDED_TEST_FAMILIES`

The arrows below are supported only where native files explicitly import or name source records.

```text
GPT-01 ──> CROA-01

ATS-01 ──> PAT-01
   └──────> IOTB-01 <──── IPG-01
                    <──── ASY-01

OVI-01 ────────────────> OVR-01 <──── IOTB-01
   └────────────────────> NVC-01 <──── OVR-01
                         NVC-01 <──── IOTB-01
```

| TEST_ID | PARENT | QUESTION | METHOD | RESULT | STATUS | FROZEN | SUPERSEDED | CANONICAL_OUTPUT | REOPEN_CONDITION |
|---|---|---|---|---|---|---|---|---|---|
| GPT-01 | none stated | frozen 6/9 glyph rotation | 180° rotation + IoU | `GLYPH_TRANSFORMATION_SUPPORTED=YES; ARITHMETIC_RELATION_DERIVED=NO` | terminal result; no explicit CLOSED label | custody-frozen | no | `03_6_9_TRANSFORMATION_TEST.md` | none stated; no run authorized |
| CROA-01 | GPT-01 rotation only | stable cross-representation recurrence? | typed audit + matrix | `E_NO_STABLE_CROSS_REPRESENTATION_OPERATOR_RECURRENCE` | CLOSED | yes by custody | no | `08_CROA01_FINAL_DECISION.md` | STOP |
| ATS-01 | none stated | anchor transport well-defined/specific? | deterministic traces + neutral predicate | `B_DISCRETE_ANCHOR_TRANSPORT_IS_WELL_DEFINED_BUT_GENERIC` | CLOSED | yes by custody | no | `09_ATS01_FINAL_DECISION.md` | STOP |
| PAT-01 | ATS-01 transition | local prime trace content? | gaps, traces, factorization, normalization | `B_LOCAL_PRIME_TRACE_SHOWS_ONLY_STANDARD_GAP_AND_TRACE_STRUCTURE` | CLOSED | yes by custody | no | `10_PAT01_FINAL_DECISION.md` | STOP |
| IPG-01 | none stated | distinguish identity/provenance/generation? | synthetic typed model + controls | `A_IDENTITY_PROVENANCE_GENERATION_FORM_DISTINCT_FORMAL_LAYERS` | CLOSED | yes by custody | no | `10_IPG01_FINAL_DECISION.md` | STOP |
| ASY-01 | none stated | asymmetry gives orientation or motion? | symmetry and static/dynamic controls | `A_ASYMMETRY_SUPPORTS_ORIENTATION_NOT_MOTION` | CLOSED | yes by custody | no | `11_ASY01_FINAL_DECISION.md` | STOP |
| IOTB-01 | IPG-01, ASY-01, ATS-01 | coherent noncollapsing binder? | typed synthesis without recalculation | `A_THREE_CLOSED_AUDITS_FORM_COHERENT_NONCOLLAPSING_BINDER` | CLOSED | yes by custody | no | `12_IOTB01_FINAL_DECISION.md` | STOP |
| OVI-01 | bounded 29-file corpus | historical vocabulary/status inventory? | exact provenance and status ledgers | closed bounded historical inventory | CLOSED | yes by custody | historical source retained | `12_OVI01_FINAL_INVENTORY.md` | reconciliation only, completed by OVR-01 |
| OVR-01 | OVI-01, IOTB-01 | reconcile historical survivors to typed core? | typed reconciliation + controls | `A_OVI_VOCABULARY_RECONCILES_TO_SMALLER_TYPED_FORMAL_CORE` | CLOSED | yes by custody | does not erase OVI | `14_OVR01_FINAL_RECONCILIATION.md` | STOP_AND_REVIEW only; no activation |
| NVC-01 | OVI-01, OVR-01, IOTB-01 | bounded reference presentation | reference card | `CLOSED_REFERENCE_ARTIFACT` | CLOSED_REFERENCE_ARTIFACT | yes by custody | no | `01_NEXAH_RECONCILED_VOCABULARY_CARD.md` | STOP |

GPT-01 is not a successor Transformation Gate and has no supported relation to frozen Gates 1–13N. No successor gate is created.
