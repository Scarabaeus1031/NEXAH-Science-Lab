# A0 Grid–Operator–Application Synthesis

Date: `2026-10-15`  
Status: `DOCUMENTARY_SYNTHESIS / FORMAL_DESIGN_PROPOSAL / NOT_A_STUDY`  
Owning identity: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`  
HTML crosswalk: `A0_BOOK/A0_LIVING_BLUEPRINT.html#integration-crosswalk`  
Scientific execution: `NONE`

## Decision

The current A0 modules are not one mechanism and should not be merged into a
single carrier. They do, however, support one common **demonstrator grammar**:

```text
source carrier
  -> typed address
  -> declared operator
  -> synchronized projections
  -> comparator / negative control
  -> return receipt
  -> application adapter
```

This grammar is the missing middle layer between the existing instruments and
an intelligible application. It says what is held fixed, what is changed, what
is shown, what can be learned, and what must remain open.

## What is new enough to record

The following are **synthesis findings**, not new admitted scientific findings
and therefore do not receive `F-A0` identifiers.

| ID | Bounded statement | State | Consequence |
|---|---|---|---|
| `SYN-A0-01` | Carrier, address field, viewport, aperture, phase clock and projection are independently typed controls in the current instruments. | implemented design fact | A view change can be tested without silently changing the carrier. |
| `SYN-A0-02` | The CRT16/Pentagon fixture renders one selected channel and one phase state in four synchronized projections: front, top, side and isometric. | implemented design fact | The `15+1` tile is a usable inspection scaffold, not a proved three-dimensional object. |
| `SYN-A0-03` | The Ghostgrid exposes `NP;RR`, field scale, viewport and `-1/12` display phase as separate controls. | implemented design fact | `100x100`, `1000x1000`, `6x6`, `7x7`, `8x8` and `25x25` can be compared as views without treating resolution as state cardinality. |
| `SYN-A0-04` | Blue Body and GAME 4 LIFE +1 can consume the same record grammar while retaining different carriers and update laws. | source-bound architectural finding | Application reuse belongs in adapters and receipts, not in an identity merge. |
| `SYN-A0-05` | A useful demonstrator terminates in a typed Return receipt rather than in an attractive image. | method decision | Every story must report source, operation, preserved data, lost data, residual and failure state. |

No statement above establishes a physical Root Room, a privileged golden
angle, a five-fold natural law, a new Life rule or an intrinsic Blue Body
interior.

## Working hypothesis

Let a demonstrator record be

```text
D = (C, A, O, P, K, W)
```

where:

- `C` is the source carrier;
- `A` is its typed address;
- `O` is a declared operator or view control;
- `P=(P_front,P_top,P_side,P_iso)` is the synchronized projection tuple;
- `K` is a comparator or negative control;
- `W` is the witness/residual required for Return.

Bounded hypothesis `H-SYN-01`:

> If every application adapter consumes the same typed record `D`, changing a
> projection or aperture can remain distinguishable from changing the source
> state, and a failed reconstruction can stop at the Return gate instead of
> being hidden by visual continuity.

This is an instrument-design hypothesis. It becomes a formal result only for
a frozen carrier, map, residual and verifier. It becomes a usefulness claim
only after a separately admitted comparison with a baseline and Human-facing
success criteria.

## Story A — Blue Body interior demonstrator

### Goal

Expose the inside of the existing `48`-address Blue Body host as an inspectable
control room without claiming that the CRT16/Pentagon tile is its intrinsic
geometry.

### Proposed run

1. Select one Blue Body source address in `Q4 x P3`.
2. Bind the declared ordinal adapter
   `B(c,l)=(P_l,(c&8)|gray3(c&7))` from `I16 x P3` to `Q4 x P3`. The prime
   modulus attached to `c` remains a label and contributes no Q4 adjacency.
3. Apply one bounded view control: C5 rotation, aperture, fold seam or
   `-1/12` display tick.
4. Render front, top, side and isometric views from the same selected record.
5. Compare the changed view against the unchanged source address and against a
   negative view control.
6. Produce a receipt containing source address, adapter ID, projection
   parameters, preserved coordinates, lost coordinates and residual witness.

### What it shows

- where an address enters the body view;
- which local layer, seam or aperture is active;
- how four projections describe one selected display state;
- whether the source address remains recoverable.

### What it can teach

- visual depth is not carrier identity;
- a seam is not yet a channel;
- an aperture changes visibility, not automatically state;
- an interior becomes useful when it exposes invariants and failure receipts.

### Implemented engineering return — 2026-10-15

The Blue Body instance is now implemented at
`A0_BOOK/A0_TESSAREC_BLUE_BODY_LAB.html#blue-body-interior-crt16`. All 48
ordinal-layer pairs are collision-free, round-trip exactly, and render in four
synchronized projections. Phase and Kite/aperture controls leave the source
key unchanged. Withholding the Return witness yields
`HOLD_MISSING_WITNESS`. The dedicated validator passes 237 assertions.

