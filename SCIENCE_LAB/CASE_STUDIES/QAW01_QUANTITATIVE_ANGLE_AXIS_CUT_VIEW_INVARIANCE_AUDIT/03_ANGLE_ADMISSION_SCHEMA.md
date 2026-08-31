# Angle Admission Schema

A candidate is admitted only when a vertex, two straight boundaries, sufficient resolution, a reproducible method, and bounded uncertainty are available without relying on decorative curvature.

## Neutralization

Historical names, animals, mythology, locations, planetary labels, Q°, colors, and symbolic prose were ignored. The admitted motif is `OBJ_A`; its sides are `RAY_A` and `RAY_B`; the three files are `VIEW_1`, `VIEW_2`, and `VIEW_3`.

## Pixel method

- Coordinates: image `x` rightward, `y` downward.
- Candidate region chosen from the visibly repeated straight TERRA triangle.
- IMG_03/IMG_04 ROI: `x=140..399`, `y=60..359`.
- IMG_05 ROI: `x=220..499`, `y=120..499`.
- Gold-line mask: mean RGB brightness `>145`, `R>1.15B`, `G>1.05B`.
- Hough-style estimate: one-pixel rho bins; line-orientation step `0.03125°`.
- Fixed side ranges: left `55°..68°`; right `112°..126°`.
- Interior apex angle: `theta_right - theta_left`.
- Sensitivity check: brightness thresholds 145 and 160, plus competing-line ambiguity.

Uncertainty includes threshold stability, finite line width, decorative interference, and side-selection ambiguity. It does not convert image-plane angles into object-space angles.

Rejection classes used: `DECORATIVE_ONLY`, `AMBIGUOUS_RAY`, `PROJECTION_UNDERDETERMINED`, and `CORRESPONDENCE_UNDERDEFINED`.

