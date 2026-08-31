# 08 — Zero / Non-overt Marker Control

## Bounded articleless comparison

WALS records Serbian-Croatian as having no definite or indefinite article. A Croatian scholarly account states more specifically that Croatian has no article system, that definiteness is often inferred from utterance context, and that adjective inflection, pronouns and other lexical/morphosyntactic devices can contribute to the contrast.

Therefore, for the bounded Croatian comparison:

```text
NO_VISIBLE_PREPOSED_ARTICLE != NO_DEFINITENESS_INFORMATION
NO_ARTICLE_IMPLIES_NO_DEFINITENESS=NO
ZERO_OR_NONOVERT_ENCODING_SUPPORTED=YES
```

The mechanism must be classified per occurrence:

- `CONTEXTUALLY_INFERRED` or `DISCOURSE_INFERRED`;
- `MORPHOLOGICALLY_MARKED_ELSEWHERE` where the grammar supports it;
- `LEXICALLY_SPECIFIED` where a lexical item contributes;
- `ZERO_MARKED` only where a specific grammatical analysis licenses that term;
- `NOT_APPLICABLE` where definiteness is not the relevant category.

Absence is not promoted to a universal operator or one universal zero-marker mechanism.
