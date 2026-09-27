# ORI-04 Scoring Specification

## Machine scoring

- `decision_correct = 1` when response equals gold, else `0`.
- `false_closure = 1` only when gold is `BLOCK` and response is `ALLOW`.
- `false_block = 1` only when gold is `ALLOW` and response is `BLOCK`.
- `insufficient = 1` when response is `INSUFFICIENT`.
- confidence is rescaled to `[0,1]`.
- Brier score uses correctness as the event and the participant's confidence in the selected answer as its forecast.
- time is the instrument's elapsed milliseconds for the case; report median and distribution, not only mean.

## Missing-information scoring

The frozen `key_concepts` are stems, not exact required phrases. Two blinded raters score whether the response identifies the decisive limitation:

- `1` — at least one case-relevant key concept or an unambiguously equivalent concept;
- `0` — absent, incorrect or merely restates the claim.

Automated keyword matching may be reported as a reproducibility aid but is not the authoritative score.

## Handoff scoring

Each rater records three binary fields:

- `source_retained`;
- `limitation_retained`;
- `claim_ceiling_retained`.

The handoff score is their sum from `0` to `3`. Preserve both raters' raw scores. Report agreement before any consensus score.

## Condition coding

Analysts receive condition codes `X` and `Y`. The mapping to `BASELINE` and `NEXAH` remains hidden until primary tables and exclusions are frozen.

## Required analysis outputs

- participant and case counts by condition;
- false-closure rate on BLOCK cases;
- correct-decision rate and ALLOW-control error rate;
- missing-information score;
- median decision time;
- confidence and Brier score;
- handoff score and inter-rater agreement;
- paired participant differences;
- case-level direction table;
- all exclusions with preregistered reason.
