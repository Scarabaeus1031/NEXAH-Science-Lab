# Compass-Binder ACR extension v0.2

Status: `ACR33_ACR44_LOCAL_EXECUTION_PASS_NO_PROFILE_ACTIVATION`

`COMPASS_BINDER_V0_2_ACR_EXTENSION.json` is an additive contract. It preserves
the two v0.1 cuts, their units, source hash, alignment alternatives, observed
vector and claim boundary.

The extension assigns bounded roles to ACR33, ACR44, ACR35, ACR43/45 and ACR27.
It does not fit the observed `2.9183` ratio to a named constant and does not use
GLB geometry as measurement evidence.

The next executable gate is ACR33 preflight followed by an ACR44 round trip:

```text
A,B -> M=(A+B)/2, S=(A-B)/2 -> A'=M+S, B'=M-S
```

The gate passes only if `A'=A` and `B'=B` within a declared numerical tolerance
and all receipts, units and alignment labels remain unchanged.

`run_acr_binder_adapter.py` executed this gate. The ACR33 preflight passed all
six checks. The ACR44 lift produced `M=-27.9058145148787` and
`S=13.662011810848611 J/cycle`, then reconstructed both inputs with zero
absolute error at tolerance `1e-12`. The result and execution receipt are stored
in `COMPASS_BINDER_V0_2_ACR_EXECUTION.json`.

The continuation `run_acr_projection_return.py` executed ACR35, ACR43 and
ACR45. The current display is a direct Cartesian-to-polar coordinate change,
not ACR35's fourfold sine-phase projection. The retained angle convention,
quadrant, signs, alignment and source receipt form its orientation key. The
polar round trip passed with maximum absolute error
`1.5987211554602254e-14` at tolerance `1e-12`.

The ACR43/45 ledger contains six forward events on an ordinal execution
timebase and a SHA-256 hash chain. It explicitly does not claim physical
synchrony. `verify_acr_return_controls.py` accepted the intact baseline and
rejected four destroyed variants. The complete result is
`COMPASS_BINDER_V0_3_ACR_RETURN_RECEIPT.json`; the negative controls are in
`COMPASS_BINDER_V0_3_DESTRUCTION_CONTROLS.json`.
