# Check 60 — Tessarec Double Body / Heptagon Bridge

**Status:** constructive combinatorial engineering candidate  
**Identity:** existing `MOD:TESSAREC`  
**Authority:** internal A0 engineering record; no Study activation; no publication authority

## Question

Can two copies of the `O2-P16-H8` Blue Body be doubled and then connected by a heptagonal seam without confusing shell topology, carrier topology, and embedding cost?

## Exact double baseline

Two disjoint copies give

`V=96, E=144, F=52, chi=4` and `2 * 280 = 560 = 70 * 8 = 7 * 80`.

The equality `560` is exact but narrow: it is the additive wirelength of two independent `Q4 x P3` carrier/host embeddings. It is not yet the wirelength of a connected carrier.

## Euler seam

For a connected trivalent spherical shell,

`sum((6-k) p_k) = 12`, hence `p5 - p7 - 2 p8 = 12`.

Keeping `32` pentagons and `4` octagons forces `12` heptagons. Keeping `V=96` and `E=144` then forces `F=50`, leaving `2` hexagons. The exact face vector is therefore:

`O4 + P32 + H6_2 + H7_12`.

The seam ledger is exact:

`14 hexagons * 6 sides = 84 = 12 heptagons * 7 sides`.

This removes two faces and changes the Euler characteristic from the disjoint value `4` to the connected spherical value `2` without changing `V` or `E`.

## Constructive existence witness

A deterministic edge-flip search on the dual triangulation found a closed, manifold, simple-face triangulation with:

- dual `V=50, E=144, F=96, chi=2`;
- degree histogram `5:32, 6:2, 7:12, 8:4`;
- primal cubic face vector `P32, H6_2, H7_12, O4`;
- seed `7080`, `600000` iteration budget, first recorded run score `0`;
- canonical face hash `e6d22663803f5bffaefc4d8df0de2dcf6667766f64d2b176a596b65e77e9c31a`.

This upgrades the face vector from a necessary Euler ledger to a constructive **combinatorial** existence witness.

## Namespace split

The following carriers must not be treated as identical:

| Carrier | States | Edges | Meaning |
|---|---:|---:|---|
| `2 x (Q4 x P3)` | 96 | 256 | disconnected additive baseline; wirelength 560 |
| `Q4 x P6` | 96 | 272 | connected six-layer path carrier |
| `Q4 x C6` | 96 | 288 | connected six-layer cycle carrier |

## Claim boundary

The check proves an exact arithmetic seam ledger and records one reproducible combinatorial cubic planar candidate. It does **not** yet prove a non-self-intersecting 3D realization, a geometrically preferred seam, a connected-carrier embedding, optimal wirelength, physical meaning, or external novelty. The next valid test is geometric realization followed by routing `Q4 x P6` and `Q4 x C6` on that realized host.

## Reproduction

```text
node A0_BOOK/a0-tessarec-heptagon-bridge-tests.cjs
```

Machine record: `A0_BOOK/assets/a0-tessarec-heptagon-bridge-v1.json`  
Executable model: `A0_BOOK/assets/a0-tessarec-heptagon-bridge-v1.js`
