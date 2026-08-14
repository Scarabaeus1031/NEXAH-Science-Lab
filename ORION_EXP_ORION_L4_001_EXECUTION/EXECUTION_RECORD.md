# EXP-ORION-L4-001 execution record

Reviewed design hash verification: **PASS**  
Reviewed hash: `83811aca6c6c495bc98b3e6de4a8723b4e7452fed16534de92e806957476c4e9`  
Review state retained: `CRITICAL 0 / MAJOR 0 / MINOR 3`  
Lock created before implementation and result exposure: **YES**  
Result known at lock time: **NO**

The single primary execution generated the frozen source, independently generated R0/R1/R2 candidate artifacts, and the R3 type result. The blind observer then stopped before sealing numeric observations because the fixed jointly supported population contained fully tied rank vectors. Under the lock, this makes Kendall tau-b undefined; assigning zero, removing rows, or continuing with a changed population was prohibited.

Primary fixed population evidence:

- total held-out queries: `1500`
- R0 supported: `1456`; jointly supported all-tied: `20`
- R1 supported: `1456`; jointly supported all-tied: `20`
- R2 supported: `1400`; jointly supported all-tied: `216`
- joint support: `1399` (`0.9326666666666666`)
- failure: `KENDALL_TAU_B_ZERO_DENOMINATOR`
- stage: `BLIND_ORION_OBSERVER_BEFORE_SEAL`

Consequently pairwise tau-b, kappa, `K_min`, matched mismatch nulls, baselines, destructive controls and OFAT sensitivities are not validly reachable. They were not assigned synthetic values. R3 independently returned `UNDEFINED / INSUFFICIENT_INFORMATION_FULL_ACTION_PREORDER` with zero rank records.

The clean replay used a new directory and regenerated all source/representation/candidate artifacts without reading primary outputs. It reached the same registered failure. Source and all three candidate NPZ hashes match pairwise; canonical scientific-failure result bytes are identical.

Primary hash: `006b2b2edbb822e89888761813e72b17ee4431318ffe02a89b69a2c4dc6ca548`  
Replay hash: `006b2b2edbb822e89888761813e72b17ee4431318ffe02a89b69a2c4dc6ca548`  
Replay identical: **YES**  
Overall L4 status: **INVALID**

