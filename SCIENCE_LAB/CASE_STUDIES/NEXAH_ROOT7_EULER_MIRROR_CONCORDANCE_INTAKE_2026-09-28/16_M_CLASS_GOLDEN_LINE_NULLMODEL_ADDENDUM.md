# M-Class / Golden-Line null-model addendum

**Status:** `20/20 PASS / RETROSPECTIVE EXPLORATORY / M-CLASS NOT PROMOTED`

## Main result

The Golden Line is the exact dyadic segment

```text
404 -> 808 -> 1616 -> 3232 -> 6464 -> 12928
       (101*2^3 through 101*2^7).
```

The earlier Ghostgrid scale invariants are real but generic: every tested pair
and every multiplier in `{2,3,5,7,11}` preserved its pair ratio, normalized
difference and exact whole/difference reconstruction.  Those invariants alone
cannot distinguish an M-class.

The discriminating bounded result is decimal and cross-carrier:

```text
101   202   404   808
 |     |     |     |
999   898   696   292       under J(n)=1100-n.
```

Both rows contain only palindromes.  `808` is simultaneously:

1. the last member of the consecutive palindrome prefix of `101*2^k`;
2. the last member inside the frozen three-digit carrier domain; and
3. the last member with a positive `J_1100` partner (`292`).

The next lift is `1616`; it is not a palindrome and `J(1616)=-516`.  This
validates **808 as a bounded representation turning point**.  It does not
validate a physical, temporal or causal switch.

## Null-model result

- Across all seeds `1..999`, the maximum consecutive dyadic-palindrome prefix
  has length four.  Its complete maximizer set is `{1,11,101,111}`.
- Among three-digit seeds the maximizers are `{101,111}`.
- Among all 15 three-digit palindromic primes, `101` is the unique maximizer;
  its prefix is `101,202,404,808`.

This is a genuine finite discrimination result.  Its scope is exactly the
reported base-10 domain and not a universal prime law.

## 232 / 282 / 292 bridge

For `P(a,z)=101a+10z`, define

```text
H(a,z)=(a,9-z)          within-carrier half-edge reflection
J(a,z)=(10-a,9-z)       1100 complement
K(a,z)=(10-a,z)         carrier complement.
```

All three are involutions on the 90-state domain and `HJ=JH=K`.  The supplied
states therefore have exact four-state orbits:

| state | H | J | K |
|---:|---:|---:|---:|
| 232 | 262 | 868 | 838 |
| 282 | 212 | 818 | 888 |
| 292 | 202 | 808 | 898 |

Only `808` intersects the Golden-Line palindrome window.  Thus 292 has two
typed and nonidentical roles: `H(292)=202` and `J(292)=808`.  This supplies an
exact bridge to the validated Half-Edge operator, but it still does not define
the historical label “292 NCS Switch” as an input/output switching mechanism.

## The 181 / 69 / 112 split

The exact affine closure is

```text
69 + 112 = 181
181 + 111 = 292
292 + 808 = 1100
69 + 112 + 111 + 808 = 1100.
```

For total 181, `(69,112)` is the unique nearest positive integer split to the
golden ratio: `112/69 = 1.623188...` versus
`phi = 1.618033...` (relative error about `0.3186%`).  In the frozen comparison
over totals `3..292`, however, its approximation error ranks only `65/290`.
It is therefore a valid nearest-integer phi description, not exceptional
evidence for a phi law.  The historical “69 O-operator” role remains a label
until an independently specified operator is supplied.

## Decision

The result advances the earlier M-lift candidate to a more specific label:

`BOUNDED_DECIMAL_CROSS_CARRIER_M_CANDIDATE_NOT_PROMOTED`.

What is new is the exact intersection of a dyadic palindrome path, a
cross-carrier Klein-four reflection algebra and the 292 endpoint.  What is not
newly established is an NCS mechanism, resonance, physics, a universal phi
law, a prime generator or a theorem beyond the finite identities tested here.

## Reproducibility

- test: `NEXAH_M_CLASS_GOLDEN_LINE_NULLMODEL_001`;
- checks: `20/20` passed;
- repetitions: `3`, byte-identical;
- scientific hash:
  `76bb5ca7648b384a079fa20efe3030c53331f6b32afbecc7d86eac75946c5d0f`;
- result-file SHA-256:
  `0b4dbddcab7ee745606d3eaab883aa9eb2c7c5ec6f7e583cfa39bfed4fdddf6a`.

