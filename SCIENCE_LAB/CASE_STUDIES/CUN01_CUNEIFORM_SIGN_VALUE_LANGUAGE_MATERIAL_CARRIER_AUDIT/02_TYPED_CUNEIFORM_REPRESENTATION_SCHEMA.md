# 02 — Typed Cuneiform Representation Schema

## Minimal model

```text
MATERIAL_CARRIER
    └─ bears → INSCRIBED_MARKS / WEDGE_IMPRESSIONS
                  └─ compose → SIGN_FORM
                                  └─ identified as → SIGN
                                                       │
LANGUAGE + PERIOD + INSCRIPTION_CONTEXT ───────────────┤
                                                       v
                                             CONTEXTUAL_SIGN_VALUE
                                              /        |         \
                                      SYLLABIC   LOGOGRAPHIC   DETERMINATIVE
                                              \        |         /
                                               LEXICAL_READING?
                                                       │
                                                       v
                                             MEANING / INTERPRETATION

HISTORICAL_ATTESTATION constrains every historical/value assertion.
```

Not every branch occurs for every sign. A determinative may constrain a lexical reading without itself being an ordinary pronounced syllable or an independent lexical item in that occurrence.

## Required cuneiform-specific fields

| Field | Role | Non-equivalence |
|---|---|---|
| `MATERIAL_CARRIER` | Tablet, cone or other sourced object class. | carrier != inscription |
| `INSCRIBED_MARK` | Individual physical impression/stroke. | mark != sign |
| `SIGN_FORM` | Period/style-bound graphic realization. | form != value |
| `SIGN` | Assyriological sign identity/name. | sign != word or sound |
| `SIGN_VALUE` | Attested context-dependent reading/function. | value != meaning |
| `VALUE_TYPE` | Syllabic, logographic, determinative or other attested function. | function types do not collapse |
| `LANGUAGE` | Selects possible mappings. | script != language |
| `PERIOD/CORPUS` | Bounds historical and palaeographic claims. | current sign list != universal timeless form |
| `INSCRIPTION_CONTEXT` | Constrains valid reading. | visible form alone is insufficient |
| `HISTORICAL_ATTESTATION` | Source and evidence state. | reconstruction/analogy != attestation |

## Operator vocabulary check

| Relation | Classification | Reason |
|---|---|---|
| Stylus produces mark in clay | `B_DOMAIN_SPECIALIZATION` of a physical transformation | Exact historical technique is domain-specific. |
| Marks compose a sign form | `B_DOMAIN_SPECIALIZATION` | Sign construction requires cuneiform rules. |
| Context relates sign form to value | `C_NON_OPERATOR_RELATION` | It is an interpretive/orthographic relation, not an execution event. |
| Determinative constrains semantic class | `C_NON_OPERATOR_RELATION` | Classification information is not automatically a NEXAH filter. |
| Lexical list records equivalences/glosses | `C_NON_OPERATOR_RELATION` | Documentary mapping, not proof of an operator. |

No exact operator match is needed and none is promoted. The boundary model is the primary result.
