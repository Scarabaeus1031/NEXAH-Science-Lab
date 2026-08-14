# A5X Prose → Machine → Raw Traceability

| Rule | Prose | Machine | Raw fields / derivation | Test / attack |
|---|---|---|---|---|
| authority | sealing contract | `authority` | file bytes→SHA-256; V1 ledger | A–H |
| parity/isolation/distinctness/leakage | validity contract | `validity_gates` | exact raw dictionaries→pure gate functions | I–L |
| support/N5/null/bootstrap | validity contract | gate function paths | exact counts/IDs/finiteness/thresholds | leaf failures |
| attribution/provenance | A5 P4 + validity | carrier/per-seed/provenance gates | exact row/hash/metric records | missing/malformed |
| sensitivities | sensitivity contract | `sensitivities.registry` | V1 JSON→one-path patch→canonical hashes→12-record conjunction | Q–S |
| N1–N5/RNG | accepted A3–A5 | `semantic_fingerprints` | exact field equality | M–P |
| P4/P5 | accepted A5 | fingerprints | exact operators/registries | T,W |
| classifier/ceiling | accepted A4/A5 | classifier fingerprint | ordered branch evaluation | V,X |

Flow is raw artifacts → deterministic functions → validity/P1–P5 → frozen classifier. No raw gate Boolean is accepted from a caller.

