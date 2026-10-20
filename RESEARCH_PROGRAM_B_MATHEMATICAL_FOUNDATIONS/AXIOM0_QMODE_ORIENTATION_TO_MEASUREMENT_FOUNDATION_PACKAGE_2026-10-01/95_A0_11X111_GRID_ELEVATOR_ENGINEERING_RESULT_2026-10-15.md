# A0 11×111 Grid Elevator — engineering result

**Date:** 2026-10-15  
**Status:** `PASS_EXACT_CRT_GRID_BRIDGE_WITH_TYPED_SEAM_AND_NONIDENTITY_CONTROLS`  
**Authority:** owner-authorized A0 engineering test; not a Laboratory run, not a new Study, not a Navigator identity or publication claim

## Result in one sentence

The proposed `11×111` connection is mathematically useful in two distinct forms: it is an exact lossless CRT product carrier with 1,221 addresses, while its connection to the `111×111` elevator requires a vertex/cell convention with an explicit `+1` seam and is not exact cell nesting.

## 1. The exact analogue of 7×11

The existing `7×11` result uses coprimality:

```text
gcd(7,11)=1
Z/77Z  ≅  Z/7Z × Z/11Z
```

The proposed grid passes the same test:

```text
gcd(11,111)=1
11×111 = 1221 = 3×11×37
Z/1221Z  ≅  Z/11Z × Z/111Z
```

For coordinates `(a mod 11, b mod 111)`, the exact reconstruction is

```text
x = 111a + 1111b  (mod 1221).
```

The two CRT idempotents are especially legible:

```text
111  -> (1 mod 11, 0 mod 111)
1111 -> (0 mod 11, 1 mod 111)
111 + 1111 = 1222 ≡ 1 (mod 1221).
```

All 1,221 addresses were exhaustively decoded and reconstructed without collision or loss. This is the strongest supported meaning of “die Grids verbinden”.

## 2. The grid neighborhood

For the open rectangular carrier

```text
P11 □ P111
```

the exact counts are:

| Object | Count |
|---|---:|
| vertices | 1,221 |
| horizontal/vertical edges | 2,320 |
| boundary vertices | 240 |
| interior vertices | 981 |

The central Janus operation

```text
J(x,y)=(10−x,110−y)
```

is an involutive graph automorphism. It has exactly one fixed point `(5,55)` and 610 two-cycles. The open rectangle, cylinder and torus were kept as distinct adjacency contracts; their edge counts are respectively `2320`, `2431` and `2442`. The open rectangle is the primary source-minimal contract.

## 3. The elevator seam: why `111 = 10×11 + 1` matters

Direct cell nesting fails because `111/11` is not an integer. The older Ghostgrid audit already rejected that model. The surviving model interprets 111 as sample points:

```text
111 sample points -> 110 fine intervals
boundaries 0,10,...,110 -> 11 coarse cells
each coarse cell -> 10 fine intervals
```

Thus the exact decompositions are:

```text
111      = 10×11 + 1
11×111   = 10×(11×11) + 11
111²     = 100×11² + 2×110 + 1
```

The `+1` is not another full 11-cell. It is the retained terminal sample/boundary that closes eleven coarse intervals. In the `11×111` rectangle this appears as a residual strip of 11 samples after ten complete `11×11` blocks. In the `111×111` square it appears as two residual strips plus their shared corner.

This gives a precise engineering reading of the elevator: **ten full blocks plus a typed seam**, not self-similar 11-fold cell nesting.

## 4. Prime radii around `c=111`

The owner-supplied Janus visual was machine-bound by SHA-256 and its radius table was reproduced:

| radius `r` | `c−r` | `c` | `c+r` | both sides prime? |
|---:|---:|---:|---:|:---:|
| 2 | 109 | 111 | 113 | yes |
| 3 | 108 | 111 | 114 | no |
| 5 | 106 | 111 | 116 | no |
| 7 | 104 | 111 | 118 | no |
| 11 | 100 | 111 | 122 | no |

Only `r=2` produces a two-sided prime pair. The other radii remain useful labeled offsets, but they are not prime pairs.

The appearance of `106` is therefore exact but narrowly typed:

```text
106 = 111 − 5
```

It is a composite coordinate neighbor. It is **not thereby identical** to the Pascal `Q106` carrier, whose cardinality 106 comes from `112 open nodes − 6 seam identifications`. Numeric equality is retained; role identity is rejected.

## 5. Destruction controls

The following tempting collapses fail:

1. `Z11` does not embed as an additive subgroup of `Z111`, because 11 does not divide 111 and `Z111` has no element of additive order 11.
2. `11×111=1221` and `111×111=12321` are different carriers, not alternate labels for one grid.
3. The decimal palindrome `1221` does not uniquely recover a source. The existing A0 return protocol records 32 unordered and 64 ordered three-digit-palindrome source pairs and correctly returns `HOLD_MISSING_WITNESS`.
4. The coordinate value 106 and the Q106 graph cardinality remain different namespaces.
5. Prime radii do not by themselves define an elevator operator or physical field.

## 6. Interpretation

What is now supported:

- `11×111` is a genuine exact extension of the `7×11` CRT-address idea.
- It supplies a finite 1,221-state carrier on which row/column neighborhoods, Janus reflection and return can be tested.
- The `111×111` grid connects through an exact sample/interval convention with a visible `+1` boundary seam.
- The prime-radius table is reproducible and discriminates the unique twin-prime radius `r=2` from the composite offsets, including 106.

What remains open:

- a source-bound rule mapping the CRT axes to the visual's `D/E`, channel, phase or branch-word roles;
- whether the residual `+1` seam should carry a specific Return label in the Pascal/Blue-Body interface;
- whether a declared projection from the 1,221-state rectangle into the 12,321-state square preserves any additional operator beyond order and neighborhood;
- any scientific or physical interpretation.

## Reproducibility

- Runner: `A0_BOOK/a0-11x111-grid-elevator-tests.cjs`
- Source contract: `A0_BOOK/assets/a0-11x111-grid-elevator-source-contract-v1.json`
- Machine result: `A0_BOOK/results/a0-11x111-grid-elevator-result-2026-10-15.json`
- Result: `16 PASS / 0 FAIL`
- Deterministic replay: byte-identical across two consecutive runs
- Result SHA-256: `d9630880ad4c4b7024ef8e6a1b3df6fbf1fa14f6e631fe4dea95e7444efad01b`
- Owner visual SHA-256: `394d11efcbc7e34e96e8b2ffb700611dbce11ec2548cd489890d424afe86ecb5`

No source-graph relation, Navigator identity, canonical carrier, Laboratory Study or publication surface is created or changed by this result.
