# PQR-01 — Phase Quantization, Residual and Seam Audit

Date frozen: `2026-09-20`

Status: `POST_HOC_EXPLORATORY_REPRESENTATION_AUDIT`

## Question

When the 72 PHX-01 cycle phases and their 12 registered summaries are passed
through declared decimal, binary and trinary views, which relations are
retained in the quantized code and which remain only in the residual?

The choice of three decimal places was made after observing `393` and `696`.
It is therefore exploratory and cannot provide confirmatory evidence.

## Typed carrier

Every record keeps the following objects separate:

```text
measured phase value
decimal digit string
integer value of the digit code
prime factorization of that integer
binary projection (code mod 2)
trinary projection (code mod 3)
quantization residual
source identity and uncertainty context
```

`DIGIT_STRING != INTEGER != FACTORIZATION != PHYSICAL_PHASE`.

## Quantization seam

For a declared view `v`, precision `p` and operator `Q`:

```text
v(x) = Q_p(v(x)) + epsilon_p(v(x))
normalized residual = epsilon_p / 10^(-p)
```

The seam is the declared boundary between `Q_p(v(x))` and the residual. Exact
decimal reconstruction from those two fields is mandatory.

## Registered corpora

1. `CYCLE_72`: every PHX-01 active cycle phase; primary corpus.
2. `SUMMARY_12`: eight cut-level circular means plus four paired circular mean
   phase shifts; marked summaries, not independent measurements.

## Registered views

- `degrees`: identity on the PHX-01 value;
- `radians_pi`: standard `degree * pi / 180` conversion;
- `cycle_fraction`: standard `degree / 360` conversion;
- `phi_scaled_control`: declared control `degree / phi`;
- `sqrt2_scaled_control`: declared control `degree / sqrt(2)`.

The last two are sensitivity controls only. Numerical proximity after those
maps cannot establish a physical role for `phi` or `sqrt(2)`.

Euler's handle is used only as the standard unit-circle encoding
`exp(i * phase_radians)` with an angle-return check. Riemann, Ramanujan, Gauss
and other historical names are not used as generic handles because no relevant
operator is bound here.

## Registered operators and precision battery

- `ROUND_HALF_UP`;
- `TRUNCATE_TOWARD_ZERO`;
- decimal precisions `p = 2, 3, 4, 5, 6`;
- two-digit and three-digit prefixes are retained as strings with leading
  zeroes;
- palindrome tests operate on the complete fixed-width fractional digit
  string;
- primality/factorization operate on the separately stored integer code.

## Null and multiplicity controls

For a fixed width `p` with leading zeroes, the uniform-digit palindrome null is
`10^(-floor(p/2))`. The prime-code null is the exact proportion of primes among
integer codes `0..10^p-1`. One-sided binomial enrichment tests are reported for
every corpus/view/operator/precision family and corrected together with
Benjamini-Hochberg FDR.

This null is a representation null, not a physical noise model.

## Bootstrap stability of the 12 summaries

Circular moving-block bootstrap settings are inherited from PHX-01:

```text
draws = 20000
block length = 2 cycles
seed = 20260920
```

For the displayed three-decimal degree code, report:

- probability of returning the identical code;
- probability of returning any palindrome;
- probability of retaining the same mod-2 state;
- probability of retaining the same mod-3 state.

## Decision classes

```text
REPRESENTATION_STABLE_RELATION
ROUNDING_LOCAL_PATTERN
BOOTSTRAP_UNSTABLE_PATTERN
NO_ENRICHMENT_OVER_DECLARED_NULL
```

No class authorizes prime causation, morphogenesis, resonance constants or a
new number-theory result.

