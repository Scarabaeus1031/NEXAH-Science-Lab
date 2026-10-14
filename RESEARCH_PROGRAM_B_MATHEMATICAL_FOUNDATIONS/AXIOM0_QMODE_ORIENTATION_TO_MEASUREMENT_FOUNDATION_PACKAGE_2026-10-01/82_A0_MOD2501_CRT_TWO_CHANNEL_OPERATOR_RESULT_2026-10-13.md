# Check 82 — MOD2501 CRT Two-Channel Operator Result

Date: `2026-10-13`  
Run: `A0_MOD2501_CRT_TWO_CHANNEL_OPERATOR_RUN_001`  
Status: `VALIDATED BOUNDED ENGINEERING RESULT / STOP REACHED`

## Result

```text
EXACT_CRT_OPERATOR_SYSTEM_WITH_CARRIER_SPECIFIC_M64_DYNAMICS
```

The split, channelwise action and bind diagram commutes exhaustively on both
declared carriers:

```text
Z_365  ~= Z_5  x Z_73
Z_2501 ~= Z_41 x Z_61
```

For every state `n` in each carrier,

```text
split(M64(n)) = (M64,p x M64,q)(split(n)),
bind(split(n)) = n.
```

## Carrier specificity

The same multiplier and seed give different exact results:

```text
M64@365(137)  = 8
M64@2501(137) = 1265
```

Their channel records are:

```text
mod 365:
  64  -> (4,64)
  137 -> (2,64)
  8   -> (3,8)

mod 2501:
  64   -> (23,3)
  137  -> (14,15)
  1265 -> (35,45)
```

Thus `137 -> 8` is a property of `M64` on `Z_365`, not a universal property
of the numeral `64`.

## Ring dynamics

### `M64` on `Z_365`

```text
inverse=154
order=6
cycle census: 1x length 1, 2x length 2, 24x length 3, 48x length 6
```

### `M64` on `Z_2501`

```text
inverse=1993
order=10
cycle census: 1x length 1, 250x length 10
```

This supplies the requested ring system: zero is fixed and every nonzero
state belongs to one of `250` ten-cycles.

## Collapse and symmetry controls

```text
M41@2501: kernel size 41, image size 61, noninvertible
M61@2501: kernel size 61, image size 41, noninvertible
MIRROR@2501: 1 fixed point and 1250 two-cycles
TRANSLATE100@2501: one cycle of length 2501
```

The historical `+100` line is therefore a local window into one complete
translation cycle after quotienting, not evidence of a privileged path.

## Visual-template replay

The two-channel ledger shown in the supplied visual is arithmetically exact:

```text
13183 mod 131 = 83
13183 mod 83  = 69
CRT(83,69)    = 2310 mod 10873
13183         = 1*10873 + 2310
```

The visual supports the architecture `split -> channel action -> bind ->
shell/reconstruction`. Its colors and elliptical traces remain view-layer
annotations.

## Registry result

The local registry records reusable parameterized classes and only the tested
instances. It reuses the existing historical types `OP_MODULO` and
`OP_CONGRUENCE`; it does not modify the historical Numbermagick source,
Navigator Source Graph or ORION's non-executable Phase-5A registry.

## STOP

- exhaustive CRT reconstruction on `365` and `2501`: `PASS`;
- exhaustive commuting squares for `M64`: `PASS`;
- carrier-specific `137` comparison: `PASS`;
- full orbit/cycle censuses: `PASS`;
- nonunit kernel/image controls: `PASS`;
- visual-template ledger replay: `PASS`;
- non-coprime CRT declaration: `REJECTED AS REQUIRED`;
- physical coupling or privileged-modulus claim: `NOT ESTABLISHED`;
- new Navigator identity/relation: `NONE`;
- ORION registry change: `NONE`;
- claim promotion/publication: `NOT AUTHORIZED`.

