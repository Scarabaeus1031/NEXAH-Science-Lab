# Check 80 — T64 137→8 Ring Crosscheck

Date: `2026-10-13`  
Status: `VALIDATED EXACT ENGINEERING CROSSCHECK / NOT A SCIENCE RUN`  
Parent: Check 79 · `A0_ZITHER_11_12_13_DECIMAL_CARRY_C64_RUN_001`  
Identity effect: `REUSES EXISTING A0 AND ORION IDENTITIES / NO NEW NAVIGATOR IDENTITY OR RELATION`

## Question

Does the already-established ORION operator

```text
T_64(k) = 64k (mod 365),  365=5*73
```

send the existing `137` carrier to the residue `8`; and how must that result
be typed relative to the A0 uses of eight?

## Exact result

```text
137 mod 73 = 64
64*137 = 8768 = 24*365 + 8
T_64(137) = 8 mod 365
```

In CRT coordinates:

```text
137 <-> (2 mod 5, 64 mod 73)
64  <-> (-1 mod 5, 64 mod 73)
8    <-> (3 mod 5, 8 mod 73)
```

and therefore

```text
(-1,64) * (2,64) = (3,8),
```

which reconstructs uniquely to `8 mod 365`.

The full `T_64` orbit is

```text
137 -> 8 -> 147 -> 283 -> 227 -> 293 -> 137.
```

It has length `6`, as permitted by the established order
`ord_365(64)=6`.

## Secondary CRT check

The supplied `37 -> 137 -> 237 -> 11357` carrier ladder remains a separate
source-bound line. Its terminal value has the exact reduction

```text
11357 = 31*365 + 42
11357 mod 365 = 42
11357 <-> (2 mod 5, 42 mod 73).
```

This arithmetic check does **not** make `42` part of the `137 -> 8` orbit and
does not establish a common generative mechanism for the ladder and `T_64`.

## Typed-eight boundary

The output `8` is first of all a residue in `Z_365`. Existing A0 records also
use eight in other typed roles:

| Expression | Typed role | Result of this check |
|---|---|---|
| `8` | residue returned by `T_64(137)` | exact |
| `2^3=8` | cardinality of three binary distinctions | existing A0 relation; not derived here |
| `8*8=64` | ordered relation-cell count | existing A0 relation; not derived here |
| eight Coxeter cycles of length `30` | one organization of the `240` E8 roots | existing reference; no identity asserted |

Thus the crosscheck establishes an exact contact at the numeral `8`, while
preserving the distinction between residue, state count, relation count and
E8 projection.

## Machine verification

- Result record:
  `A0_BOOK/results/a0-t64-137-to-8-ring-crosscheck-2026-10-13.json`
- Lock:
  `A0_BOOK/assets/a0-t64-137-to-8-ring-crosscheck-lock.json`
- Validator:
  `A0_BOOK/validate_t64_137_to_8_ring_crosscheck.mjs`

## STOP

- `137 mod 73 = 64`: `PASS`;
- `T_64(137)=8 mod 365`: `PASS`;
- CRT reconstruction: `PASS`;
- six-state orbit closure: `PASS`;
- `11357 mod 365=42`: `PASS / SEPARATE CRT CHECK`;
- identity of the four typed uses of eight: `NOT ESTABLISHED`;
- external significance or common mechanism: `NOT ESTABLISHED`;
- new Navigator identity/relation: `NONE`;
- claim promotion/publication: `NOT AUTHORIZED`.

