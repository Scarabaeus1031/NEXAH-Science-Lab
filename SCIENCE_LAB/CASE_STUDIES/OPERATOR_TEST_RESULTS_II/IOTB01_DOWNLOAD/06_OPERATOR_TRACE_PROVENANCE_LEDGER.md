# 06 — Operator / Trace / Provenance Ledger

| Object | Carries | Does not necessarily carry |
|---|---|---|
| operator F | transformation rule | evidence of execution |
| input X | pre-event record | future result |
| output Y | endpoint record | unique producing operator |
| execution e | F, input and output for one event | ancestry beyond that event |
| trace τ | ordered executed events/states | derivation/source relation unless events are marked derivational |
| provenance P | recorded ancestry/source edges | complete temporal trajectory |

Trace and provenance are **overlapping but distinct**. A derivational execution
may contribute both an execution trace and a provenance edge. An in-place motion
trace need not create provenance or generation. A provenance summary may retain
parentage while omitting the detailed transition trace.

```text
OPERATOR_DISTINCT_FROM_RESULT=YES
OPERATOR_DISTINCT_FROM_TRACE=YES
TRACE_DISTINCT_FROM_PROVENANCE=YES_OVERLAPPING_COMPLEMENTARY
```
