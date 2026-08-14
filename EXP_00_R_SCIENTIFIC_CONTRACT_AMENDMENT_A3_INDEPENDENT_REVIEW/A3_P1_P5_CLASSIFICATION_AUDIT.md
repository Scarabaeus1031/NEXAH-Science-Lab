# A3 P1–P5 and Classification Audit

## Proposition reconstruction

| Proposition | Frozen requirement | Reconstruction |
|---|---|---|
| P1 | observed mean coherence and top-action agreement each exceed N1, N2, N3, N4_T, and N4_F; one-sided `(1+k)/201`; adverse ties; `k<=4` | uniquely recoverable from accepted A1/A2 |
| P2 | positive standardized coherence coefficient and seed-clustered 95% CI strictly above zero for both carriers; coefficient-null p-values diagnostic only | uniquely recoverable |
| P3 | positive held-out log-loss gain, nonworse Brier, and carrier-specific gain above N1/N2/N3/matching N4 for both carriers | uniquely recoverable |
| P4 | direction and log-loss gain positive for every preregistered carrier/leave-one-representation attribution after score/margin controls | present in V1 prose, absent from A3 machine |
| P5 | both action amplitudes preserve positive coefficient and log-loss gain for both carriers; interval exclusion only at primary amplitude | present in V1 prose, absent from A3 machine |

The exact sensitivity registry also includes estimator-neighbor, horizon, training-block, and support-quantile diagnostics. They cannot rescue the primary analysis and must be complete, but A3 machine encodes them only as a generic unchanged-registry string.

## Validity gates

A positive label must be unreachable after information-parity/train-test isolation failure, representation-integrity failure, analytic-field leakage, support gate failure, N5-RUN failure, missing/incomplete null family, invalid bootstrap, missing per-seed attribution, incomplete sensitivity registry, configuration/provenance failure, or post-access unregistered choice. These clauses are recoverable from V1 prose but are not represented as a complete A3 machine dependency graph.

## Rössler classification overlap

Consider one fixed valid result:

- both carrier coefficients and held-out log-loss directions are positive;
- the required P1/null comparison fails;
- no invalidity gate fails.

V1 `Partial replication` applies because the primary directions are positive and criterion 6 fails. V1 `Non-replication` also applies because observed agreement or predictive gain does not exceed required nulls. No precedence rule chooses one label. The same artifact set can therefore yield either `PARTIALLY REPLICATED` or `NOT REPLICATED`.

## Cross-system ceiling

The Lorenz-v2 P4 limitation and maximum `PARTIAL CROSS-SYSTEM REPLICATION` label are explicit and preserved. A positive Rössler result cannot override that ceiling. This part passes.

## Verdict

**P1–P5 / CLASSIFICATION CONTRACT: FAIL.** P1–P3 and the Lorenz ceiling are sound, but P4/P5/validity are not machine-reconstructive and the Rössler label clauses overlap without priority.
