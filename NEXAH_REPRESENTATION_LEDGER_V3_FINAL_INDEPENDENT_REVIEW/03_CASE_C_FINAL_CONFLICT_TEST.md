# Case C — Final Conflict and Scope Test

## Evidence-first reconstruction

For E3, code constructs a forward rotation of the frozen F2 points and an inverse rotation, then `recovery_record` computes error and certificates, loads the frozen tolerance, assigns `primary_status`, and builds the result record. The function consumes raw arguments plus protocol state; it does not consume a pre-existing comparison/result record.

The frozen result reports `TOLERANCE_RECOVERY` with maximum coordinate error `2.220446049250313e-16`, below `1e-12`. Runner, protocol, and result hashes match V3.

## V3 comparison

V3 corrects the source/output split:

- source artifacts are the fixture/call definition and frozen protocol;
- the result JSON is a target/output artifact;
- preservation, numerical uncertainty, and approximate recoverability apply only to subpath `C.C1 -> C.C2`;
- loss applies only to the declared projection `pi_status(full_result_record)`, not to the full target record.

The former boundary description remains visible as rejected `C.H2`. Corrected `C.H3` remains visible and explicitly `CONTRADICTS` it. The disagreement is preserved as history rather than silently rewritten.

No Case C subpath property is represented as a whole-edge property. The whole-edge `claim_support = MIXED` accurately summarizes supported execution, rejected prior boundary language, and supported correction.

`CASE_C_AGREEMENT = SUBSTANTIVE_AGREEMENT`  
`CASE_C_SCOPE_LEAKAGE_FOUND = NO`  
`CASE_C_HISTORICAL_CONFLICT_PRESERVED = YES`
