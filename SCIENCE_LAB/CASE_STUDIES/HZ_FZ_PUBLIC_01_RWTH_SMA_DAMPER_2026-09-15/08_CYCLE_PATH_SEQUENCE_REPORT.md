# HZ_FZ_PUBLIC_01: cycle-path sequence audit

Date: `2026-09-15`

Status: `DESCRIPTIVE_PATH_STRUCTURE_WITH_ALIGNMENT_SENSITIVITY_AND_UNSTABLE_REFERENCE_ORIENTATION`

## Result

The active-order path contains 3 pairwise crossings; pairing the same records by their shared nominal cycle labels gives 2. The visible path therefore depends on the declared alignment rule. The Compass-Binder keeps both views and does not silently choose one as physical truth.

The active-order crossing gaps are 1.648090 and 3.299013 cycle-order units; their ratio is 2.001719. That is a precise descriptive 2:1 feature in this interpolation, but it is post hoc, small-n, and alignment-sensitive.

## Exploratory reference screen

| Reference ray | Ratio | point residual | bootstrap ±5° | bootstrap ±10° |
|---|---:|---:|---:|---:|
| sqrt(2) | 1.414214 | +106.36% | 7.7% | 16.9% |
| phi | 1.618034 | +80.36% | 8.0% | 16.7% |
| 2:1 | 2.000000 | +45.92% | 8.8% | 17.3% |
| 2*sqrt(2) | 2.828427 | +3.18% | 9.2% | 17.7% |
| gamma^-2 | 3.000000 | -2.72% | 8.9% | 17.5% |
| pi | 3.141593 | -7.11% | 9.0% | 17.9% |

The table tests all named candidates together. It does not select one after looking at the plot. The bootstrap orientation remains broad, so closeness of the point estimate to any one ray is not stable evidence for a constant.

## Schimmer, Spiegel und Linien bei etwa −100

The polar shimmer is the Cartesian bootstrap cloud written as angle plus radius. It is not a second dataset. The vertical bands in the Cartesian cloud arise because moving-block bootstrap medians are assembled from eight discrete cycle values; only 909 distinct x-values occur at 1e-9 J rounding. They should not be read as independent excitation lines.

The reflection diagnostic has normalized median nearest-partner residual 0.191; zero would mean exact reflection pairing. With eight path points this is descriptive only.

## Boundary

All constant rays and reflection checks are exploratory coordinate references on the same source records; they add no independent evidence and identify no physical constant or refraction law.
