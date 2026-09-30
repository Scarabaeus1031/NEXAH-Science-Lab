# OLS Prime Generation Profile 0.1 — Project Intake

```yaml
record_id: OLS_PRIME_GENERATION_PROFILE_0_1_2026_09_30
date: 2026-09-30
human_owner: Thomas
study_owner: Human Owner
record_class: BOUNDED_RESEARCH_PROJECT
method_class: TYPE_D_DESIGN_AND_TEST_PREPARATION
native_status: PROJECT_CREATED_NOT_PREREGISTERED
lab_status: FILED_NO_ACTIVATION
reproducibility: R0_PROJECT_DOCUMENTED
research_activation: NO
scientific_result: NO
novelty_confirmed: NO
ols_changed: NO
```

## Owner decision

The Human Owner authorizes creation of a bounded follow-on project connecting
the existing `n+1` Relational Stack candidate to an explicitly typed prime
sequence application. Creation of this project does not authorize execution,
promotion, OLS modification or a mathematical novelty claim.

## Working proposition

Let `p_n` denote the one-based ordered prime sequence. The base-phase local
cell is

```text
G_k = (p_(4k+1), p_(4k+2), p_(4k+3)) | p_(4k+4),  k >= 0.
```

The first three entries are local ordered records. The fourth entry has the
local role label `+1 / Binder`. That role is induced by the declared cut. It is
not asserted to be an intrinsic property of every fourth prime.

The profile asks whether a typed `3+1` record, its internal gaps, its forward
transition and matched alternative cuts provide useful orientation or
comparison information beyond the grouping rule itself.

## Why OLS matters here

OLS remains the semantic authority. This project applies the released order

```text
OBSERVE -> REPRESENT -> COMPARE -> ORIENT -> EXPLAIN
```

to one bounded prime-sequence case. `A`, `B`, `C`, `+1`, `SELECT`, `CUT`,
`RETURN` and `NEXT` are local profile roles or verbs. They are not new OLS
primitives and do not modify OLS 1.0.

The profile also prevents one glyph from silently carrying several meanings.
In particular, `101` must remain typed by record:

- prime-stream value `p_26 = 101`;
- factor `101` in the separate `F_50` factor field;
- any selector, carrier, grid or code role only where separately declared.

Equal numeric value does not imply equal function.

## Frozen planning horizon

- base phase: seven complete `3+1` cells, `p_1` through `p_28`, ending at 107;
- matched shifted phases: seven complete cells each, requiring `p_1` through
  `p_31`, ending at 127;
- no extrapolation beyond this finite horizon in Project 0.1.

## Package map

1. [Project scope and boundaries](01_PROJECT_SCOPE.md)
2. [Prime-cell ledger](02_PRIME_CELL_LEDGER.md)
3. [OLS application profile](03_OLS_APPLICATION_PROFILE.md)
4. [Test and control plan](04_TEST_AND_CONTROL_PLAN.md)
5. [Machine-readable project record](project_record.json)

## Predecessors

- [n+1 Relational Stack candidate](../NEXAH_N_PLUS_ONE_RELATIONAL_STACK_CONTRIBUTION_2026-09-30/00_README.md)
- [mod-6 prime-window state operator](../NEXAH_MOD6_PRIME_WINDOW_STATE_OPERATOR_2026-09-28/FINAL_REPORT.md)
- [Vendessimal prime-grid forensic audit](../NEXAH_VENDESSIMAL_PRIME_GRID_FORENSIC_AUDIT_2026-09-28/FINAL_REPORT.md)
- [Prime Lens follow-on contract](../NEXAH_ROOT7_EULER_MIRROR_CONCORDANCE_INTAKE_2026-09-28/11_PRIME_LENS_FOLLOWON_TEST_CONTRACT.md)
- OLS 1.0 remains canonical in NEXAH Core; this Lab project does not alter it.

## Current status

```text
PROJECT CREATED / NOT PREREGISTERED / NOT EXECUTED / NO CLAIM
```

## Next permitted action

Draft and owner-review one preregistration that freezes the four phases,
representations, controls, metrics and interpretation rules. No computation
may be promoted as a project result before that gate.
