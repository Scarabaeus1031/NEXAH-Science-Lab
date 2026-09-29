# SNCE_101_PARITY_PROFILE_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / LOSSLESS REPARAMETERIZATION TEST`

## Single question

Can the already verified carrier family

```text
c_k = 101 * 2^k,  k = 0..20
```

be represented losslessly by a typed SNCE pipeline
`Start -> Norm -> Code -> Expand`, with the exponent separated into even and
odd channels, without importing 404-gate, NCS292, SCN or digit-substring
semantics?

## Frozen sources

| Source | SHA-256 |
|---|---|
| Composite-G preregistered contract | `703308d68b779c63d75c6d35a289c02d164d29c2becbc4ee4250bf67dbb26a8c` |
| Composite-G machine result | `8ed8457d77d062f2ea237c3df4d0ddd3e3eb8c3903e25d2fcabae04893c6df0f` |
| Operator-collision contract | `dc5049dbb33508e12ee9bf4d834c74b3f6a4bfa690c79fd941aa4ceeb2005a8b` |
| Operator-collision machine result | `0f587856b9107042f7d1245599b9e69cfc5d1e6f5d535182840a868f74385fde` |
| Operator-collision addendum | `973e365b353820bb4d3d2611e2ab65f5839fe1f945337dcb0f4a2d9fcab80f51` |
| User-supplied historical `444 Resonance Track` image | `a0d9396df0b5db7e25ac05cff54181f55ed5b454825d28f021aa8599d0dbf808` |

## Frozen SNCE profile

For a positive integer carrier `c`:

```text
Start(c)  = immutable integer c
Norm(c)   = q = c / 101
Code(q)   = (u, epsilon), where q=2^k, k=2u+epsilon,
            u is a nonnegative integer and epsilon is 0 or 1
Expand(u,epsilon) = 101 * 4^u * 2^epsilon
Mirror(c) = (-c, 0, +c)
```

`Norm` rejects carriers not divisible by 101. `Code` rejects quotients that
are not positive integral powers of two. `Expand` rejects malformed codes.

The even channel is `epsilon=0`; the odd channel is `epsilon=1`.

## Mandatory checks

1. all frozen source hashes match;
2. all 21 carriers for `k=0..20` pass `Expand(Code(Norm(Start(c))))=c`;
3. all codes are unique and decode to exactly one tested carrier;
4. even and odd codes partition the domain completely and exclusively;
5. each same-parity channel advances by factor four;
6. the interleaved carrier sequence advances by factor two;
7. the mirror expansion is exactly `(-c,0,+c)` and is centered at zero;
8. `404` is encoded as carrier code `(u=1,epsilon=0)` without acquiring the
   independently typed `G404(a,b)` regulator-gate semantics;
9. `1212`, `303`, `292`, `12929`, `0`, `-101`, `110`, `220`, `550` and the
   control family `97*2^k` are rejected by the 101-dyadic profile;
10. malformed codes (`u<0`, nonintegral `u`, `epsilon` outside `{0,1}`) are rejected;
11. `12928` is recorded as `k=7`, `(u=3,epsilon=1)` and roundtrips exactly;
12. the decimal substring observation `12928 = "1"|"292"|"8"` is recorded
    separately, while the arithmetic control `12928 mod 292 = 80` prevents
    promotion to numeric equality or divisibility;
13. `1212` remains an additive/midpoint record outside the pure SNCE profile;
14. the old visual labels `444 -> 4.44 -> 74 -> 4774` are recorded as an
    unevaluated legacy trace because the image supplies values but no typed
    functions connecting all four stages.

## Decision rules

- `PASS_SNCE_101_PARITY_PROFILE__LOSSLESS_REPARAMETERIZATION_ONLY` if all
  fourteen checks pass;
- `FAIL_SNCE_101_PARITY_PROFILE` otherwise.

## Stop rule

One primary execution and two byte-identical replays. Do not fit a 444 rule,
promote the `292` substring, or add another carrier base after execution.

## Claim boundary

SNCE is tested here only as a reversible encoding of the already verified
`101*2^k` family. It is not a predictor, physical resonance, SCN/NCS switch,
404 gate input, decimal-mirror law or proof that the historical 444 track used
the reconstructed operations discussed after the image was supplied.
