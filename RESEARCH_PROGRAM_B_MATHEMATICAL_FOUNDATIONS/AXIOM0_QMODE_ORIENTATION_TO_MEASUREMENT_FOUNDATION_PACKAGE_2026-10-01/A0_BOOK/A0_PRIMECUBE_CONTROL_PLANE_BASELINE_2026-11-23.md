# Primecube Control Plane · Inventory, notation and baseline

Date: `2026-11-23`  
Status: `BOUNDED ENGINEERING/DOCUMENTATION BASELINE`  
Canonical home: existing A0 package and `A0_PRIMECUBE_GAP_FOLD_LAB.html`

## Disposition

This record performs steps 1–3 of the Owner-requested control-plane sequence:

1. inventory the current Primecube page without changing it;
2. freeze a typed notation and component grammar;
3. replay the already declared component periods and returns independently.

It extends the existing A0 instrument documentation. It creates no Study,
Finding, canonical identity, Source Graph relation, activation or publication
state. The combined `840`-step coupling test is explicitly not part of this
baseline.

## 1 · Current page inventory

The source page contains `20` visible principal sections and reports `33/33`
contract modules as demo-bound. The sections fall into five operational lanes:

| Lane | Existing sections | Baseline reading |
|---|---|---|
| Carrier/address | Primecube Workbench, Shadow Cube, H-record, Q/T20 Cube | retained integers and typed addresses |
| Geometry/topology | Root gate, Splinter Sail, ISO45 adapter, S/Z lab | view and fold operators; no physical mechanism |
| State/display | Q/T20, LOKI, Scarab, α/β field, fixed-point bands | distinct finite or iterative displays |
| Interface | QCTRL, Mathfield Deck, NLK and Number View ports | selector, typed switch or external port |
| Audit/return | contract audit, reviewer packet, Khipu ledger | evidence and return witnesses |

The machine-readable list is `SECTION_INVENTORY` in
`a0-primecube-control-plane-baseline.js`. It binds the exact HTML section IDs,
so a renamed or missing section fails the baseline test visibly.

## 2 · Typed grammar

| Token/component | Frozen role | Explicit non-role |
|---|---|---|
| `.` / `SOURCE_POINT` | addressed source latch | not decimal, product or phase signal |
| `·` / `CENTER_DOT` | selected grid cell | not source or multiplication |
| `.` / `DECIMAL_POINT` | declared scale change | not source point |
| `·` / `PRODUCT_DOT` | multiplication | not source or decimal point |
| `:` | open typed joint; no glue | not division, topology or phase transport |
| QCTRL | display selector with source return | not Q-Cube transition engine |
| Q-Cube | CRT state register for modulus `1001` | not the complete controller |
| `T20±` | reversible modular transition | not a Splinter fold |
| MZ24 | non-injective 24-slot phase readout with restricted image | not actuator, full 24-state clock or CRT identity |
| Mathfield Deck | typed adapter/view switch | not a common mechanism |
| ISO45 | axis-fixed view involution | not physical suspension or energy channel |
| LOKI | `C7 × C8` display-state cycle | not the local Splinter identity |
| `€` | Owner-candidate exchange-value view | not operator, measurement or mechanism |
| `¢` | unassigned glyph port on HOLD | no inferred meaning |
| Return receipt | source/return comparison gate | not evidence promotion |

The repeated glyph `.` is therefore not assigned one universal meaning. A role
identifier is mandatory. Likewise `:` may become the socket for a later phase
contract, but it does not transport phase in the present sources.

## 3 · Independent component baseline

The executable baseline confirms:

- Q-Cube: `Q=1001=7·11·13`, `ord(T20+)=ord(T20−)=60`, exact inverse and
  exact step-60 return;
- LOKI: `7×8=56` distinct states and exact `(0,0)` return at step `56`;
- ISO45: fixed `8↔27` axis, fold involution and exact view return;
- MZ24: all outputs remain within the declared 24-slot display and anchor `27`
  reads `90°`; however, the formula reaches only ticks `0…22`, so tick `23` is
  globally unreachable. On the specific T20 orbit only ticks `2…21` occur;
  `0`, `1`, `22` and `23` are absent;
- the ISO45 source diagonals are not invariant, while the declared symmetric
  control is invariant;
- the Splinter anchor set `{1,8,11,22,27,33}` is not closed under `T20`; its
  first images are `{20,160,220,440,540,660}`;
- the fold pairs do not have one shared MZ24 phase difference: `1↔11` gives
  `135°`, while `33↔22` gives `30°`.

The last two are retained negative baselines. They block a direct Q-Cube to
Splinter control claim until an explicit adapter is declared and tested.

## Holds and next gate

The following remain open by design:

- colon phase-transport contract;
- meaning of `¢`;
- operator status of `€`;
- Q-Cube/Splinter adapter;
- combined Q60/LOKI56/Fold2 `840`-step return test.

The next permitted engineering step is the separate `840`-step coupled-return
fixture. It must retain three state registers and may not infer a shared clock
or common carrier merely from the least common multiple.

## Replay

```bash
node a0-primecube-control-plane-baseline-tests.cjs
```

Expected classification: `PASS_BASELINE_WITH_EXPLICIT_HOLDS`.

## Governance return

- Identity action: extend/reuse existing A0 and typed source identities.
- New canonical IDs: `0`.
- Relation changes: `0`.
- Lab Register effect: none.
- Mission Control priority/currentness effect: none; bounded local source
  documentation only.
- Claim ceiling: exact finite arithmetic, typed interface inventory and local
  engineering replay; no physical, causal, currency or universal-theory claim.
