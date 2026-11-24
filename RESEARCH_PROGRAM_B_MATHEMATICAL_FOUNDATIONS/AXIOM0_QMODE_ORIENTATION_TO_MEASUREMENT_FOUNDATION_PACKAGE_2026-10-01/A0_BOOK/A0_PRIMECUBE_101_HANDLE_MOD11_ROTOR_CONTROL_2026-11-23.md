# Primecube 101 Handle / Mod-11 Rotor Control

Date: `2026-11-23`  
Status: `SOURCE_BOUND_FORMAL_DESIGN_NO_ADMISSION`  
Reuse: `MOD:NUMBER_VIEW_SUITE`, `ART:A0:MATHEMATICAL_JOINTS`  
Graph delta: `0 identities / 0 relations`

## Exact retained structure

- Root mask: `4 × (5 × 5) + 1 = 101`; 101 selected cells inside the 121-cell `11 × 11` grid.
- Handle: `101_10 = 92_11`, hence `101 ≡ 2 (mod 11)`.
- Operator: `r ↦ 2r (mod 11)`.
- Complete nonzero orbit: `2 → 4 → 8 → 5 → 10 → 9 → 7 → 3 → 6 → 1 → 2`.
- The multiplier `2` has order 10 modulo 11 and is therefore a primitive root modulo 11.

## Typed 8/9 joint

- `8 + 9 = 17`
- `8 × 9 = 72`
- `(8/9)(9/8) = 1`
- decimal concatenation `8|3 = 83 = p_23`
- factor return `3565 = 5 × 23 × 31`
- unit-bound crosswalk `1728 h = 72 d`

## Negative controls

1. `101 → 2501` is a switch of integer representative while the residue moves `2 → 4`; `2501 ≠ 2 × 101`.
2. Decimal concatenation `8|3`, multiplication `8 × 9`, residue reduction and prime-index lookup are different operators.
3. The proposed subset `{3,6,9}` is not closed under doubling modulo 11: `3→6`, `6→1`, `9→7`.
4. A `Root2` identity is not established and remains `HOLD`.
5. The residue rotor is not derived from the continuous α/β memory recurrence.

## Return

The Primecube surface now shows the complete residue orbit and the typed 8/9 comparator below the 101 mask. It extends the existing Primecube identity only; it does not create a Navigator node, relation, Study, finding or publication state.

## Interactive demonstrator

The `101 HANDLE / MOD-11 ROTOR DEMONSTRATOR` reuses one visible wheel for four explicitly typed modes:

1. `×2 ROTOR`: forward/backward stepping and a ten-step animated exact return;
2. `101 HANDLE`: visible separation of `101≡2`, `2501≡4` and `2501≠2×101`;
3. `3-6-9 PROBE`: visible failure of subset closure;
4. `8/9 JOINT`: sum, product, reciprocal return, decimal concatenation and prime-index return.

The demonstrator contract has 25 deterministic checks. Its visual modes do not change the underlying record or any Navigator identity.

## Local `1 / i / j / k` axis overlay

The Al-Jabr Lens now provides two switchable coordinate views:

- `TOP · i/j`: `k=0`; scalar `1` occupies the selected center cell, the horizontal and vertical channels carry `±i` and `±j`, and the four quadrant rays are `−i+j`, `i+j`, `−i−j`, `i−j`.
- `SIDE · i/k`: `+k` is the declared Carrier layer, `−k` the declared Shadow layer, and `j` is shown edge-on.

The twenty cross-arm cells remain outside the 101-cell selection and are displayed as open coordinate channels. The orientation comparator `ij=k; ji=−k` is an exact quaternion-algebra reference, but it is not derived from the grid. The local labels create no Quaternion identity and do not identify the Shadow Cube with physical depth.

## Plus / times dual-mask comparator

The top view now switches between four exact mask readings:

- `PLUS_ZERO`: twenty noncentral orthogonal-arm zeros, four square `5×5` quadrants and the selected center; `121−20=101`.
- `TIMES_ZERO`: twenty noncentral diagonal zeros, four rotated wedge sectors of 25 cells and the selected center; `121−20=101`.
- `PLUS_TIMES_OVERLAP`: the two noncentral zero sets are disjoint, hence the selected intersection has `81=9²` cells and the selected union has `121=11²` cells. The 81 cells are not a contiguous `9×9` subgrid.
- `PRIME_QUADRANTS`: in declared screen order top–left–bottom–right, the four 25-cell sectors carry the type labels `2,3,5,7`.

The prime-sector comparator retains

```text
2+3+5+7 = 17
2·3·5·7 = 210
4·210 = 840
4!·210 = 24·210 = 5040 = 7!
```

The last line deliberately multiplies the invariant label product by all 24 permutations. It is a constructed finite comparator, not a derivation of `5040` from the grid. Prime labels are sector types and are not assigned as numerical values to every cell.

## p/b/q/d Cube-shift demonstrator

The Cartesian `PLUS_ZERO` view now also exposes four fixed orientation registers:

| Register | Position | Glyph | Prime type |
|---|---:|---:|---:|
| `Q_I` | NE | `b` | 2 |
| `Q_II` | NW | `d` | 3 |
| `Q_III` | SW | `q` | 5 |
| `Q_IV` | SE | `p` | 7 |

The glyphs are fixed parking labels. The visible cube tokens `C2,C3,C5,C7` move between those registers under three exact permutations: vertical mirror `V`, horizontal mirror `H`, and half-turn `R`. They satisfy `V²=H²=R²=id` and `VH=HV=R`, so this bounded control has the Klein-four composition table.

`ZERO` and `NULL` remain distinct types. `ZERO` is a present numerical mask state. `NULL` is an unbound record outside arithmetic, cell counts and the four-register permutation. The demonstrator neither identifies glyphs with cubes nor derives a physical Cube motion from their screen animation.
