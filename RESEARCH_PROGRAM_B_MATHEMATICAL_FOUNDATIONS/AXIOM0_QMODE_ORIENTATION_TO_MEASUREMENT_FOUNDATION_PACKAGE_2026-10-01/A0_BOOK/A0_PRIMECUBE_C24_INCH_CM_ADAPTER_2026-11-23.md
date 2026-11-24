# Primecube C24 and Inch–Centimeter Adapters

Date: 2026-11-23  
Disposition: `PASS_EXACT_TYPED_ADAPTERS / MZ24_IDENTITY_NEGATIVE`  
Identity: reuse `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`, `ART:A0:MATHEMATICAL_JOINTS`, `MOD:NUMBER_VIEW_SUITE`, `MOD:TESSAREC`

## C24 common refinement

Because `lcm(6,8,12)=24`, the three finite index sets admit injective embeddings into one constructed C24:

| Source | C24 ticks |
|---|---|
| C6 boundary | 0, 4, 8, 12, 16, 20 |
| C8 orientation | 0, 3, 6, 9, 12, 15, 18, 21 |
| twelve D6 operations | 0, 2, 4, …, 22 |

The exact intersections are:

- C8∩D12 = `0,6,12,18`;
- C6∩C8 = `0,12`;
- C6∩D12 = the complete C6 embedding.

The previously observed proportion becomes an explicit zero-determinant control:

`90/60 = 84/56 = 3/2`, therefore `60·84 = 90·56 = 5040`, with `84=6·7·2`.

### MZ24 negative control

The constructed C6 ticks are `0,4,8,12,16,20`. The retained Q adapter produces MZ24 ticks `2,5,4,13,10,11`. Position-by-position matches: zero of six.

Result: C24 is an exact shared index refinement. It is not identical to MZ24, which remains the separately defined residue projection `(n mod 11 + n mod 13) mod 24`.

## Exact inch–centimeter adapter

The legal unit definition is exact:

`1 inch = 2.54 cm = 127/50 cm`.

Choosing one common tick as `0.2 mm = 0.02 cm = 1/127 inch` yields integer addresses:

- 1 cm = 50 ticks;
- 1 inch = 127 ticks;
- 50 inch = 127 cm = 6350 ticks.

| Fixture | Centimeters | Ticks |
|---:|---:|---:|
| 1 inch | 2.54 cm | 127 |
| 2 inch | 5.08 cm | 254 |
| 10 inch disk | 25.40 cm | 1270 |
| 12 inch disk | 30.48 cm | 1524 |
| 50 inch | 127.00 cm | 6350 |

The disk ratio is unit invariant: `10:12 = 25.40:30.48 = 5:6`.

## Type boundary

`INDEX`, `ANGLE`, `LENGTH`, `UNIT`, `STATE_COUNT` and `TICK_ADDRESS` remain separate types. Equal numbers, ratios or modulus sizes connect them only through the explicitly declared adapter. No physical suspension, material law, natural phase, MZ24 identity, cube-derived unit system or publication claim is established.

Navigator effect: zero new identities, relations, aliases, Studies, Findings and status changes.

