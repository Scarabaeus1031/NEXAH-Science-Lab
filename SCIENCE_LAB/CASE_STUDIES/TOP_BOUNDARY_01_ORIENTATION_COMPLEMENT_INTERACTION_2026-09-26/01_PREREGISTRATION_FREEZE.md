# 01 — Preregistration Freeze

## Frozen objective

Estimate orientation, complement and two-boundary interaction residuals without
allowing display rendering, automatic camera processing or post-hoc mask
selection to become evidence.

## Primary hypotheses

### H1 — orientation return

For a rotationally symmetric optical path and detector, a record acquired at
angle `theta` should agree with the `0°` record after geometric return to the
common frame, within calibration and sampling tolerance.

```text
rho_theta = ROTATE_BACK(Y_theta, theta) - Y_0
```

A nonzero `rho_theta` is a system residual. It is not assigned to the source
until mask accuracy, alignment, polarization, prism axis, lens aberration,
sensor grid and interpolation have been checked.

### H2 — complement closure

For a declared linear intensity regime, stable illumination and an admissible
mask/complement pair:

```text
epsilon_Q = Y(Q) + Y(1-Q) - Y(1) - Y(0)
```

The dark-reference term prevents the detector offset from being counted twice.
This is a diagnostic, not a universal conservation law. In coherent propagation
the fields may interfere; intensity records need not close by simple addition.
The coherent arm therefore reports `epsilon_Q` but does not preregister zero as
its general expected value.

### H3 — two-boundary interaction

```text
Delta_12 = Y(Q1 UNION Q2) - Y(Q1) - Y(Q2) + Y(0)
```

For the coherent double-slit arm, a structured nonzero interaction is expected
because the detected intensity contains a cross term. For the incoherent arm,
nonzero structure is first treated as a system or overlap effect and localized
before any physical interpretation.

## Frozen factors

| Factor | Levels |
|---|---|
| arm | `A_BROADBAND_BOUNDARY`, `B_COHERENT_SLIT` |
| orientation | `0, 45, 90, 135, 180, 225, 270, 315 degrees` |
| polarity | `LIGHT_TO_DARK`, `DARK_TO_LIGHT`, `NOT_APPLICABLE` |
| boundary family | `OPEN`, `CLOSED`, `SINGLE_EDGE`, `SLIT`, `BAR_COMPLEMENT`, `DOUBLE_SLIT`, `DOUBLE_BAR_COMPLEMENT` |
| detector record | linear RAW intensity; spectrometer where spatially addressable or repeatably sampled |
| display record | derived only; fixed rendering recipe; never primary evidence |
| repeats | minimum `10` independently triggered captures per executable condition |

Slit width, slit separation, mask material, curvature, source wavelength,
bandwidth, distance and optical-axis geometry are required equipment-bound
fields. They are not guessed in this preregistration.

## Execution blocks

1. dark frames;
2. open-field reference and flat field;
3. source stability series;
4. randomized mask/orientation block;
5. repeat dark and open-field references;
6. exact-complement block using masks manufactured or rendered from the same
   binary master;
7. independent rerun of the full primary block.

Randomization seed and acquisition order must be written before the first
primary exposure. Failed captures remain in the manifest with a typed reason.

## Equipment-binding gate

Execution is prohibited until all fields below are recorded:

- source make/model and measured or certified spectrum;
- coherence class and, for Arm B, wavelength and linewidth;
- mask master files, manufacturing method and measured dimensions;
- prism material, apex angle and orientation convention for Arm A when used;
- distances among source, mask, prism/medium, lens and detector;
- camera/sensor, lens, bit depth and RAW format;
- exposure, gain/ISO, aperture and focus locked manually;
- white balance, gamma, denoising, sharpening, HDR and auto-exposure disabled
  for the primary record;
- dark/flat calibration procedure;
- environmental light control;
- declared pixel registration and rotation interpolation method;
- primary regions of interest and tolerances.

Missing any required field yields `STOP_EQUIPMENT_NOT_BOUND`.

## Primary endpoints

For every admissible condition and detector channel:

1. normalized mean `rho_theta` and its spatial map;
2. normalized mean `epsilon_Q` and its spatial map;
3. normalized mean `Delta_12` and its spatial map;
4. bootstrap 95% interval across the ten captures;
5. repeat-run agreement;
6. spectral-channel version where calibrated spectral data exist.

No threshold for a scientific anomaly is set before calibration noise and
repeatability are measured. The first run is a characterization run, not a
discovery test.

## Analysis lock

- linear sensor values only for primary analysis;
- no JPEG values, display screenshots or auto-rendered color as primary data;
- no angle, channel, crop or mask may be excluded because its result is
  inconvenient;
- interpolation residual is estimated using a rotate-and-return control image;
- Arm A and Arm B are analyzed separately before any relational comparison;
- Human color judgments are outside the primary experiment and require a
  separate perception protocol.

## Outcome vocabulary

| Outcome | Meaning |
|---|---|
| `CHARACTERIZED_WITHIN_TOLERANCE` | residuals are bounded by declared calibration/repeatability limits |
| `STRUCTURED_RESIDUAL_REQUIRES_LOCALIZATION` | repeatable residual survives but its physical location is unresolved |
| `EXPECTED_COHERENT_INTERACTION_OBSERVED` | Arm B interaction matches the preregistered diffraction/interference baseline |
| `BASELINE_MISMATCH` | measured structure fails the established domain model or calibration controls |
| `INVALID` | equipment, source stability, registration, complement or data-integrity gate fails |

None of these outcomes establishes new physics by itself.
