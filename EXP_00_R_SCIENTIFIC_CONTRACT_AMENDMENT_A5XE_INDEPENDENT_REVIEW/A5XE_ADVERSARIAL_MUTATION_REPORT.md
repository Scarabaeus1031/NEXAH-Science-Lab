# A5XE Independent Adversarial Mutation Report

The additive review suite contains 20 independent tests and attacks categories A–X. The complete run passed in 108.317 seconds. It does not rely on A5XE's reported 60-test count.

| Attack family | Result |
|---|---|
| Raw rows, duplicate/foreign identities, provenance | Detected |
| Support gate threshold failure | Detected |
| Valid partial support with fixed-joint population semantics | **Not detected; unsupported rows remain modeled** |
| Null family/member/count/RNG hashes | Detected |
| Monte Carlo direction/ties/`k<=4` | Correct |
| Bootstrap cluster/count/multiplicity | Detected |
| N5 transform/rank/SYNTH/RUN | Detected with correct typed states |
| Dominance exact half/negative aggregate/malformed | Correct |
| Attribution eligible IDs | Detected |
| Missing P4 score/margin controls | **Not detected** |
| Empty mandatory report-only diagnostic payloads | **Not detected** |
| Sensitivity missing/foreign ID/count | Detected |
| Sensitivity path/value/config/output contradiction | **Not detected** |
| Machine model/observed/validity/population/output mutation | **Not detected semantically** |
| Direct P1–P5/classification injection | Detected |
| Summary-only substitution | Detected |
| Upstream member/root bytes | Detected for listed dependencies; A1 is not listed |

The undetected mutations use recomputed internal provenance where applicable. They are semantic failures, not expected seal failures. Overall adversarial validation: **FAIL**.
