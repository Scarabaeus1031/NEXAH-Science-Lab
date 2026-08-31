# 05 — State / History Control

Import the IPG-01 COPY control:

```text
X0 --COPY--> X1
OBS(X0)=OBS(X1)
ID(X0)≠ID(X1)
PROV(X0)≠PROV(X1)
GEN(X1)=GEN(X0)+1
```

The same endpoint fields can therefore coexist with different identity and
history.

For a known deterministic `Y=F(X)`, removing the execution trace can leave a
unique reconstructable candidate path. It does not attest that F was executed.
Y alone may have multiple possible producers or no retained producer metadata.

```text
ENDPOINT_STATE_ESTABLISHES_OPERATOR_HISTORY=NO
RECONSTRUCTABLE_IMPLIES_ATTESTED=NO
STATE_DISTINCT_FROM_HISTORY=YES
```
