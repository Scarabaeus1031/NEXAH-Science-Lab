# T01-B Stillpoint Results

`STILLPOINT` denotes only the frozen equilibrium `(0,0)` of the synthetic linear
systems. In every system, `F(0,0)=(0,0)` exactly.

| System / delta | Primary status | Residual at t=60 | Convergence time | Overshoot | Damping estimate |
|---|---|---:|---:|---:|---:|
| stable `(0.1,0)` | `RETURNS_TO_EQUILIBRIUM` | `5.673959413274441e-7` | `34.23` | `0` | `0.2000486379` |
| stable `(1,0)` | `RETURNS_TO_EQUILIBRIUM` | `5.673959413274461e-6` | `46.37` | `0` | `0.2000486379` |
| stable `(0,1)` | `RETURNS_TO_EQUILIBRIUM` | `6.869129253186067e-6` | `45.60` | `0` | `0.1999151367` |
| unstable `(0.1,0)` | `DOES_NOT_RETURN` | `1.0686474579861675e12` | null | `1.0686474579860675e12` | `-0.499999999997` |
| unstable `(1,0)` | `DOES_NOT_RETURN` | `1.068647457986166e13` | null | `1.068647457986066e13` | `-0.499999999997` |
| neutral `(0.1,0)` | `NEUTRAL_NONIDENTIFIABLE` | `0.09999999999583295` | null | `0` | `6.945e-13` |
| neutral `(0,1)` | `NEUTRAL_NONIDENTIFIABLE` | `0.9999999999583333` | null | `0` | `6.945e-13` |

All seven prospective expectations were met. The stable controls returned under
all three perturbations, unstable controls did not return, and neutral controls
were not coerced into stable or unstable recovery. The operational equilibrium
label is therefore confirmed for these selected synthetic systems only.

Disposition: `STILLPOINT_OPERATIONAL_EQUILIBRIUM_CONFIRMED`.

No physical stability, universal equilibrium, prediction, early-warning, or
control claim follows.
