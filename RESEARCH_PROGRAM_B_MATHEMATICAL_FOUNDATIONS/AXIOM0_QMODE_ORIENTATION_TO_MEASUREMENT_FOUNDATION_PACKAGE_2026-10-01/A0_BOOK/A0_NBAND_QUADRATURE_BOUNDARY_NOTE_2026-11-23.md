# N-Band Quadrature Boundary Note

**Date:** 2026-11-23  
**Status:** `PASS_TYPED_ADAPTER_INTEGRATED / PHYSICAL_HOLD`  
**Standalone lab:** `A0_NBAND_QUADRATURE_BOUNDARY_LAB.html`  
**Integrated view:** `A0_BOUNDARY_GRAPH_DEMONSTRATOR.html#nband-quadrature-boundary`

## Question

Can the existing A0 quadrature identity and the proposed square/cube N-band
shell readings support a bounded display adapter without identifying annuli,
cubes or physical material mechanisms?

## Existing source reuse

The A0 Field Notes already record:

```text
Q_plus  = cos^2(delta_phi/2)
Q_minus = sin^2(delta_phi/2)
Q_plus + Q_minus = 1
```

The new view reuses this formula and the existing identities
`ART:A0:MATHEMATICAL_JOINTS` and `MOD:NUMBER_VIEW_SUITE`. It creates no
Navigator identity, relation, alias, Study or Finding.

## 1. Quadrature test

The finite audit sampled `delta_phi = 0...720 degrees` in `0.5 degree` steps:

```text
samples              = 1441
maximum residual     = 2.220446049250313e-16
declared tolerance   = 1e-12
result               = PASS_EXACT_NUMERIC_QUADRATURE_CLOSURE
```

The squared weights return after `360 degrees`; the oriented sine/cosine
vector returns after `720 degrees`. These are separate return contracts.

## 2. N-band shell test

For every integer `n = 1...64`:

```text
n^2 - (n-1)^2 = 2n - 1
n^3 - (n-1)^3 = 3n^2 - 3n + 1
```

All 64 square and cube shell comparisons pass. The result permits a square
shell and cube shell register; it does not turn an N-band into a physical cube.

## 3. Three display carriers

The view exposes three distinct registers:

1. `Q+ / COS^2`
2. `1 / CLOSURE`
3. `Q- / SIN^2`

Their isometric drawing is a display convention. It is not evidence for three
piezoelectric cubes.

## 4. Material adapter boundary

| Adapter | Typed input/output | Boundary |
|---|---|---|
| Quartz | mechanical stress to electrical polarization/charge | piezoelectric adapter; measurement and tensor data still required |
| Iron | magnetic field/strain/temperature to magnetization, magnetostriction or thermal state | comparator, not a piezo operator |
| Ice/water | temperature/pressure to phase/flow state | phase-boundary comparator |
| Fire | energy/process rail | not a material node or fourth cube identity |

## 5. Gate

```text
mathematical contract     PASS
type separation           PASS
display integration       GO_TYPED_ADAPTER_ONLY
physical mechanism        HOLD_MEASUREMENT_REQUIRED
Prime Cube identity       FALSE
Source Graph delta        0 / 0 / 0
```

The module is therefore integrated into the existing Boundary Graph as a
typed display adapter only. Physical integration requires a separately
declared geometry, material constants, excitation, measurement method,
controls and calibration.

## Validation

- module suite: `58/58 PASS`
- JavaScript syntax: `PASS`
- quadrature residual: `2.220446049250313e-16`
- square/cube shell range: `n=1...64`, zero failures
- Mission Control projection: `PASS`, `21` components
- Navigator App audit: `255/255 PASS`
- Source Graph: base `329/29`, composed `332/32`; only the pre-existing Red Balloon canonical-hash failure remains

