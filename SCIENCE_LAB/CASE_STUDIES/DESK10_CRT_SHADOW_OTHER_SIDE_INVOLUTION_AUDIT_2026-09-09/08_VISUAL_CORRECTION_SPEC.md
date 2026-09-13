# Visual correction specification

Target marker as transcribed in the audit prompt: `THE 29/31 GATE · CRT & SHADOW`.

Preserve:

```text
29 <- 30 -> 31
PRIME · MACHINE · PRIME
29 + 31 = 60
11357 + 19643 = 31000
```

Replace exactly:

```text
CRT CANDIDATE: 3 + 1000
```

with:

```text
CRT DECOMPOSITION: 31 × 1000
```

Reason: CRT requires a product of pairwise-coprime moduli. `31*1000=31000` and `gcd(31,1000)=1`; `3+1000=1003` is not a CRT decomposition.

No source image matching the marker title or labels was physically identified by exact-text search or targeted OCR in the reviewed Incoming folders. This is therefore a specification against the prompt-supplied transcription, not an executed edit. No visual was modified.
