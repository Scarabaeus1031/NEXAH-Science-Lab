# A0-BL-025 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Question

Compared with four finite controls, does the typed SCC-003 seam provide a
bounded address/Return advantage without losing level consistency, provenance,
the declared `D5` action or an invertible local crossing rule?

## Frozen carrier

The raw carrier is five labelled copies of

```text
T6 = {(n,k): 0 <= k <= n <= 6},
```

giving `5 * 28 = 140` source incidences. The canonical seam identifies all
five apices and, for `1 <= n <= 6`, identifies

```text
(f,n,n) ~ (f+1 mod 5,n,0).
```

Its expected quotient size is `106`.

## Frozen conditions

| ID | Condition | Purpose |
|---|---|---|
| `C0` | five disjoint faces | raw-address baseline |
| `C1` | common apex only | weak shared-interface baseline |
| `C2` | canonical seam, residual omitted | proves quotient address alone is lossy |
| `C3` | seam levels paired by `n -> 7-n` | matched-count arbitrary-gluing negative control |
| `C4` | canonical seam plus minimal within-class residual | candidate typed channel |

`C3` is deliberately not a Pascal-compatible seam. It preserves the number of
pairings while mixing source levels; it is not selected after observing a
result.

## Frozen measures

1. quotient address count;
2. source-incidence reconstruction accuracy;
3. number of quotient classes mixing Pascal levels;
4. fixed address cost `ceil(log2(number of quotient addresses))`;
5. source-weighted conditional residual cost
   `mean(ceil(log2(class size)))`;
6. preservation of the declared rotation `r` and reflection `m`;
7. exact inverse for every directed canonical zipper transition;
8. preservation of quotient and unfolded incidence ledgers.

The raw comparator costs `ceil(log2(140)) = 8` bits. The C4 advantage gate is
strict: its quotient-address cost plus conditional residual cost must be less
than `8`, and Return must remain exact for all `140` source incidences.

## Hypothesis gates

- `H-U1`: C4 has fewer quotient addresses than C0 with no mixed-level class.
- `H-U2`: C4 reconstructs all raw incidences and has lower mean address cost
  than C0.
- `H-U3`: every explicitly designed `+1/-1` canonical seam crossing is
  deterministic and inverse-exact.
- `H-U4`: the quotient ledger and unfolded incidence ledger coexist without
  summing or deleting source multiplicity.

Historical `+/-2,+/-3` offsets and any Riemann mapping are excluded because no
source-bound rule has been recovered. Human usability is not tested.

## Decision rule

`PASS_BOUNDED_TYPED_SEAM_ADVANTAGE` requires all four gates and all controls.
Otherwise return the first applicable registered negative or invalid class.

## STOP and claim ceiling

The run stops after one Primary, one Replay and verification. It establishes
at most a finite information-accounting and typed-transition result. It does
not establish physical transport, stability, application utility, a universal
Grid-Fold-Channel architecture, a Riemann relation or publication readiness.
