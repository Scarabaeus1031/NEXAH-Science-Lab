# A0 Primecube · Gap Fold Contract

Status: `SOURCE_BOUND_ENGINEERING_VIEW / NOT_ACTIVE / NO_ADMISSION`
Date: `2026-11-21`
Surface: `A0_PRIMECUBE_GAP_FOLD_LAB.html`
Reuses: `MOD:NUMBER_VIEW_SUITE`, `ART:A0:MATHEMATICAL_JOINTS`,
`A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1`

## Question

Can the integers `1..1111`, their prime constellations and the twin-cluster
gap between the pairs `(659,661)` and `(809,811)` be compared through one 2D
matrix, one exact 3D address carrier and one explicitly view-only fold without
collapsing number, address, projection and mechanism?

Can the same source number also address a Root Ruler without confusing an
exact radical expression with its floating-point display?

## Frozen carrier

The carrier is the complete ordered set

```text
N = {1,2,...,1111}.
```

Prime status is calculated by an exact finite sieve. Prime position is the
one-based index in the ordered prime sequence. A superprime is a prime whose
prime position is itself prime.

The accepted constellation definitions are:

```text
twin       = (p,p+2)
triplet A  = (p,p+2,p+6)
triplet B  = (p,p+4,p+6)
quadruplet = (p,p+2,p+6,p+8).
```

For the frozen population the exact counts are:

| Object | Count |
|---|---:|
| primes | 186 |
| twin pairs | 40 |
| triplets | 32 |
| quadruplets | 5 |
| superprimes | 42 |

The five quadruplets are `(5,7,11,13)`, `(11,13,17,19)`,
`(101,103,107,109)`, `(191,193,197,199)` and `(821,823,827,829)`.
The supplied narrative's `21` triplets and `6` quadruplets are therefore not
retained.

## Address and Return

The 3D carrier is a declared row-major `11×11×10` address box:

```text
x = (n-1) mod 11
y = floor((n-1)/11) mod 11
z = floor((n-1)/121)
n = 1 + x + 11y + 121z.
```

It is injective on `1..1111`. The displayed ten-layer address box has `1210`
cells and an unused tail of `99`; the completed `11³=1331` cube would have
`220` unused cells. The 2D matrix uses 37 columns and retains `n` as its
source key. Rotation and perspective are display operations. Return is by the
retained source number and exact cube address, never by screen coordinates.

## 11² layer-closure overlay

The nine complete-layer terminals are

```text
121, 242, 363, 484, 605, 726, 847, 968, 1089.
```

They are exactly `m·121` for `m=1..9` and occupy `[10,10,z]` for `z=0..8`.
All nine are guaranteed composite by the explicit factor `11²`; this makes
them structural negative controls rather than prime events. The square
closures are exactly `121=11²`, `484=22²` and `1089=33²`.

The registers remain typed and separate:

- the matrix address uses 37 columns;
- `n mod 30` is a residue record;
- the cube address uses `n−1` in Base 11;
- the displayed decimal reversal or palindrome reading is optional metadata.

For example, `726=600₁₁`, while its zero-based address value is
`725=5AA₁₁`, hence cube address `[10,10,5]`. `363=300₁₁`; it is a decimal
palindrome but not a Base-11 palindrome.

## RDMH provenance lane

The centre label reuses the historical source reading
`RDMH → ROM–MH (Mutterraum)` and its vertical-polarity display role. The
calendar string `29.02.1972` is independently valid under the proleptic
Gregorian rule and carries the historical source role `R / Handle`.

No mapping from the date to `RDMH` is asserted. `RDMH`, `DA–MA` and the date
remain `HOLD_OPEN_IDENTITY_NO_OPERATOR`: provenance and navigation labels,
not a numerical, physical or temporal operator.

## Gap and fold

`661→809` is not a prime gap. Eighteen primes lie strictly between the two
twin-cluster anchors. It is a **twin-cluster gap**: no twin pair occurs between
the endpoint pairs `(659,661)` and `(809,811)`.

The fold is a declared visualization. For `n≤661` the fold phase is zero; for
`661<n<809` it increases linearly; for `n≥809` it reaches the selected maximum
angle. This transformation is useful for comparing before/interior/after
records, but it is not an intrinsic prime operation or physical hinge.

## Transition record 659 / 661

The left anchor has the following verified finite properties:

```text
(659,661) = twin pair #30
p_120 = 659
p_121 = 661
660 = 2²·3·5·11 = 6·110 = 11·60
661 = 551_11
661−1 = 660 = 550_11 → [0,5,5]
661 mod 37 = 809 mod 37 = 32
809−661 = 148 = 4·37
```

