# 02 — Typed Grammatical Representation Schema

## Orthographic side

```text
VISIBLE_MARKS / CHARACTERS
          │
          └─ language-specific convention → BOUND_ORTHOGRAPHIC_UNIT?
                                                 │
LANGUAGE + WORD/PHONOLOGICAL CONTEXT ────────────┤
                                                 v
                                        PRONUNCIATION RELATION
```

Character count and functional-unit count are separate fields. A two- or three-character sequence may be treated as a digraph, trigraph, composite symbol, alphabet letter, ordinary sequence or context-dependent letter-like unit.

## Grammatical side

```text
GRAMMATICAL_FEATURE / SEMANTIC INTERPRETATION
       │
       ├─ overt article or other marker
       ├─ morphology/agreement/word form
       ├─ lexical entry or position
       ├─ context/discourse
       └─ non-overt or zero expression in a defined construction
```

`GRAMMATICAL_MARKER != GRAMMATICAL_FEATURE`. An overt form may carry several features; a feature may be distributed across several locations or recovered contextually.

## Absence states

| State | Meaning |
|---|---|
| `ABSENCE_OF_MARKER` | A specified overt form is not present. |
| `ABSENCE_OF_FEATURE` | The grammatical/semantic feature is not part of the analysis. |
| `ABSENCE_OF_EVIDENCE` | The audit lacks evidence for a classification. |
| `ZERO_MARKING` | A grammar analyzes a contrastive slot as having no overt exponent. |
| `UNEXPRESSED_CONTEXT_RECOVERED` | Interpretation comes from context/discourse without an overt article. |
| `NOT_APPLICABLE` | The category/slot is not relevant to that construction. |

These states cannot be interchanged without a language-specific source.
