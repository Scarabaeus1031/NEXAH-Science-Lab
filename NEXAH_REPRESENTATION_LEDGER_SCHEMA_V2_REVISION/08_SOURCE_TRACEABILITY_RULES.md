# Source-Traceability Rules

Trace links use roles `CLAIM`, `ARTIFACT`, `IMPLEMENTATION`, `CONFIGURATION`, `INPUT`, `OUTPUT`, and `AUDIT`. Each link states its availability independently.

`LOCATED`, `HASH_CONFIRMED`, and `REPLAY_CONFIRMED` require a locator; hash-confirmed links require SHA-256. Missing links use `PROVENANCE_UNAVAILABLE` or `UNKNOWN` with a note. `NOT_APPLICABLE` is valid for abstract records.

No aggregate provenance state may be stronger than its consequential missing link permits. For A/B, implementation is located but historical in-memory arrays are unavailable, so provenance is `PARTIAL`. C has runner, protocol, result hashes, and replay. D has frozen protocol/result/runner and synthesis evidence, while its unique edge decomposition remains unresolved rather than falsely reconstructed.

