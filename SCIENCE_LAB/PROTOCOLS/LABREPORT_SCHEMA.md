# Canonical Labreport schema

Every field is mandatory. Use `NOT_APPLICABLE` rather than omission.

```yaml
LABREPORT_ID:
TITLE:
DATE:
RESEARCH_BRANCH:
PARENT_QUESTION:
SCOPE:
CLAIM_TESTED:
METHOD:
PREREGISTRATION:
LOCK_HASH:
IMPLEMENTATION_HASH:
DATA_POPULATION:
CONTROLS:
PRIMARY_RESULT:
AUDIT_RESULT:
REPLAY_RESULT:
THEORETICAL_RESULT:
FINAL_CLASSIFICATION:
WHAT_WAS_ESTABLISHED:
WHAT_WAS_NOT_ESTABLISHED:
REFUTED_ELIMINATED_CLAIMS:
NEW_INFRASTRUCTURE:
NEW_SCHEMAS:
ARCHITECTURE_CHANGES:
INFORMATION_BOUNDARIES:
OPEN_QUESTIONS:
DOWNSTREAM_IMPLICATIONS:
NEXT_ACTION:
ARTIFACTS:
HASHES:
CLOSURE_STATUS:
```

Rules:

1. Bind claims to exact scope and evidence class.
2. Preserve failures, nulls, controls, limitations, and superseded outcomes.
3. Separate scientific result hashes from package/document hashes.
4. List conflicting historical claims and their disposition.
5. A Labreport summarizes evidence; it does not rewrite evidence packages.
6. `CLOSED` requires the closure gate in `SCIENCE_LAB_PROTOCOL.md`.
