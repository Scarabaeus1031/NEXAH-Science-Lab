# Preservation and Loss Model

## Preservation

Every preservation assertion names an `object`, `level`, `assertion`, `scope`, and supporting evidence IDs.

Levels are `EXACT`, `APPROXIMATE`, `EMPIRICALLY_SUPPORTED`, `TASK_CONDITIONAL`, and `UNKNOWN`. `EXACT` refers to a defined relation under declared assumptions, not to “important structure.” Approximate claims require a metric and tolerance in the assertion or referenced protocol.

## Loss

Loss kinds are:

- `PROVEN`: the operator mathematically removes a distinction;
- `OBSERVED`: verified output lost the named distinction;
- `POTENTIAL`: the operator can lose it under declared conditions;
- `UNKNOWN`: no valid assessment.

Every loss assertion names the lost object. Task loss is never inferred solely from unequal sources.

## Collision

A collision record requires two distinct source artifact references, a target equivalence criterion, and evidence that their targets satisfy it. Task consequences require a separately defined task. This prevents the ledger from recreating T02's circular first-loss target.

Introduced structure is recorded separately: labels, discretization, clustering assignments, or human categories may appear in the target without being present in the source.

