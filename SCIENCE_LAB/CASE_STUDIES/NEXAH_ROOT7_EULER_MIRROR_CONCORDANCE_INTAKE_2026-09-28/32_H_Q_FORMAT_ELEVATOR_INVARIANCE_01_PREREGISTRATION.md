# H_Q_FORMAT_ELEVATOR_INVARIANCE_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / REPRESENTATION-INVARIANCE TEST`

## Single question

When the eight frozen `H_Q` projection records are passed through every
pre-existing `FIT` lens from A1 through US Letter, which properties survive as
record invariants and which are merely coordinates of one graphical view?

The conspicuous source display value for gate `42 h` is included explicitly:

```text
y = 137.3565058015647 px -> 137.357 at three decimals
357 - 137 = 220 = 2 * 110.
```

The test asks whether that digit split survives the declared view change. It
does not assume that it does.

## Frozen sources

| Source | SHA-256 |
|---|---|
| `h_q_piq_mask_compatibility_01_results.json` | `226f3aace443b0ffff74dc58b45d7aa9e01ef2bb854fd2fc6168acf6949590bc` |
| Double-Cut-0.2 model | `35c49ac53760c0df79411822568f924e86b6bf697f2041690a04d705ab623849` |
| `07_FORMAT_LENS_SPECIFICATION.md` | `192f372b9184a01558dc37214b707c14f10b0f358b6fe4ffceb8abd24ae26372` |
| `FINAL_DECISION.md` | `9a45b51b4bf06cb2a6efe7c1f7eb1ee400c9da64d57d62fbd69ba0c79fadac1f` |
| `data/format_lenses.json` | `da59993eb45c2b70e6e2439038698c9877fdf284d984e99da9e293b346c826ac` |
| Format-Elevator `run_gate.py` | `8e318df1e68058e34a55f1cb20deaa436253c24b40a8d85867fed2254b378f77` |
| Format-Elevator validation report | `898ac6023f1509f52ea1e05cb5a93b0aa701d3934279364b92ea158953339d40` |

## Frozen transform

The source graphical frame is the Double-Cut plot `664 x 226 px`. Each format
is used in landscape orientation with target frame
`long_mm x short_mm`. Only the already declared `FIT` operator is used:

```text
s       = min(target_width / 664, target_height / 226)
offsetX = (target_width  - 664*s) / 2
offsetY = (target_height - 226*s) / 2
x'      = offsetX + s*x
y'      = offsetY + s*y.
```

The same affine map is applied to both mask edges. `FIT` is uniform, centered,
adds margin and does not crop. No gate coordinate or threshold is fitted.

## Frozen digit-split diagnostic

For a coordinate `v`, define:

```text
fixed3(v) = decimal string rounded to exactly three places
split(v)  = three-digit fractional integer - integer part.
```

Thus `split(137.3565058015647) = 357 - 137 = 220`. The diagnostic is run on
the source coordinate and on the transformed `42 h` y-coordinate in every
format. Units are reported and never equated: source values are pixels; target
values are millimetres in the chosen graphical frame.

## Mandatory checks

1. every frozen source hash matches;
2. exactly 16 format lenses are present and each declares `FIT`;
3. all eight gate IDs, five clock IDs and five source-cell keys per gate survive;
4. inverse `FIT` reconstructs every source coordinate within `1e-9 px`;
5. transformed mask classification preserves the frozen `2 inside / 6 outside` split;
6. full-trace and no-trace classes remain unchanged;
7. no gate is cropped in any format;
8. y-order is preserved and `42 h` remains the lowest plotted y-coordinate;
9. all 28 pairwise-distance ranks are preserved; specifically, the `9 h` to
   `42 h` chord retains its source rank;
10. convex-hull area obeys `area' = s^2 * area` within tolerance;
11. normalized source-frame coordinates recovered from every view are stable;
12. the `137|357 -> 220` diagnostic is evaluated independently for all formats.

## Decision rules

- `PASS_FORMAT_ELEVATOR_INVARIANCE__137_357_SPLIT_VIEW_DEPENDENT` if checks
  1-11 pass and the value `220` does not survive all 16 target views;
- `PASS_FORMAT_ELEVATOR_INVARIANCE__137_357_SPLIT_PERSISTS_ALL_FORMATS` if
  checks 1-11 pass and all 16 target views also yield `220`;
- `FAIL_FORMAT_ELEVATOR_INVARIANCE` if any technical invariant fails.

Persistence of the decimal split would be a property of this finite set of
views only, not evidence of a number-theoretic or physical law.

## Stop rule

One primary run and two byte-identical replays. Do not select a format, unit,
rounding precision, crop, scale or offset after seeing the result.

## Claim boundary

This is a representation-invariance test for the already joined chain
`Five-H record -> Pi_Q projection -> mask -> typed FIT view`. It does not join
the H_Q coordinates to CRT carrier arithmetic, QRT factor generators,
SCN/NCS292/404, E8/H4, astronomy or a state-update/re-feed mechanism.
