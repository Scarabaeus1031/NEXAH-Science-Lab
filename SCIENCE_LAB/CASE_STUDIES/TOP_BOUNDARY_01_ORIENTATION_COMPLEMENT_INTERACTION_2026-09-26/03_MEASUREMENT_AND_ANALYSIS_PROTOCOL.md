# 03 — Measurement and Analysis Protocol

## 1. Record architecture

Every capture receives an immutable row in the execution manifest:

| Field | Requirement |
|---|---|
| capture ID | unique and never reused |
| matrix ID | exact row from `02_BOUNDARY_MATRIX.csv` |
| arm | A or B |
| mask hash | SHA-256 of binary master and physical-mask identifier |
| complement hash | required for complement pair |
| orientation | commanded and independently measured angle |
| source state | spectrum/wavelength, power monitor and elapsed time |
| geometry | all bound distances and prism state where applicable |
| detector state | RAW settings, temperature if available and calibration IDs |
| acquisition order | randomized sequence position |
| validity | valid or typed failure; no silent deletion |
| file hash | SHA-256 of immutable primary file |

## 2. Linearization and calibration

For each raw capture `C`:

```text
Y = LINEARIZE(C - DARK) / FLAT
```

`LINEARIZE` must be justified from the detector specification or measured
response curve. Saturated, clipped or black-level-crushed pixels are masked and
reported. If more than 0.1% of the preregistered primary region is invalid, the
capture fails unless a stricter equipment-specific rule was frozen before the
run.

## 3. Common-frame return

Each oriented image is returned to the `0°` frame using the frozen registration
method. A calibration target without an optical boundary passes through the
same rotation and interpolation. Its return error is reported separately from
the optical residual.

```text
rho_theta(x, channel) = RETURN(Y_theta) - Y_0
```

Report:

- signed mean;
- mean absolute error;
- root-mean-square error;
- maximum absolute residual with coordinates;
- structural residual map;
- bootstrap interval across captures.

The full map remains primary. A scalar summary may not replace it.

## 4. Complement closure

For mask `Q`, its exact complement `1-Q`, open reference `1` and dark reference
`0`:

```text
epsilon_Q = Y(Q) + Y(1-Q) - Y(1) - Y(0)
```

The dark term prevents detector offset from being counted twice. Exposure and
source-monitor normalization are applied before this calculation. Registration
uses mask fiducials rather than the observed color fringe.

Arm A may use closure as a linear-system diagnostic after spatial-coherence and
stray-light controls. Arm B reports the same ledger quantity but interprets it
only against coherent diffraction theory; zero closure is not presumed.

## 5. Two-boundary interaction

For separately measured components `Q1`, `Q2`, their joint aperture and the
closed reference:

```text
Delta_12 = Y(Q1 UNION Q2) - Y(Q1) - Y(Q2) + Y(0)
```

For Arm B, compare the observed double-slit intensity with the established
finite-slit model:

```text
I(phi) proportional to sinc^2(pi*w*sin(phi)/lambda)
                     * cos^2(pi*d*sin(phi)/lambda)
```

where `w` is slit width and `d` is center separation. Exact convention and
normalization must be bound to the apparatus before fitting.

The interaction residual is not interpreted as an extra object or energy. It
is the difference between a joint record and the declared additive comparator.

## 6. Orientation comparison

The primary test compares each returned angle with `0°`. A secondary periodic
comparison tests:

```text
0 vs 180
45 vs 225
90 vs 270
135 vs 315
```

These pairs test whether nominally equivalent geometry changes when polarity,
mounting direction, sensor sampling or prism orientation is reversed. The
comparison is diagnostic; equivalence is not assumed.

## 7. Spectral and rendered records

Spectral data are retained by wavelength bin with instrument calibration and
uncertainty. Camera color-channel values are not treated as wavelength bins.

Rendered PNGs may be generated only after primary analysis with one frozen
display transform. They are communication artifacts, not measurement evidence.

## 8. Separation of mechanism and common relation

Only after each arm has passed its own domain baseline may the following common
description be used:

```text
same relational form:
source -> bounded aperture -> transformed field -> detector record

not established:
same physical mechanism
```

Cross-arm similarity is descriptive unless a dimensionally valid mapping and
an independent test are added in a later preregistration.