This closes the local adapter implementation gap only. It does not establish
CRT-to-Q4 topology, intrinsic interior geometry or application utility.

## Story B — GAME 4 LIFE +1 extension

### Goal

Reuse the same record grammar on the closed LIFE08 carrier while leaving the
Conway `B3/S23` update, boundary operator, seed and trajectory unchanged.

### Proposed run

1. Select one persistent event address `(x,y,g)`.
2. Encode a local `NP;RR` sheet only as an address/view adapter.
3. Apply the existing generation projection and optional Ghostgrid lens.
4. Render field, event/register, phase/boundary and Temporal-Z history views.
5. Compare the native Life record with the projected view and a magnitude- or
   resolution-collision control.
6. Return the persistent event ID, native address, generation, rule metadata
   and projection residual.

The Ghostgrid must not become a new Life neighborhood. A future `6x6`, `7x7`
or `8x8` comparison is valid only as a view or as a separately declared rule
experiment.

### Implemented transfer control — 2026-10-15

The independent control is now implemented at
`A0_BOOK/A0_GAME_4_LIFE_PLUS_1.html#blue-body-transfer`. The 48 Blue Body
addresses map bijectively to the 48 cells of a finite-dead `8x6` one-hot LIFE
display. Before dynamics, the cell coordinate returns the source address
exactly. After one unchanged Conway `B3/S23` step, every singleton becomes the
same empty state.

The typed branch retains the Blue Body Source Key and returns
`PASS_TYPED_TRANSPORT_RETURN`. The dynamics-only branch is deliberately
ablated and returns `HOLD_DYNAMICS_ONLY_AMBIGUOUS` with 48 candidates. The
dedicated validator passes 295 assertions. This closes the implementation gap
for the transfer control while leaving comparative usefulness open.

## Crosswalk

| Stage | Grid / CRT16 | Blue Body story | GAME 4 LIFE +1 story | Required test |
|---|---|---|---|---|
| Source | 16 channels or `NP;RR` field | one of 48 `Q4 x P3` addresses | one persistent `(x,y,g)` event | source identity frozen |
| Address | modulus/channel or `n=S*NP+RR` | host address plus explicit local adapter | native event ID plus optional view address | encode/decode round trip |
| Operator | C5 rotation, aperture, seam, phase | display-only local interior control | generation/view projection; `B3/S23` unchanged | operator cannot mutate source implicitly |
| Projection | front/top/side/isometric | four synchronized body-interior views | field/register/boundary/Temporal-Z views | all views report same source key |
| Comparator | alternate aperture, viewport or ablation | source vs observed envelope | native event vs view/collision control | at least one negative control |
| Return | source + parameters + residual | exact address or explicit `HOLD` | persistent event ID or explicit `HOLD` | fail closed on missing witness |

## Minimum demonstrator tests

1. **Address round trip:** `decode(encode(NP,RR,S),S)=(NP,RR)` for
   `S in {100,1000}`.
2. **Phase periodicity:** `c12(n,t+12)=c12(n,t)` and a reverse tick restores
   the previous display state.
3. **Projection synchronization:** all four CRT16 projections expose the same
   selected channel and phase record.
4. **View invariance:** viewport or aperture changes do not mutate the source
   carrier address.
5. **Application separation:** Blue Body and GAME 4 LIFE +1 use different
   carrier IDs and different update contracts.
6. **Negative control:** withholding a required address or residual produces
   `HOLD_MISSING_WITNESS`, never an inferred reconstruction.
7. **Claim ceiling:** the receipt explicitly rejects physical mechanism,
   carrier identity merge and publication authority.

## Paper disposition

- **Paper C** remains the controlling method lane for projection, residual and
  Return without identity.
- **Paper E** may use the two-story crosswalk as a concrete example of the
  orientation method, not as evidence that the method is effective.
- **Paper F** may add `H-SYN-01` as an instrument-architecture hypothesis: one
  frozen source record, several synchronized observed envelopes, one explicit
  Return receipt.
- A new scientific paper or `F-A0` finding is not warranted by the present
  synthesis alone.

## Next permitted implementation

The `A0 Living Blueprint` remains the two-story crosswalk. Both bounded build
targets are now implemented: the Blue Body interior route provides an exact
address Return, and GAME 4 LIFE +1 provides the negative application-transfer
control. The record grammar transfers; the carrier and native dynamics do not.

```text
NEW_STUDY = NO
NEW_F_A0_FINDING = NO
NEW_NAVIGATOR_IDENTITY = NO
NEW_GRAPH_RELATION = NO
APPLICATION_DEMONSTRATOR = IMPLEMENTED_SOURCE_BOUND_ENGINEERING_CONTROL
PUBLICATION_AUTHORIZED = NO
```
