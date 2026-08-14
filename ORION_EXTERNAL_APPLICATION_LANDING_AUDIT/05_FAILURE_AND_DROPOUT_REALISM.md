# Failure and Dropout Realism

## Natural failure modes

`SOURCE_FACT`: NASA's current small-spacecraft GNC survey states that star trackers
need a clear starfield and that angular rate, external light and glare can corrupt
or invalidate their solutions; missions commonly propagate attitude with an IMU
and Kalman filter during loss
([NASA GNC state of the art](https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/)).

`SOURCE_FACT`: ECSS star-sensor terminology explicitly includes invalid attitude
solutions, silence, false valid solutions and recovery/settling time
([ECSS-E-ST-60-20C](https://ecss.nl/wp-content/uploads/2019/05/ECSS-E-ST-60-20C_Rev.2%2815May2019%29.pdf)).

For stabilized imaging/tracking, occlusion, feature loss, blur, saturation and
temporary visibility loss are `NATURAL_FAILURE_MODE` only when inherited from the
application environment. Deliberately hiding markers solely to create benchmark
difficulty is `BENCHMARK_INJECTION`.

## Operational action mapping

| Abstract action | Spacecraft attitude | Stabilized pointing | Tracker qualification |
|---|---|---|---|
| `ACCEPT` | use attitude for control/payload | command/hold pointing | publish pose to client |
| `ABSTAIN` | flag invalid; inhibit precision operation or enter safe logic | inhibit exposure/actuation | flag pose invalid |
| `REMEASURE` | reacquire starfield/reinitialize | reacquire target or re-home | restore visibility/reinitialize tracking |

No monetary values are inferred. The consequences are ordinal and operational.
An owner must decide when safe mode, hold-last, propagation or reacquisition is
permitted.

The primary candidate therefore has genuine dropout; the current bench's
fiducial occlusion is only an analogue and must not be called star-tracker flight
qualification.

