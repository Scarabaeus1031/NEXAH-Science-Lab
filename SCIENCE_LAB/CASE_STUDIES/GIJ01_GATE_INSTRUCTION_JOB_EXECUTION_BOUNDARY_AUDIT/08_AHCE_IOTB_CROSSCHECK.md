# GIJ-01 - AHCE / IOTB Cross-check

## AHCE-01

| Distinction | GIJ-01 result |
|---|---|
| INFORMATION != EXECUTION | Preserved. Instruction content does not attest an event. |
| AGENT != CARRIER | Preserved. An instruction does not become an agent. |
| ENVIRONMENT != EXECUTION | Preserved. Availability is only a precondition. |
| MODEL != AUTHORITY | Preserved. A type model grants no permission. |
| AUTHORITY != EXECUTION | Preserved. Permission does not attest occurrence. |
| TRACE != PROVENANCE | Preserved. Event recording and origin remain separate. |

A technical execution environment is not promoted to a biological host. Biological host comparison remains `ANALOGICALLY_COMPATIBLE_ONLY`.

`AHCE_DISTINCTIONS_SURVIVE=YES`

## IOTB-01

For an execution record:

- WHAT IS IT? - a particular event or attempt with its own identity.
- HOW IS IT ORIENTED? - applicable state/reference framing, not event identity.
- WHAT HAPPENED TO IT? - transitions, attempt, event entry and outcome.
- WHERE DID IT COME FROM? - instruction, authority, dispatch and record provenance.

```text
SAME_RESULT_NE_SAME_EXECUTION_EVENT=YES
SAME_RESULT_NE_SAME_TRACE=YES
SAME_RESULT_NE_SAME_PROVENANCE=YES
SAME_INSTRUCTION_NE_SAME_EXECUTION=YES
SAME_ENVIRONMENT_NE_SAME_EXECUTION=YES
RETURN_OF_STATE_NE_ERASURE_OF_HISTORY=YES
IOTB_DISTINCTIONS_SURVIVE=YES
```

No predecessor file or result is modified.

