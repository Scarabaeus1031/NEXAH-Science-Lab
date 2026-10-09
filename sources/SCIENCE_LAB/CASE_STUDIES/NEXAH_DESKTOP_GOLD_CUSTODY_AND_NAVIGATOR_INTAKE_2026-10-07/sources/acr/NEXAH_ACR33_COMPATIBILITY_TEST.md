# NEXAH ACR-33 — Groove / Needle Compatibility Gate

## Scope and evidence boundary

This is a documentary-mechanical type audit plus an ideal orthogonal-axis model. No physical record was played, worn, measured, or damaged. Quality and wear classes are therefore categorical decisions based on the supplied historical/technical description, not laboratory measurements.

## Typed layers

The visible object “record groove” is insufficient to determine compatibility. A readout configuration is typed as

\[
\mathcal R=(g,a,s,v,d,t),
\]

where:

- \(g\): groove scale (`N` normal or `M` micro);
- \(a\): modulation axis (lateral or vertical);
- \(s\): stylus geometry/material;
- \(v\): playback speed;
- \(d\): traversal direction;
- \(t\): transducer/diaphragm orientation.

## Axis test

In an ideal two-axis model,

\[
I_x=(1,0),\qquad I_z=(0,1),\qquad I_x\cdot I_z=0.
\]

Thus a purely lateral reader has zero ideal sensitivity to a purely vertical modulation, and vice versa. Real mechanisms may have cross-coupling; none was measured here.

## Compatibility matrix

| Recorded format | Normal/lateral reader | Micro/lateral reader | Sapphire/vertical reader |
|---|---|---|---|
| N normal groove, lateral | `MATCH` | `DEGRADED / TIP RISK` | `AXIS_MISMATCH` |
| M microgroove, lateral | `GROOVE_DAMAGE_RISK` | `MATCH` | `AXIS_MISMATCH` |
| Pathé vertical groove | `INCOMPATIBLE` | `INCOMPATIBLE` | `MATCH` |

The `MATCH` entries still require correct speed and traversal direction. The matrix does not claim that every historical object within a broad format used identical dimensions.

## Five gates

1. `G1_GROOVE_SCALE`: stylus profile matches N/M groove scale.
2. `G2_MODULATION_AXIS`: reader sensitivity matches lateral/vertical encoding.
3. `G3_SPEED`: readout rpm matches the recording convention.
4. `G4_TRAVERSAL`: read direction matches the stored order.
5. `G5_TRANSDUCER`: stylus and diaphragm geometry transmit the encoded displacement.

Decode is classified as compatible only when every required gate passes.

## Decision

| Claim | Status |
|---|---|
| N/M are groove-scale classes | `SUPPORTED_BY_SUPPLIED_DOCUMENTATION` |
| Lateral/vertical are distinct modulation axes | `SUPPORTED` |
| Ideal axes are orthogonal | `VERIFIED_MODEL` |
| Reader compatibility is multi-parameter | `VERIFIED_ARCHITECTURE` |
| Any real wear or audio-quality percentage | `NOT_MEASURED` |
| New acoustic or historical discovery | `NO` |

The central result is architectural: stored information is recoverable only through a type-compatible readout operator.
