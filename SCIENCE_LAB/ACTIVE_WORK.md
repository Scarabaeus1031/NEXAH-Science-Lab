# Science Lab — Active Work

Status date: 2026-08-14

Lab operations state: **STRUCTURE_FREEZE**

## Scientific WIP

| Slot | Record | Status |
|---|---|---|
| ACTIVE 1 | `NONE` | No scientific execution authorized |
| OPEN 1 | `NONE` | Admission paused |
| OPEN 2 | `NONE` | Admission paused |

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

- [ ] Constitution and adoption record are tracked and remote-durable.
- [ ] `00_LAB_ENTRY` reaches Constitution, Active Work and Lab Register.
- [ ] Lab Register contains only owner-accepted current control records.
- [ ] New-work intake cannot create a Lab without owner admission.
- [ ] Run Contract distinguishes documentation, verification, replay and
      external replication.
- [ ] Contributor Onramp states one safe first action and all claim boundaries.
- [ ] Existing protocols, ledgers and the Labreport index are tracked.
- [ ] Master Status, portfolio and Lab Desk agree on `STRUCTURE_FREEZE`.
- [ ] All Constitution V1 control-surface navigation links pass.
- [ ] A clean checkout exposes the complete entry and governance route.
- [ ] Human Owner records a separate `REOPEN` or `REMAIN_FROZEN` decision.

Until the final checkbox receives a Human decision:

`ACTIVE_RESEARCH_CYCLE = NONE`
