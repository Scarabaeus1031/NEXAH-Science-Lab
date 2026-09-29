# Corrected 11357 / QRT carrier-family connection

Date: `2026-09-28`

Classification:

`CORRECTED_11357_CARRIER_FAMILY_CONFIRMED_QRT_SINGLE_CARRIER_IDENTITY_REJECTED`

## Correction

The former terminal state `11735` / `11|735` is withdrawn as a transcription
error. The Human Owner-confirmed sequence is:

```text
11537 -> 11573 -> 11357
```

## Two exact cut views

The same five-digit records admit two lossless decimal views:

```text
2+3: 11|537 -> 11|573 -> 11|357
3+2: 115|37 -> 115|73 -> 113|57
```

Both cuts reconstruct the original integers exactly. They are quotient/remainder
decimal decompositions, not automatically CRT coordinates.

## Carrier family versus carrier identity

All three integers share the sorted digit multiset `11357` and digit sum `17`.
That is an exact carrier-family relation. QRT nevertheless keeps the integer
carrier distinct from its representation:

```text
11537 = 20*576 + 17
11573 = 20*578 + 13
11357 = 20*567 + 17
```

The path therefore leaves the existing `r=17` carrier column through `r=13`
and returns to `r=17`. Its grid-coordinate deltas are `(+2,-4)` followed by
`(-11,+4)`; the net endpoint displacement is `(-9,0)`.

The controlling CRT fingerprints modulo `(7,11,13,19)` are also distinct:

```text
11537 -> (1,9,6,4)
11573 -> (2,1,3,2)
11357 -> (3,5,8,14)
```

Thus this is one digit-permutation family containing three carriers, not one
carrier shown in three formats. For the actual QRT Format Elevator, changing
the paper or cut lens preserves the selected carrier and its numeric address.

## QRT-to-Janus connection

The wider controlling `r=17` QRT column is exact:

```text
10537, 11357, 11537, 12537, 14357.
```

Within it, `11357` and `12537` differ by `1180 = 59*20`, so the Janus pair is
also a vertical QRT translation with address delta `(+59,0)`. Simultaneously:

```text
11357 <-> 12537 around 11947, radius 590
11947 = 13*919
11357 mod 13 = 8, 12537 mod 13 = 5, 8+5 = 0 mod 13.
```

The nested `12555` relation is a second center, not the same mirror:

```text
11357 <-> 13753  radius 1198
12537 <-> 12573  radius 18
12543 <-> 12567  radius 12
12549 <-> 12561  radius 6
12555 <-> 12555  fixed point.
```

The seven-state ladder `12555+6k`, `-3<=k<=3`, and the translation
`12321+18m` for `m=12,13,14` both reproduce their displayed values exactly.
The shared nodes connect the records; the different centers and step sizes
keep their operators typed.

## Relation to counter-rotation

The corrected `2+3` sequence still rejects one fixed suffix operator. Its two
steps require different `D3` actions. The correction changes the second action
and terminal state, but not the boundary conclusion that a phase/operator label
is required for replay.

The corrected actions are `ref:2` followed by `rot:2`.

## Reproducibility

Three consecutive executions produced the same result:

```text
checks:          22/22 passed
result SHA-256:  12ffd6da2b59022dcd542c02d2c88b8bbcf0468db1e69d912fdb49f66aaaecf2
scientific hash: d0ec361eea9a7ca4ba508e6bff9b7001820734be9217c0f814cc3140c700bae8
```

## Boundary

Exact arithmetic and representation grammar only. No generator provenance,
physical format effect, resonance, Möbius topology or new NEXAH capability.
