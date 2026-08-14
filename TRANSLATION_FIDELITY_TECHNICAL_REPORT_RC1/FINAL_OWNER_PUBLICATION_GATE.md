# Final Owner Publication Gate

## Gate evaluation

| Criterion | Status | Evidence |
|---|---|---|
| A. Scientific artifact integrity | PASS | all frozen allowlist copies remain byte-identical |
| B. Provenance | PASS | source and historical dependency provenance are hash-bound |
| C. Replay portability | FAIL | Study 2 exact result hash mismatch |
| D. Environment lock | PASS_BOUNDED | exact macOS/arm64 runtime pinned; no cross-platform claim |
| E. Authorship/citation readiness | OWNER_CONFIRMATION_REQUIRED | consolidated in `OWNER_METADATA_CONFIRMATION.md` |
| F. License readiness | OWNER_CONFIRMATION_REQUIRED | software snapshot established; research-artifact scope unresolved |
| G. Release manifest consistency | PASS | regenerated and verified after release engineering |
| H. Claim-boundary preservation | PASS | scientific conclusions and novelty classifications unchanged |

Replay failure has priority among the allowed gate decisions. Owner metadata and
license confirmations also remain necessary, but cannot turn a failed exact
replay into a ready gate.

No publication, commit, push, tag, GitHub release, DOI, Zenodo upload, or
outreach action was performed.

```text
FROZEN_SCIENTIFIC_FILES_CHANGED = NO
MATHEMATICAL_NOVELTY = NONE
ALGORITHMIC_NOVELTY = NONE
EMPIRICAL_NOVELTY = PARTIAL
METHODOLOGICAL_NOVELTY = PLAUSIBLE

AUTHOR_METADATA = OWNER_CONFIRMATION_REQUIRED
CITATION_METADATA = OWNER_CONFIRMATION_REQUIRED
LICENSE_STATUS = OWNER_CONFIRMATION_REQUIRED
ENVIRONMENT_LOCK = COMPLETE_FOR_RECORDED_MACOS_ARM64_RUNTIME
PORTABLE_REPLAY = BLOCKED
STUDY_1_REPLAY = PASS
STUDY_2_REPLAY = FAIL_HASH_MISMATCH
STUDY_3_REPLAY = PASS
MANIFEST_VALID = YES

FINAL_GATE_DECISION = PUBLICATION_GATE_BLOCKED_BY_REPLAY
```

