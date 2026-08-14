# Cross-Revision Identity Final Test

## Result: PARTIAL — blocking

V3 defines useful ingredients: `ledger_series_id`, `record_id`, `record_revision`, `previous_record_ref`, `claim_id`, `claim_revision`, and the relations `SUPERSEDES`, `REFINES`, `CONTRADICTS`, and `RETRACTS`. It also correctly allows a genuinely unrelated claim to use a fresh ID without an artificial relation.

However, the schema alone neither requires claim IDs from the referenced prior record to remain present/related nor requires a later claim revision to target its actual previous revision. That behavior is deferred to a future cross-record consistency checker.

More importantly, the required regression sample demonstrates the bypass rather than preventing it. Case D:

1. references the V2 record;
2. changes the record ID;
3. renames all three V2 claim IDs;
4. retains none of the actual V2 claim IDs as a relation target;
5. creates a local revision-1 replacement and relates the local revision 2 only to that replacement.

This preserves the old file and its semantics, but not stable claim identity. A minimal validator operating on the stated V3 rules would need a mapping that V3 does not declare; it cannot infer that `D.H.HIERARCHY` is the continuation of `D.CLAIM.HIERARCHY_REJECTED` without comparing prose.

Consequently the known-lineage reset defect is not closed at the identifier/relationship level. This is not a request for V4; under the hard-stop rule it blocks authorization of the stronger representation-ledger validator path.

`CROSS_REVISION_IDENTITY_FINAL_TEST = PARTIAL`  
`NEGATIVE_HISTORY_PRESERVED = YES`  
`KNOWN_LINEAGE_RESET_PREVENTED = NO`  
`LEGITIMATE_UNRELATED_CLAIMS_ALLOWED = YES`
