# Knowledge / Interpretation Boundary

NEXUS-01 does not define absolute philosophical knowledge. It uses a scoped
claim-assessment record:

```text
InterpretationClaim {
  claim_id,
  proposition,
  evidence_refs[],
  inference_method_ref,
  status,
  uncertainty_or_confidence,
  scope,
  provenance_ref
}
```

Allowed status vocabulary for this derived interface:

| Status | Minimum meaning |
|---|---|
| OBSERVED | Directly registered through the declared observation channel |
| SUPPORTED | Evidence favors the proposition under a named method |
| INFERRED | Conclusion follows under explicit assumptions/rule |
| UNDERDETERMINED | Multiple compatible explanations remain |
| CONTRADICTED | Registered evidence conflicts under the stated criterion |
| UNKNOWN | Authorized basis is absent or unresolved |

These are epistemic statuses, not truth values. Absence of contradiction is not
proof; confidence is not truth; one compatible explanation under one model is
not ontological identity. RID ambiguity and abstention support fail-closed
treatment.

`KNOWLEDGE_STATUS_RECORD_STATUS=NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE`
