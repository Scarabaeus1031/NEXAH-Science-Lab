# Observability and Correspondence

## Local observability by channel

- A calibrated camera viewing a rigid asymmetric fiducial with known geometry and
  correspondence can constrain full orientation; conditioning fails with poor
  geometry, occlusion, small image footprint and near-degenerate views.
- Gyro-only propagation observes angular increments but not absolute orientation;
  bias creates growing drift.
- A quasi-static accelerometer constrains the gravity direction (roll/pitch), not
  yaw. Unknown linear acceleration confounds tilt.
- A calibrated magnetometer supplies a second world vector and can constrain yaw,
  but only when the local magnetic field is stable and platform distortions are
  modeled.
- Visual-inertial systems retain gauge freedoms without absolute references;
  global yaw and translation are standard unobservable directions in common VINS
  formulations ([Yang et al.](https://doi.org/10.1109/LRA.2021.3140054)).

Formal local analysis must use the frozen nonlinear dynamics and observation
Jacobians/Lie derivatives; sensor count alone never proves observability. Global
uniqueness additionally requires analysis of symmetries and multiple pose
solutions.

## Triple-beam correspondence

If three beams are rigidly attached, each measured spot is the intersection of a
known body-frame ray with a calibrated screen plane. Labeled, non-symmetric beams
can make roll observable locally. Unlabeled spots introduce a permutation
ambiguity; symmetric geometry can make distinct orientations observationally
equivalent. Occlusion, saturation, reflection and crossings cause data-association
failures.

Color or coded modulation can normally label beams directly. Consequently,
unknown correspondence is avoidable engineering noise, not the core scientific
question. It may be a secondary robustness condition only after the labeled
system works. Do not remove labels to manufacture partial observability.

Three spots are not automatically sufficient globally. A simpler asymmetric
multi-point fiducial with at least four correspondences gives established pose
solvers redundancy and clearer degeneracy checks. Roll is therefore
`CONDITIONAL` for the current beam concept and straightforward for the redesigned
fiducial under visibility and calibration assumptions.

