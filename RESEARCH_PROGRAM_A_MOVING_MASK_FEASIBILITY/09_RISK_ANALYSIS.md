# Risk Analysis

| Risk | Severity | Failure mode | Required control |
|---|---|---|---|
| multiple-hypothesis drift | high | H1–H5 become one unfalsifiable success surface | freeze one primary hypothesis; mark other outputs diagnostic |
| exposure confounding | critical | moving mask removes different information than static mask | predeclare and verify an information-matching rule |
| ground-truth leakage | critical | estimator receives withheld synthetic state | isolate estimation and evaluation inputs |
| estimator flexibility | high | estimator or history changes after results | freeze exact contract and hash before runs |
| weight tuning | high | reliability weights encode result knowledge | use fixed preregistered weights in the minimum Lab |
| threshold flexibility | high | reacquisition or confidence outcome changes with post hoc thresholds | preregister tolerance, persistence, and confidence rules |
| undefined-state concealment | high | missing information is silently filled | require underdetermined/unknown/undefined outputs |
| smoothness substitution | high | stable-looking output is treated as accurate | score estimator movement and truth error separately |
| representation dependence | medium | coordinate choice carries the result | freeze representation and state the scope; do not generalize |
| baseline weakness | high | complexity appears useful only because comparator is poor | include static mask and simpler available-observation baseline |
| single-benchmark overclaim | high | one synthetic result becomes a general law | enforce claim boundary in result record |
| symbolic authority transfer | high | Q° or Pattern language is treated as scientific evidence | retain them as provenance only |
| scope expansion | high | adaptive masks, nonlinear models, control, or applications enter | stop at the minimum three-condition protocol |
| naming/provenance collision | medium | proposed `Lab 0.5` is treated as an assigned identity | create no Lab ID; owner governs identity separately |
| irreproducible environment | medium | result cannot be replayed | pin environment, seeds, inputs, hashes, and commands |
| implementer-only review | medium | protocol choices and validation share one unchecked owner | require independent protocol and result review |

## Critical risks

The decision depends primarily on controlling exposure confounding, ground-truth leakage, estimator/threshold flexibility, and scope expansion. Failure of any one makes the primary comparison uninterpretable.

## Stop conditions

Stop before implementation if the owner, repository, benchmark, information-matching rule, estimator, thresholds, or independent review gate is absent. Stop during a future run if frozen inputs change, truth leaks, conditions are not comparable, or required insufficiency states cannot be represented.
