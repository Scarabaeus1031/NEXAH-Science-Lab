# 10 — Parameter Sensitivity Ledger

| stage | parameters / conventions requiring registration | consequence if missing | GRC-01 status |
|---|---|---|---|
| trajectory | solver, step, duration, transient, seed, sampling measure | path and occupancy can change | missing for V1–V9 |
| projection | selected coordinates/map, scaling, fitted basis | distinct states may merge; shapes change | missing/partial labels only |
| density | estimator, bandwidth/bins, kernel, normalization, grid | peaks, valleys, magnitude change | missing |
| derivative | grid spacing, stencil, smoothing, boundary policy | direction/magnitude/noise change | missing for images; legacy archive omits physical spacing |
| flow | equations/parameters or empirical velocity estimator | comparison object changes | not bound to images |
| coherence | formula, metric, zero policy, temporal matching | values and undefined cases change | missing |
| gate | thresholds, conjunction, window, persistence, deduplication | candidate count/location change | missing |
| cross-system | system parameters and identical preprocessing | comparisons become non-reproducible | incomplete for this lineage |

`PARAMETER_SENSITIVITY_STATUS=MATERIAL_AND_INCOMPLETELY_REGISTERED`.

No numerical sensitivity sweep was performed. The entry records dependencies; it is not a new experiment.

