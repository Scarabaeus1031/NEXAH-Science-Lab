# SNCE_101_PARITY_PROFILE_01 result report

Date: `2026-09-29`

## Result

```text
PASS_SNCE_101_PARITY_PROFILE__LOSSLESS_REPARAMETERIZATION_ONLY
```

All `14/14` preregistered checks passed. The primary result and both replays
are byte-identical.

## Exact profile

The tested SNCE profile is:

```text
Start(c)  = immutable positive integer c
Norm(c)   = q = c / 101
Code(q)   = (u,epsilon), q=2^k and k=2u+epsilon
Expand    = 101 * 4^u * 2^epsilon
Mirror    = (-c,0,+c)
```

This is a reversible encoding of the already verified family `101*2^k`.
Across `k=0..20`, all 21 carriers roundtrip exactly.

## Two channels

The code separates the ladder into two interleaved factor-four channels:

```text
epsilon=0 / EVEN:
101 -> 404 -> 1616 -> 6464 -> 25856 -> ...

epsilon=1 / ODD:
202 -> 808 -> 3232 -> 12928 -> 51712 -> ...
```

Reading the channels alternately reconstructs the factor-two ladder. No value
is lost, duplicated or ambiguously decoded.

## Typed boundaries retained

- Carrier `404` has code `(u=1,epsilon=0)`. This does not import the separate
  regulator predicate `G404(a,b)`.
- `1212` is rejected by the dyadic profile. It remains the additive midpoint
  `3*404=(808+1616)/2`.
- `12928` has code `(u=3,epsilon=1)` and roundtrips exactly.
- The segmentation `12928 = 1|292|8` is recorded as `DIGIT_SUBSTRING_ONLY`.
  Numerically `12928 mod 292 = 80`; it is neither equality nor divisibility.
- `110`, `220` and `550` are rejected here. They may form a separate base-110
  SNCE profile, but were not imported after seeing this result.
- The `97*2^k` control family is rejected, preserving the base-101 type.

## Historical 444 trace

The supplied older image visibly gives

```text
444 -> 4.44 -> 74 -> 4774.
```

It does not give typed functions connecting all four values. Therefore this
test records it as `UNMODELED_LEGACY_TRACE`; it does not fit the plausible
post-hoc operations `/100`, `/6` and decimal concatenation into the historical
source.

## Portfolio effect

SNCE is now a tested profile vocabulary rather than a new research family:

```text
carrier family
  -> normalized quotient
  -> discrete channel code
  -> exact reconstruction / mirror frame.
```

The result compresses the dyadic ladder into a common runtime description. It
does not make SNCE predictive and does not close SCN/NCS, 404-gate or re-feed
bridges.

## Reproducibility

- preregistration: `34_SNCE_101_PARITY_PROFILE_01_PREREGISTRATION.md`
- lock: `SNCE_101_PARITY_PROFILE_01_PREREGISTRATION_LOCK.json`
- runner: `run_snce_101_parity_profile_01.js`
- execution log: `SNCE_101_PARITY_PROFILE_01_EXECUTION_LOG.md`
- machine result: `snce_101_parity_profile_01_results.json`

Machine-result SHA-256:

```text
81ff586caaf2c8725176175a20172e8c945341f90d1228cfb256015fbbd088b8
```

## Claim boundary

Lossless encoding of `101*2^k` only. No prediction, physical resonance,
SCN/NCS switch, 404 gate bridge, decimal law or recovered 444 mechanism.
