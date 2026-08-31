# GIJ-01 - Result / Trace Control

## Outcome model

```text
EXECUTION EVENT
      |
      +--> OUTCOME = SUCCESS | FAILURE | ERROR | ABORT | UNKNOWN
      |
      +--> RESULT, optional
      |
      +--> TRACE, optional record
```

An execution event need not produce a useful result. Failure and error are valid outcomes.

```text
EXECUTION_WITH_FAILURE_POSSIBLE=YES
EXECUTION_EQUALS_RESULT=NO
RESULT_EQUALS_TRACE=NO
```

## Independent controls

| Situation | Admissible? | Boundary |
|---|---|---|
| Event occurred, outcome is `ERROR` | YES | Event identity does not require success. |
| Observable result, trace absent | YES | Result does not establish a complete recorded history. |
| Trace present, result unavailable | YES | A trace may record attempt/event transitions without a retained result. |
| Current state matches an earlier state | YES | Return of state does not erase event history. |
| Same result from two runs | YES | Same result does not identify the same event, trace or provenance. |

Trace quality and provenance must be assessed separately. A trace is not automatically authoritative merely because it exists.

