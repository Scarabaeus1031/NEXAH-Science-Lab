# Machine Output Schema

Every attempted run emits `FINAL_RESULT.json`:

```json
{
  "schema_version": "2.0.0",
  "protocol_bundle_sha256": "hex",
  "run_status": "terminal status from 14_NEGATIVE_OUTCOME_REGISTRY.md",
  "seed_commitment": "hex-or-null",
  "revealed_seed_hex": "hex-or-null",
  "diagnostic_output_sha256": "hex-or-null",
  "integrity": {},
  "preconditions": {},
  "leakage_audit": {},
  "controls": {},
  "held_out_case_results": [],
  "method_endpoints": {},
  "primary_endpoints": {},
  "hypotheses": {"H1_A": false, "H1_B": false},
  "falsifiers": {},
  "precedence_trace": [],
  "claim_boundary": {}
}
```

Each held-out record contains truth, every method prediction, correctness,
stage-distance, false/missed loss, baseline decision vector and N4 ledger. JSON is
UTF-8, sorted-key, finite and hashed. Failure artifacts use nulls, never omit
required top-level fields.

