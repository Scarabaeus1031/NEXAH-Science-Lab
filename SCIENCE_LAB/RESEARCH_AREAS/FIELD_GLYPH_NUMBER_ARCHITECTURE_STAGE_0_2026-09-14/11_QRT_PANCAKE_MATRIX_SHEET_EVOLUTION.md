# QRT Pancake, Matrix and Sheet Evolution

## Correction to the older CRT overview

The board `CRT (Chinesischer Restsatz) — Bekanntes vs. NEXAH / ARCHY` is an
older orientation plate. It correctly separates standard CRT mathematics from
the NEXAH research questions, but it does not represent the later matrix,
sheet, layer and QRT demonstrator family.

The later source is preserved in:

`00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/`

Its intake audit classifies 33 received files, including twelve locally loaded
HTML artifacts. The package decision is a coherent two-module demonstrator
chain, not a reusable common runtime.

## Recovered carrier and slice distinctions

The phrase “seven slices” currently spans several related but non-identical
structures:

| Structure | Source-local meaning | Evidence |
|---|---|---|
| seven-position carrier | finite ordered sequence used by QRT and Bubble/Pancake Sort | executable HTML |
| three state slices | `BLUE · INPUT`, `GREEN · CUT`, `RED · RETURN`, each showing the seven carrier positions | executable HTML |
| `7×7` glyph carrier | rows `A–H` without `G`, columns `1–7`, persistent addresses such as `D4` | executable HTML |
| three measurement layers | blue/local, green/hinge and red/return views over the same `7×7` carrier | executable HTML |
| seven transit routes | layer grouping `I · 2×7`, `II · 3×7`, `III · 2×7`; together `2+3+2=7` routed rows | executable SVG/HTML view |
| matrix/sheet readings | address, morphology/form, instrument, color-control and LQ/audit views of the retained carrier | executable HTML variants |

This means the owner expression “Pancake cut into seven slices” is a useful
cross-artifact synthesis, while the recovered implementation distinguishes
seven carrier positions or routes from three displayed state/measurement
slices.

## QRT transformation chain

The QRT Code Mechanism gives a small explicit example:

```text
X = [A B C D E F X]
  -> Q: cut at D4
  -> T: flip right frame
  -> R: inverse + address alignment
  -> compare X' with X
  -> Delta = 0 in the demonstrated case
```

The Sort Lab supplies two operator regimes over a seven-element numerical
carrier:

- Bubble: local adjacent boundary comparisons and swaps;
- Pancake: variable-length prefix-frame reversals.

The displayed residual is the inversion count. With an inserted unknown value,
the later variant stops in `UNRESOLVED` rather than fabricating an order.

## The transition from seven to eight

The `7×7` Q Rosetta carrier uses vertical, horizontal and antipodal address
maps. For a column `c in {1,...,7}`, the horizontal reflection is:

```text
H(r,c) = (r, 8-c)
```

The row reflection uses the analogous reversal of the seven retained row
labels, and `D4` is the common fixed center. Thus `8` functions as the
`n+1` reflection boundary for a seven-position axis. It is not stored as an
eighth carrier cell.

This gives a precise bounded reading of:

```text
7 positions / steps
  -> 8 as completion or reflection constant
  -> paired addresses and Klein-four orbit
  -> FORM / MORPHOLOGY reading of the same carrier
```

The transition to form is therefore produced by a declared view and transform,
not by the numeral eight alone. Whether this `7 -> 8 -> form` construction
generalizes beyond the retained grid remains an open research question.

## Matrix family

The later architecture is not one CRT matrix. It contains at least:

1. a geographic/global/local/antipodal view family;
2. a persistent-address grid;
3. the seven-position QRT carrier lanes;
4. Bubble and Pancake operator traces;
5. the `7×7` TQR/QRT/HRT grid;
6. layered local/hinge/return slices;
7. the grid transit map;
8. address, form, instrument, color and LQ matrix readings;
9. CRT×QRTp reconstruction and holdout result matrices;
10. format-lens and Carrier–View–Return matrices.

These are related sheets and views, not automatically one tensor or one
algebraic object.

## Current status

```text
OLDER_CRT_PLATE                         = HISTORICAL_ORIENTATION_VISUAL
DUAL_VIEW_ROSETTA_INTAKE               = COHERENT_TWO_MODULE_DEMONSTRATOR_CHAIN
SEVEN_POSITION_QRT_CARRIER             = EXECUTABLE_LOCAL_DEMONSTRATOR
PANCAKE_PREFIX_FLIP                    = EXECUTABLE_FINITE_OPERATOR
THREE_STATE_SLICES                     = EXECUTABLE_DISPLAY
SEVEN_TRANSIT_ROUTES_IN_2_3_2_LAYERS   = EXECUTABLE_REPRESENTATION
SEVEN_TO_EIGHT_REFLECTION_RULE         = EXACT_FOR_DECLARED_7_AXIS
EIGHT_AS_UNIVERSAL_FORM_OPERATOR       = NOT_ESTABLISHED
SHARED_REUSABLE_QRT_RUNTIME            = NOT_ESTABLISHED
```

## Main locators

- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/00_README.md`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/06_CROSS_MODULE_RELATION_MAP.md`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/09_INTEGRATION_ASSESSMENT.md`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_QRT_CODE_MECHANISM.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_SORT_LAB_BUBBLE_VS_PANCAKE-2.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_TQR_QRT_HRT_PANCAKE_GRID.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_TQR_QRT_HRT_GRID_TRANSIT_MAP.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/Q_ROSETTA_THREE_MATRICES_LQ II.html`
