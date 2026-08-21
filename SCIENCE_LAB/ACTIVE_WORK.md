# Science Lab — Active Work

Status date: 2026-08-21

Lab operations state: **STRUCTURE_FREEZE · REMAIN_FROZEN**

Record status: **HISTORICAL_MIGRATION_SNAPSHOT**. Current private work control
lives at `NEXAH-Mission-Control/00_LAB_RESEARCH_DIRECTOR_DESK/ACTIVE_WORK.md`.
This public snapshot does not schedule work.

## Scientific WIP

| Slot | Record | Status |
|---|---|---|
| ACTIVE 1 | `NONE` | No scientific execution authorized |
| OPEN 1 | `NONE` | Admission paused |
| OPEN 2 | `NONE` | Admission paused |

`SL-CLEAN-001` is `DONE` as bounded non-scientific maintenance. It did not
occupy a scientific WIP slot or activate a research cycle.

`APP-01-H1` is `READY_NOT_ACTIVE`: Desk 05 has not accepted it and no work is
activated. Its only next gate is a separate Human Authority decision
`REOPEN_FOR_APP_01_H1_ONLY`, after the now-verified cleanup closure.

EXP-00-R retains its frozen scientific and engineering state but is not
operationally active during the Structure Freeze. No other research line may
occupy an ACTIVE slot.

## Authorized structure work

`SL-STRUCTURE-V1` — establish and independently verify the minimum Lab operating
system:

- Constitution V1;
- one Lab Register;
- one Active Work surface;
- intake/admission record;
- Run Contract;
- contributor onramp;
- tracked protocols, ledgers and Labreport index;
- synchronized Master Status, portfolio and Lab Desk;
- clean-checkout navigation verification.

## Structure Freeze exit gate

Every item must pass:

- [x] Constitution and adoption record are tracked and remote-durable.
- [x] `00_LAB_ENTRY` reaches Constitution, Active Work and Lab Register.
- [x] Lab Register contains only owner-accepted current control records.
- [x] New-work intake cannot create a Lab without owner admission.
- [x] Run Contract distinguishes documentation, verification, replay and
      external replication.
- [x] Contributor Onramp states one safe first action and all claim boundaries.
- [x] Existing protocols, ledgers and the Labreport index are tracked.
- [x] Master Status, portfolio and Lab Desk agree on `STRUCTURE_FREEZE`.
- [x] All Constitution V1 control-surface navigation links pass.
- [x] A clean checkout exposes the complete entry and governance route.
- [x] Human Owner recorded `REMAIN_FROZEN` on 2026-08-21.

`ACTIVE_RESEARCH_CYCLE = NONE`

The completed checklist does not authorize reopening. Any APP-01-H1 admission
requires the separate `REOPEN_FOR_APP_01_H1_ONLY` decision.
