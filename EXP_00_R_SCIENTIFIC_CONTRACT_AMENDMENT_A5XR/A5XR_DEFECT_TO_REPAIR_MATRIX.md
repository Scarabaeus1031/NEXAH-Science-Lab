# A5XR Defect → Repair Matrix

**First artifact.** No A5XR derivation code existed when written.

| Finding | Accepted rule | Raw inputs | Deterministic derivation | Validator | Positive/negative fixtures | Mutation |
|---|---|---|---|---|---|---|
| R30 | A4/A5 exact P1–P5 | observed carrier/agreement metrics; 200-value null columns; CI/Brier; attribution; amplitude records | derive Monte Carlo `k`, carrier conjunctions, dominance, amplitudes; ignore/recheck caches | `derive_p1_p5` | canonical bundle / raw sign-null-cache mutations | supplied P1/P5/classification mismatch |
| R31 | A2/A5 exact dominance; A2–A4 N1–N5 | row losses/counts/seed IDs; null provenance/statistics; N5 tier/transforms/tau | exact `Fraction.from_float`; full family metadata/IDs/RNG/population; exact 12 matrices/tier metadata/min tau | `derive_dominance`, `validate_nulls`, `validate_n5` | exact-half / above-half; complete / missing-wrong transform | dominance/null/N5 attacks |
| R32 | V1 registries/support; accepted 12 sensitivities/provenance | sealed synthetic registry, support blocks, full variant configs/results, canonical provenance | registry membership, range/count/uniqueness, canonical JSON one-leaf comparison, fixed expected digests/types | `derive_support`, `validate_sensitivities`, `validate_provenance` | canonical / fake seed, duplicate, impossible range, fake provenance | identity/support/sensitivity attacks |
| R33 | accepted A3–A5 semantics | bound A4/A5/A5X machines plus A5XR semantic registry | exact semantic fingerprint comparison and hash binding | `validate_semantic_contract` | frozen sources / one-field mutations | N1/N2/N3/N4/N5/RNG/action/P4/P5/classifier/ceiling |

All repairs are Class-B encodings. **Stop condition:** if a required expected value is absent from accepted A1–A5/A5X authority, return `SCIENTIFIC CONTRACT CHANGE REQUIRED`; do not select one.
