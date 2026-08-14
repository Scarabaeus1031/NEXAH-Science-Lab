# Optical Geometry Audit

## Triple-beam model

For rigid body pose `(R,t)`, beam `j` has body-frame origin `o_j` and direction
`v_j`. In world coordinates the ray is

```text
r_j(lambda) = R o_j + t + lambda R v_j.
```

Its intersection with a calibrated screen plane is projected to camera pixels.
The estimator needs beam geometry, screen pose, camera intrinsics/distortion and
spot identity. Merely drawing three orthogonal beams does not establish invertible
pose geometry.

## Degrees of freedom and degeneracies

- If translation is fixed, the target has three rotational degrees of freedom;
  three labeled 2D spots may overdetermine pose locally.
- If translation is free, six pose degrees of freedom are coupled to spot motion;
  global uniqueness must be proven for the actual ray/screen arrangement.
- Coaxial, coplanar or symmetric beams, spots near crossings, grazing screen
  incidence and missing spots degrade rank/conditioning.
- Roll is invisible to a rotationally symmetric or effectively single-axis
  pattern; it is observable only with asymmetric off-axis geometry and labels.
- Camera pose, screen geometry, lens distortion, distance, beam divergence,
  speckle/saturation and thermal beam drift enter the model.

## Design verdict

Optical orientation reconstruction is feasible, but the current triple-beam
concept is not yet demonstrated and is inferior as an MVP to a rigid asymmetric
fiducial with at least four known points viewed by a calibrated camera. Standard
PnP minimizes reprojection error from known 3D–2D correspondences
([OpenCV calibration/pose documentation](https://docs.opencv.org/3.4.3/d9/d0c/group__calib3d.html)).

Triple-beam sensing should survive only if it later has a separately justified
advantage—remote projection, occlusion geometry or environmental constraint—and
outperforms the fiducial reference on accuracy, visibility and calibration drift.

