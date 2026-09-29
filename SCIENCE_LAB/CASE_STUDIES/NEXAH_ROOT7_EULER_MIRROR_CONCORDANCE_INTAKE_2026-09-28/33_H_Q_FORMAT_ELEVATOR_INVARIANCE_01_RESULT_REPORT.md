# H_Q_FORMAT_ELEVATOR_INVARIANCE_01 result report

Date: `2026-09-29`

## Result

```text
PASS_FORMAT_ELEVATOR_INVARIANCE__137_357_SPLIT_VIEW_DEPENDENT
```

All `12/12` preregistered checks passed. The primary output and both required
replays are byte-identical.

## Direct answer

Yes: the existing QRT Format Elevator is the correct instrument for this
question, because it separates a persistent record from its displayed surface.
All 16 declared `FIT` surfaces — A1-A5, B1-B5, C1-C5 and US Letter — display
all eight H gates without cropping.

The result makes the important distinction precise:

- `42 h` remains the lowest plotted y-position in every format;
- gate identity, five source keys, normalized position, mask zone, trace class,
  y-order, all pairwise-distance ranks and hull geometry survive;
- the raw y-coordinate does not survive as the same numeral;
- consequently `137.357 -> 357 - 137 = 220 = 2*110` is a property of the
  original pixel view, not a format-invariant property of the H record.

No target format reproduced the split `220` (`0/16`).

## What the surfaces show

Under `FIT`, every page shows the same complete H configuration. The page is a
view carrier, not a new numeric carrier. The eight gates keep this y-order from
top of the plotted coordinate system (smallest y) to bottom:

```text
42, 36, 12, 9, 6, 48, 3, 24.
```

The mask split remains exactly `2 inside / 6 outside` on every surface. `12 h`
and `36 h` remain masked/recoverable with Full Trace; the other six remain
unmasked. `42 h` therefore remains structurally notable as the y-minimum, but
not because the decimal digits of one raster coordinate are preserved.

Selected `42 h` target coordinates illustrate the change:

| View | y in target frame | three-place split |
|---|---:|---:|
| source plot | `137.357 px` | `357 - 137 = 220` |
| A1 | `327.849 mm` | `849 - 327 = 522` |
| A4 | `115.894 mm` | `894 - 115 = 779` |
| B4 | `137.949 mm` | `949 - 137 = 812` |
| C4 | `126.385 mm` | `385 - 126 = 259` |
| US Letter | `118.199 mm` | `199 - 118 = 81` |

Even B4, whose integer part happens to remain `137`, changes the fractional
part. This is a strong negative control for reading `220` as a persistent
relation.

## Geometry that did survive

The `9 h` to `42 h` chord remains rank `8/28` among all pairwise distances in
every format. `42 h` remains the y-minimum. The convex hull scales by exactly
`s^2` within the frozen tolerance, and inverse FIT reconstructs the source
coordinates within `1e-9 px`.

This means the triangle or chord can be carried across formats as normalized
geometry. Its absolute length, raw pixel/mm coordinates and digit partitions
cannot.

## Portfolio effect

This does not create another theme. It extends the existing joined pipeline by
one typed view stage:

```text
Five-H keyed record
  -> Pi_Q projection
  -> fixed mask class
  -> QRT typed FIT view (A1 ... US Letter).
```

The CRT/QRT Format Elevator is reused as a representation layer. Its separate
CRT carrier arithmetic — such as `n = 20q + r`, factor generators or returned
numeric addresses — is not imported into the H_Q coordinates. Carrier and view
remain separate fields, exactly as the older package requires.

## Reproducibility

- preregistration: `32_H_Q_FORMAT_ELEVATOR_INVARIANCE_01_PREREGISTRATION.md`
- lock: `H_Q_FORMAT_ELEVATOR_INVARIANCE_01_PREREGISTRATION_LOCK.json`
- runner: `run_h_q_format_elevator_invariance_01.js`
- execution log: `H_Q_FORMAT_ELEVATOR_INVARIANCE_01_EXECUTION_LOG.md`
- machine result: `h_q_format_elevator_invariance_01_results.json`
- visual: `H_Q_FORMAT_ELEVATOR_INVARIANCE_01.html`

Machine-result SHA-256:

```text
2deb4e60111abac31341d565eb5a1db53dd9044547e117b74adf1e131bd7d49d
```

## Claim boundary

Representation invariance only. No CRT-carrier arithmetic, factor-generator,
SCN/NCS292/404, E8/H4, astronomy, physics or state-update/re-feed claim follows.
