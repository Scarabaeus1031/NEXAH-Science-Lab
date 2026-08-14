# Blocking Defects and Minimum Revisions

The schema is not modified here. Seven blocking defects must be resolved before validator implementation.

| # | Severity | Defect | Minimum necessary revision |
|---:|---|---|---|
| 1 | `BLOCKING` | no schema-conforming serialized sample instances | publish four immutable example instances and demonstrate conformance plus source traceability |
| 2 | `BLOCKING` | preservation/loss assertions lack operational criterion | require equivalence/test/metric/tolerance for preservation; distinction scope and witness/test for loss |
| 3 | `BLOCKING` | single `status` conflates operator, execution/replay, provenance, and claim authority | split status dimensions and attach status to individual claims |
| 4 | `BLOCKING` | negative results can be deleted by a later valid record | add record version/supersession lineage and monotonic/non-deletion validation across revisions |
| 5 | `BLOCKING` | operator and representation boundaries are not reproducible | require ordered component operator references and versioned representation contracts; define split/coarsening rule |
| 6 | `BLOCKING` | provenance forces repository/commit and endpoint artifacts | add explicit `KNOWN/UNKNOWN/NOT_APPLICABLE` provenance alternatives without fake placeholders |
| 7 | `BLOCKING` | scientific judgment and symbolic eligibility are not attached to claims/evidence | require assessment mode/assessor/rationale and evidence content eligibility; symbolic material cannot be relabeled silently |

## Important, nonblocking after the above

- require unique/resolvable evidence IDs and explicit evidence integrity versus claim support;
- add collision→invertibility consistency rules;
- define stochastic RNG and estimated-operator training provenance or remove those kinds from v1;
- distinguish uncertainty epistemic source and require an applicability decision;
- use portable content-addressed locators where possible.

No optional feature is needed before these corrections; ontology expansion, UI, inference, and automatic propagation remain postponed.

