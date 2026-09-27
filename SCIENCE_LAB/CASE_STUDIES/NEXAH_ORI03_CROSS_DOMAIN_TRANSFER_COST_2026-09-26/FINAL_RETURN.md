# NEXAH-ORI-03 — Final Return

Date: 2026-09-26  
Execution state: complete  
Outcome: `NO_EFFICIENCY_ADVANTAGE_SHOWN`

## Result

Both arms produced correct and identical claim decisions for all four cases. Neither engine required a core change when the transfer-control case was added.

The frozen efficiency gates all failed:

- executable evaluator logic: strong baseline `10` logical lines and `354` source bytes; NEXAH `22` logical lines and `771` source bytes;
- equal-output serialized record: baseline `711` bytes; NEXAH equal-output projection `711` bytes, therefore not smaller;
- full NEXAH ledger: `2,315` serialized bytes;
- local median runtime: baseline and NEXAH remained at sub-microsecond to low-microsecond scale; the NEXAH/baseline ratio was approximately `2.60–2.69` across execution and validation replay.

The absolute runtime difference is negligible for this task and must not be projected to a real application. It nevertheless fails the preregistered claim that NEXAH is at least 20% faster.

## Interpretation

NEXAH did not simplify the minimal software decision task. A strong generic requirements-and-provenance baseline transferred across the same domains with zero core changes and less executable logic.

NEXAH produced a richer orientation record: source, context, question, selection, retained, lost, introduced, unresolved and residual fields. That additional explicitness explains much of its size and runtime overhead. This is a possible auditability tradeoff, not an efficiency advantage.

The defensible software hypothesis is therefore narrower:

> NEXAH may justify additional record cost when explicit cross-domain orientation, review or handoff traceability is required.

Whether that richer record reduces human review time, misunderstandings, handoff failures or claim inflation remains untested.

## Limitations

- four authored internal cases, not a sealed external benchmark;
- structural proxies, not observed developer time or cognitive load;
- Python microbenchmark at sub-microsecond scale;
- both evaluators were intentionally generic;
- no integration, storage, UI, team workflow or maintenance study;
- no claim that the strong baseline represents every scientific workflow.

## Claim boundary

This test supports no statement that NEXAH is simpler, faster or more computationally efficient than a strong generic baseline. It also does not establish that the richer ledger is useful to people. It establishes equal decision correctness in this bounded fixture and quantifies the local overhead.