The interval to the next twin pair `(809,811)` is the longest twin-cluster
gap in the frozen carrier through 1111. The statement `p_121=661` belongs to
the prime-index register. It is not the same object as carrier value `121`,
even though index `121=11²` is an exact square seam.

## Two non-identical fold contracts

The existing distributed gap fold and the new rigid 661 hinge are retained as
different views.

### Distributed gap fold

The angle grows from zero at 661 to the selected maximum at 809 and rotates
the declared `x/z` display section around the carrier centre. It compares
before/interior/after records along the twin-cluster gap.

### Rigid 661 hinge

Map cube coordinates into the normalized carrier:

```text
u_x = 2x/10 − 1
u_y = 2y/10 − 1
u_z = 2z/9 − 1
h_0 = 1/9.
```

For `n<661` the source coordinate is fixed. For `n≥661`, rotate rigidly around
the `u_x`-parallel axis `u_y=0, u_z=h_0`:

```text
u_x' = u_x
u_y' = u_y cos θ + (u_z−h_0) sin θ
u_z' = h_0 − u_y sin θ + (u_z−h_0) cos θ
0 ≤ θ ≤ π/2.
```

At `θ=π/2`, point 661 remains fixed because its normalized address is
`(-1,0,1/9)`. The rotation in 3D is bijective and has an inverse rotation.
Only the subsequent 2D camera projection can make two distinct source records
share or nearly share a screen location. Return therefore continues to use
the retained `PC1111:N....` source ID and exact cube address, never the pixel.

`HG→OF`, `A5`, `BHK` and “AM im PM” are retained as Owner navigation labels
for this view. They are not standardized mathematical terms and do not create
an additional operator, identity or physical mechanism.

## Root Ruler

For integer `k` in `1..1110`, the fourth view evaluates

```text
Δk = √(k+1) − √k = 1 / (√(k+1) + √k).
```

The symbolic expressions are exact. Their displayed decimal values and the
difference between the direct and rationalized Float64 evaluations are
explicitly approximate. The source integer `k` is retained, so Return is exact
by source identity rather than by inverting a plotted decimal coordinate.

`√2`, `√5` and `√7` are reference anchors already present in the A0
Source–Operator–Return surface. Treating them as orthogonal axes of a natural
"Root Cuboid" would be an additional modelling choice and is not asserted by
this contract. CODON planes and F1–F7/333 coordinates are likewise outside this
view until source coordinates and an independent contract are supplied.

## Typed H-Record crosswalk

The crosswalk retains one source number while exposing four non-identical
address registers: source and prime rank, Base-11 cube address, declared Dice
addresses and SHA-256 source-witness provenance.

For `d∈{5,6}`, the ordered Dice address is the exact little-endian Base-6
encoding of `n−1`, with each digit displayed as a die value in `1..6`:

```text
n−1 = Σ (die_i−1)·6^i
n   = 1 + Σ (die_i−1)·6^i.
```

The finite spaces are `H5={1,…,6}^5` with `6^5=7776` states and
`H6={1,…,6}^6` with `6^6=46656` states. Hamming distance counts changed Dice
positions. This is a declared address view, not a natural Dice property of a
prime number.

| n | prime rank | cube address | source delta |
|---:|---:|---:|---:|
| 787 | 138 | `[5,5,6]` | — |
| 797 | 139 | `[4,6,6]` | +10 |
| 809 | 140 | `[5,7,6]` | +12 |
| 811 | 141 | `[7,7,6]` | +2 |

All four records share carrier layer `z=6`. Consecutive prime ranks do not by
themselves create geometric adjacency; the displayed path is a comparison
selection. `5+6+6=17` is retained only as a typed view inventory: five Dice
positions, six face labels and six orientation poles. `787↔7.83` remains a
mnemonic Owner reading without a supplied operator. SHA-256 values identify
source artifacts; they are provenance records, not H-space coordinates.

## Result vocabulary

- `PASS_EXACT_CENSUS`
- `PASS_ADDRESS_RETURN`
- `PASS_VIEW_TRANSFORM`
- `INFORMATION_LOST`
- `UNDEFINED_CONTRACT`
- `FAIL`

## Claim boundary

This is finite arithmetic and source-bound engineering. It establishes no
prime generator, natural cube, natural Root Cuboid, physical fold, resonance, frequency law,
natural Dice correspondence, `787=7.83` identity, Rootroom mechanism, new Study, scientific Finding, Navigator identity,
relation or publication state.
