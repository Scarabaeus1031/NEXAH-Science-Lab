# A0 Tessarec P3/C3 Phase Binding — Engineering Check

Date: `2026-10-13`  
Status: `DETERMINISTIC CARRIER COMPARATOR / ENGINEERING EXECUTED`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / NO NEW STUDY / NO NEW RELATION`

## 1. Bounded question

Can the formal `+12 mod 48` quarter phase be bound to an adjacency-preserving
operator on the existing `Q4 square P3` carrier? Does closing only the missing
layer seam to form the comparator `Q4 square C3` permit a combined three-layer
and four-phase operator, and if so is that binding canonical?

`Q4 square C3` is a control graph in this check. It is not adopted as a new
carrier and does not replace the existing `Q4 square P3` instrument.

## 2. Frozen carriers

```text
Q4 square P3:
  vertices       = 16 * 3 = 48
  Q4 inner edges = 32 * 3 = 96
  layer bridges  = 16 * 2 = 32
  total edges    = 128

Q4 square C3 comparator:
  vertices       = 16 * 3 = 48
  Q4 inner edges = 32 * 3 = 96
  layer bridges  = 16 * 3 = 48
  total edges    = 144
```

The comparator adds exactly one seam edge per Q4 address: `16` additional
bridges and no additional states.

## 3. Frozen operator questions

1. Enumerate all `384` affine Q4 automorphisms: coordinate permutations
   followed by XOR translation.
2. Find fixed-free order-four Q4 operators with cycle type `4+4+4+4`.
3. Combine them with the factor-preserving layer automorphisms of `P3`.
4. Combine them separately with the two genuine order-three rotations of
   `C3`.
5. Require adjacency preservation and report complete cycle types.
6. Compare the existing Paper-F Gray display shifts `+4`, `+12` and `+16`.
7. Count compatible operator/bijection pairs to expose non-uniqueness.

For a valid combined `C3` witness `L`, the expected powers are:

```text
L      : order 12; four cycles of length 12
L^3    : order 4;  twelve cycles of length 4; layer returns
L^4    : order 3;  sixteen cycles of length 3; Q4 address returns
```

Under a separately declared cyclic bijection these correspond to `+4`, `+12`
and `+16 mod 48`. Existence does not choose the bijection.

## 4. Result vocabulary

- `SUPPORTED_AS_GRAPH_COUNT`
- `EXISTS_BUT_NON_CANONICAL`
- `REFUTED_FOR_CURRENT_DISPLAY_ORDER`
- `UNDERDETERMINED`
- `INVALID_ENGINEERING_CHECK`

No visual resemblance is a pass condition.

## 5. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_P3_C3_PHASE_BINDING_ENGINEERING_CHECK_001
PURPOSE: VERIFY_CARRIER_AND_OPERATOR_CANDIDATES
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-p3-c3-phase-binding.mjs
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-p3-c3-phase-binding.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: finite graph counts, product-form automorphisms and display-address comparison only
AUTHORIZED_SCIENCE_RUN: false
```

## 6. Interpretation ceiling

Even a successful `C3` control would establish only that a seam-closed
three-layer graph can carry a compatible order-12 automorphism. It would not
show that the current instrument should be changed, that the operator is
unique, or that Gon values, Fourier phase and graph motion are one mechanism.

## 7. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `e992916d4d6bdf62628e345895f08c4bba53218c8d75aba39c1334ffaf6e42fe`  
Repeated stdout SHA-256: `1c446aa181276a1fe3657143f0015dc2f764c0bfd19577774349138dd06eff2c`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_WITH_CARRIER_COMPARATOR_AND_UNDERDETERMINATION`

| Check | Receipt | Bounded reading |
|---|---|---|
| `B1_CARRIER_COUNTS` | `PASS` | `Q4 square P3 = 48 vertices / 128 edges`; seam-closed `Q4 square C3 = 48 / 144`; delta `+16` edges |
| `B2_LAYER_SYMMETRY` | `PASS_COMPARATOR` | `P3` has only identity/reflection; `C3` has two genuine order-three rotations |
| `B3_Q4_AFFINE_QUARTER_TURNS` | `PASS` | `384` affine Q4 automorphisms checked; `84` fixed-free order-four candidates |
| `B4_PRODUCT_OPERATOR_SEARCH` | `PASS_WITH_CONTRAST` | factor-preserving `P3` search has `0` order-12 candidates; `C3` comparison has `168` |
| `B5_CURRENT_DISPLAY_ORDER` | `MIXED_NEGATIVE_BINDING_RESULT` | current `+16` becomes exact only on `C3`; current `+12` and `+4` remain non-automorphisms |
| `B6_CANONICALITY_CONTROL` | `UNDERDETERMINED` | existence does not select one operator or one address bijection |

One explicit `C3` witness has:

```text
L   : 4 cycles x 12 states   (order 12)
L^3 : 12 cycles x 4 states  (quarter phase; layer returns)
L^4 : 16 cycles x 3 states  (layer rotation; Q4 address returns)
```

The current `P3` display shifts break `28`, `36` and `16` of its `128` edges
for `+4`, `+12` and `+16`, respectively. After seam closure, current `+16`
preserves all `144` `C3` edges, while current `+4` and `+12` still each break
`24` edges.

Canonicality does not follow from existence:

```text
P3 abstract quarter-turn operator candidates: 168
P3 operator/bijection pairs:                 1,350,100,635,667,660,800

C3 combined order-12 operator candidates:    168
C3 operator/bijection pairs:                 83,607,552
```

### Disposition

```text
CURRENT Q4 square P3 CARRIER: RETAINED
DIRECT CURRENT +12 BINDING: REFUTED
ABSTRACT P3 QUARTER TURN: EXISTS, HIGHLY NON-UNIQUE
C3 SEAM-CLOSURE 144-EDGE COUNT: SUPPORTED
C3 COMBINED 3 x 4 PHASE OPERATOR: EXISTS, NON-CANONICAL
CARRIER CHANGE: NOT AUTHORIZED
VISUAL CHANGE: NOT AUTHORIZED
NEW FINDING: NO
```

The next admissible design step is not to switch the instrument to `C3`.
It is to declare an observable and a small set of candidate address bijections
before comparing whether any candidate preserves more of the existing Frame,
Envelope, Observer and Return contracts than matched alternatives.
