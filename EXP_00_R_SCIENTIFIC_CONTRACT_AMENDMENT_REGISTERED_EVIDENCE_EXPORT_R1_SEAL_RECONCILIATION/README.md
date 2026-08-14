# Export R1 Seal Tree-Construction Reconciliation

Status: **PASS — CLOSED / RECONCILED**

This additive, package-integrity-only reconciliation resolves the tree-construction discrepancy in:

- `EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1`
- `EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_REGISTERED_EVIDENCE_EXPORT_R1_INDEPENDENT_REVIEW`

All 17 declared member files are present, with exact recorded byte lengths and SHA-256 hashes. No member was substituted, added, removed, or modified. The historical tree identifiers are reproducible, but both seals document different constructions from those historically used.

The Export R1 seal sorted complete records by their leading digest rather than by basename. The independent-review seal also sorted by digest and omitted the documented two-space delimiter between digest and basename. Exact legacy rules are frozen in `TREE_CONSTRUCTION_RECONSTRUCTION.md` and `RECONCILIATION_RECORD.json`.

No scientific contract, runtime authority, generator, review finding, registered evidence, seed, P1–P5 result, or classification was accessed or changed.

Next permitted object: `REGISTERED EVIDENCE GENERATION OPERATION AUTHORIZATION — FINAL RECHECK`.
