# Research-cycle lifecycle

## Type E — preregistered empirical

```text
QUESTION -> DESIGN -> PREREGISTRATION -> LOCK -> IMPLEMENTATION FREEZE
-> EXECUTION -> AUDIT -> REPLICATION/REPLAY -> THEORY/CEILING ANALYSIS
-> ARCHITECTURE INTEGRATION -> LABREPORT -> CLOSED
```

Stages may end early as `INVALID_EXPERIMENT`, but audit, integration of that
fact, and Labreport closure are still required.

## Type T — theory/elimination

```text
QUESTION -> FORMAL THEORY -> INDEPENDENT/ADVERSARIAL CHECK
-> INTEGRATION -> LABREPORT -> CLOSED
```

No preregistration, dataset, lock, or execution is fabricated.

## Type I — infrastructure/conformance

```text
REQUIREMENT -> CONTRACT -> IMPLEMENTATION/FREEZE -> CONFORMANCE/AUDIT
-> REPLAY IF APPLICABLE -> INTEGRATION -> LABREPORT -> CLOSED
```

Classification is infrastructure-level, not a scientific-domain result.

## Type D — design feasibility

```text
QUESTION -> DESIGN/COMPARATOR ANALYSIS -> ADVERSARIAL REVIEW
-> ADMIT / ELIMINATE / UNDEFINED -> INTEGRATION -> LABREPORT -> CLOSED
```

An admitted candidate remains `OPEN`; it is not a positive result.

## Status transitions

- `OPEN`: question recorded, no authorized active work.
- `ACTIVE`: current authorized work.
- `BLOCKED`: required dependency/authority absent.
- `AWAITING_AUDIT`: result exists but interpretation is not closed.
- `AWAITING_INTEGRATION`: audited meaning exists but ledgers are stale.
- `READY_FOR_LABREPORT`: closure inputs complete.
- `CLOSED`: Labreport/index/ledgers completed.
- `SUPERSEDED`: replaced operationally, retained as provenance.

Not every cycle uses every stage, but every cycle uses audit/review,
integration, Labreport, and explicit closure.
