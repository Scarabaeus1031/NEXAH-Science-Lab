# Final independent adversarial review of A5XEF

## Outcome

A5XEF closes the previously reported population, P4, sensitivity, model-binding, semantic-coverage and transitive-authority defects for synthetic evidence. It does **not** close the pre-V3 evidence contract because its claimed generic raw interface cannot represent an authorized registered bundle.

## Blocking finding F47 — registered evidence identity is prohibited

**Class:** B — evidence encoding / implementation-readiness defect.

**Severity:** blocking under the review stop rule.

**Claim falsified:** “the generic raw schema is suitable for a future authorized V3 evidence bundle.”

The sealed schema and both derivation implementations accept only fixture identity:

```text
manifest.registered = false
authority_binding.registered_data = false
authority_binding.fixture = true
```

An otherwise conforming registered candidate is rejected before scientific classification by both implementations. A future V3 producer therefore cannot instantiate A5XEF's interface as claimed. At least the JSON schema, both derivation identity gates, the machine-readable contract, provenance identity rules, and consequently the finite root would need to change.

This is not a request to authorize execution and not a scientific ambiguity. The registered/fixture distinction is metadata and trust-state typing; repairing it should not alter any estimand, threshold, population, model, endpoint or classification rule. Nevertheless, the current evidence contract is not closed because two implementers cannot use it for the future object it claims to govern.

## Review matrix

| Review area | Finding |
| --- | --- |
| Authority reconstruction | PASS |
| Raw evidence versus summaries | PASS |
| Population binding | PASS |
| Model-spec binding | PASS |
| Nulls / Monte Carlo / bootstrap | PASS |
| N5 reconstruction and typing | PASS |
| P4 and mandatory diagnostics | PASS |
| Twelve sensitivities | PASS |
| P1–P5 and classification | PASS |
| Failure-state separation | PASS |
| Two derivations | PASS for synthetic fixtures; shared schema/constants are visible and appropriately limited |
| Central counterexample | PASS |
| Authority/integrity | PASS within the declared finite trust boundary |
| Namespace neutrality | PASS for alternate synthetic namespace |
| Registered readiness | **FAIL — F47** |

## Stop-rule application

F47 is not cosmetic or optional defense in depth. Invalid evidence is not passing, but valid future registered evidence cannot be represented at all. The failure lies directly on the required pre-V3 interface boundary. Therefore a blocking Class-B defect survives adversarial testing.

No Class-A defect was found. No additional machinery beyond correcting this identity-mode contract is demanded by this review.

## Status

SCIENTIFIC CONTRACT: CLOSED
EVIDENCE / ENCODING CONTRACT: OPEN — F47
INDEPENDENT REVIEW: FAIL
REGISTERED DATA ACCESSED: NO
V3 IMPLEMENTED: NO
V3 EXECUTION AUTHORIZED: NO

FINAL DECISION:
REJECT A5XEF — CLASS B DEFECT
