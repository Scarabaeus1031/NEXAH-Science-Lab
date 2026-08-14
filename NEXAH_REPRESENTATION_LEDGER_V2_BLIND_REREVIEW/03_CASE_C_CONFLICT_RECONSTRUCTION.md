# Case C Conflict Reconstruction

## Independent record

E3 is a composite of forward rotation, inverse rotation, certificate/error calculation, frozen-tolerance lookup, and classification-record construction. `recovery_record` consumes raw arguments; it does not consume a pre-existing comparison record. The frozen run produced `TOLERANCE_RECOVERY` with error `2.220446049250313e-16 <= 1e-12` and replayed byte-identically.

The prior description of a precomputed input record must remain rejected while the corrected raw-argument/protocol boundary is supported.

## V2 agreement and conflict

V2 correctly preserves both historical claims and exposes the composite components. However:

1. the source boundary lists `T01A_PRIMARY_RESULTS.json` as its concrete artifact even though that file is the target/result, not a raw input artifact;
2. the whole declared composite maps raw arguments to a result record, but invertibility is classified `APPROXIMATELY_RECOVERABLE` for only the rotation subpath;
3. the loss claim concerns a hypothetical later projection onto `primary_status`, not the declared full-record target.

The schema has no `applies_to_component_ids` or equivalent assertion scope, so these subpath claims appear to describe the entire edge. The historical evidence conflict is preserved, but V2 creates a new source/scope conflict.

`CASE_C_AGREEMENT = EVIDENCE_CONFLICT`

