# A0 Blue Body CRT16 Interior Adapter — Engineering Result

Date: `2026-10-15`  
Status: `INTERNAL DETERMINISTIC ENGINEERING RESULT / NOT A SCIENCE RUN`  
Record: `A0:BLUE_BODY:INTERIOR:CRT16:ORDINAL_GRAY_RING:V1`

## Question

Can the existing sixteen-channel CRT/Pentagon inspection tile be used as a
controllable three-layer interior view of the existing `Q4 x P3` Blue Body
without identifying CRT moduli with carrier states or confusing a display
aperture with a state transition?

## Frozen objects

- source carrier: `MOD:TESSAREC:Q4xP3` with `16 x 3 = 48` addresses;
- local display channels: ordinal set `I16 = {0,...,15}`;
- layer register: `P3 = {0,1,2}`;
- CRT labels: `17,19,23,...,79`;
- views: front, top, side and isometric;
- display phase: `C12`;
- Return outcomes: exact pass or explicit `HOLD`.

The moduli are metadata attached to channel ordinals. They do not define Q4
adjacency, a metric, a physical resonance or an intrinsic Blue Body geometry.

## Adapter

Let `c in I16`, `l in P3`, `h = c & 8` and `u = c & 7`. The adapter is

```text
B(c,l) = (P_l, h | (u xor (u >> 1))).
```

This is the established two-half Gray-ring order used by the Blue Body
baseline. Its inverse decodes the three low Gray bits while retaining the high
half bit. Therefore `B` is a bijection from `I16 x P3` to `Q4 x P3`.

The typed address is the Blue Body key `P<layer>:<four bits>`. A separate
display key records the CRT ordinal and layer. Keeping both keys prevents the
prime label from silently becoming carrier topology.

## Demonstrator

`A0_BOOK/A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16` now provides:

1. a channel selector for all sixteen CRT labels;
2. a three-layer `P3` selector;
3. a Kite/aperture display control;
4. forward and reverse `1/12` phase steps, with the middle `P3` layer counter-rotating against the two outer layers;
5. a 48-state animation;
6. four synchronized projections from one source record;
7. an explicit Return-witness switch and fail-closed receipt.

Each layer is rendered as a declared `15+1` Pentagon display scaffold. The
three scaffolds expose all 48 records. Their projected geometry is an
inspection view only; carrier edges and display seams remain differently
typed.

## Validation

Command:

```bash
node A0_BOOK/a0-blue-body-interior-crt16-tests.cjs
```

The deterministic validator evaluates `237` assertions:

- 48 records, 48 unique source keys and 48 unique display keys;
- exact ordinal Gray-ring inverse for all sixteen channels;
- exact layer, channel, modulus-label and source-key Return for every address;
- one selected source in each of four 48-address projections;
- source invariance under aperture and phase changes;
- finite coordinates in every projection;
- `PASS_EXACT_ADDRESS_RETURN` with a complete witness;
- `HOLD_MISSING_WITNESS` when the witness is withheld;
- `HOLD_VIEW_DIVERGENCE` for inconsistent projection keys;
- `HOLD_INVALID_ADDRESS` for malformed source keys.

## Result

The local adapter exists and passes its exact address-level contract. It closes
the implementation gap recorded under `H-SYN-01`: the four Blue Body interior
views can now share one frozen source key, and Return fails closed when its
witness is missing.

This does **not** establish adjacency preservation between the CRT labels and
Q4, an intrinsic 3D interior, an optimal embedding, physical mechanism,
utility superiority or scientific novelty.

```text
NEW_STUDY = NO
NEW_F_A0_FINDING = NO
NEW_NAVIGATOR_IDENTITY = NO
NEW_GRAPH_RELATION = NO
H_SYN_01_BLUE_BODY_INSTANCE = IMPLEMENTED_ENGINEERING_PASS
GAME_4_LIFE_TRANSFER_CONTROL = STILL_OPEN
PUBLICATION_AUTHORIZED = NO
```

## Sources and returns

- `A0_BOOK/A0_PINK_DIAMOND_GRID_ATLAS.html#crt16-tile`
- `A0_BOOK/A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16`
- `A0_BOOK/assets/a0-blue-body-interior-crt16-v1.js`
- `A0_BOOK/assets/a0-blue-body-interior-crt16-v1.json`
- `101_A0_GRID_OPERATOR_APPLICATION_SYNTHESIS_2026-10-15.md`
- `36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md`

