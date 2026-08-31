# GIJ-01 - Precondition / Trigger / Event Model

## Smallest defensible dependency structure

```text
INSTRUCTION ----+
ENVIRONMENT ----+--> PRECONDITIONS_SATISFIED
RULE -----------+
AUTHORITY ------+

PRECONDITIONS_SATISFIED
        +
DISPATCH / TRIGGER OCCURRENCE
        |
        v
EXECUTION ATTEMPT
        |
        +---- no event entry ----> NO_EVENT / ATTEMPT OUTCOME
        |
        +---- attested event entry ----> EXECUTION EVENT
                                           |
                                           +----> OUTCOME
                                           |
                                           +----> TRACE, if recorded
```

A trace may also record a rejected dispatch or failed start without recording an execution event.

## Consequences

- `PRECONDITIONS_EQUAL_EVENT=NO`
- `TRIGGER_EQUALS_EVENT=NO`
- `DISPATCH_EQUALS_EXECUTION=NO`
- `OPERATOR_EQUALS_EXECUTION=NO`
- `EXECUTION_EQUALS_RESULT=NO`
- `RESULT_EQUALS_TRACE=NO`

The model permits an execution event with `FAILURE`, `ERROR`, `ABORT` or `UNKNOWN` outcome. A successful result is not part of the definition of execution.

## Epistemic boundary

An event may occur without a complete trace, but the audit may not assert occurrence without adequate attestation. Trace is one possible attestation source; it is not identical to the event or to provenance.

