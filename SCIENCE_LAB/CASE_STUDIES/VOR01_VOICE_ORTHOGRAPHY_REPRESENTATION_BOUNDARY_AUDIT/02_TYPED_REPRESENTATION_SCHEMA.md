# 02 — Typed Representation Schema

## Minimal record

```text
ReferentOrConcept? ──lexical selection──> LexicalItem
                                         │
                                         ├─ language: Language
                                         ├─ grammatical role / sense
                                         ├─ orthographic form: OrthographicString
                                         │    └─ grapheme sequence
                                         └─ phonological form
                                              └─ phonetic realization(s)

LexicalItem ──historical evidence──> EtymologicalRelation / HistoricalAncestry
```

`PhysicalSound` is a concrete acoustic event. `PhoneticRealization` is its linguistically described realization. A `Phoneme` is a language-specific contrastive category. A `Grapheme` is an orthographic unit. These are connected by language- and context-specific relations, not equality.

## Required distinctions

| Type | Minimum role | Must not collapse into |
|---|---|---|
| `LANGUAGE` | Selects a linguistic system. | orthographic string, meaning |
| `ORTHOGRAPHIC_STRING` | Ordered written form. | pronunciation, lexical item |
| `GRAPHEME` | Language-specific written unit. | phoneme, sound event |
| `PHONEME` | Language-specific contrastive sound category. | grapheme, phonetic token |
| `PHONETIC_REALIZATION` | Documented pronunciation form/token class. | physical event, spelling |
| `LEXICAL_ITEM` | Language-bound word/reading with grammatical and semantic fields. | bare string, concept |
| `MEANING` | Bounded sense/semantic description. | lexical identity, ancestry |
| `ETYMOLOGICAL_RELATION` | Source-attested historical relation. | similarity score |
| `HISTORICAL_ANCESTRY` | Diachronic claim with evidence. | plausible reconstruction |

## Representation-change test

The notation `R_EN(X)`, `R_DE(X)`, `R_FR(X)` is valid only when `X` is declared. In the translation controls, `X` is a bounded linguistic category (vowel or consonant), and the claimed preservation is approximate lexical meaning/category. String, pronunciation and full grammar are not preserved.

No invariant equation is asserted. Translation equivalence is a typed relation, not identity.

## Audit finding

The closed vocabulary can preserve boundaries, but it cannot generate the language-specific mapping relations. Pronunciation, orthographic convention, lexical sense and history remain external domain fields supplied by linguistics.
