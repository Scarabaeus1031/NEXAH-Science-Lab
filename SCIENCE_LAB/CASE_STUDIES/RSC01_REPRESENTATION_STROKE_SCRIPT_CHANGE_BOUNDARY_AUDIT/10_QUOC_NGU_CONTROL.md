# 10 — Quốc Ngữ Control

## Verified status

`QUOC_NGU_STATUS=SOURCE_BOUND_ROMANIZED_VIETNAMESE_ORTHOGRAPHY_WITH_TYPED_BASE_AND_DIACRITIC_RELATIONS`

V1 establishes the historical Romanized system. V4 supplies a precise modern encoding control:

- Vietnamese has 12 vowel letters and five tone marks in the cited Unicode account;
- a displayed vowel with tone can be one precomposed code point or a sequence of a base plus combining marks;
- exact glyph placement is rendering/style behavior, not a separate linguistic meaning.

## Distinctions

```text
BASE_LETTER != DIACRITIC
CODE_POINT_COUNT != DISPLAYED_GRAPHEME_COUNT
ENCODING_SEQUENCE != PHONOLOGICAL_SEQUENCE
TONE_MARK != TONE_AS_ABSTRACT_PHONOLOGICAL_VALUE
ORTHOGRAPHIC_UNIT != LEXICAL_MEANING
```

A diacritic is a mark/component with a documented orthographic role. It is not an article, determinative, operator or independently meaningful symbol. The relationship between form, grapheme, syllable and phonological value remains language- and orthography-bound.

