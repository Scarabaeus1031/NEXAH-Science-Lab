# A4 Validity-Gate Contract

## Dependency graph

`PREAUTH_INTEGRITY → N5_SYNTH → EXTERNAL_AUTHORIZATION → REGISTERED_INPUT_BINDING → TRAINING/TARGET/FITS → PARITY/DISTINCTNESS/LEAKAGE → HELDOUT_PREDICTION/SUPPORT → SUPPORT_GATES → N5_RUN → OUTCOMES → PRIMARY+ATTRIBUTION → N1–N4 → SENSITIVITIES → BOOTSTRAP/PER-SEED → PROVENANCE_COMPLETENESS → P1–P5 → RÖSSLER LABEL → CROSS-SYSTEM LABEL`.

A4 creates no authorization. N5-SYNTH failure is pre-execution `IMPLEMENTATION_FAILURE` and keeps registered access unreachable. After authorization, every listed gate is mandatory and failure is `INVALID_EXPERIMENT`; scientific labels are unreachable until the full conjunction passes.

## Gates

- exact V1 config/source hash and exact accepted amendment bindings;
- authorized registry only, train/test isolation, no future-test access in fitting;
- same raw training information/actions/objective/horizon for both representations;
- documented distinct estimator families; no analytic Rössler field import/data leakage;
- finite complete canonical row IDs and all required provenance/config/source hashes;
- T OOS `<=.10`, F OOS `<=.10`, joint support `>=.80`;
- at least 20 test seeds each have at least 20 jointly supported rows on which **both** named carriers propose nonzero actions;
- N5-RUN pass;
- exactly 200 finite slots for N1,N2,N3,N4_T,N4_F, no retry/omission;
- exactly 500 finite seed-cluster bootstrap slots using seed as cluster;
- both symmetric carriers, per-seed direction tables, exact seed-dominance decomposition;
- every 12-value one-factor sensitivity registry entry present in frozen order;
- primary/attribution/sensitivity/null artifacts bound to the same config and row populations;
- no post-access scientific mutation or recomputation under modified configuration;
- P1–P5 and both classifications generated mechanically from sealed inputs.

Support failure propagates to joint support and invalidity; no complete-case redefinition is allowed. Missing mandatory report-only diagnostics is provenance incompleteness and invalidity even when it would not change a proposition.

