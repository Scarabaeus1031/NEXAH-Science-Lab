# D-GATE 10.2R4.1 execution decision

## Decision

**A — FIRST_BLIND_EXTERNAL_APERTURE_CUT_EXECUTED_AND_VERIFIED**

Exactly one authorized Primary and, only after its acceptance, exactly one isolated Replay completed. Both CRIC bundles and receipts are schema-valid, conformance-valid, and hash-valid. The scientific result projection, OutputRecord hashes, and Post-Execution Result hash match. The receipts correctly differ because they bind separate actual UTC execution timestamps.

Observed result:

```text
I = STT,GREENWICH
L = NONE
A = NONE
U = GIZA
AGGREGATE_COMPARABLE_RESIDUAL = 0
ILAU_OVERALL_STATUS = HOLD
RETURN_TEST_STATUS = UNRESOLVED
GIZA = A3 / null / UNRESOLVED
```

Boundaries:

```text
PRIMARY_CONSUMED = 1_OF_1
REPLAY_CONSUMED = 1_OF_1
ALLOWANCE_CLOSED = YES
RETRY_EXECUTED = NO
LIVE_API_CALLED = NO
NEW_EXTERNAL_BYTES_ACQUIRED = NO
DEPENDENCY_STAGING_REMOVED = YES
RUNNER_HASH_PRESERVED = sha256:2fed64479dc8cc78deaba6dc5833c898a6b865666acc3978235555472a9ed0ac
NEW_PHYSICS_CLAIM = NO
NEW_ONTOLOGY_CLAIM = NO
D_GATE_11_STARTED = NO
```

THE BLIND EXTERNAL CUT HAS RUN  
THE VISIBLE RELATIONS RETURNED EXACTLY  
THE WITHHELD IDENTITY REMAINED EXPLICITLY UNRESOLVED  
ZERO COMPARABLE RESIDUAL DID NOT ERASE THE OPEN U  
THE MACHINE RETURNED HOLD — HONESTLY
