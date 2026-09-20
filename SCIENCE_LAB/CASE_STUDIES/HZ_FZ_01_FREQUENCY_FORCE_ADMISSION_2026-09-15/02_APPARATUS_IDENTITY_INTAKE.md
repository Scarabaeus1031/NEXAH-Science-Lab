# HZ_FZ_01 — Step 1: Apparatus Identity Intake

Status: `APPARATUS_IDENTITY_PENDING`

This is the first real-measurement gate. It identifies the complete physical
chain before any NULL, REFERENCE_A or REPLAY_B samples are acquired. Unknown,
placeholder or inferred values fail closed. Product photographs, visual
similarity and synthetic identifiers are not calibration evidence.

## A. Device under test

- device name, model and serial or locally assigned asset ID;
- physical quantity expected to respond along the declared `z` axis;
- fixture drawing or photograph reference;
- material/contact configuration and orientation;
- operating limits supplied by the manufacturer or laboratory owner.

## B. Actuator and drive channel

- actuator type, manufacturer, model and serial/asset ID;
- drive source manufacturer, model and serial/asset ID;
- declared safe voltage, current, frequency and duty-cycle limits;
- measured drive-channel input and acquisition channel;
- proof that `drive_v` is the measured voltage, not merely a software setpoint.

## C. Force channel

- force sensor/load-cell manufacturer, model and serial/asset ID;
- rated range, overload limit and measurement direction;
- calibration certificate or traceable in-house calibration ID;
- calibration date, expiry date and issuing laboratory/person;
- positive expanded uncertainty in newtons and coverage factor;
- force acquisition channel and sign convention for the `z` axis.

## D. Acquisition and synchronization

- acquisition device manufacturer, model and serial/asset ID;
- software and version;
- drive and force channel mapping;
- ADC range/resolution for both channels;
- one shared clock or a documented synchronization method;
- available sample rate, timestamp source and exported numeric precision.

## E. Mechanical and environmental frame

- rigid fixture ID and axial-alignment method;
- preload application and verification method;
- isolation from table vibration, cable pull and airflow;
- location plus temperature record;
- operator ID and UTC acquisition time.

## F. Safety disposition

- responsible operator confirms all manufacturer limits;
- emergency stop or immediate power-removal method is identified;
- no improvised mains/high-voltage wiring;
- no run if the fixture, sensor range, electrical limit or calibration state is
  unknown;
- stop on unexpected heating, movement, smell, noise, overload or loose parts.

## Step-1 admission rule

Step 1 passes only when `apparatus.identity.json` contains real, non-placeholder
identifiers, the force calibration is current on the planned acquisition date,
the uncertainty is positive, both measured channels are mapped, synchronization
is declared, and the four safety acknowledgements are true.

Passing Step 1 authorizes only preparation of the NULL run. It is not an E3
result and does not authorize REFERENCE_A until the null floor has been recorded
and checked.

## Operator workflow

1. Copy `apparatus.identity.pending.json` to `apparatus.identity.json`.
2. Replace every `PENDING`, empty string and `null` with observed documentation.
3. Keep supporting photos, manuals and certificates outside the JSON; record
   their stable paths or document IDs in the reference fields.
4. Run `node validate_apparatus_identity.js apparatus.identity.json`.
5. Do not acquire the NULL run unless the result is `APPARATUS_IDENTITY_ADMISSIBLE`.

