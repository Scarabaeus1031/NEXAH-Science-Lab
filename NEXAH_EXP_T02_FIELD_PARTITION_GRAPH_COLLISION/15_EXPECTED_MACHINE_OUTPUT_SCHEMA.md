# Expected Machine Output Schema

Future execution writes `results/EXP_T02_RESULTS.json` with:

```json
{
  "schema_version": "1.0.0",
  "protocol_bundle_sha256": "hex",
  "execution_status": "COMPLETED|PRECONDITION_FAILED_<CODE>",
  "environment": {},
  "fixtures": {},
  "representations": {},
  "certificate_comparisons": [],
  "baseline_comparisons": [],
  "collision_ledger_file": "COLLISION_LEDGER.json",
  "correspondence_audit": {},
  "numerical_controls": {},
  "falsifiers_triggered": [],
  "robustness_discrimination": {},
  "incremental_diagnostic_value": "SUPPORTED_BOUNDED|NOT_SUPPORTED|INCONCLUSIVE|NOT_EVALUATED",
  "hypothesis_decision": "H1_SUPPORTED_BOUNDED|H0_NOT_REJECTED|INCONCLUSIVE|NOT_EVALUATED",
  "claim_boundary": {
    "new_mathematics": false,
    "physical_claim": false,
    "universal_claim": false
  }
}
```

Additional required files are listed in `10_CORRESPONDENCE_SCHEMA.md`, plus
`COLLISION_LEDGER.json`, `BASELINE_RESULTS.json`, `CERTIFICATE_RESULTS.json`,
`NUMERICAL_CONTROLS.json`, `RUN_MANIFEST.json`, and `FINAL_STATUS.txt`.

All JSON uses UTF-8, sorted keys, two-space indentation and no NaN/Infinity.
Result hashes cover every result file except the result manifest itself.

