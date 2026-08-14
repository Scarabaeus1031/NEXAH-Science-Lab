# A5XE Bootstrap Reconstruction Contract

The raw bootstrap artifact contains IDs 0–499 and exact multiplicities of 30 sampled TEST seed clusters. A5XE independently regenerates the sequential NumPy 2.3.5 PCG64 stream with seed `20260808`, rejects changed/missing/foreign multiplicities and expands every sampled seed to all its canonical TEST rows with multiplicity.

For each carrier and repetition, the standardized L2-logistic model is refit on the expanded rows and the coherence coefficient is recomputed. No coefficient vector is accepted in place of resample definitions. All 500 coefficients must be finite. The clustered interval is the NumPy 2.3.5 linear `.025/.975` quantile; no redraw is permitted.
