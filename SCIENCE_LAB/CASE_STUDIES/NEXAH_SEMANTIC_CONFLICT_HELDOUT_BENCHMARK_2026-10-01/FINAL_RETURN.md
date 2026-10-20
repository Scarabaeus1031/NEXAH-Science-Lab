# Final Return — NEXAH Semantic Conflict Held-Out Benchmark

Date: 2026-10-01

## Result

The matched public-data experiment completed validly: 48 previously unused,
non-reannotation AVeriTeC items, three fresh replicates per condition, 144
decisions per condition and no parse repair. Both conditions used the same
model, effort, data, verdict definitions and output schema.

The frozen decision is:

`SIGNAL_AGAINST_NEXAH`

The current NEXAH semantic-relation prompt did not improve conflict or missing-
evidence recognition. It reduced all three aggregate performance metrics.

## Primary and secondary results

| Metric | A — strong baseline | B — NEXAH | B − A |
|---|---:|---:|---:|
| Critical macro-F1 (Conflict + NEE) | 62.79% | 51.99% | −10.80 pp |
| Overall macro-F1 | 65.58% | 56.23% | −9.34 pp |
| Accuracy | 67.36% | 57.64% | −9.72 pp |
| Evidence-ID validity | 100% | 100% | 0 pp |
| Three-run item stability | 87.50% | 91.67% | +4.17 pp |

Paired decisions: B wins 5, B losses 19, ties 120.

## Mechanism observed

B classified 83 of 144 decisions as Not Enough Evidence, versus 58 for A. It
retained perfect recall for actual Not Enough Evidence cases but reduced that
class's precision from 62.07% to 43.37%. It also lowered conflict recall from
33.33% to 27.78% and refutation recall from 69.44% to 41.67%.

The added binding/residual procedure therefore behaved mainly as an
over-abstention amplifier. Its slightly higher repeatability is not evidence of
better judgment because the repeated answer was often the same wrong abstention.

## Claim boundary

This result does not show that every NEXAH idea is empty or that conservative
epistemic rules have no value. AVeriTeC also contains a limited policy mismatch:
some labels treat lack of scientific support as refutation, while NEXAH forbids
turning absence into refutation.

It does show that the current minimal NEXAH semantic procedure is not a better
AI conflict classifier than an equally formatted strong baseline on this
held-out public task. Direct counterevidence and genuine conflict were also
missed, so label policy cannot explain the full deficit.

## Decision and STOP

Together with the preceding format-controlled benchmark, there is now no
demonstrated incremental semantic-reasoning or conflict-recognition advantage.
The claim that NEXAH presently supplies a special AI reasoning method should
stop here unless a materially new, executable mechanism is defined before any
new outcomes are inspected.

Retained demonstrated value remains narrower:

- deterministic checking after Human-authored structured alignment;
- canonical machine-compatible output normalization;
- provenance, residual and return discipline;
- a Human orientation/cultural method whose utility is not established by
  these AI classification tests.

No automatic successor experiment is opened.

