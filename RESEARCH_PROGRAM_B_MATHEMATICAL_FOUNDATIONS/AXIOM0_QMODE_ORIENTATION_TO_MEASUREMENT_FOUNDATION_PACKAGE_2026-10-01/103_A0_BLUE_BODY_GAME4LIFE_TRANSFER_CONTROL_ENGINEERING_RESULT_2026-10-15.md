# A0 Blue Body → GAME 4 LIFE +1 Transfer Control

Date: `2026-10-15`

Status: `INTERNAL DETERMINISTIC ENGINEERING CONTROL / NOT A SCIENCE RUN`

## Question

Can the 48-address Blue Body record grammar be transported into a LIFE display
without claiming that the two carriers or update laws are identical? What
survives if the transported view is then passed through native Conway
`B3/S23` dynamics?

## Frozen objects

- source carrier: existing `MOD:TESSAREC · Q4 × P3`, 48 addresses;
- source adapter: Check 102 ordinal `I16 × P3 ↔ Q4 × P3` map;
- target: finite-dead `8 × 6` one-hot LIFE display;
- update: unchanged Conway `B3/S23`;
- witness: optional persistent Blue Body Source Key;
- no LIFE08 seed, trajectory, result or evidence record is changed.

## Exact transport

For source address `(q,l)` with `q ∈ {0,...,15}` and `l ∈ {0,1,2}`:

```text
x = q mod 8
y = 2l + floor(q/8)
T(q,l) = one live cell at (x,y) in an 8×6 finite-dead grid
```

The inverse is:

```text
l = floor(y/2)
q = x + 8(y mod 2)
```

Thus the pre-dynamics map is bijective `48 → 48`.

## Negative control

Every transported state contains exactly one live cell. Under finite-dead
`B3/S23`, a singleton has zero live neighbours and dies after one generation:

```text
48 distinct source addresses
  → 48 distinct generation-0 displays
  → one common empty generation-1 display
```

The post-state alone therefore has 48 compatible source candidates. This is
the intended negative control: native dynamics erase the foreign address.

## Typed receipts

| Path | Receipt |
|---|---|
| pre-dynamics coordinate inverse | `PASS_PRE_DYNAMICS_COORDINATE_RETURN` |
| post-dynamics plus retained Source Key | `PASS_TYPED_TRANSPORT_RETURN` |
| post-dynamics state only | `HOLD_DYNAMICS_ONLY_AMBIGUOUS` |
| divergent Source Key | `HOLD_SOURCE_KEY_MISMATCH` |
| invalid source address | `HOLD_INVALID_SOURCE_ADDRESS` |

## Validation

The deterministic validator passes **295 assertions** covering:

- all 48 unique source-to-cell transports;
- all 48 exact pre-dynamics inverses;
- all 48 singleton-to-empty `B3/S23` updates;
- typed Source-Key Return;
- the 48-candidate dynamics-only ambiguity;
- fail-closed invalid-address and witness-mismatch paths.

The dependency-free UI mount smoke test separately passes **33 assertions**
against the production `mount()` function and the actual GAME 4 LIFE +1 HTML
contract. It covers the initial typed PASS, all 48 cells in both grids,
Witness-off HOLD, stage return to `g0`, the Gray-ring address
`P2:1111 → (7,5)`, synchronized readouts, required element IDs, script load
order and the return links to the A0 Crosswalk and Check 103. This is an
interaction-contract test; it does not add evidence or broaden the claim.

## Result

```text
EXACT ADAPTER REUSE = PASS
CARRIER OR UPDATE IDENTITY = NOT ESTABLISHED
DYNAMICS-ONLY RECONSTRUCTION = VALID NEGATIVE / HOLD
```

This is the second bounded engineering witness for `H-SYN-01`. It closes the
implementation gap for the independent transfer control, but it does not
establish comparative usefulness, a new LIFE rule, a shared carrier, a
physical mechanism, a Study, a new Navigator identity or publication
authority.

## Files

- `A0_BOOK/A0_GAME_4_LIFE_PLUS_1.html#blue-body-transfer`
- `A0_BOOK/assets/a0-blue-body-life-transfer-v1.js`
- `A0_BOOK/assets/a0-blue-body-life-transfer-v1.json`
- `A0_BOOK/a0-blue-body-life-transfer-tests.cjs`
- `A0_BOOK/a0-blue-body-life-transfer-ui-smoke-tests.cjs`

