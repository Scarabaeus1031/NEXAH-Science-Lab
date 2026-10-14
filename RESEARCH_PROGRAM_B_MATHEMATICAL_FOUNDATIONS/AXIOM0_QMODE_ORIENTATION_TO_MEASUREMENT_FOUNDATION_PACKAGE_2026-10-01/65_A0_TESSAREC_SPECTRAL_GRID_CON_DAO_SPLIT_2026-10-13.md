# Check 65 — Tessarec Spectral Grid × CON–DAO Split Lens

Date: `2026-10-13`  
Status: `SOURCE_BOUND_DISPLAY_ADAPTER / NOT_A_SCIENCE_RUN`  
Identity: extends `MOD:TESSAREC`; reuses `NEXAH:CON_DAO_BREATH:V1` and the tested AXIS08 operator  
New Navigator identity or relation: `NO`

## Purpose

Restore the full 48-point spectral pattern while making the eight display
slices readable as coordinates and fields. Couple the already admitted
CON–DAO display clock to the E8/AXIS08 lens without changing eigenvalues,
E8 roots or the quotient definition.

## Grid

The horizontal coordinate is the measured eigenvalue. Six declared unit
intervals partition the displayed range `[-3,3]`:

```text
F1=[-3,-2)  F2=[-2,-1)  F3=[-1,0)
F4=[ 0, 1)  F5=[ 1, 2)  F6=[ 2,3]
```

The vertical coordinate remains the existing index packing:

```text
lane = sorted eigenvalue index mod 8
coordinate = L{lane+1} · F{field+1}
```

This is an interface coordinate, not a new spectral invariant.

## Split lens

The trivial eigenvalue marker at `lambda=+3` is retained as a fixed pink
cut/split marker. In the declared display convention:

- `q7` is drawn inside the split and denotes the fused seventh quotient
  coordinate;
- `p8` is drawn outside and denotes the retained physical-pole/residual
  witness;
- CON–DAO changes their display separation and field illumination only.

At `STILL` the markers approach the split but never exchange sides. The
quotient and its residual remain separately reported by Check 64.

## Boundary

`q7 INSIDE / +3 SPLIT / p8 OUTSIDE` is a typed visualization convention.
It does not establish that the adjacency spectrum is E8, that `lambda=3`
is an E8 root or AXIS08 pole, or that CON–DAO is a physical spectral
mechanism.

## Verification

```bash
node A0_BOOK/a0-tessarec-spectral-grid-breath-tests.cjs
node A0_BOOK/a0-tessarec-spectral-audit-tests.cjs
node A0_BOOK/a0-coverage-link-audit.mjs
```
