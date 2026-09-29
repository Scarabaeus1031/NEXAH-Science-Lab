# 64/37 Nexus Selector 01 — result report

Date: `2026-09-29`

Decision: `PASS / MULTI_PATH_SELECTOR_CONTRACT_BOUND`

Tests: `8/8 PASS`

## Result

The formerly external `101` carrier now has one bounded, deterministic
selection contract. Three declared routes converge exactly:

```text
decimal boundary:  next_prime(99) = 101
prime hinge:       upper endpoint of 97–99–101 = 101
Nexus route:       64 + P_12 = 64 + 37 = 101
```

The routes are arithmetic cross-checks, not independent statistical samples.
The test does not claim that `F_50` intrinsically selects `101`; it supplies a
separate typed selector before the `F_50` compatibility view is consulted.

## Prior binding of 37

Complete enumeration of two-digit primes found these value/index mirror hits:

```text
11=P_5  -> 11=P_5   (palindromic fixed point)
37=P_12 -> 73=P_21
73=P_21 -> 37=P_12
```

After excluding the fixed point, `{37,73}` is the only unordered two-digit
pair for which both decimal value and one-based prime index reverse. This is
the finite prior-binding property used by the contract.

## Nexus triad and checksum

```text
64+37=101=P_26
64+63=127=P_31=2^7-1
64+73=137=P_33

3*64=192
37+63+73=173=P_40
101+127+137=365=192+173
```

The Nexus triad `[101,127,137]` is nonconsecutive. It is explicitly distinct
from the consecutive-prime control `[127,131,137]=[P_31,P_32,P_33]`; their
intersection is exactly `[127,137]`.

`365` is retained only as an exact checksum and common-year mnemonic. It is
not a physical or cosmological constant and not a universal calendar
invariant.

## Negative controls

### Arbitrary residual

There are 20 values `r` in `1..99` for which `64+r` is prime. Therefore the
bare form `64+r` is underdetermined. The selector depends on the preregistered
value/index mirror binding of `37`; it is not justified merely because the
sum happens to be prime.

### Mirror squares

```text
37^2+64^2=1369+4096=5465
73^2+46^2=5329+2116=7445
```

The sums are unequal. Digit reversal is reversible, but this quadratic
checksum is not invariant. The earlier equality wording is rejected.

## Disposition

```text
FORMER: MISSING_SELECTION_CONTRACT
NOW:    SELECTOR_CONTRACT_PRESENT / MULTI_PATH_BOUND / 8_OF_8_PASS
```

The state-update question and optional Poincare curve-family comparison remain
parked. This result creates no `RR-050`, capability, platform, Active Queue
row or physical/information-theoretic claim.

## Claim ceiling

`FINITE_INTEGER_MULTI_PATH_SELECTOR / NO_PHYSICAL_INFORMATION_THEORETIC_OR_UNIVERSAL_CALENDAR_CLAIM`
