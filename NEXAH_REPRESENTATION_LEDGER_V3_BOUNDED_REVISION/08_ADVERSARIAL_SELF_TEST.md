# Adversarial Self-Test

| Test | Result | Basis |
|---|---|---|
| T1 component loss asserted as whole-edge loss | `CAUGHT` | scope shape/reference is mandatory; whole-edge assertion cannot name component IDs; referential check verifies applicability |
| T2 contradictory machine statuses | `CAUGHT` | each dimension has one controlled `status`; duplicate value removed |
| T3 rejected claim reset inside known lineage | `CAUGHT` | later revision requires prior record; cross-record rule derives and retains prior claims/relations |
| T4 complete history with unresolved prior references | `CAUGHT` | `HISTORY_COMPLETE` requires an empty unresolved list; partial requires a nonempty list |
| T5 genuinely unrelated new claim | `ALLOWED` | new stable claim ID may omit relations when no lineage evidence connects it |

Scientific falsehood can still be written in prose or attached to plausible evidence. Schema-valid remains distinct from scientifically true.

