# Mirror–Carry and `1459/1471` residual addendum

Date: `2026-09-28`

Classification: `TYPED_MIRROR_FAMILY_CONFIRMED_PHASE_IDENTITY_REJECTED`

## Mirror family

Across all 665 states in bases 2 through 36:

```text
Q_B(z) = -z mod B
R_B(z) = B-1-z
Q_B^2 = R_B^2 = id
R_B = Q_B o T_1.
```

`Q_B` has one fixed state in odd bases and two in even bases. `R_B` has one
fixed state in odd bases and none in even bases. An integer translation
conjugates the two reflections exactly in odd bases. In even bases the missing
integer solution is the already registered half-step/0.5 boundary.

For raw radix complement `B-z`, exactly `z=0` emits carry one. The carrier
`101` therefore separates three typed outcomes:

```text
Q_10:             101 -> 101
R_10:             101 -> 191
raw 10-z + carry: 101 -> 201.
```

Fixed-width bit reversal remains a different representation operator:
`41 <-> 37` requires width six, and dropping width can destroy the return.

## The terminal error as a two-coordinate residual

The exact correction is:

```text
observed: 1459 = P232
expected: 1471 = P233
```

Using `observed minus expected`, the residual vector is:

```text
(Delta value, Delta prime-index) = (-12,-1).
```

The correction vector is `(+12,+1)`. If one newly normalizes the signed index
step by the positive gap magnitude 12, these orientations can be written
`-1/12` and `+1/12`. That notation is valid only for this explicitly declared
two-coordinate slope.

It is **not** the already registered Root7 `c12` phase tick:

```text
1459 mod 12 = 7
1471 mod 12 = 7.
```

The value correction `+12` is one complete mod-12 turn and is therefore
invisible in the `c12` lens. Under the `c112` lens:

```text
1459 mod 112 = 3
1471 mod 112 = 15,
```

so the correction is `+12/112`, not `+1/112`. There is no direct identity with
the existing microtick.

This is nevertheless a useful NEXAH result: the prime-index layer detects a
one-step error that the mod-12 phase lens erases. It is a concrete information-
loss example, not a new Draft/Drift law.

## Pair aggregate

```text
1459+1471 = 2930
232+233 = 465
midpoint = 1465
2930 = 10*293
1465 = 5*293
P465 = 3307, not 2930.
```

Thus `(2930,465)` is a valid value-sum/index-sum record. Writing `2930=P465`
would be false. Gap 12 also occurs repeatedly among ordinary consecutive
primes in the registered frequency control, so the gap itself is not unique.

The frozen first-10,000-prime control produced an initially striking exact
count:

```text
gap 12 count = 1008 among 9999 adjacent gaps
fraction = 0.100810081...
```

This `1008` is retained as a bounded exact observation because 1008 is already
present in the connected intake family. It is not promoted to a generator:
the prime-prefix cutoff is an analysis boundary, the fraction is about 10.1%,
and the post-hoc neighboring-cutoff control shows a plateau rather than a
unique hit. The count is already 1008 at prefix 9990, remains 1008 through
prefix 10001, then becomes 1010 at prefix 10010. See
`04_GAP12_CUTOFF_SENSITIVITY.csv`.

## Decision

The Mirror–Carry family is confirmed only when base, phase, width and carry are
part of the operator type. The `1459/1471` defect may be labelled
Draft/Drift only as correction/error orientation under a newly declared slope;
it is not the existing Root7 `1/12` or `1/112` phase operator.

No new theory, prime law, physics, capability or active research follows.

## Reproducibility

- checks: `18/18 PASS`;
- primary and clean-rerun results SHA-256:
  `6ff3e116bb6b952fee49e7aade01855b231c91cf1694d6334136da096156e019`;
- scientific hash:
  `f5e87d128d839582ff5d3209e1a8b2aba14906905811f6e8dfc836960dbf5d84`;
- replay: `IDENTICAL`.
