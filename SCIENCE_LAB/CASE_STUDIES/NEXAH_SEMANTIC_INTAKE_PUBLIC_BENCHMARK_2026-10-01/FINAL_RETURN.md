# Final Return — NEXAH Semantic Intake Public Benchmark

Date: 2026-10-01

## Result

The bounded public-data experiment completed successfully on 36 items using
fresh ephemeral runs of `gpt-6.1-sol` at medium reasoning effort.

The preregistered scorer returned `SIGNAL_FOR_NEXAH` because the NEXAH condition
substantially outscored the original baseline on TAT-QA and tied it on AVeriTeC.
However, mandatory inspection and an explicitly post-hoc format control explain
the TAT-QA gap completely. The final scientific interpretation is therefore:

`NO_DEMONSTRATED_INCREMENTAL_SEMANTIC_REASONING_SIGNAL`

## Primary results

| Dataset / metric | A — baseline | B — NEXAH |
|---|---:|---:|
| TAT-QA exact match | 37.50% | 79.17% |
| TAT-QA F1 | 43.71% | 82.13% |
| TAT-QA scale accuracy | 79.17% | 79.17% |
| AVeriTeC verdict accuracy | 50.00% | 50.00% |
| AVeriTeC macro-F1 | 41.67% | 41.67% |
| Evidence-ID validity | 100% | 100% |

The frozen decision rule therefore produced `SIGNAL_FOR_NEXAH`.

## Diagnostic control

A third run used the baseline without NEXAH and added only explicit canonical
answer formatting:

| TAT-QA metric | C — format-aware baseline |
|---|---:|
| Exact match | 79.17% |
| F1 | 82.38% |
| Scale accuracy | 83.33% |

This control reproduced all of B's exact-match gain and slightly exceeded B on
F1 and scale accuracy. The observed gain is therefore attributable to output
contract discipline, not demonstrated better semantic reasoning.

AVeriTeC reinforces that conclusion: A and B returned identical verdicts on all
12 claims. Both missed all three conflict/cherrypicking cases.

## What NEXAH can claim from this test

NEXAH can make model outputs narrower, more canonical and easier for a machine
contract to score. This is useful infrastructure and is consistent with the
existing deterministic Compare core.

NEXAH cannot yet claim from this test that it improves:

- semantic discovery;
- conflict recognition;
- evidence judgment;
- human orientation;
- decision quality.

## One next test

Hold canonical output formatting identical in both conditions. Use a purpose-
built held-out set where success depends on preserving conditions, time scope,
missing evidence and conflicting sources. Vary only the semantic procedure. The
primary endpoint should score relation and conflict decisions, not exact output
strings.

This is a negative result for the broad capability hypothesis and a positive
result for one narrow component: machine-compatible normalization.

