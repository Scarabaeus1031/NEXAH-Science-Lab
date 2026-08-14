# Downstream Decision and Resource Limits

## External decision

At each evaluation time choose:

- `USE`: accept the orientation estimate for a fixed pointing task;
- `ABSTAIN`: do not act;
- `REMEASURE`: acquire an additional optical observation or restore a sensor.

With ground-truth geodesic orientation error `e(q_hat,q)`, a candidate loss is:

```text
L(USE,x) = c_error * e + c_unsafe * 1[e > theta_max]
L(ABSTAIN,x) = c_abstain
L(REMEASURE,x) = c_measure + post_measurement_loss
```

The task owner must fix pointing tolerance `theta_max`, latency, costs and allowed
remeasurement before estimator comparison. Report unsafe acceptance, unnecessary
abstention, calibration coverage and latency separately. The current concept has
no external owner contract, so loss is externally definable but only `PARTIAL`.

## Legitimate resource constraints

- sensor energy and camera duty cycle;
- optical occlusion/visibility windows;
- fixed update latency and compute platform;
- bandwidth and sampling rates;
- finite calibration time/validity;
- physical delay/cost of remeasurement.

These are real only when tied to selected hardware or an application requirement.
Do not limit queries or hide correspondence solely to create a NEXAH advantage.

## Translation-fidelity interpretation

After the state model is validated, each sensor subset `Y_S` is a representation
of the same orientation process. Legitimate endpoints are geodesic reconstruction
error, calibrated task-success probability and decision loss. Mutual information
may be estimated only with stated assumptions and uncertainty. “Fidelity” is
task- and state-relative; visual similarity and symbolic correspondence are not
measurements.

