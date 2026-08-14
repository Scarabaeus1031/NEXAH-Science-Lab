# Strongest Conventional Comparators

All methods must receive the same calibrated measurements, timestamps, dropout
masks, training/calibration data and compute/latency budget.

## Mandatory primary comparator

A factor-graph/fixed-lag smoother over `SO(3)` with IMU preintegration, optical
pose/reprojection factors, calibrated noise, robust outlier handling, bias states
and optional magnetic factors is the strongest direct conventional comparator for
offline or bounded-latency evaluation. Factor graphs are established sensor-fusion
machinery ([Dellaert & Kaess review](https://doi.org/10.1146/annurev-control-061520-010504)).

For strict real-time operation, the primary comparator may instead be a well-
specified error-state EKF or invariant EKF; the smoother remains a reference
ceiling within its declared latency.

## Required comparator set

- nonlinear least-squares optical pose per frame;
- complementary orientation filter;
- error-state EKF and UKF;
- particle filter only where non-Gaussian/multimodal ambiguity justifies cost;
- information-filter equivalent where distributed information form matters;
- factor graph/fixed-lag smoothing;
- Bayesian sensor fusion with calibrated posterior uncertainty;
- selective prediction/abstention and the same remeasurement action;
- learned fusion only with sufficient independent training systems, frozen
  architecture selection and equal resource accounting.

Each comparator gets all visible structure: fiducial identity, stage geometry,
sensor covariances, control inputs and dropout indicators. Weak tuning, denied
calibration or unequal latency would invalidate the comparison. Classical
observability analysis is a prerequisite/diagnostic, not itself a state estimator.

