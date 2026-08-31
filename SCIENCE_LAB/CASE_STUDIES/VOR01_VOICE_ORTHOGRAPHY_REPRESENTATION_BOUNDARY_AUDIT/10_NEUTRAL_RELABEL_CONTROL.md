# 10 — Neutral Relabel Control

Relabelling:

```text
SOUND=A
PHONEME=B
GRAPHEME=C
STRING=D
LEXICAL_ITEM=E
MEANING=F
LANGUAGE=G
ETYMOLOGICAL_RELATION=H
```

The dependency record remains:

```text
G selects the rules relating C/D to B/A.
D plus G and context may identify E.
E carries a bounded relation to F.
H requires historical evidence and cannot be inferred from D or A similarity.
```

After removing all frozen words and `NEXAH`, the anti-collapse rules still hold. The architecture therefore does not depend on suggestive labels or wordplay.

`NEUTRAL_RELABEL_SURVIVES=YES`
