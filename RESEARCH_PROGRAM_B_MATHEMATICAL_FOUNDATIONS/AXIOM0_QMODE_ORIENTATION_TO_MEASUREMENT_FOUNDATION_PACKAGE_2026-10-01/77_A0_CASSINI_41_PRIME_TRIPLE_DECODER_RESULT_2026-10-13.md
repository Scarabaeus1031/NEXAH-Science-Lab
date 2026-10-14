# Check 77 — Cassini / 41 Prime-Triple Decoder Result

Date: `2026-10-13`  
Study: `A0_CASSINI_41_PRIME_TRIPLE_DECODER_2026_10_13`  
Run: `A0_CASSINI_41_PRIME_TRIPLE_DECODER_RUN_001`  
Status: `VALIDATED_BOUNDED_FORMAL_DERIVATION / STOP REACHED / AWAITING_OWNER_DISPOSITION`

## Result

```text
EXACT_UNIQUE_PRIME_TRIPLE_DOUBLE_PATH_WITH_SATURATED_DECODER
```

The clarification is exact:

```text
P1*P2*P4 = 2*3*7 = 42.
```

Together with the lower neighbor, it produces two paths to `41`:

```text
upper:  P1*P2*P4 - 1          = 2*3*7 - 1      = 41
lower:  P2(P1*P2 + P4) + P1   = 3(2*3 + 7) + 2 = 41
```

Equivalently:

```text
42 = P1*P2*P4
39 = P2*P6 = P2(P1*P2+P4)
42-1 = 39+2 = 41.
```

## Cassini channel decoder

For `epsilon=(-1)^n`, the affine offset

```text
delta(epsilon)=(3epsilon-1)/2
```

gives:

```text
epsilon=+1 -> 41+delta = 42
epsilon=-1 -> 41+delta = 39.
```

Across `n=1..81`, the exact Cassini sequence therefore produces 40 occurrences
of `42` and 41 occurrences of `39`.

## Strong part: uniqueness inside the declared class

For strictly increasing primes `a<b<c`, impose

```text
abc-1 = b(ab+c)+a.
```

Rearrangement gives

```text
b(ac-ab-c)=a+1.
```

Thus `b` divides `a+1`. Since `a<b` are prime, this is possible only for
`a=2,b=3`. Substitution then gives `c=7`. Therefore `(2,3,7)`, or
`(P1,P2,P4)`, is the unique strictly increasing prime triple satisfying this
double-path equation. Exhaustive enumeration over the first 100 primes
independently returns the same single solution.

## Control reading

The uniqueness result is internal to the declared equation class. The class
itself was selected after observing the `39/41/42` relations. It therefore
does not yet establish external significance.

The Cassini decoder is also saturated: two chosen channel outputs determine
the two coefficients of an affine map exactly. Its zero residual is not an
independent success. What survives as the nontrivial formal result is the
prime-triple uniqueness of the double-path equation, not the fitted decoder.

## STOP

- exact 81-row Cassini replay: `PASS`;
- `P1*P2*P4=42`: `PASS`;
- lower factor/sum path to `39`: `PASS`;
- two returns to `41`: `PASS`;
- global uniqueness proof in declared prime class: `PASS`;
- first-100-prime enumeration: one solution;
- Navigator identity/relation change: `NONE`;
- claim promotion and publication: `NOT AUTHORIZED`.

The next informative test would have to freeze the double-path equation before
applying it to an unseen carrier or prime triple. That prospective holdout is
not executed here.
