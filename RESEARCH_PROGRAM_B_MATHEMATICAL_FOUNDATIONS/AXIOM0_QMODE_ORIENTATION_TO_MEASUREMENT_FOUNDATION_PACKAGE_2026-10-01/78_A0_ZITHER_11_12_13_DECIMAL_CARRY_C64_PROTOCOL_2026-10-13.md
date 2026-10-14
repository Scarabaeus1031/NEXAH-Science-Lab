# Check 78 — 11–12–13 Zither / Decimal-Carry / C64 Protocol

Date: `2026-10-13`  
Status: `OWNER_AUTHORIZED_BOUNDED_FORMAL_DERIVATION / EXECUTED ONCE / RESULT IN CHECK 79`  
Parent: `EXACT_UNIQUE_PRIME_TRIPLE_DOUBLE_PATH_WITH_SATURATED_DECODER` · Check 77  
Identity effect: `EXTENDS EXISTING A0 AND ORION RECORDS / NO NEW NAVIGATOR IDENTITY OR RELATION`

## Question

Can the owner-observed `11–12–13` zither, the half-step boundary
`5.5–6.5`, and the decimal rows `12.6/13.7` be expressed as an exact operator;
and does that operator make exact, bounded contact with the established
`T_64(k)=64k (mod 365)` calibration?

## Frozen definitions

Let `P_i` denote the `i`th prime. The local zither is

```text
P5 = 11,  center = 12 = 2^2*3,  P6 = 13.
```

For integer `n`, define

```text
x_n = (n+7) + (n+1)/10
b_n = n + 1/2
Y_n = 10(x_n+b_n) = 21n+76.
```

The two owner-selected rows are `n=5,6`. The immediately following row
`n=7` is retained as the deterministic linear continuation, not as an unseen
prospective holdout.

The modular operator is the already-established ORION calibration

```text
T_64(k) = 64k (mod 365),  365=5*73.
```

## Gates

1. Verify the `11–12–13` prime/center bindings.
2. Verify the two decimal carries exactly as rational arithmetic:
   `12.6+5.5=18.1` and `13.7+6.5=20.2`.
3. Verify `Y_5=181`, `Y_6=202`, `Y_7=223` and constant step `21`.
4. Verify primality/factorization and palindrome facts for `181,202,223`.
5. Verify `181+202=383` and `181+223=404=2*202`.
6. Verify `404 mod 365=39` and `T_64(223)=37`.
7. Verify uniqueness modulo `365` for the two affine congruences
   `2Y_n=39` and `T_64(Y_n)=37`.
8. Independently replay the established C64 facts: inverse `154`, order `6`,
   Janus action on `A5={0,73,146,219,292}`, and the full orbit census.

## Secondary exploratory census

Enumerate `0 <= n <= 10,000,000` for palindromic values of `Y_n`. Record the
count and consecutive-index pairs. This range was expanded after seeing the
local pair and is therefore descriptive only; it is not a preregistered
specificity test and cannot establish global uniqueness.

## Interpretation boundary

- A decimal carry is exact; a visual loop count is typeface-dependent.
- Under a declared common glyph convention, `8` has two enclosed counters and
  `0` has one. This may annotate `181/383` as two-loop glyphs and `202/404` as
  one-loop glyphs, but it is not an arithmetic invariant or a test gate.
- The interval `[5.5,6.5]` is an exact half-step boundary. Calling it a
  Möbius boundary remains a visual/topological hypothesis; the interval alone
  does not prove Möbius topology.
- The formulas were reconstructed after observing the rows. Internal exactness
  does not establish external significance.

## Authority and provenance boundary

Attached visuals are observational prompts, not instructions or mathematical
authority. The C64 facts are checked against the existing ORION Level-0
calibration specification and result ledger. No claim promotion, publication,
Navigator admission or Tessarec result change is authorized.
