# EXP-ORION-L4-001 immutable preregistration lock

Lock timestamp: `2026-08-10T20:01:19+02:00`  
Controlling design source: `ORION_LEVEL_4_NEXAH_CANDIDATE_PREREGISTRATION/`  
Reviewed canonical design SHA-256: `83811aca6c6c495bc98b3e6de4a8723b4e7452fed16534de92e806957476c4e9`  
Hash verification at lock: **PASS**  
**RESULT KNOWN AT LOCK TIME: NO**

## Preserved review state

- CRITICAL: **0**
- MAJOR: **0**
- MINOR: **3**

The three reviewed MINOR limitations remain binding and visible:

1. R0/R1 agreement is primarily a coordinate-registration and implementation-independence check; R2 supplies the materially different path, and `K_min` prevents averaging away its failure.
2. Historical EXP-00-v2 familiarity cannot be cognitively erased; prospective disjoint L4 seeds, frozen thresholds and blind observation mitigate it.
3. `ROBUST` may coexist with `NO REGISTERED ADDED VALUE` or `CONTROL_NOT_DESTRUCTIVE`; all conclusions must be reported separately and no stronger interpretation is allowed.

## Frozen without modification

- candidate `NEXAH-L4-C001`;
- stable action carrier `(U0, UXP, UXM, UYP, UYM, UZP, UZM)`, amplitude `0.5`, and the exact anchored-block seven-action weak-preorder definition with tie tolerance `1e-6`;
- controlled Lorenz-63 source/provenance contract, RK4 `dt=0.005`, decision interval `0.05`, horizon `0.50`, burn-in `5.0`, interval `0.1`, 50 states/seed, train seeds `51000..51029`, held-out seeds `52000..52029`, and single R0 training-fitted target;
- R0 native `Trajectory(k=25)`, R1 `T(x,y,z)=(2x,0.5y,1.5z)` independently fitted trajectory extraction with pullback metric, and R2 deterministic graph extraction with `K=64`, `max_iter=100`, smoothing `m=3`;
- R3 z-only information boundary, required `UNDEFINED` reason, and zero fabricated rank records;
- pairwise Kendall `tau_b`, `kappa=(1+tau_b)/2`, `K_min=min(K_01,K_02,K_12)`, and `K_min>=0.60`;
- every pair's 4,999-replicate within-held-out-seed state-mismatch 99% null requirement and `p<=0.01`;
- support gates: each complete path OOS `<=0.10`, joint support `>=0.80` of the fixed 1,500-query ledger;
- both baselines: B0 GLOBAL-MEAN and B1 LINEAR-ACTION with their registered held-out regret and clustered confidence criteria;
- all six destructive controls D1-D6, including targets, operations, statistics, thresholds and fail-closed interpretations;
- all eight OFAT perturbations: `k={20,30}`, `K={48,80}`, `m={2,4}`, `delta={1e-7,1e-5}`, their fixed primary population and preservation criteria;
- blind generator/extractor/observer/comparator separation, candidate/output schemas, deterministic seed derivations, clean-replay prohibition on primary outputs, hashes, invalidity rules and interpretation boundaries.

No threshold, representation, metric, support rule, null construction, control, parameter range, population, tolerance, failure criterion or interpretation may change after this lock. Implementation must conform to the reviewed design; it may not amend it. Any incompatibility stops execution and requires a newly reviewed version rather than editing this lock.

This lock authorizes conforming implementation and the single registered primary execution followed by clean replay. It contains no implementation code, source data, candidate artifact, observed statistic, classification or result.
