# A5XR Sensitivity Audit

The exact 12 IDs, paths, primary values and sensitivity values are correctly reconstructed. Canonical JSON, one-path variant hash and unchanged-config hash are deterministic. Missing, duplicate, extra, wrong-path and wrong-value records are rejected.

The result completeness gate remains unsound:

- the canonical fixture claims `contributing_seeds=30` while `rows_per_seed` contains one seed, and it passes;
- `rows_per_seed` may be any subset of synthetic seeds rather than the exact contributing set;
- support fractions are range-checked but not recomputed from support rows;
- per-result population/config/environment/authority provenance is absent; one bundle tuple substitutes for all results;
- carrier coefficient/gain values are finite but not bound to endpoint/population artifacts.

P5 correctly uses only the two amplitude IDs and does not demand sensitivity intervals. The other ten remain report-only. The identity portion passes; output/support/provenance completeness fails. **A5X-R32 sensitivity closure: FAIL.**
