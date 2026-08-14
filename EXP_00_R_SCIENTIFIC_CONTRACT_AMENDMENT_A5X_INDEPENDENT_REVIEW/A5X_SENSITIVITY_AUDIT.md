# A5X Sensitivity Audit

A5X correctly reconstructs the exact 12 IDs, paths and frozen values from V1 JSON. Canonical sorted compact JSON, one-path replacement, full variant equality, unchanged-config digest, exact ID set and duplicate/missing/extra rejection are deterministic.

Completeness still fails at result validity and provenance:

- caller supplies the expected provenance dictionary; it is not derived from the authority root/current machine/config;
- arbitrary 64-character values satisfy the conformance fixture;
- support fractions `-99` and `99`, contributing count `-1`, and empty per-seed counts are accepted;
- zero/finite coefficient and gain are enough regardless of required endpoint/population provenance;
- malformed non-dictionary records can raise rather than mechanically return false.

Thus two teams agree on sensitivity identity but may disagree on whether outputs/provenance are valid. **Sensitivity identity/completeness: FAIL (Class B).**

