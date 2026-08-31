# GIJ-01 - Execution Type Schema

## Minimal roles

| Role | Minimum meaning | Required separation |
|---|---|---|
| INFORMATION | Represented content without an intrinsic execution role. | `INFORMATION != EXECUTION_EVENT` |
| INSTRUCTION | Information interpreted under a declared rule as a candidate executable directive. | Not all information is instruction. |
| ENVIRONMENT | A compatible context capable of supporting an execution. | `ENVIRONMENT != EXECUTION_EVENT` |
| RULE | A condition that specifies when or how dispatch is permitted. | `RULE != EVENT` |
| AUTHORITY | A permission or credential accepted by the rule. | `AUTHORITY != DISPATCH` and `AUTHORITY != EVENT` |
| DISPATCH / TRIGGER | A particular invocation or start request. | `TRIGGER != EVENT` |
| EXECUTION_ATTEMPT | An attested attempt to initiate execution. | An attempt may fail before event entry. |
| EXECUTION_EVENT | An attested occurrence in which execution entered its bounded event state. | `EVENT != OUTCOME` |
| OUTCOME | Event disposition: `SUCCESS | FAILURE | ERROR | ABORT | UNKNOWN`. | A meaningful result artifact is not mandatory. |
| RESULT | Optional produced value or observable state associated with an outcome. | `RESULT != TRACE` |
| TRACE | Optional record of an attempt, event, transition or outcome. | `TRACE != PROVENANCE` |

## Legitimate bounded collapses

- An instruction is a subtype or role of information under a declared interpretation. Therefore `INFORMATION_EQUALS_INSTRUCTION=CONDITIONAL`, not universal.
- A single policy object may carry rule and authority data, but the logical roles remain distinguishable: a rule can exist without granted authority, and authority can exist without a satisfied rule.
- A dispatch record may also record an attempt when dispatch is actually issued. Permission to dispatch is not dispatch.
- A result may encode an outcome, but event identity and outcome/result remain different fields.

## Assertion rule

```text
compatible instruction
+ compatible environment
+ satisfied rule and authority
= execution preconditions

preconditions
+ dispatch or trigger occurrence
= execution attempt

execution attempt
+ separately attested event entry
= execution event assertion
```

Neither the OVR operator vocabulary nor the word `GATE` is extended. Dispatch and outcome are event-control roles, not invented NEXAH operators.

