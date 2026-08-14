# F47 scientific mode-invariance audit

The review constructed `F` and `R_SIM` independently from the A5XEF synthetic evidence generator using one shared nonregistered namespace and identical scientific rows. Only the typed identity, corresponding evidence flags and their provenance differed.

An independently implemented canonicalizer produced exactly equal scientific evidence objects for both modes and matched the sealed A5XEFR canonicalizer in each case.

Four complete derivations were then executed:

```text
A5XEF reference(F)
A5XEF independent(F)
A5XEF reference(R_SIM)
A5XEF independent(R_SIM)
```

All complete nested outputs were equal. Their canonical digest was:

`5eaaa0b9d779515926fd99c89f1096474dac333980d8313d4c745f72ad92cb01`

Explicitly covered objects included population hashes, model-spec hash, action-derived outputs, null-world hash, bootstrap intervals, N5, P4 attribution/dominance, diagnostics, all sensitivities, P1–P5, execution state and final nested synthetic classification.

The inner synthetic classification (`PARTIALLY REPLICATED`) is conformance-test material only. Every A5XEFR top-level output retained `CONFORMANCE_ONLY`, `scientific_result=false`, `classification=null`, and `release_permitted=false`.

Scientific mode invariance: **PASS**.
