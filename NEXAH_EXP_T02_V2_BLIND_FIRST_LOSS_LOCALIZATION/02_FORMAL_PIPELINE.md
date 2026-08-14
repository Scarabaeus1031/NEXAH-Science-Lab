# Formal Pipeline

Each synthetic case is an ordered seven-stage abstraction:

```text
X0 --T1--> X1 --T2--> X2 --T3--> X3
   --T4--> X4 --T5--> X5 --T6--> X6
```

Every stage contains exact integer-valued observable records, a directed weighted
graph, and stable stage-local identifiers. Transformations deterministically
canonicalize, merge or erase selected distinctions; once an individual task
distinction is erased it may not reappear. Nuisance distinctions have independent
loss schedules and may persist after task loss.

The held-out generator stratifies truth across `T1`–`T6` and `NO_LOSS`: 12 cases
per label, 84 primary cases total. A 256-bit execution seed randomizes aliases,
values, graph nuisance and case order. Conditional on the recorded seed, the suite
is exactly replayable.

This abstract pipeline is deliberately domain-neutral. It tests localization
machinery, not the validity of the historical field pipeline.

