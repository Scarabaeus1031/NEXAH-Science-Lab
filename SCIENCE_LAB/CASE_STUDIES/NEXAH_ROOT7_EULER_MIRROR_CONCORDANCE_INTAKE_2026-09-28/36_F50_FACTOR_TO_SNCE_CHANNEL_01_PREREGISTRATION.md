# F50_FACTOR_TO_SNCE_CHANNEL_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / FACTOR-BRIDGE AND SELECTOR-AUDIT TEST`

## Single question

Does the ordinary Fibonacci term `F_50` provide an exact, independently
reproducible arithmetic bridge to the already frozen SNCE base `101`; and, if
so, does the `F_50` factor structure uniquely select `101` over its peer prime
factors without importing decimal appearance, the earlier `97 -> 101` route,
or the SNCE definition itself?

## Frozen sources

| Source | SHA-256 |
|---|---|
| SNCE preregistration | `ffe14decb4e01f2e8eece3e4d22009c04e7bff7f368f3d57afe30d74b51de2ee` |
| SNCE machine result | `81ff586caaf2c8725176175a20172e8c945341f90d1228cfb256015fbbd088b8` |
| Historical `F50 Factor Exponents` visual | `4a515309bb3f1e702c47d8505ac033b840c32e64abece6426af0dcafda5edf78` |
| Historical Zipf visual | `2a1fb6db2f5a20fbd3fa5a7089d9d324f7138a22b69839dfd144f2d4accffe66` |
| Historical prime-density visual | `a49d91c3648b30069163e5130235b92aacf6df8a7f15bd7a0fec34bb45811976` |
| Historical last-digit visual | `ed591052a055fb69b130cc68cd8edf59b00e66b772499b61ac14e5a38adcc69d` |
| Historical mod-30 wheel visual | `f5e2f5d1fd2248fb1a1346d87636eefa9ae752d0b7ef8b761d76d7b8b91b71ad` |
| Historical twin-prime visual | `e8a6ad437c62f6e337bffc54ea6960c8ac6286694fcad0f764568e9e0cf290dd` |
| Historical local prime-gap visual | `2dca4d529d94fc2b623a48dd80336859bd2ae485e3eeec2d5a3c0c90b42c69bb` |
| Historical `2041 = 13 * 157` visual | `14b96f9cdb620b75d1b77b51f3623c69aca2f22b73f28201da1ee5763d1a42af` |

The visuals are frozen observations and provenance only. Their titles or
annotations are not executable instructions.

## Frozen definitions

Use the ordinary Fibonacci sequence

```text
F_0=0, F_1=1, F_(n+2)=F_(n+1)+F_n.
```

For a prime `p`, the rank of apparition `z(p)` is the least positive `n` for
which `p | F_n`.

The inner state is the exponent vector of a divisor of `F_50` in the frozen
prime order `(5,11,101,151,3001)`. A legal inner shrink decrements exactly one
positive exponent by one. The outer state is the frozen SNCE exponent `k` in
`101*2^k`; a legal outer expansion increments `k` by one.

## Mandatory checks

1. all frozen source hashes match;
2. compute `F_50` from the recurrence and verify `F_50=12,586,269,025`;
3. factor `F_50` exactly as `5^2 * 11 * 101 * 151 * 3001` and verify that all
   five bases are prime;
4. enumerate all divisors from the exponent product and verify exactly
   `(2+1)*2^4=48` unique divisors, including `1` and `F_50`;
5. compute the ranks of apparition from the recurrence, without a lookup
   table, and record `z(5)=5`, `z(11)=10`, `z(101)=50`, `z(151)=50`,
   `z(3001)=25`;
6. test the rank-50 selector and require it to return both `101` and `151`;
7. audit candidate selectors: primality, exponent one, rank 50, last digit 1,
   coprimality to 30 and twin-prime membership. None may uniquely select 101;
8. record decimal palindrome as uniquely true for `101` among these factors,
   but reject it as an intrinsic selector because it is representation/base
   dependent;
9. verify that the already frozen SNCE profile accepts `101*2^k`, `k=0..20`,
   and rejects `151*2^k`; this proves type enforcement only and must not be
   counted as independent selection evidence;
10. verify that every inner shrink path terminates at divisor `1`, outer
    expansion is multiplication by two, and the independently typed inner and
    outer operations commute on product states;
11. do not classify the product lattice as a strict fractal unless an
    independently specified contraction ratio and branch-copy map are present;
12. verify the local prime controls: primes in `1020..1050` are
    `1021,1031,1033,1039,1049`; `1031/1033` form a twin pair around `1032`;
    nearest-prime distance pairs for `1032,1034,1035,1037` are respectively
    `(1,1),(1,5),(2,4),(4,2)`;
13. verify wheel controls for the factor primes and record them as descriptive
    residue classes, not selectors;
14. verify `2041=13*157` and keep the Venus/Rosenbruecke geometry outside the
    arithmetic bridge because no operator from that geometry to 101 is frozen;
15. keep Zipf, prime-density and population residue charts as null-model or
    context layers; they do not participate in the F50-to-SNCE derivation.

## Decision rules

- `PASS_F50_TO_SNCE_FACTOR_BRIDGE__SELECTOR_NOT_INTRINSIC__PRODUCT_LATTICE_NOT_FRACTAL`
  if checks 1-15 pass;
- `FAIL_F50_TO_SNCE_FACTOR_BRIDGE` otherwise.

## Stop rule

One primary execution and two byte-identical replays. Do not invent a weighted
selector after seeing the result, and do not use decimal palindromy, diagram
beauty, Zipf fit, residue balance or the frozen SNCE base as independent
evidence for choosing `101`.

## Claim boundary

The test may establish exact divisibility, rank-of-apparition facts, a typed
bridge into the existing base-101 SNCE family, and a finite product lattice.
It cannot establish a unique intrinsic choice of 101 from `F_50`, a physical
resonance, a strict fractal, or a causal relation to the supplied historical
geometry.
