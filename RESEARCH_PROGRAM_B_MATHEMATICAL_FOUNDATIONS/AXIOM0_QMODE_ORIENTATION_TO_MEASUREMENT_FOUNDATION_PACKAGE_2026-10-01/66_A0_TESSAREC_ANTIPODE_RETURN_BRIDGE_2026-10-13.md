# Check 66 — Tessarec Antipode Return Bridge

Date: 2026-10-13  
Status: `SOURCE-BOUND REPRESENTATION ADAPTER / NOT A SCIENCE RUN`  
Reused identities: `MOD:TESSAREC`, `MOD:E8_COXETER`, `MOD:NUMBER_VIEW_SUITE`  
New Navigator identity or relation: none

## Purpose

Connect the eight signed spectrum-display lanes in the Blue Body instrument to the already validated LIFE04B antipodal record grammar without changing the LIFE04B result, the Tessarec carrier, or the spectral calculation.

The adapter receives the normalized eight-lane vector `z`, partitions the established 240-root E8 reference into 120 exact antipodal axes, chooses one oriented representative, and retains the residual:

```text
[α] = {α, −α}
σ ∈ {−1, +1}
r = z − σα
z = σα + r
```

The last equality is an exact reconstruction because `r` remains in the record. It is a bookkeeping and return-contract result, not support for E8 specificity.

## Typed separation

- AXIS08: eight lane values → seven weighted quotient coordinates + the fused-pair residual → eight exact lane values.
- LIFE04B adapter: eight normalized lane values → one of 120 antipodal axis addresses + orientation sign + eight-component residual → the same normalized vector.
- The displayed `q7 IN / +3 SPLIT / p8 OUT` geometry remains an AXIS08/spectrum display convention. It is not identified with an E8 antipodal pair.
- The CON–DAO/Janus button may flip the displayed orientation sign only. The residual is recomputed, so the returned vector remains exactly the same. This is a representation action, not a claimed operator identity.

## Re-reading the last two tests

### LIFE//ORBIT Scale Lab V2

`OPEN TRANSIENT` remains open. Static antipodal geometry cannot supply a missing temporal or retained-history witness. The bridge makes the distinction explicit: carrier, address and view do not close a temporal return unless the required history/residual is retained.

### LIFE04B

`NO E8 ANTIPODAL SPECIFICITY` remains the primary result. The useful reusable result is narrower: 240 roots form 120 exact axes, and `pair + sign + residual` is an exact return record. Reconstruction and specificity are separate questions.

## Source bindings

- `SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_E8_ANTIPODAL_RETURN_LIFE04B_2026-10-07/antipodal-engine.js`
- `SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_E8_ANTIPODAL_RETURN_LIFE04B_2026-10-07/README.md`
- `SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_ORBIT_SCALE_LAB_V2_2026-10-07/README.md`
- `A0_BOOK/assets/a0-tessarec-e8-axis08-adapter-v1.js`
- `A0_BOOK/assets/a0-tessarec-antipode-return-bridge-v1.js`

## Verification boundary

The local check verifies the 240→120 fixed-point-free partition, typed sign, retained residual, exact numerical reconstruction, Janus display reorientation, and preservation of the negative specificity statement. It does not execute a new LIFE benchmark or amend any frozen result.

