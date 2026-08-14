# A5XE Provenance Contract

The raw ledger has exact unique entries for identity, observed rows, model specification, null worlds, bootstrap, N5, attribution, sensitivities and authority binding. SHA-256 is computed over compact sorted canonical JSON. Each nonroot raw entry names `IDENTITY` and `AUTHORITY_BINDING` as ordered parents.

Each derivation constructs—not consumes—derived entries for support, null statistics, bootstrap coefficients, N5 decisions, attribution/dominance, sensitivities, P1–P5 and final classification. Each entry hashes its normalized value and names exact parent IDs. Missing, duplicate, extra, stale or mismatched parent/hash evidence invalidates.

Producer P/null/bootstrap/N5/support/dominance/sensitivity/provenance/classification decisions are forbidden. Debug caches, if later allowed, have no authority and must compare exactly to reconstructed records.
