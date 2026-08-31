# GIJ-01 - Event Attestation Test

## Central comparison

Cases 7 and 8 share the same instruction, environment and authority fields. Both also record an execution attempt.

| Field | Case 7 | Case 8 |
|---|---|---|
| Preconditions satisfied | YES | YES |
| Execution attempted | YES | YES |
| Event entry attested | NO | YES |
| Result present | NO | YES in this bounded example |
| Trace present | YES, attempt trace | YES, event/outcome trace |
| Execution event assertable | NO | YES |

The two cases remain distinguishable because event occurrence is a separate field. The presence of all enabling conditions and even an attempt does not imply event entry.

```text
CASE7_CASE8_DISTINGUISHABLE=YES
POSSIBILITY_OF_EXECUTION_EQUALS_EXECUTION=NO
PRECONDITIONS_EQUAL_EVENT=NO
ATTEMPT_EQUALS_EVENT=NO
```

## Assertion boundary

- A trace of rejected dispatch proves only that a dispatch or attempt was recorded.
- Absence of a trace does not prove no event occurred.
- For this audit, an execution event claim requires adequate occurrence attestation.
- Reconstructing that execution could have happened is not attestation that it did happen.

This preserves `RECONSTRUCTABLE != ATTESTED`.

