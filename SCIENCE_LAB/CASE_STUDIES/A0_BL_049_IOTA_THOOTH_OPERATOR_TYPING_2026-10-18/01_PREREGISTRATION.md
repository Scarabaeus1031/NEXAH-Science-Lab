# A0-BL-049 — Frozen preregistration

Date: `2026-10-18`

## Source-bound type declarations

- `IOTA_EXISTING`: a parameterized directed angular classifier
  `C_alpha: samples -> {I,O,M}` already supported by the closed Zero/Glyph/Iota
  record. It is not globally an index, injection, state or generator.
- `THOOTH_EXISTING`: a title/provenance label and manual comparison-card
  pattern. The intake provides no executable map, schema or scoring rule; it
  is therefore not an operator in this audit.
- `delta_first`: delete the first decimal position.
- `delta_second`: delete the second decimal position.

## Frozen domain and codomains

```text
D4 = {decimal strings 1000..9999}                         |D4| = 9000
S3 = {all three-character decimal strings 000..999}      |S3| = 1000
D3 = {three-character decimal strings 100..999}           |D3| = 900

delta_first : D4 -> S3,  abcd |-> bcd
delta_second: D4 -> D3,  abcd |-> acd
joint       : D4 -> D3 x S3, abcd |-> (acd,bcd)
```

Strings remain strings; leading zero in `S3` is preserved.

## Predictions and controls

1. `delta_first` is surjective with uniform fibre size `9`.
2. `delta_second` is surjective with uniform fibre size `10`.
3. Neither deletion is injective.
4. The ordered joint is injective and reconstructs all `9000/9000` inputs.
5. Each single projection returns exactly with its removed digit residual;
   uniform fixed-width residual cost is four bits in both cases.
6. Registered witnesses: `1737→737` under `delta_first` and `1737→137`
   under `delta_second`.
7. Collision controls: `1737/2737→737` and `1737/1837→137`.
8. Deletions are not endomorphisms of `D4` and therefore are not iterative
   generators on the declared carrier. A swap of positions two and three is a
   length-preserving bijective control.
9. Exact arithmetic stays separate: `1737=9*193=1729+8`, hence it is not
   prime and the decimal maps do not derive those equalities.

## Decision vocabulary

- `PASS_TYPED_LOSSY_PROJECTIONS_WITH_JOINT_EXACT_RETURN` if all predictions,
  controls and source-bound type separations pass.
- `FAIL_DECLARED_FIBRE_OR_RETURN_CONTRACT` if a finite map prediction fails.
- `UNDEFINED_OPERATOR_TYPING` if IOTA/THOOTH or map domains cannot be kept
  distinct without inventing semantics.
- `INVALID_EXPERIMENT` on lock drift, incomplete enumeration or map change.

## STOP and claim boundary

Stop after Primary, Replay and verification. Passing does not make THOOTH an
operator, IOTA a universal residual, either deletion a generator, the joint a
historical decoder, or any glyph/title relation algebraic.

