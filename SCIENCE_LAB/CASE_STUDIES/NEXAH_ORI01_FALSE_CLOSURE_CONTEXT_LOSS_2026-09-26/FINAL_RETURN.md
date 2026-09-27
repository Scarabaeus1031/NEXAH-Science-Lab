# NEXAH-ORI-01 — Final Return

Date: 2026-09-26  
Execution state: complete  
Outcome: `TIE_NO_INCREMENTAL_DETECTION_UTILITY`

## Result

The deterministic execution passed the five method-functioning gates and failed the incremental-detection gate by design:

- Aggregate admission rate: male `44.52%`, female `30.35%`; female-minus-male `-14.16` percentage points.
- Directly standardized with common pooled department weights: male `38.73%`, female `43.00%`; female-minus-male `+4.26` percentage points.
- The comparison therefore changes sign when the declared department context is preserved under common weights.
- The strong conventional stratified baseline blocks the aggregate-to-department inference.
- NEXAH also blocks it and records `department under aggregate selection` as lost content.
- Because the strong baseline already detects the error, NEXAH shows no incremental error-detection utility in this case.

## What NEXAH adds here

NEXAH makes the bookkeeping explicit:

- source carrier: the twelve-row table;
- context: department;
- selection: aggregation over department;
- retained: gender, outcome and counts;
- lost: department in the aggregate cut;
- introduced: common pooled department weights in the standardized comparator;
- unresolved: qualifications, decision process and causal discrimination;
- allowed claim: an aggregate descriptive difference and a material context effect;
- blocked claim: the aggregate record alone establishes department-level admissions bias.

That explicit ledger is a representational and audit difference. This run does not show that it improves human judgment, speed, reliability or discovery relative to an expert conventional analysis.

## Interpretation

The first bounded test supports a narrow claim: the NEXAH minimum contract can represent and stop a known false closure under context loss. It does not support novelty or superiority. The correct next scientific question is no longer “can the vocabulary describe the case?” but “does the explicit ledger help a reader or workflow avoid errors that a strong baseline presentation does not?”

## Claim boundary

No new statistics, causal finding, Berkeley finding, scientific theory, truth-machine claim, product claim or incremental-utility claim is created. A reader/workflow test would require separate authorization, preregistration, blinded materials and a strong equal-information baseline.

## Sources

- P. J. Bickel, E. A. Hammel and J. W. O'Connell, “Sex Bias in Graduate Admissions: Data from Berkeley,” *Science* 187 (1975), 398–404. DOI: `10.1126/science.187.4175.398`.
- R `datasets::UCBAdmissions`, six largest departments, 4,526 observations.
