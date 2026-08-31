# ORION Capability Matrix

`Y` = yes in the frozen corpus; `P` = partial or bounded; `N` = no. “ORION V1” refers only to the certified membrane/slice, not all repository experiments.

| Capability | Formally defined? | Machine-readable? | Implemented? | Tested? | Domain dependent? | ORION V1? | Human authority required? | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| identity preservation | Y | Y | P | P | N | Y | N | contract-ready; narrow V1 |
| provenance preservation | Y | Y | P | P | N | Y | N | contract-ready; narrow V1 |
| history preservation | Y | Y | N | N | N | N | N | RID-defined only |
| representation typing | Y | Y | P | P | Y | Y | N | bounded |
| view typing | Y | Y | N | N | Y | P | N | RID-defined; membrane projection only |
| geometry vs measurement | Y | Y | N | N | Y | N | N | RID-defined |
| transformation typing | Y | Y | P | P | Y | P | N | heterogeneous implementations |
| comparison | Y | Y | P | P | Y | P | sometimes | declared criterion required |
| declared criteria | Y | Y | N | N | Y | N | Y | authority supplied |
| invariants | Y | Y | P | P | Y | P | sometimes | case-bounded |
| differences | Y | Y | N | N | Y | N | N | RID-defined |
| residuals | Y | Y | N | N | Y | N | N | typed, not universal |
| ambiguity | Y | Y | P | P | Y | Y | N | V1 status-preserving |
| abstention | Y | Y | N | N | N | P | Y for final decision | schema-level |
| undefined states | Y | Y | P | P | Y | Y | N | frozen V1 coherence rules |
| reconstruction | Y | Y | N | N | Y | N | sometimes | event distinct from original |
| return | Y | Y | N | N | Y | N | sometimes | componentwise only |
| winding-number evaluation | Y | N | Y in WNI fixture code/records | Y | Y | N | N | bounded case capability |
| representation-capacity testing | Y | P | P | Y in WNI controls | Y | N | N | conditional evidence |
| observation-channel typing | Y | P | N | P documentary controls | Y | N | N | useful composite record |
| regime/context typing | Y | P | N | P documentary controls | Y | N | N | useful composite record |
| trajectory/state-space records | Y | Y | N | N | Y | N | N | derived records |
| knowledge-status records | Y | P | N | N | Y | N | Y | derived, non-primitive |
| canonical serialization | Y | Y | N | schema fixtures only | N | P | N | RID contract; no serializer runtime |
| validation | Y | Y | N | schema-level only | Y | P | sometimes | no RID validator runtime |
| deterministic execution | P | P | Y in certified narrow slices | Y in certified narrow slices | Y | P | authorization boundary | not integrated RID machine |
| human decision | Y as boundary | Y as DecisionEvent record | N | N | Y | N | Y | never delegated to ORION |

Interpretation controls: `DEFINED != IMPLEMENTED`; `IMPLEMENTED != TESTED`; `TESTED != TRUE`; `VALID != TRUE`; `RECOVERABLE != IDENTICAL`; `INVARIANT != COMPLETE_DESCRIPTION`.

