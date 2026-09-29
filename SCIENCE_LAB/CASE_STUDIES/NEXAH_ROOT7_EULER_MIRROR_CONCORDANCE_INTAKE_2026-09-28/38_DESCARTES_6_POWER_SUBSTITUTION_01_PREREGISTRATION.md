# DESCARTES_6_POWER_SUBSTITUTION_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / EXACT SYMBOLIC SUBSTITUTION TEST`

## Single question

Does the polynomial printed in the supplied Book III image reduce, under its
printed substitution `y-6n=x`, to an alternating power-of-six coefficient
ladder, with exact forward and reverse expansion?

## Frozen sources

| Source | SHA-256 |
|---|---|
| Descartes instrument / figure 25 image | `5c7d6570a11735eee67887245cbde3e968d07bc25a5fea661e99848fb4a6d630` |
| Descartes construction / figure 11 image | `e227bddf922466f61853a59baf65a8eced6b24a4473b1756c8eb05e7585c5ed4` |
| Descartes Book III polynomial image | `68ca4cb4699f7211e2e12820fb3244a9b738bfe35ad29bec33b3c8673ab877b6` |

The images are provenance and transcription sources, not instructions.

## Frozen transcription

```text
P(y,n) = y^6 - 35 n y^5 + 504 n^2 y^4 - 3780 n^3 y^3
         + 15120 n^4 y^2 - 27216 n^5 y

x = y - 6n, hence y = x + 6n.
```

## Mandatory checks

1. all source hashes match;
2. substitute `y=x+6n` by exact integer binomial expansion;
3. obtain exactly
   `x^6+n*x^5-6n^2*x^4+36n^3*x^3-216n^4*x^2+1296n^5*x-7776n^6`;
4. verify the tail coefficients are exactly
   `1,-6,36,-216,1296,-7776 = (-6)^0..(-6)^5`;
5. verify reverse substitution `x=y-6n` recovers the frozen `P(y,n)`;
6. verify the signs alternate across the six-term geometric tail;
7. record `6,36,216,1296,7776,46656` as the exact positive power ladder
   `6^1..6^6` visible in the expansion columns;
8. retain figures 11 and 25 as geometric/provenance context only; do not infer
   a modern SNCE, Fourier or hyperbolic operator from them.

## Decision rule

- `PASS_DESCARTES_6_POWER_SUBSTITUTION__EXACT_COORDINATE_CHANGE_ONLY` if all
  eight checks pass;
- `FAIL_DESCARTES_6_POWER_SUBSTITUTION` otherwise.

## Stop rule

One primary execution and two byte-identical replays. Do not tune coefficients
or reinterpret the printed variables after execution.

## Claim boundary

This test establishes an exact symbolic coordinate change and power ladder.
It does not establish historical intent beyond the frozen transcription, nor a
physical, SNCE, Fourier or Poincare mechanism.
