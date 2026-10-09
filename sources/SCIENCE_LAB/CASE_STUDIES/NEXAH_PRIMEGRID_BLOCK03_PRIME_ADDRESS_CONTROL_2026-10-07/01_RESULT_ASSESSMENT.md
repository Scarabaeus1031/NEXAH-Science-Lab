# PRIMEGRID BLOCK 3 — Result assessment

Date: `2026-10-07`

Decision: `SUPPORTED_AS_REPRODUCIBLE_PRIME_SELECTOR_WITHOUT_CODING_ADVANTAGE`

## Result

All ten preregistered validity gates passed. The prime-selected address fields
have full cyclic orbits, exact complex DFT return and exact one-bit
nearest-codeword recovery. The frozen superiority conditions did not pass.

| Carrier | Minimum cyclic Hamming distance | One-bit accuracy | Two-bit accuracy | Two-bit ambiguity |
|---|---:|---:|---:|---:|
| N=8 prime `{2,3,5,7}` | 4 | 100% | 10.7143% | 89.2857% |
| N=8 non-prime complement `{0,1,4,6}` | 4 | 100% | 10.7143% | 89.2857% |
| N=16 prime `{2,3,5,7,11,13}` | 4 | 100% | 95% | 5% |
| best registered N=16 strict-composite control | 6 | 100% | 100% | 0% |

The time-domain Hamming decoder and complex-frequency nearest-shift decoder
agreed on every registered one- and two-bit error case.

## Exact control distributions

At N=8, all `C(8,4)=70` size-matched selections were enumerated:

```text
minimum distance 0:  6 selections
minimum distance 2: 16 selections
minimum distance 4: 48 selections
prime percentile:   1.0000
```

The prime field reaches the largest observed N=8 minimum distance, but its
non-prime complement has the identical complete utility score. Therefore the
result is not prime-specific.

At N=16, all `C(16,6)=8008` size-matched selections were enumerated:

```text
minimum distance 0:   56 selections
minimum distance 2:  144 selections
minimum distance 4: 3200 selections
minimum distance 6: 4608 selections
prime percentile: 0.424575
```

The N=16 prime field has minimum distance 4. Registered strict-composite
controls reach distance 6 with perfect one- and two-bit decoding. The prime
field therefore does not outperform the composite controls.

## Interpretation

The prime predicate is a valid deterministic address selector. Combined with
the existing cyclic-shift and full-complex-DFT contracts, it produces a
replayable finite codebook and exact uncorrupted return. That is the supported
result.

The selector does not supply an observed coding advantage. The strong N=8
performance is shared exactly by its complement, and the N=16 result is below
many size-matched alternatives. The DFT preserves the registered distances; it
does not create the gain.

## Frozen superiority conditions

| Condition | Result |
|---|---|
| full orbit and complex return | PASS |
| N=8 strictly beats non-prime complement | FAIL |
| N=16 strictly beats every strict-composite control | FAIL |
| minimum-distance percentile at least 0.95 at both sizes | FAIL |

## Reproducibility

```text
unit tests: 8/8 PASS
validity gates: 10/10 PASS
result SHA-256: 91463cc59b01978433bcf8aaa608a00b08c3339d7e5da917bbdc862c7e8c3af3
decision: SUPPORTED_AS_REPRODUCIBLE_PRIME_SELECTOR_WITHOUT_CODING_ADVANTAGE
```

## Claim ceiling

This is a finite address-selection and cyclic-code audit. It establishes no
physical light or kappa channel, optical transport, cryptographic security,
error-correcting superiority, prime optimality or asymptotic number-theoretic
law.

## Next admissible action

No automatic Block 4 follows. A successor may compare selector-design rules
under an independently chosen task, but it must treat primality as one frozen
baseline among equal-information controls rather than as a privileged
mechanism.
