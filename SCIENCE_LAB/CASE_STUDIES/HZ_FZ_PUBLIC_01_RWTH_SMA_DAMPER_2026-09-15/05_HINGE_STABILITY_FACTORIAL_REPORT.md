# HZ_FZ_PUBLIC_01 — Hinge Stability and Factorial Report

Date: `2026-09-15`

Classification: `DESCRIPTIVE_BINDER_INPUT_READY`

## Coverage

- 18 paired active-cycle positions across the two 4-wire before/after pairs.
- 36 actuator-cycle records after evaluating both actuators.
- Six additional 8-wire records forming a complete `2 amplitudes × 3
  frequencies` source grid.
- Original archive SHA-256 verified before analysis.

## Hinge stability

The curvature candidate stays near the middle crossing, but it is not a single
fixed pin:

| Pair | Channel | Median fraction | IQR | Observed range |
|---|---|---:|---:|---:|
| 0.5 Hz / 20 mm | actuator 1 | 0.5088 | 0.5088–0.5125 | 0.4600–0.5127 |
| 0.5 Hz / 20 mm | actuator 2 | 0.5181 | 0.4980–0.5203 | 0.4414–0.5264 |
| 1.0 Hz / 40 mm | actuator 1 | 0.5322 | 0.5020–0.5371 | 0.4492–0.5430 |
| 1.0 Hz / 40 mm | actuator 2 | 0.5400 | 0.5234–0.5435 | 0.4531–0.5527 |

Most cycles cluster tightly; isolated cycles select an earlier local-curvature
maximum. The binder must therefore retain the candidate per cycle and its
distribution. It must not collapse HINGE to one universal position.

## Before/after loop area

Median Cut-B change in absolute force/displacement loop area:

| Pair | Actuator 1 | Actuator 2 |
|---|---:|---:|
| 0.5 Hz / 20 mm | -7.42% | -4.91% |
| 1.0 Hz / 40 mm | +1.75% | +3.41% |

At 0.5 Hz the reduction has the same sign throughout the active sequence. At
1.0 Hz the sequence moves from a small early reduction to a later increase.
Cycle index is therefore part of the record rather than disposable noise.

## Frequency/amplitude separation

The archive includes the same 8-wire configuration at 20 and 40 mm for 0.1,
0.5 and 1.0 Hz. Median active-cycle results are:

| Amplitude | Frequency | Gain (kN/mm) | Loop area (J/cycle) |
|---:|---:|---:|---:|
| 20 mm | 0.1 Hz | 1.2622 | 128.8 |
| 20 mm | 0.5 Hz | 1.3868 | 135.9 |
| 20 mm | 1.0 Hz | 1.4155 | 140.4 |
| 40 mm | 0.1 Hz | 0.8093 | 353.8 |
| 40 mm | 0.5 Hz | 0.8365 | 339.6 |
| 40 mm | 1.0 Hz | 0.8824 | 381.2 |

Gain increases with frequency at both amplitudes. From 0.1 to 1.0 Hz the
increase is about 12.1% at 20 mm and 9.0% at 40 mm. Loop area increases
monotonically at 20 mm but is non-monotonic at 40 mm. This supports a
frequency-conditioned force/displacement response in this 8-wire dataset; it
does not establish a universal Fz–Hz law.

## Binder decision

Admit as descriptive fields:

- `GAP(x)` and its per-cycle distribution;
- signed and absolute `AREA` in J/cycle;
- `ORIENT` from displacement direction;
- signed residual `ARC` regions;
- per-cycle `PIN_HINGE` candidates with method and uncertainty spread.

Keep provisional:

- `TOUCH`, currently defined only as a smoothed time-view zero crossing;
- any physical switch, clamp, electrical AC/DC, or series/parallel claim.

Next gate: `CUT_BINDER_V0_1_DESCRIPTIVE_CONTRACT`.
