# Metrics and Tolerances

- Numeric `E_rec`: maximum absolute coordinate difference.
- Graph `E_rec`: `0` for exact canonical edge equality, otherwise `1`.
- Exact recovery tolerance: `1e-12`.
- Perturbed reconstruction bound: `1.01 *` the registered perturbation bound
  (`epsilon` for additive noise; `step/sqrt(2)` as the coordinate-wise bound
  after inverse rotation of two independently rounded coordinates). Within-bound state change with all applicable certificates preserved
  is `STRUCTURE_PRESERVED_STATE_CHANGED`; if any applicable certificate changes
  it is `STRUCTURE_CHANGED`. `TOLERANCE_RECOVERY` is reserved for nonzero error
  at/below `1e-12` in exact-control floating arithmetic.
- Forward and recovery certificate comparison: exact canonical equality.
- False recovery: any lossy run with non-null recovered state or a recovery
  status.
- Monotonic degradation: nondecreasing `E_rec` within each frozen perturbation
  family; no curve fitting or threshold tuning.

Stillpoint integration uses deterministic RK4, `dt=0.01`, horizon `60`, return
tolerance `1e-4`, and dwell window `5` time units. Convergence time is the first
sample after which all remaining samples stay within tolerance. Overshoot is
`max(||x(t)||)-||x(0)||`. Damping estimate is minus the least-squares slope of
`log(||x||)` over finite positive norms; it is descriptive only.
