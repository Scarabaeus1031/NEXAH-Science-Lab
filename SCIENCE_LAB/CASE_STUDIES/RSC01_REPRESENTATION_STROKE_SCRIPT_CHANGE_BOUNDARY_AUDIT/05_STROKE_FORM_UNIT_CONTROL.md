# 05 — Stroke / Form / Unit Control

## Findings

`STROKE` is not a single universal type. Depending on the question, it can denote:

- an execution segment;
- the deposited trace of that segment;
- a recognized stroke form;
- a functional component in a character description.

The same label therefore crosses event, mark, form and unit roles. The roles must be typed in each record.

| Candidate collapse | Result | Reason |
|---|---|---|
| stroke = static mark | `REJECTED` | The term can include an executed movement and its trace; a mark records but is not the event. |
| trace = action | `REJECTED` | The trace is an outcome/evidence object, not the movement itself. |
| contact continuity = one system unit | `REJECTED` | B4 documents several conventional strokes written without lifting in running style. |
| physical brush component = written component | `REJECTED` | Bristles belong to the tool; their contact pattern need not determine unit count. |
| stroke order irrelevant | `REJECTED` | B1/B3/B4 treat sequence as part of production and recognition. |
| visible form determines full event history | `REJECTED` | The trace supports partial inference, not unique event reconstruction. |

## SFM classification

```text
MARK=REQUIRED
FORM=REQUIRED
UNIT=REQUIRED
VALUE=REQUIRED_FOR_READING_OR_FUNCTION_NOT_FOR_BARE_PRODUCTION
PROCESS=DOMAIN_EXTENSION
EVENT=DOMAIN_EXTENSION
TEMPORAL_ORDER=DOMAIN_EXTENSION
PROVENANCE=PROVENANCE_FIELD
TRACE=DOMAIN_EXTENSION_REALIZED_AS_MARK_BEARER
```

No `TRACE`, `FLOW` or `PROCESS` operator is created.

