# Prime-Cell Ledger

Status: `EXACT PLANNING LEDGER / NOT AN EXECUTED RESULT`

## Index convention

`p_1 = 2` and prime indices are one-based.

## Base phase

For `k = 0..6`:

```text
G_k = (p_(4k+1), p_(4k+2), p_(4k+3)) | p_(4k+4)
```

| Cell | Prime indices | `A · B · C | +1` | Internal gaps | Forward gap |
|---|---|---|---|---:|
| `G0` | `1..4` | `2 · 3 · 5 | 7` | `1,2,2` | `4 -> 11` |
| `G1` | `5..8` | `11 · 13 · 17 | 19` | `2,4,2` | `4 -> 23` |
| `G2` | `9..12` | `23 · 29 · 31 | 37` | `6,2,6` | `4 -> 41` |
| `G3` | `13..16` | `41 · 43 · 47 | 53` | `2,4,6` | `6 -> 59` |
| `G4` | `17..20` | `59 · 61 · 67 | 71` | `2,6,4` | `2 -> 73` |
| `G5` | `21..24` | `73 · 79 · 83 | 89` | `6,4,6` | `8 -> 97` |
| `G6` | `25..28` | `97 · 101 · 103 | 107` | `4,2,4` | `2 -> 109` |

The base-phase Binder rail is therefore

```text
7, 19, 37, 53, 71, 89, 107.
```

This rail is mechanically induced by selecting prime indices divisible by
four. Any additional property must be tested against phase-matched controls.

## Why 101 does not close the base record

```text
p_25 = 97
p_26 = 101
p_27 = 103
p_28 = 107
```

Therefore `101` has local role `B` in `G6`. Stopping at 101 leaves the cell
open. The seventh base cell closes at 107.

## Four matched phases

Let phase `s` be the index offset `s in {0,1,2,3}`:

```text
G_(s,k) = (p_(4k+1+s), p_(4k+2+s), p_(4k+3+s)) | p_(4k+4+s).
```

Seven complete cells per phase require:

| Phase | First cell | Final required prime index | Final prime |
|---:|---|---:|---:|
| `0` | `2 · 3 · 5 | 7` | `p_28` | `107` |
| `1` | `3 · 5 · 7 | 11` | `p_29` | `109` |
| `2` | `5 · 7 · 11 | 13` | `p_30` | `113` |
| `3` | `7 · 11 · 13 | 17` | `p_31` | `127` |

The frozen planning universe is thus `p_1..p_31`, not merely the primes up to
101.

## Required record fields

Every future computed cell must retain at least:

```text
profile_version
phase
cell_index
source_index_start
prime_indices
prime_values
local_roles
internal_gap_vector
forward_gap
representation_id
residue_modulus_if_any
provenance
status
```

An open cell must be recorded as open. Missing entries must not be inferred or
silently padded.
