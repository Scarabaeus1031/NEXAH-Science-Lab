# Frozen Arithmetic Contract

Frozen before numerical execution on 2026-08-23.

```text
a = 41
b = 74
n = 17
forward_difference = a - b
mirror_difference  = b - a
canonical_mod(x,n) = x % n in {0,...,n-1}
```

`signed_residue(x,n)` starts from canonical residue `r`. If `r > n/2`, return `r-n`; otherwise return `r`. For even `n` at the exact half-cycle tie `r=n/2`, the positive representative is retained. Thus modulus 2 returns signed `+1`, not `-1`.

Calibration must yield:

```text
41 - 74 = -33
74 - 41 =  33
canonical_mod(-33,17) = 1
canonical_mod( 33,17) = 16
signed_residue(-33,17) = +1
signed_residue( 33,17) = -1
33 = 2*17 - 1
34 = 2*17
```

## Frozen controls

- Neighbor matrix: `a'={39,40,41,42,43}`, `b'={72,73,74,75,76}`, `n=17`; all 25 ordered pairs.
- Modulus sweep: fixed difference `-33`, every integer `n=2..40`.
- Archive set: the exact delimited retrospective list at report line 2019, frozen as `{3,6,9,12,17,24,29,33,41,48,96,137,1836}`. It is P2 retrospective evidence, not contemporaneous authority. Evaluate 156 unequal ordered pairs across 39 moduli (6,084 tests).
- Random control: 5,000 deterministic sets; each contains 13 unique integers sampled uniformly without replacement from `3..1836`; ordered unequal pairs; moduli `2..40`; seed `330117`.
- Fixed-modulus match: signed residue `+1` at preregistered `n=17`.
- Post-hoc-modulus match: at least one `n∈2..40` gives signed residue `+1` after the pair is known.
- Raw rate: matching ordered pairs divided by all ordered pairs.
- Search-adjusted descriptive rate: fraction of 13-number sets containing at least one matching ordered pair after the declared pair/modulus search. This is not a p-value.

## Mirror operations

This lab tests only **subtraction reversal**: `(a,b) -> (b,a)`. It does not identify that operation with coordinate reflection, image mirroring, graph reversal, or historical traversal reversal.

## Decision gate

`A_ARCHIVE_SUPPORTED_SELECTIVE_RETURN_OPERATOR` requires independent historical coupling, independently fixed modulus 17, selective controls, and recoverable cycle semantics. Otherwise choose exactly one of B–E according to the supplied category definitions. No result may be promoted through arithmetic exactness alone.

Required null statement:

> For any integers a and b, a modulus can often be selected after the fact to produce a small desired residue. Exact congruence alone is therefore not evidence of a privileged historical structure.
