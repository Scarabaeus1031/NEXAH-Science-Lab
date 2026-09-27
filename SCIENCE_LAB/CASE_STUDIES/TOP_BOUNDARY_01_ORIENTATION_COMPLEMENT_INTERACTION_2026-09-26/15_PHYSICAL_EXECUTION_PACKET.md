# 15 — Physical Execution Packet

**Status:** `READY_FOR_EQUIPMENT_BINDING / NOT AUTHORIZED TO ACQUIRE DATA`  
**Purpose:** convert the validated four-state digital operator into one bounded
apparatus run without changing its primary contrast

## Minimum first physical block

Run the coherent arm first because it supplies a known positive interaction
control. Use visible, low-power, appropriately classified laser illumination;
two independently selectable finite slits derived from one mask master; a
rigid source-mask-detector geometry; and a detector capable of locked linear
RAW acquisition.

The exact product, laser classification, wavelength, mask dimensions,
distances and detector settings remain unbound. No purchasing or beam
operation is authorized by this document.

## Required apparatus bindings

| Register | Required value before execution |
|---|---|
| source | make/model, wavelength, linewidth/coherence class, output class and stability record |
| safety | beam enclosure/stop, eye-height exclusion, responsible operator and local laser-safety compliance |
| mask | master-file hash, slit width, separation, material, fabrication tolerance, `B1/B2` selection mechanism |
| geometry | source-to-mask and mask-to-detector distances, optical-axis height, rotation-center definition |
| orientation | independently readable `0,45,...,315 degree` positions and tolerance |
| detector | model, bit depth, RAW format, linearity test, full-well/clipping behavior and dark noise |
| acquisition | fixed exposure/gain/focus/aperture; auto processing disabled |
| calibration | dark frames, open field, source monitor, registration target and uncertainty budget |

Any blank field returns `STOP_EQUIPMENT_NOT_BOUND`.

## Primary capture matrix

For every one of the eight orientations:

```text
0       both slits closed
B1      slit 1 open only
B2      slit 2 open only
B1+B2   both slits open
```

Acquire at least ten independently triggered RAW captures per state and repeat
the complete randomized block once. This gives:

```text
8 orientations x 4 states x 10 repeats x 2 blocks = 640 primary RAW captures
```

Dark, open-field, registration and source-stability records are additional.
No state may be synthesized from another state during the physical run.

## Online validity checks only

During acquisition, inspect only:

- file presence and hashes;
- clipping or black-level crushing;
- source-monitor stability;
- commanded versus measured orientation;
- dark and calibration completeness.

Do not inspect or optimize `Delta_12` until the randomized block is complete.

## Locked primary analysis

For each repeat and each linear detector channel:

```text
Delta_12(x,y,theta)
  = Y(B1+B2) - Y(B1) - Y(B2) + Y(0).
```

Retain the signed map, then report ROI RMS, normalized L1, maximum absolute
value and coordinates, repeat interval, run-to-run agreement and orientation
return relative to `0 degrees`.

Compare the coherent result with the finite-slit Fourier model using the bound
wavelength, slit width, separation and distance. Fit parameters may not replace
the independently measured geometry.

## Second block only after the positive control

The incoherent/dispersion arm may be run only after the coherent apparatus has
demonstrated that the acquisition chain can recover its known positive
interaction. Its nonzero interaction is initially assigned to overlap,
stray-light, detector nonlinearity, registration or an incomplete optical
model—not to a new mechanism.

Human color judgments, underwater appearance and film-development safelight
effects remain separate future protocols.

## Physical stop boundary

This packet is execution-ready in structure but cannot itself cross the
equipment gate. The next valid action is to bind a real apparatus inventory
and safety record, not to reinterpret the synthetic result.

