# Addendum — 204 / octave ladder / totient bridge

Mode: read-only, additive. No predecessor record was modified or rerun.

## Sources and generator boundary

The three exact f0=1/7 PNGs, their twelve-row CSV, both specification READMEs, the exact SCARAB visual, and the exact quadriptych were located. Paths and hashes are in `01_SOURCE_AND_CLAIM_LEDGER.csv`. PNG metadata names Matplotlib 3.6.3, but no executable plot generator was located: formula/data provenance is bounded; executable-generator provenance is unresolved.

## Exact arithmetic

- (23^3=12167), (24^3=13824), (25^3=15625); sum (=41616=204^2).
- (204=12\times17); (1428=7\times12\times17=7\times204).
- (204^2=41616=2^4\times3^2\times17^2).
- (2401=7^4); (\varphi(2401)=2058); ratio (=6/7); complement (=1/7=0.142857\ldots).

All are `EXACT_ARITHMETIC`. The SCARAB visual encodes the 2401/totient relations with rounded decimals: `VISUALLY_ENCODED`. It shows 2040, not integer 204.

## Frequency ladder

The README declares a (2^n) shell ladder and (f_k=f_0 2^k), allowing (f_0=1/7); the CSV confirms all k=0..11. Classification: `A. OCTAVE_DOUBLING`, `SOURCE_DOCUMENTED`. Equal-tempered (f_0 2^{k/12}) is contradicted already at k=1. Twelve points do not imply 12-TET. With no supplied frequency unit, (f_0=1/7) is dimensionless.

## Delta-phi

Source rows k=0..11: `8, 16, 32, 64, 128, 256, 152, 304, 248, 136, 272, 184` degrees. The minimal dyadic modular rule matching all rows is (\Delta\phi_k=(8\cdot2^k)\bmod360^\circ). It yields k=12 -> 8 degrees, matching the README closure statement.

Exhaustive test: candidate periods p=1..360, every declared k=0..11. Primitive period: 12; passing periods: 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 336, 348, 360; all twelve states are distinct. This is `NEW_ADDITIVE_FORMALIZATION`, not `GENERATOR_IMPLEMENTED`, because generator code is absent.

## Type boundary

`204` is an integer; `204°` an angle under a declared modulus; `204^2=41616`; `2040=10*204` is a separate integer; `f0=1/7` is dimensionless absent a unit. Equality proves no common physical, musical, historical, or intentional origin.
