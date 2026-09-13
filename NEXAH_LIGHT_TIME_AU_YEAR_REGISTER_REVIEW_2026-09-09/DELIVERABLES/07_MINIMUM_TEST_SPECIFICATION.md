# Minimum Test Specification

Status: specification only; execution not authorized.

## Selected experiment

Differential pulsed-light round-trip time of flight using one emitter/detector station and the same reflector placed at two independently surveyed positions.

## Question and measurand

Can the apparatus recover an effective optical group speed consistent, within a predeclared uncertainty, with (c/n_g) over a known path difference?

Primary measurand:
[
hat v_{mathrm{air}}=rac{2Delta L}{Deltaar t}.
]
Secondary corrected quantity:
[
hat c_0=n_ghat v_{mathrm{air}}.
]
The secondary quantity is a consistency estimate, not a redefinition or improved determination of exact SI c.

## Three-regime binding

- A — source/emission: one eye-safe pulsed optical source; electrical trigger timestamp; recorded wavelength, pulse width, repetition rate, and source ID.
- B — propagation/conversion: same line of sight and medium; reflector positions L1 and L2; independently surveyed (Delta L=L_2-L_1); recorded temperature, pressure, humidity, CO₂ assumption/measurement, and wavelength for n_g.
- C — reception/timestamp: return detector and digitizer on the same clock as the trigger; raw waveforms preserved; fixed analysis rule for time pickoff.

## Minimum design

Predeclared nominal geometry: L1 ≈ 5 m, L2 ≈ 35 m, so ΔL ≈ 30 m. Use the measured values, not the nominal values. Alternate reflector position in ABBA blocks to decorrelate drift. Collect at least 1,000 accepted pulses per position across at least four ABBA blocks. Store every raw waveform and every rejected-event reason.

Suggested capability envelope, not procurement authorization: pulse width ≤5 ns; detector/digitizer analogue bandwidth ≥500 MHz; sampling ≥2 GS/s or equivalent calibrated time interpolator; timing stability sufficient for ≤1 ns standard error on each block mean. Laser/optical safety review is a mandatory pre-execution gate.

## Timing estimator

Predeclare one estimator: constant-fraction crossing on baseline-subtracted return waveforms, with the fraction fixed before unblinding. Determine per-block (ar t_1,ar t_2), then (Deltaar t=ar t_2-ar t_1). Report block estimates and a random-effects or drift-aware aggregate; do not report only a pooled mean.

## Calibration controls

1. Electronic zero/loopback or optical short-path run before and after each block.
2. Stable injected timing reference to monitor digitizer timebase.
3. Independent distance survey with traceable instrument and recorded reflector reference plane.
4. Dark/background and no-reflector runs to characterize false returns.
5. Threshold/constant-fraction sensitivity analysis.
6. Atmospheric sensor calibration status and path representativeness.
7. Blind or scripted position labels where practical; raw data remain immutable.

## Acceptance gates

All gates are prospective:
- exact source, detector, clock, reflector, and distance-instrument IDs recorded;
- raw-data schema and checksum plan frozen;
- (Delta L), (Deltaar t), covariance terms, and n_g uncertainty reported;
- timing nonlinearity and drift below predeclared limits;
- signal-to-background and event-selection rules frozen;
- corrected result compatible with exact c under a predeclared expanded-uncertainty criterion, e.g. (|hat c_0-c|le U_{95});
- failure remains a measurement-system discrepancy until conventional systematics are exhausted, not evidence of new physics.

## Reproducibility package

Apparatus diagram; bills/IDs without purchasing; geometry survey; environmental log; calibration certificates/status; acquisition configuration; immutable raw waveforms; analysis code version if later authorized; exclusion log; uncertainty budget; and machine-readable result table.

## Stop

No apparatus is to be built or operated under this review. No data are claimed to exist. No pass/fail result is asserted.

