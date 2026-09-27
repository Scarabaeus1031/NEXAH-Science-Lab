# KAPPA-01 — Campaign Handoff

## What is ready

- active-versus-sham randomized crossover architecture;
- continuous PRE→EVENT→POST→RECOVERY acquisition contract;
- shared-clock and event-marker requirements;
- primary endpoint and ordered Kappa path outcomes;
- fail-closed campaign schema;
- sample-size gate;
- synthetic phase recovery and negative admission controls.

## What the laboratory owner must supply

### Apparatus

1. device and acquisition-system IDs;
2. shared hardware-clock ID;
3. proof that drive voltage is measured rather than a setpoint;
4. calibrated displacement sensor ID, calibration ID and uncertainty;
5. calibrated force sensor ID, calibration ID and uncertainty;
6. measured or bounded channel skew;
7. completed HZ_FZ_01 apparatus identity and safety acknowledgements.

### Intervention

1. operational active intervention definition;
2. physically credible sham definition;
3. same-clock event-marker source;
4. duration;
5. washout rule;
6. safety approval/reference.

The active and sham procedures must differ only in the intended intervention,
not in file handling, marker timing, operator attention or acquisition length.

### Fixed settings

1. excitation frequency;
2. measured drive amplitude;
3. preload;
4. sample rate satisfying at least 100 samples per cycle;
5. confirmation that at least 20 valid PRE, POST and RECOVERY cycles are
   feasible in every session.

### Design and power

1. smallest scientifically meaningful phase difference in degrees;
2. paired-session standard deviation from an independent pilot or conservative
   external source;
3. variance-source receipt;
4. attrition allowance;
5. minimum and maximum randomized blocks;
6. randomization-seed receipt;
7. named blinding-key custodian who is not the primary analyst.

PHX-01 cycle dispersion must not be used as paired-session variance because
cycles from one run are not independent sessions.

## Finalization sequence

1. Copy `campaign.pending.json` to `campaign.final.json`.
2. Replace every pending/null field with source-bound values.
3. Set status to `PREREGISTERED_READY_FOR_ACQUISITION`.
4. Run `implementation/check_readiness.py` against the final configuration.
5. Review the computed block target against declared minimum/maximum bounds.
6. Generate and separately custody the active/sham decoding key.
7. Hash the final configuration, randomization receipt, apparatus identity,
   calibration receipts and analysis implementation.
8. Only then begin the NULL session and subsequent randomized blocks.

## Current stop

`DATA_COLLECTION_AUTHORIZED = false`

No physical run should be improvised from the synthetic fixture or placeholder
configuration.
