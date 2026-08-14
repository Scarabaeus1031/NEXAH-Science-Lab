# Stop/Go Roadmap

## Next design-only sequence

1. Obtain an independent one-axis pointing/decision contract: `tau_task`, motion
   envelope, latency, coverage and action costs.
2. Allocate tolerance symbolically across truth, optics, calibration, timing and
   inertial propagation; define `rho_GT`.
3. Select no vendor yet; issue performance requirements for stage, camera, IMU,
   fiducial metrology and clocks.
4. Freeze frame realization, fiducial coordinates, placement and calibration
   motions; perform an analytical identifiability/conditioning review.
5. Only then conduct component feasibility and uncertainty-budget review.
6. Preregistration/build/implementation remain separate future decisions after
   M1–M8 all pass.

## Stop or reclassification conditions

- no independent one-axis tolerance or decision need exists;
- reference uncertainty cannot be made subdominant;
- timing allocation is infeasible at required angular rates;
- actual optical geometry contains unresolved pose branches/poor conditioning;
- gyro bias/scale/extrinsics cannot be independently characterized;
- total uncertainty cannot close without ignoring correlations/systematics;
- dropout adds only a tutorial demonstration with no external decision;
- the task ceases to make sense after deleting NEXAH terminology.

If measurement is clean but no external task exists, reclassify as a standard
educational sensor-fusion/metrology demonstrator. If the single-axis chain passes
and a 3-DOF task is externally required, open a new multi-axis design audit rather
than silently expanding scope.

## Success condition

Success is a traceable, uncertainty-bearing chain with predefined failure, not a
low error observed after the fact. Equivalence, abstention and failure to meet the
tolerance are valid outcomes.

