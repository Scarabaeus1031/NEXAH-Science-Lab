# A3 Two-Independent-Implementers Test

## Verdict

**FAIL.**

| Decision point | Team A | Team B | Can alter science? | Contract resolves? |
|---|---|---|---|---|
| N4 training support distance | full support-model distance including query row (all zero) | leave-one-out or OOF training distance | yes: strata/nulls/P1/P3 | NO |
| Valid positive-direction result failing required null | apply partial-replication clause first | apply non-replication clause first | yes: final label | NO |
| Sensitivity execution/serialization order | V1 config family order | alphabetic/path order | usually artifact order; may affect unpartitioned reductions | NO exact A3 order |
| Regression/reduction row order | canonical row key globally | stored table order | possible binary64/model differences | not explicitly global |
| N1–N4 random draws | A3 namespace/draw contract | same | no | YES |
| Phase/quantile closure and N1 direction | A3 exact rules | same | no | YES |
| N5 transforms and validity | explicit list/minimum | same | no | YES |

The first two rows independently fail the governing zero-discretion test. Cosmetic software choices remain allowed, but these choices change null distributions or classification.
