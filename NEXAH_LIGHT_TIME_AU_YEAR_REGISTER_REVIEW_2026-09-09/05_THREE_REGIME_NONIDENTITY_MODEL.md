# Three-Regime Nonidentity Model

## Required typed chain

| Regime | Physical role | Required records | Explicit nonidentity |
|---|---|---|---|
| A | emission/source | source ID; physical mechanism; emission event e_A; source timebase; waveform/pulse definition | source ≠ body ≠ receiver |
| B | propagation/conversion | path geometry; one-way distance L or round-trip geometry; medium; refractive/group index; conversion model; environmental state | path length ≠ duration; medium speed ≠ vacuum c |
| C | reception/timestamp | detector ID; reception event e_C; receiver timebase; trigger/threshold model; electronics delay | timestamp ≠ event without latency model |

Additional types: INTERVAL = t_C − t_A after clock/latency binding; CONVERSION = equation mapping interval and geometry to speed; DISTANCE = independently surveyed length, not inferred from the same assumed c.

## Valid forms

One-way:
[
hat v = L/Delta t_{mathrm{corr}},
quad
Delta t_{mathrm{corr}} = t_C-t_A-delta_{mathrm{sync}}-delta_{mathrm{electronics}}.
]

Round-trip:
[
hat v = 2L/Delta t_{mathrm{corr}}.
]

Differential round-trip, preferred:
[
hat v_{mathrm{medium}} =
rac{2(L_2-L_1)}{ar t_2-ar t_1}.
]
A common fixed electronics delay cancels to first order. For propagation in air,
[
hat c_0 = n_g,hat v_{mathrm{air}},
]
provided group index n_g and its uncertainty are bound to wavelength and ambient conditions.

## Marker rule

Flames, shadows, suns, baskets, domes, colors, zones, and return arcs are visual markers unless an independent physical specification assigns them a source, event, geometry, medium, observable, and calibration. Three graphic regions are not three physical regimes by themselves.

## Period, phase, and drift

[
f=1/P,qquad
phi(t)=2pi t/P+phi_0.
]
P is time, f is inverse time, and phase is dimensionless. Phase delay gives time only after frequency binding and integer-cycle unwrapping:
[
Delta t=(Deltaphi+2pi k)/(2pi f).
]
Clock drift requires a model such as (t_{mathrm{read}}=a+b,t_{mathrm{true}}), with offset a and scale/drift b separately calibrated. Neither periodic resemblance nor phase alignment proves propagation.

