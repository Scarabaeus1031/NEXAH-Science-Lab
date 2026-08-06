# C3 to C2 transition experiment

Date: 2026-08-06  
Status: `CONTROLLED MODEL EXPERIMENT — NO TRANSFER CLAIM`

## Question

Under one declared transition protocol, how often do starts around the C3
label reach and remain briefly in a declared C2 target region under free flow,
a minimal pulse, the v39 capture controller, and the same capture controller
with a post-entry regime lock?

This is separate from the v39 retention scan. A v39 controlled-return result
is not counted as transition evidence here.

## Frozen model and integrator

- Static `scalar_field`, `rotational_field` and `combined_field` copied from
  `navigator_v39_fixpoint_extraction.py`.
- New shared transition integrator:
  Euler-Maruyama on `dx = (combined_field(x) + u) dt + sigma dW`.
- The combined field is not direction-normalized.
- `dt = 0.02`, horizon `T = 25`, `sigma = 0.01`.
- Declared C3 and C2 centers are labels and controller targets, not assumed
  free fixed points.

The additive integrator differs deliberately from v39's normalized capture
step. This makes `u=0` a genuine free-field condition and makes the declared
control cost `integral ||u||^2 dt` comparable across conditions.

## Paired evaluation design

- 25 start offsets around C3: center plus eight angles at radii
  `0.2`, `0.4` and `0.6`.
- Eight deterministic noise records per offset.
- 200 trials per condition; 800 trials in total.
- Base seed: `20260806`.
- Every condition receives the same start/noise pair.

The minimal pulse was selected on a separate deterministic 13-start
calibration grid. Selection rule: minimum nominal L2 pulse cost among grid
candidates with calibration success at least 0.80. Selected pulse:

```text
amplitude = 0.2
duration = 10.0
nominal L2 pulse cost = 0.4
calibration success = 11/13 = 0.846154
```

This is internal model calibration, not independent validation.

## Conditions

| Condition | Before first C2 entry | After first C2 entry |
| --- | --- | --- |
| `free_field` | no control | no control |
| `minimal_control` | constant C3-to-C2 pulse for 10 time units | pulse ends at its declared duration |
| `capture_hook_lock_off` | v39 target bias plus capture hook | control off |
| `capture_hook_lock_on` | identical v39 target bias plus capture hook | bounded proportional C2 holding term |

The lock comparison is paired: both capture conditions are identical until
the first entry into the C2 region.

## Outcome contract

- First entry: distance to declared C2 center `<= 0.40`.
- Success: continuous residence for `1.0` time unit within radius `0.45`.
- Transition time: beginning of the first successful residence interval.
- Relapse: after success, continuous residence for `0.5` time unit outside
  radius `0.80`.
- Timeout: no successful residence before `T = 25`.
- Failure: non-finite state or exit from the declared numerical domain.
- Endpoint distribution: coordinates, spread, distance to C2 and nearest
  declared cluster label.

These radii are operational cuts. They do not define natural basin boundaries.

## Primary results

| Condition | Success | Median transition time | Mean L2 control cost | Relapse among successes | Timeout |
| --- | ---: | ---: | ---: | ---: | ---: |
| Free field | 0.565 | 3.10 | 0.000 | 0.000 | 87/200 |
| Minimal control | 0.770 | 3.01 | 0.400 | 0.000 | 46/200 |
| Capture, lock off | 1.000 | 1.22 | 3.063 | 0.000 | 0/200 |
| Capture, lock on | 1.000 | 1.22 | 3.778 | 0.000 | 0/200 |

No numeric or out-of-domain failures occurred.

Transition-time 10th to 90th percentiles:

| Condition | q10 | q90 |
| --- | ---: | ---: |
| Free field | 1.74 | 13.94 |
| Minimal control | 1.532 | 15.202 |
| Capture, lock off | 0.94 | 1.74 |
| Capture, lock on | 0.94 | 1.74 |

## Endpoint distributions

| Condition | Endpoint nearest-cluster counts | Mean endpoint | Mean radial spread |
| --- | --- | --- | ---: |
| Free field | C0 15; C1 3; C2 116; C3 66 | `(11.9014, 27.7495)` | 3.3395 |
| Minimal control | C2 158; C3 42 | `(12.8931, 26.9198)` | 2.0548 |
| Capture, lock off | C2 200 | `(13.3023, 25.8238)` | 0.0065 |
| Capture, lock on | C2 200 | `(13.4029, 25.8927)` | 0.0050 |

Nearest-cluster membership is descriptive only. Seven trials in aggregate
(three free-field and four minimal-control trials) end nearest C2 without
satisfying the continuous-residence success criterion.

## Sensitivity

Success-rate range across the eight noise seeds:

| Condition | Minimum | Maximum |
| --- | ---: | ---: |
| Free field | 0.56 | 0.60 |
| Minimal control | 0.72 | 0.80 |
| Capture, lock off | 1.00 | 1.00 |
| Capture, lock on | 1.00 | 1.00 |

Success by start radius:

| Radius | Free | Minimal | Capture lock off | Capture lock on |
| ---: | ---: | ---: | ---: | ---: |
| 0.0 | 0.000 | 1.000 | 1.000 | 1.000 |
| 0.2 | 0.515625 | 0.78125 | 1.000 | 1.000 |
| 0.4 | 0.625 | 0.750 | 1.000 | 1.000 |
| 0.6 | 0.625 | 0.750 | 1.000 | 1.000 |

The free result is strongly start-offset dependent but only weakly dependent
on the tested noise seed. The capture conditions are insensitive to both over
the declared grid. No extrapolation outside this grid is supported.

## Lock disposition

The post-entry lock changes the final endpoint cloud: it moves the median
endpoint distance to the declared C2 center from approximately `0.265` to
`0.145` and slightly reduces endpoint spread. It does not improve success,
transition time or relapse rate under the declared horizon and relapse cut.
It increases mean L2 control cost by approximately `0.715` and mean L1 effort
from `1.969` to `6.047`.

Therefore this run supports **no operational promotion of the lock**. Its only
observed benefit is tighter controller-dependent endpoint centering.

## Claim boundary

Supported within this synthetic model and declared protocol:

- some C3-neighborhood starts reach C2 under the free combined field;
- the selected minimal pulse increases the paired success rate;
- the v39 capture controller reaches the declared success set in all tested
  trials at higher control cost;
- the tested post-entry lock tightens endpoints but adds no success or relapse
  benefit within the horizon.

Not supported:

- C3 or C2 is a free fixed point;
- a natural C3 or C2 basin radius;
- a universal directed edge C3 to C2;
- optimality of any controller;
- robustness outside the tested offsets, noise and horizon;
- physical, biological, psychological or ontological transfer.

## Reproduction

```bash
/opt/anaconda3/bin/python FIELD_NOTES/C3_PROFILE_2026-08-06/C3_TO_C2_TRANSITION_2026-08-06/run_transition_experiment.py
```

Outputs:

- `results/c3_to_c2_transition_summary.csv`
- `results/c3_to_c2_transition_trials.csv`
- `results/c3_to_c2_transition_sensitivity.csv`
- `results/c3_to_c2_transition_full.json`
- [Deterministic replay record](REPRODUCIBILITY.md)

The runner emits SHA-256 hashes. Re-running with the same NumPy runtime must
produce identical bytes. Reproducibility is a property of this instrument;
it does not strengthen the model claim.
