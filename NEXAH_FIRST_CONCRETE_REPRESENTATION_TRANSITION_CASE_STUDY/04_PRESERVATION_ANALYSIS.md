# Preservation Analysis

Preservation means satisfaction of the stated criterion, not visual similarity or generic “structure.”

| Transition | Quantity tested | Criterion | Existing result |
|---|---|---|---|
| T01 | registered latent sequence | generated labels equal the repeated protocol walk under declared dwell/repeats | Preserved by deterministic construction |
| T02 | current observations, labels, indices | elementwise identity | Exactly preserved |
| T03 | current observation, labels, sample indices | first two target columns equal `x_t`; labels/indices unchanged | Exactly preserved in all cells by operator definition |
| T03 | predecessor context | final two columns equal `x_{t-1}`, with declared first-row repetition | Exactly derived under boundary convention |
| T04/T05 | pairwise Euclidean distance ratios and ordering | for all row pairs with nonzero distances, normalized distances equal source distances divided by the same positive RMS | Preserved by global translation/scalar scaling |
| T06 | source-state identity through baseline decode/alignment | aligned ID equals latent ID per sample | Mean 1.0; all 20 baseline cells exact |
| T07 | source-state identity through delay decode/alignment | same per-sample equality | Partial: mean accuracy `0.7895645327`; one dominant collision pair in every delay cell |
| T08/T09 | transition counts of the aligned sequence | count every adjacent aligned pair exactly once | Preserved relative to each decoded/aligned sequence by construction |
| T09 vs T08 | graph certificates across representation path | exact serialized certificate equality for paired system | C0: 19/20; C1–C6: 0/20 |
| T10/T11 | registered finite-matrix counts/rates | aggregate numerator/denominator equals exact comparison of frozen cell fields | Existing report and result agree |
| T12 | registered category | apply frozen thresholds/rules without retuning | Existing disposition follows registered association rule |

The central distinction is that T03 preserves the current observation exactly, while the downstream T07/T09 outputs do not preserve state identity or transition certificates. Preservation is therefore operator- and scope-specific; it is not inherited automatically along the full path.

`PRESERVATION_CRITERIA_EXPLICIT = YES`
