# L4.003 TNSPA-v1 immutable preregistration lock

Lock timestamp: `2026-08-10T20:59:30+02:00`  
Controlling package: `ORION_LEVEL_4_003_TIE_AWARE_METRIC_PREREGISTRATION/`  
Reviewed preregistration SHA-256: `288b50e7d28eb78e9fb07a7748b2ef18f99f92415d402409d2f6c2883a4970ec`  
Review state: `CRITICAL 0 / MAJOR 0 / MINOR 3`  
**RESULT KNOWN AT LOCK TIME: NO**

## Preserved minor limitations

1. The scalar kernel assigns the same `-1` to opposite-strict and tie/strict cells; separate mandatory cell counts preserve their interpretive difference.
2. TNSPA measures absolute signed strict-relation support, not conditional accuracy; informativeness and full-tie prevalence must accompany every result.
3. R0/R1 are algebraically linked and principally test transport/implementation; both graph pairs must pass independently.

## Immutable scientific contract

- candidate: `NEXAH-L4-C001`, unchanged;
- authentic historical inputs only; no L4.001 rerun;
- fixed triple-joint support: `N=1399` authentic query IDs;
- action carrier: `(U0,UXP,UXM,UYP,UYM,UZP,UZM)`;
- exactly 21 unordered stable-index action pairs per state;
- relation alphabet `rho in {-1,0,+1}` for `prec`, tie and `succ`;
- TNSPA kernel: `+1` same strict orientation, `0` tie/tie, `-1` opposite strict or either one-sided tie/strict;
- `TNSPA_ij=(1/(21N))*sum_q sum_p g(rho_i(q,p),rho_j(q,p))`, range `[-1,+1]`;
- every full-tie state and every pair cell retained;
- `I_r=strict_cells/(21N)` and `I_r>=0.50` separately for R0/R1/R2;
- `TNSPA_min=min(R0-R1,R0-R2,R1-R2)>=0.60`, with every pair individually `>=0.60`;
- exactly 9,999 within-held-out-seed-block permutations of whole preorder vectors, preserving tie structure, graph pattern structure, action marginals, support and seed blocks;
- empirical q99 uses frozen `higher` rule; every observed pair must be strictly above q99 and have `p<=0.01`;
- exact three controls TC1 mutual full-tie, TC2 one-sided full-tie and TC3 strict reversal;
- R3 remains `UNDEFINED / INSUFFICIENT_INFORMATION_FULL_ACTION_PREORDER`, zero rankings, no x/y, source-rank, score or correspondence leakage;
- First-Action-Set Jaccard only after primary seal, secondary/non-decisional; full/full reported `UNINFORMATIVE_FULL_SET`;
- all score-vector distances/correlations out of scope;
- clean replay must regenerate relations, observation, nulls, controls, Jaccard and comparison without primary generated outputs; canonical hashes must match.

No population, relation orientation, kernel value, aggregation, informativeness rule, threshold, null construction, seed rule, quantile, p-value, control, supplementary authority, classification rule or interpretation may change after this lock.

This lock precedes implementation and contains no relation artifact, metric value, null value, classification or scientific result.
