# A0 Power · Pitch · Polygon · Mod 9 Comparator

**Date:** 2026-11-23  
**Host:** `A0_BOUNDARY_GRAPH_DEMONSTRATOR.html#power-pitch-polygon-mod9`  
**Identity reuse:** `ART:A0:MATHEMATICAL_JOINTS`, `MOD:NUMBER_VIEW_SUITE`, existing Spin-to-Bloom Mod-9 wheel  
**Source Graph delta:** entities `0`, relations `0`, aliases `0`  
**State:** internal source-bound comparator; no Study, Finding or publication change

## Question

The owner atlas places `1024 Hz` at the regular 13-gon. The comparator asks which parts of this statement are intrinsic and which are assigned.

## Four typed lenses

### Power

```text
32 = 2^5
32^2 = 1024 = 2^10
2048 = 2^11
```

This is exact integer arithmetic.

### Pitch

Equal temperament uses `f_n=f_0·2^(n/12)`. A declared `32 Hz` reference reaches `1024 Hz` after five octaves. Under the standard `A4=440 Hz` reference, `C1≈32.70319566 Hz` and five octaves give `C6≈1046.50226120 Hz`. Thus `1024 Hz` lies about `22.5023 Hz` or `−37.6317 cents` below that standard C6 reference. The owner dome labels are therefore not treated as standard sequential note assignments.

### Regular 13-gon

The intrinsic data used here are:

```text
n = 13
symmetry = D13
central angle = 360/13 ≈ 27.6923077°
cycle spectrum λ_k = 2 − 2 cos(2πk/13)
1024 = 13·78 + 10
```

None of these equations derives a frequency of `1024 Hz`. The final division only states that an even distribution of 1024 samples over 13 bins has quotient 78 and remainder 10.

### Mod 9

The digital roots of powers of two form the exact cycle:

```text
1 → 2 → 4 → 8 → 7 → 5 → 1
dr(1024) = 7
dr(2048) = 5
```

The existing Spin-to-Bloom source already keeps `3↔6` and `9/0` separate. This comparator reuses that contract.

## Deterministic null

The owner sequence for `n=3…18` is retained as a source assignment. The Null lens rotates its 16 frequency labels by five positions. Under that reproducible permutation:

```text
SOURCE: 13-gon → 1024 Hz
NULL:   13-gon → 1836 Hz
```

This proves only that the visible pairing depends on the label assignment. It is a negative-control example, not a randomized significance test and it produces no p-value.

## Type boundary

`POWER ≠ PITCH ≠ POLYGON ≠ MOD 9`. A repeated number may support a valid crosswalk, but it does not transfer units, operators or physical meaning. The Tesla/Vortex-Math visual is retained as owner source material; “key to the universe” is not accepted as a scientific claim.

## Owner visual bindings

| Visual | SHA-256 | Role |
|---|---|---|
| Brane Grid 512/1024 | `0c87faa69eeb69f86a82e2111617ce380a45e69948c97397789cb96cd4df6dda` | dyadic/frame owner visual |
| Alpha Gate 1087 → 1024 | `6fb7f1f77e456f9cd14ecc2cf6c4c483e50685554bf66c3c711b0faf8135d293` | 1024 construction owner visual |
| polar i/j/k grid | `4c310b9465c140fb8334fe6f91c89f702634f21220c01bc14e35b4511e0cc39c` | axis owner visual |
| Zeta butterfly 1024 origin | `cd72693a3c33476718e6c0fa7f0070ef5a8e2f78eff871b5938a6c187d1b0be7` | 1024 neighborhood owner visual |
| dome harmonic steps | `81adbe400fc587d1c5c6fa3039ef0e607cad5cbe1e12d58e760bf48260659dd9` | pitch/dyadic owner visual |
| polygon harmonic spiral | `ced873693b315aa8b49afb1f9589ef6907bbb6ebfae88f93c696970a16323ffa` | n-gon/frequency source assignment |
| quantum compass core | `82b2a8441207f078e9b37b8b95b08e94b57154276578852a1b98e34900ba00c2` | duplicate n-gon/frequency view |
| Vortex Math 3-6-9 | `698ea4df23a0d1ba841dc857b108c7619a73e328f53182d022a54d92136e3293` | Mod-9 owner visual / claim boundary |

The images are treated as owner source material, not executable instructions or scientific evidence.

## Validation

- Comparator model and host assertions: `19/19 PASS`
- Ghost Ring regression: `15/15 PASS`
- Orange Packing regression: `14/14 PASS`
- Boundary Grid Atlas regression: `147/147 PASS`
- Point/Line/Topology regression: `38/38 PASS`
- JavaScript syntax: `PASS`
- Mission Control projection: `PASS`, `21` components
- Navigator App audit: `255/255 PASS`
- Source Graph: base `329/29`, composed `332/32`; only the pre-existing Red Balloon source-hash failure remains

