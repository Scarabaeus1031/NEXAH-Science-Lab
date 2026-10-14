# A0-BL-051 — Pascal / Generation Return Test Draft

Date: `2026-10-10`

Status: `PREPARE / NON_EXECUTABLE_TEST_DESIGN / ADMISSION_REQUIRED_BEFORE_RUN`

Reproducibility class: `R0_DOCUMENTED`

Parent crosswalk:
[`A0-BL-050`](29_A0_PASCAL_GENERATION_CORNER_CROSSWALK_2026-10-10.md)

Preparation archaeology:
[`CON–DAO / Return Series Archaeology`](31_A0_CON_DAO_RETURN_SERIES_ARCHAEOLOGY_2026-10-11.md)

## Question

Can the five-phase Pascal / Generation Corner crosswalk preserve relation
genealogy, keep three generation coordinates separate and classify Return
without inferring identity from representation?

This is a design question only. It is not an admitted Study, preregistration,
Run Contract or authorization to execute.

## Declared object

A record is

```text
X = (carrier_id, t, g_R, g_P, g_M, value, address,
     parents, rule, relation_graph, view_id, invariants)
```

The three generation coordinates are independent fields:

- `g_R`: relation/system lift;
- `g_P`: Pascal row/depth;
- `g_M`: declared operator iteration.

## Five gates

### Gate 1 — Relation-object reconstruction

Given `R_(n,k)`, recover the two parent addresses, addition rule and result
address. Duplicate values at different addresses are a mandatory control.

PASS requires exact reconstruction. A value-only record must fail.

### Gate 2 — Coordinate separability

Construct matched records in which exactly one of `g_R`, `g_P` or `g_M`
changes. A classifier must report the changed coordinate without changing the
other two.

PASS requires zero silent coordinate collapse. The negative control relabels
all three fields as one generic `generation` and must lose information.

### Gate 3 — Representation-change accounting

Present one declared carrier through at least two non-identical views. Compare
carrier ID, relation graph, addresses and view-local geometry.

PASS requires retained/changed/lost/introduced accounting. Similar colour or
outline must not create carrier identity.

### Gate 4 — Return-level classifier

Use frozen examples for the four levels:

1. exact state equality;
2. same carrier with changed position or side;
3. isomorphic relation structure;
4. one declared invariant only.

A0-BL-045 supplies a mandatory separation control: the signed reciprocal
bridge has an algebraic return law but is not a Euclidean isometry.

PASS requires the strongest supported level and forbids promotion from a
weaker level.

### Gate 5 — Non-identity stress test

Inject visually or arithmetically salient labels such as `29|30|31`,
`40|41|42`, repeated colours and similar arcs without a carrier map.

PASS requires `NO_IDENTITY_INFERRED`. Any automatic Pascal, Janus, physical or
Family assignment is a failure.

The preparation archaeology adds four mandatory matched controls:

- historical `720/1440` double-cycle versus the A0 `540/1080` side-state
  model;
- Game Over deck-ledger `55` versus `Z_3885/T^2` return-class count `55`;
- card-rank `13` versus CON–DAO carrier size `13`;
- nine named Return views versus nine operator iterations.

For every pair, numeric equality, label reuse or visual similarity without an
explicit carrier map and operator intertwining law must return
`NO_IDENTITY_INFERRED`. The historical `110/112` channel labels remain a STOP
control until a modulus, carrier and operator are declared.

## Decision table

| Outcome | Meaning |
|---|---|
| `PASS_BOUNDED` | all five gates pass for the frozen fixture only |
| `PARTIAL` | genealogy or Return typing works, but one separation gate fails |
| `NON_IDENTIFIABLE` | available records cannot distinguish the coordinates or Return levels |
| `INVALID_DESIGN` | a gate uses target labels, leaks provenance or lacks a matched control |
| `UNINFORMATIVE` | the record already contains the answer literally and no loss/change is tested |

## STOP

Stop without execution if:

- the Human Owner has not admitted one bounded Study;
- no frozen fixture and comparator exist;
- the expected outputs and failure semantics are incomplete;
- any gate depends on colour/name similarity as evidence;
- the proposed result would require a new canonical Family or OLS term.

## Admission package still required

Before a run, supply a Study Owner, frozen fixture, machine-readable schema,
matched controls, implementation, verifier, Run Contract, resource bounds,
hash manifest and closure path. Structure Freeze remains controlling.
