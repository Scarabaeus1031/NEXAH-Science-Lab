# History-Completeness Rules

`history_completeness` is `HISTORY_COMPLETE`, `HISTORY_PARTIAL`, or `HISTORY_UNKNOWN`.

- `HISTORY_COMPLETE` requires zero unresolved prior references.
- `HISTORY_PARTIAL` requires at least one named unresolved prior reference.
- `HISTORY_UNKNOWN` records that no defensible completeness assessment exists.
- Revision greater than 1 requires `previous_record_ref` and `known_prior_record_refs`.

Completeness is local to the declared ledger series and located evidence; it is never a global claim about all historical documents. Future referential validation must load the previous record, derive its claims, and require them to remain addressable or explicitly related. Schema form cannot discover hidden external history.

