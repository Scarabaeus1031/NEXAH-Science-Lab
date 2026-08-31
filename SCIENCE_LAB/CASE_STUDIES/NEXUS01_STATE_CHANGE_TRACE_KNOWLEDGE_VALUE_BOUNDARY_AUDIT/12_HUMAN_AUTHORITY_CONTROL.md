# Human Authority Control

Machine-readable evidence, comparison and registered criteria may produce a
candidate assessment, recommendation or authorized `DecisionResult`. They do not
show that the machine created the normative criterion.

Every normative decision rule must answer:

```text
WHERE_DID_THE_VALUE_CRITERION_COME_FROM?
```

Allowed declared origins include:

- `HUMAN_AUTHORITY`;
- `REGISTERED_POLICY` with issuing authority and version;
- `TASK_OBJECTIVE` authorized for the execution;
- `SAFETY_CONSTRAINT` with scope/source;
- `EXTERNAL_STANDARD` with version and applicability.

RID already requires authority on `DecisionRule` and `DecisionEvent`; SWM keeps
decision distinct from reconstruction and comparison. An undocumented criterion
is invalid for normative decision. Ambiguity or insufficient authority permits
abstention rather than invented value.

`HUMAN_AUTHORITY_BOUNDARY_PRESERVED=YES`
