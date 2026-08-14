# A5X Raw-Artifact Gate Audit

| Gate | Raw derivation finding |
|---|---|
| INFORMATION_PARITY | deterministic exact record comparison; PASS |
| REPRESENTATION_DISTINCTNESS | exact record equality; PASS |
| NO_ANALYTIC_FIELD_LEAKAGE | deterministic but free-form import/call vocabulary weak; not sole blocker |
| TRAIN_TEST_ISOLATION | deterministic stated fields; PASS |
| SUPPORT_VALIDITY | **FAIL:** any 20 string keys with value 20 pass; registered test-seed membership is not enforced |
| N5_RUN | **FAIL:** IDs/tau/population flags only; matrices/order/transforms/B/path/refit/inverse registration absent |
| NULL_FAMILY_COMPLETENESS | **FAIL:** arbitrary finite statistic name passes; no transformation/carrier/statistic provenance |
| BOOTSTRAP_VALIDITY | counts/draw ranges present; RNG/population/config provenance incomplete |
| PER_SEED_ATTRIBUTION_COMPLETENESS | **FAIL:** direction records only; exact dominance artifacts absent |
| ALL_12_SENSITIVITIES_COMPLETE | identity strong; support/provenance validation weak |
| CONFIG_BINDING_COMPLETE | exact caller-provided expected dictionary; expected root linkage not internally derived |
| PROVENANCE_COMPLETE | **FAIL:** expected artifact ID registry is caller-supplied |
| SOURCE_CONFIG_INTEGRITY | package verification recomputes bytes; PASS |
| P1_P5_MECHANICALLY_COMPUTED | **FAIL:** consumes producer Booleans rather than raw results |

False gates map to invalidity, but several incorrect worlds map to true. **Raw-artifact derivation: FAIL.**

