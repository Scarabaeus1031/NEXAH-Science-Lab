# POLAR-LOD-BL-01 source and method binding

## Target product

The target remains the named IERS `EOP 20u24 C04` daily 0 h UTC series and
its `LOD` field in seconds. The current product metadata describes daily C04
values and the IERS Earth Orientation Centre describes C04 as representing
fluctuations longer than about 6–7 days.

The official IERS C04 interface offers removal of solid-Earth zonal-tide
variations from UT1/LOD. The older C04 construction guide also documents that
zonal-tide terms removed during combination are added back to the final
series. Therefore the long-period zonal correction is an applicable known
component of the observed daily LOD target, not an independent target.

## IERS model binding

Model: IERS Conventions (2010), Chapter 8, `RG_ZONT2.F`, calling
`FUNDARG.F`.

| Item | URL | SHA-256 observed 2026-10-01 |
|---|---|---|
| `RG_ZONT2.F` | `https://iers-conventions.obspm.fr/content/chapter8/software/RG_ZONT2.F` | `5aab78a0bb47f3ccb363a707b9aa6db8433aacd73038d5e15b631c592bcb9b0f` |
| `FUNDARG.F` | `https://iers-conventions.obspm.fr/content/chapter8/software/FUNDARG.F` | `18263cbb1289e222e6ee6e59d52beb343eb77a63ed3212e4f05a4c85d475ae78` |

The local Python routine is a renamed derived implementation. It transcribes
the 62 argument multipliers and coefficient rows and the IERS fundamental
argument polynomials. It is not IERS software, is not endorsed by IERS, and
ships with the upstream notice in `IERS_SOFTWARE_LICENSE.txt`.

Official reference case:

- input: `T = 0.07995893223819302`, corresponding to MJD 54465;
- expected `DUT`: `7.983287678576557467e-2 s`;
- expected `DLOD`: `5.035331113978199288e-5 s/day`;
- expected `DOMEGA`: `-4.249711616463017e-14 rad/s`.

The qualification runner checks all three outputs.

## Historical source binding

Retained extract:

`../Orion_POLAR:Pass Maastricht/Polar-Janus-Test-08-LOD-Holdout/test_08_iers_lod_2010_2025.csv`

- rows: `5844` data rows plus header;
- span: 2010-01-01 through 2025-12-31;
- SHA-256: `5a4df1e393b3feaceb695c636c1a8b363c08a5464f448ba890b678c9cc396996`.

This snapshot is admitted retrospectively for reproducibility. Tracking it
now does not retroactively seal the original Test-08 preregistration or turn
the 2025 comparison into prospective evidence.

## Why `ORTHO_EOP` is excluded

`ORTHO_EOP` models diurnal and semidiurnal ocean-tide effects used for
subdaily interpolation. Daily C04 exchange values omit those high-frequency
terms, while the candidate Test-08 periods are all 13.66–29.53 days. Adding
`ORTHO_EOP` to a daily target would therefore mix sampling conventions and is
not the appropriate comparator for this question.

## Scientific meaning

`B2-IERS-ZONT2` asks whether a forecast that explicitly removes and restores
the established long-period tidal contribution is harder to beat than a
generic autoregression. It does not claim that all geophysical LOD drivers are
modeled; atmosphere, ocean, hydrology and core/mantle variability remain in
the residual.
