# SL-GOV-002 — Science Lab Structure V1 Verification

Date: `2026-08-14`

Status: `PASS / STRUCTURE_FREEZE_REMAINS`

Verifier role: Science Lab Research Director

## Scope

Verify that Constitution V1 creates a usable Lab entrance and fail-closed
operating layer without executing science, modifying evidence or importing the
historical untracked corpus.

## Versioned baseline

- Constitution adoption commit:
  `895087ab9def7e3990c5108ac6ee3027a8c9f7ef`
- clean-checkout route repair commit:
  `91699ae7a3268c032b5f36ad61ce762d8d8a4abd`
- verified remote ref: `origin/codex/z3885-verification`
- verified remote SHA:
  `91699ae7a3268c032b5f36ad61ce762d8d8a4abd`

## Verification performed

The remote commit was exported into a new temporary directory independent of
the working tree.

```text
PORTFOLIO_JSON_VALID = YES
CONTROL_SURFACE_MARKDOWN_FILES_CHECKED = 28
BROKEN_INTERNAL_LINKS = 0
REQUIRED_ENTRY_ROUTE_FILES_PRESENT = 7/7
REMOTE_REF_MATCHES_VERIFIED_COMMIT = YES
EXPERIMENT_OR_SCIENTIFIC_REPLAY_EXECUTED = NO
SCIENTIFIC_EVIDENCE_MODIFIED = NO
UNTRACKED_RESEARCH_CORPUS_IMPORTED = NO
```

The first check exposed two links to locally present but untracked provenance
folders. They were converted into explicit local-only references rather than
silently importing those packages. The second clean-checkout check passed.

## Gate disposition

All technical and documentary Structure V1 gates pass. The Lab nevertheless
remains in `STRUCTURE_FREEZE`. Passing this verification is not a reopen
decision and does not activate EXP-00-R or any other Study.

The only remaining gate is a separate Human Owner decision:

`REOPEN` or `REMAIN_FROZEN`

## Machine-readable conclusion

```text
SCIENCE_LAB_STRUCTURE_V1_VERIFIED = YES
STRUCTURE_FREEZE_EXIT_TECHNICAL_GATES = PASS
HUMAN_OWNER_REOPEN_DECISION_RECORDED = NO
LAB_OPERATIONS_STATE = STRUCTURE_FREEZE
ACTIVE_RESEARCH_CYCLE = NONE
```
