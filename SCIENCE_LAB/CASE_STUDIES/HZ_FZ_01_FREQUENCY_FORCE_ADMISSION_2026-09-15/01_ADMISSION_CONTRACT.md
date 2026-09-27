# HZ_FZ_01 — Frequency-to-Force Admission Contract v0.1

## Claim boundary

This experiment may establish only a local, apparatus-bound transfer record
between a measured drive voltage and measured axial force at one declared
frequency. `Hz` and `N` remain different quantities. The derived transfer
quantity is `Gz(f)` in `N/V`; it is not a universal conversion from frequency
to force.

## Required records

Exactly three runs are required:

1. `NULL` — actuator drive disabled; detector floor recorded;
2. `REFERENCE_A` — first driven measurement;
3. `REPLAY_B` — independently repeated driven measurement.

Every run must retain ordered samples containing:

```text
t_s       elapsed time in seconds
drive_v   measured drive channel in volts
force_n   calibrated, baseline-zeroed dynamic axial force in newtons
```

The measurement record must identify the device, actuator, force sensor,
calibration certificate, acquisition system and operator. Calibration
uncertainty is declared in newtons and must be positive. Static preload is
retained as run metadata; it is not added to `force_n`.

## Frozen controls

`REFERENCE_A` and `REPLAY_B` must have identical declared:

- frequency in hertz;
- drive amplitude in volts;
- drive phase in degrees;
- preload in newtons;
- sample rate.

Sample timestamps must be strictly increasing. Each driven record must cover
at least three periods and provide at least twenty samples per period.

## Operator

For each driven record the validator extracts the complex fundamental at the
declared frequency using the recorded timestamps:

```text
D(f) = fundamental(drive_v)
F(f) = fundamental(force_n)
Gz(f) = F(f) / D(f)
```

It reports `|Gz|` in `N/V` and the circular phase difference in degrees. It
also reports force RMS and the null-run force RMS.

## Admission criteria

All conditions must pass:

- null force RMS is at or below `max_null_force_rms_n`;
- both driven force fundamentals exceed the declared calibration uncertainty
  by `min_signal_to_uncertainty_ratio`;
- relative `|Gz|` difference is at or below `max_gain_relative_delta`;
- circular phase difference is at or below `max_phase_delta_deg`;
- relative force-RMS difference is at or below
  `max_force_rms_relative_delta`;
- metadata, units, controls and sample order conform to the schema.

## Failure semantics

Missing, placeholder, non-finite, unordered or structurally ambiguous data
fail closed. A validator self-test proves only software behavior. It is never a
measurement receipt and cannot promote the runtime profile.
