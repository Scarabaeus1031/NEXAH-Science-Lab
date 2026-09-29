# F50_FACTOR_TO_SNCE_CHANNEL_01 result report

Date: `2026-09-29`

## Result

```text
FAIL_F50_TO_SNCE_FACTOR_BRIDGE
```

The frozen suite passed `14/15` checks. The primary result and both replays
are byte-identical.

This is a useful preregistered failure, not a failure of the central arithmetic
identity. The exact factor bridge passed; one anticipated selector property
was false.

## Exact bridge established

The ordinary Fibonacci recurrence gives

```text
F_50 = 12,586,269,025
     = 5^2 * 11 * 101 * 151 * 3001.
```

The ranks of apparition computed directly from the recurrence are

```text
z(5)=5, z(11)=10, z(101)=50, z(151)=50, z(3001)=25.
```

Therefore `101` is an exact factor of `F_50`, but rank 50 does not uniquely
select it: `151` is an equal rank-50 peer.

## Selector audit

None of the frozen intrinsic candidates uniquely selected `101`:

- primality: all five factors;
- exponent one: `11,101,151,3001`;
- rank 50: `101,151`;
- last digit one: `11,101,151,3001`;
- coprime to 30: `11,101,151,3001`;
- twin-prime membership: all five factors.

The preregistered expectation that decimal palindromy uniquely selected `101`
was falsified. In base 10, `5`, `11`, `101` and `151` are palindromes. Even a
unique decimal property would remain representation-dependent and unsuitable
as an intrinsic selector.

## Inner and outer staircase

The factor exponents generate exactly `48` divisors:

```text
(2+1)(1+1)^4 = 48.
```

Decrementing one positive exponent gives a finite inner shrinking lattice with
unique sink `1` and maximum path length `6`. Independently, the frozen SNCE
outer channel expands by

```text
101*2^k -> 101*2^(k+1).
```

The two typed operations commute on their product states. This supports the
"inner staircase / outer staircase" description. It does not yet satisfy a
strict fractal definition: no independently specified contraction ratio or
branch-copy map is present.

## SNCE boundary

The frozen SNCE predicate accepts all tested `101*2^k`, `k=0..20`, and rejects
all corresponding `151*2^k` controls. This confirms base-101 type enforcement;
it is not independent evidence for choosing 101 from the `F_50` factors.

## Added visual controls

- The local primes in `1020..1050` are exactly
  `1021,1031,1033,1039,1049`.
- `1031` and `1033` form the exact twin-prime hinge around `1032`.
- Nearest-prime distance pairs for `1032,1034,1035,1037` are
  `(1,1),(1,5),(2,4),(4,2)`.
- Mod-6, mod-30, last-digit, Zipf, prime-density and twin-prime population
  views are retained as descriptive/null-model layers. They do not select 101.
- `2041=13*157` is exact. The supplied Rosenbruecke/Venus geometry has no
  frozen operator connecting it to the F50-to-SNCE bridge.

## Portfolio effect

The result sharpens rather than discards the proposed architecture:

```text
Fibonacci F_50
  -> exact factor set containing 101
  -> external typed choice of base 101
  -> SNCE outer dyadic channel.
```

The word `external` is essential. The earlier independent `97 -> 101` route
may motivate the type choice, but this test did not import it as an intrinsic
property of `F_50`.

## Reproducibility

- preregistration: `36_F50_FACTOR_TO_SNCE_CHANNEL_01_PREREGISTRATION.md`
- lock: `F50_FACTOR_TO_SNCE_CHANNEL_01_PREREGISTRATION_LOCK.json`
- runner: `run_f50_factor_to_snce_channel_01.js`
- execution log: `F50_FACTOR_TO_SNCE_CHANNEL_01_EXECUTION_LOG.md`
- machine result: `f50_factor_to_snce_channel_01_results.json`
- visual instrument: `F50_FACTOR_TO_SNCE_CHANNEL_01.html`

Machine-result SHA-256:

```text
7618d275f5eb7b28e4296fb65b630cf0c95a184f217c09e0833993341eb7379a
```

## Claim boundary

Exact `F_50` factor bridge and finite product lattice only. No unique intrinsic
101 selector, strict fractal, physical resonance or geometric causal bridge.
