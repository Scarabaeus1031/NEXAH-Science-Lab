# A4 RNG and Ordering Contract

## Null RNG

For N1–N4 use the exact A3 construction: UTF-8 payload `CONFIG_ID|family_token|replicate` followed by ordered `|TAG=VALUE` fields; unsigned canonical decimals; closed uppercase ASCII enum encodings; SHA-256; digest bytes 0–7; unsigned 64-bit big-endian conversion; fresh NumPy 2.3.5 `Generator(PCG64(seed))`; no preliminary or retry draws. Replicates are exactly integers 0–199.

Object streams and calls are fixed: N1 one `permutation(5)` per representation/training-seed; N2 one `permutation(n)` per split/seed; N3 one `integers(0,n,endpoint=False,dtype=int64)` per recipient; N4 one `permutation(n)` per split/carrier/stored stratum. An invalid input is detected before generator construction and invalidates the experiment; no slot is replaced.

## Total orders

The orders are: splits `TRAIN_OOF,TEST`; seeds ascending; rows `(split code, seed ID, sampling index 0..49)`; actions `-0.5,-0.25,0,0.25,0.5`; representations `TRAJECTORY,LEARNED_FIELD`; carriers `T,F`; nulls `N1,N2,N3,N4`; replicates 0..199; donors and permutation members by row key; strata by target bin, magnitude token, ascending member deciles.

Sensitivity execution order is: action amplitude `[0.25,1.0]`, trajectory neighbors `[15,50]`, learned-field neighbors `[60,160]`, horizon `[0.5,1.5]`, training-seed half `[[5000,5014],[5015,5029]]`, support quantile `[0.95,0.995]`. One factor changes at a time.

Canonical row order governs every design matrix, fold standardization, fit, prediction, metric reduction, per-seed reduction, bootstrap expansion, null statistic, sensitivity statistic, and serialized artifact. Bootstrap uses one fresh PCG64 stream seeded by unsigned 64-bit integer `20260808`, draws 30 seed IDs with replacement in each of exactly 500 sequential replicates numbered 0..499, and expands each draw in draw order followed by canonical within-seed row order. A repeated seed therefore repeats its entire cluster. Undefined bootstrap fit yields invalid experiment; no redraw.

No dictionary, filesystem, set, hash-table, incidental dataframe/NumPy traversal, unstable sort, or library tie order has authority.

