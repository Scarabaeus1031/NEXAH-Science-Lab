# NEXAH-ORI-04 — Reader and Handoff Utility

Date: 2026-09-26  
State: preregistered design; human execution not started  
Study class: randomized within-reader crossover pilot

## Primary question

With identical case information, does the NEXAH orientation layout reduce critical false closure relative to a strong plain-language structured baseline?

## Conditions

Both conditions show the same nine value fields in the same order. Only the field labels differ.

- Baseline: Source, Context, Question, Selection, Present, Missing, Added, Open, Difference.
- NEXAH: Omega/Source, X/Context, Q/Question, S/Selection, I/Retained, L/Lost, A/Introduced, U/Unresolved, epsilon/Residual.

Both are strong structured presentations. The baseline is not deliberately weakened. Values, claim wording and response controls are byte-identical across conditions.

## Cases

Eight cases span statistics, particle physics, historical topography, relativity, provenance and symbol namespaces. Four claims are `BLOCK`; four are `ALLOW`. Case order and condition assignment are counterbalanced across eight forms.

## Participants

- minimum pilot: 12 completed participants;
- target pilot: 24 completed participants;
- adults able to read German technical prose;
- no requirement for specialist expertise;
- record self-rated familiarity per domain;
- exclude the Human Owner and anyone who has seen the answer key or case construction.

No recruitment begins until a separate Human Owner authorization confirms participant route, consent language, privacy/storage plan and whether institutional ethics review is required.

## Task per case

1. Decide `ALLOW`, `BLOCK` or `INSUFFICIENT` for the displayed claim.
2. Name the most important missing or limiting information.
3. Give confidence from 0 to 100.
4. Write a one-sentence handoff summary for another reader.

The local instrument records decision time from case display to submission. It stores no network data and exports one JSON response file.

## Primary endpoint

Critical false-closure rate on `BLOCK` cases:

`false closures / all BLOCK-case responses`, compared within participant between conditions.

A false closure is an `ALLOW` response on a gold `BLOCK` case. `INSUFFICIENT` is not a false closure but is scored separately from the correct `BLOCK` response.

## Secondary endpoints

- exact decision accuracy across all cases;
- failure to allow on gold `ALLOW` controls;
- missing/limiting-information identification using frozen key concepts;
- decision time;
- confidence calibration using Brier score;
- handoff retention of source, missing/unresolved content and claim ceiling;
- response completeness.

## Handoff scoring

Two blinded raters score each one-sentence handoff on three binary items:

1. source or record identified;
2. decisive missing/unresolved content retained;
3. claim ceiling retained.

Disagreements are retained and reported; consensus may be added only as a separate column. Inter-rater agreement is reported. A later true recipient-handoff experiment is outside this pilot.

## Analysis

- Report condition totals and paired participant differences.
- Primary descriptive effect: NEXAH false-closure rate minus baseline false-closure rate; lower is better for NEXAH.
- Report bootstrap 95% interval clustered by participant.
- With 12–24 participants, treat inferential statistics as exploratory and emphasize effect size and uncertainty.
- Do not exclude slow, incorrect or incomplete cases after viewing condition results. Predeclared exclusions: duplicate response file, participant requested withdrawal, or fewer than six completed cases.

## Outcome space

- `A_BOUNDED_READER_BENEFIT`: fewer false closures with no material loss on ALLOW controls; effect direction stable across at least three of four BLOCK cases.
- `B_AUDITABILITY_TRADEOFF`: fewer false closures but slower decisions or worse ALLOW-control performance.
- `C_NO_READER_ADVANTAGE`: no meaningful directional advantage.
- `D_BASELINE_BETTER`: baseline has fewer false closures or materially better accuracy with comparable time.
- `E_INVALID_OR_INSUFFICIENT`: fewer than 12 valid participants, broken counterbalancing, information mismatch, scoring contamination or instrument failure.

No numerical superiority threshold is introduced after data inspection. This pilot estimates effect size for a later confirmatory design.

## Stop and claim boundaries

- Stop immediately if condition values differ, form balance fails, answer keys leak or response export loses required fields.
- Do not call AI-model responses human validation.
- No truth-machine, scientific-discovery, general cognitive, clinical, educational, product or production claim.
- A positive pilot supports only the tested reader task and materials.
