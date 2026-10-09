# Dual Cut, Antipode and Persistent Address Method

## Why this is one thread

The Transversum, Geodesic Weather, Dual Regime, Antipodal Dual View, persistent
address, Q Rosetta and QRT artifacts are successive method steps rather than an
unrelated poster collection:

```text
one carrier X
  -> two directed cuts or observer frames
  -> declared binder / registration
  -> comparison space
  -> persistent address
  -> transform / QRT
  -> return comparison
  -> typed residual and ILAU record
```

The PNG plates state the method visually. The retained HTML files add the
executable state, equations, data records, projection functions and controls.

## Core two-cut equation

Let `R1` and `R2` be two bounded readings of the same declared carrier `X`.
Before comparison, the second reading must be transported or registered into
the first frame by a declared binder `T_2_to_1`:

```text
r = d(R1(X), T_2_to_1[R2(X)])
```

`r` should be a typed vector over declared quantities, not a single mystical
remainder. Depending on the instrument it may include address mismatch,
coordinate or projection drift, phase, amplitude, delay, missing support,
introduced representation or unresolved provenance.

The binder is the calibrated correspondence that makes comparison possible. It
is not a third observation, a third wave or a third world.

## Antipode as a controlled frame flip

For a geographic point `p = (lambda, phi)`, the antipodal transformation is:

```text
A(lambda, phi) = (wrap(lambda + 180 degrees), -phi)
```

The executable Geodesic Weather instrument instantiates this exactly for its
anchor:

```text
St. Thomas = (-64.93 degrees, 18.34 degrees)
Antipode    = (115.07 degrees, -18.34 degrees)
```

The HTML provides four relevant operations:

1. a global Natural Earth projection;
2. a St.-Thomas-centred azimuthal equidistant projection;
3. an antipode-centred azimuthal equidistant projection;
4. in the Module II variant, a Codex Grid view.

Great-circle distance is calculated from `d3.geoDistance * 6371`; initial
azimuth is calculated from the standard spherical bearing expression in the
script. These are executable cartographic operations. The displayed weather
values are embedded snapshots, not a live weather pipeline.

The methodological role of the antipode is therefore precise:

```text
centre(A) -> margin/shadow(B)
centre(B) -> margin/shadow(A)
```

What is marginal or singular in one projection can become central and legible
in the opposite frame. This does not make either projection the whole carrier.

## Persistent address bridge

The Module II Geodesic variant assigns each geographic node a declared grid
address and adds a `Codex Grid` control. For example:

```text
St. Thomas -> C2
Antipode   -> H7
Giza       -> A3
Greenwich  -> B4
```

Thus the implemented claim is:

```text
M_A(p) != M_B(p) may hold while ADDRESS_A(p) = ADDRESS_B(p)
```

The address identifies the record across the two projections. It is not
computed from latitude and longitude by a recovered encoder; it is declared in
the node data. The retained grid is an `8 x 8` frame around a `7 x 7` payload:

```text
64 = 49 payload + 14 headers + 1 corner
```

The absent row `G` and the use of `H` as row seven are explicitly retained as a
structural residual. Address, glyph, operator and meaning remain separate
types.

## From antipodal view to QRT

The QRT Code Mechanism transfers the same method into a finite seven-position
carrier:

```text
X = [A B C D E F X]
Q: cut at D4
T: flip the right frame
R: apply the inverse and align addresses
Delta = R(T(Q(X))) - X
```

For the included demonstration, `Delta = 0`. The change of view is visible,
while the tested addressed relation returns exactly. This is a bounded
demonstration, not proof that every cut is invertible or lossless.

The subsequent Q Rosetta, Pancake and TQR/HRT artifacts unfold that compact
operation into layered readings, prefix flips, routes, registers and typed
return records.

## Method layers recovered from the series

| Layer | Question | Retained implementation status |
|---|---|---|
| carrier | what is held constant across views? | declared nodes or finite sequence |
| cut/frame | where and from which orientation is it read? | executable controls and local operators |
| binder | how are two views made comparable? | declared transport/alignment; no shared package-wide contract |
| comparison space | what survived, disappeared, appeared or remains open? | ILAU displays and local records |
| persistent address | what names the same record after reprojection? | executable declared node addresses |
| transform | what operation changes the representation? | projection, frame flip, prefix flip and local QRT steps |
| return | how is the transformed record aligned with the source? | exact in the small QRT demonstration; local elsewhere |
| residual | what remains after comparison? | several local definitions; no normalized cross-module metric |
| provenance | which carrier, frame, operator and record produced the statement? | partly present in intake and typed records; no common runtime ledger |

## Claim boundary

```text
ANTIPODE_TRANSFORM                     = EXACT_GEOGRAPHIC_RELATION
GEODESIC_DISTANCE_AND_INITIAL_AZIMUTH  = EXECUTABLE_LOCAL_CALCULATION
FRAME_SWITCH                          = EXECUTABLE_CARTOGRAPHIC_DEMONSTRATOR
WEATHER_FIELD                         = EMBEDDED_SNAPSHOT_NOT_LIVE_INGESTION
PERSISTENT_ADDRESS                    = DECLARED_AND_EXECUTABLE_NOT_DERIVED
TWO_CUT_BINDER                        = METHOD_CONTRACT_NOT_UNIVERSAL_ENTITY
QRT_RETURN                            = EXACT_FOR_INCLUDED_FINITE_DEMO
SHARED_RESIDUAL_METRIC                = NOT_ESTABLISHED
UNIVERSAL_ANTIPODAL_ONTOLOGY          = NOT_CLAIMED
```

## Main source locators

- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/01_MODULE_I_TRANSVERSUM_GEO_WEATHER_VIEW/NEXAH_GEODESIC_WEATHER_INSTRUMENT.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_GEODESIC_WEATHER_INSTRUMENT(1).html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_MAP_GRID_PERSISTENT_ADDRESS.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_QRT_CODE_MECHANISM.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/02_MODULE_II_G_RT_ROSETTA/NEXAH_TQR_QRT_HRT_GRID_TRANSIT_MAP.html`
- `00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/06_CROSS_MODULE_RELATION_MAP.md`

