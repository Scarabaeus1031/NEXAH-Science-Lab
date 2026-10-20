# A0-BL-020 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN / ADMITTED / ACTIVE_PENDING_LOCK`

## Declared constructions

For each face `f=0..m-1`, level `n=0..d` and position `k=0..n`, begin with
the raw Pascal address `(f,n,k)`.

The **cyclic quotient** identifies every apex and identifies the right side of
face `f` with the left side of face `f+1 mod m` at the same positive level.
Interior addresses remain face-typed.

The **open-chain control** identifies every apex and only adjacent non-wrapped
sides. It retains two exterior boundary chains and is not SCC-003.

Frozen predictions:

```text
N_cyclic(m,d) = 1 + m*d*(d+1)/2
E_cyclic(m,d) = m*d^2
N_open(m,d)   = N_cyclic(m,d) + d
E_open(m,d)   = E_cyclic(m,d) + d
```

At `d=6`, cyclic counts for `m=5,6,7,8` are `106,127,148,169`; open counts
are `112,133,154,175`. The latter may never be imported into SCC-003.

## Frozen grids

- primary: `m in {5,6,7,8}`, `d=6`;
- formula and symmetry audit: `m in 3..12`, `d in 1..12`;
- SCC-003 anchor: exactly `m=5,d=6`, `106` nodes and `180` directed edges.

## Gates

1. source anchor reproduces SCC-003 `106/180`;
2. enumerated cyclic nodes equal `N_cyclic` on the full grid;
3. enumerated cyclic directed edges equal `E_cyclic` on the full grid;
4. open control equals its distinct formulas and differs by exactly `d`;
5. every quotient class has one Pascal weight `binom(n,k)`;
6. all `D_m` rotations/reflections preserve nodes, weights and directed edges;
7. the primary table separates `106/127/148/169` from
   `112/133/154/175` and records the static/dynamic boundary.

## Decision

`PASS_GENERAL_CYCLIC_FORMULAS_BOUNDED` requires every gate on every frozen
instance. Any exact counterexample returns `COUNTEREXAMPLE_FOUND`; a source,
lock, replay or verifier failure returns `INVALID_DESIGN`.

## Claim ceiling

An exact theorem for this declared finite combinatorial construction only.
No dynamic confluence, physical geometry, regular polygon/solid, general
attachment law, canonical new carrier, utility, novelty or publication claim.
