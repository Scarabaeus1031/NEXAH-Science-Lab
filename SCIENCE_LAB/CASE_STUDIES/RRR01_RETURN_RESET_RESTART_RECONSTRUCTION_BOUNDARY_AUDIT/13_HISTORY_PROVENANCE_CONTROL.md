# History / Provenance Control

For documentary history only, let

```text
H0=[]
H1=[e1]
H2=[e1,e2]
```

and suppose state after `H2` equals state at `H0`. The state comparison can be true while `H2 != H0` because the registered ordered event lists differ.

`DOCUMENTARY_HISTORY_ACCUMULATES_REGISTERED_EVENTS=YES`

This is a property of the record model, not entropy, thermodynamics, time reversal or physics. Deletion/compaction policies are separate operations and are not exercised here.

Provenance retains source, rule, event and result lineage. Returning state values does not erase those records.

`DOCUMENTARY_HISTORY_DISTINGUISHED_FROM_STATE=YES`

`PROVENANCE_PRESERVED=YES`

`STATE_EQUALITY_IMPLIES_HISTORY_EQUALITY=NO`

`HISTORY_MONOTONICITY_CLAIM_SCOPE=REGISTERED_DOCUMENTARY_APPEND_ONLY_MODEL`
