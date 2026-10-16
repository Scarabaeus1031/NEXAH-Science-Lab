# A0 Orientation Controller Bench — Science Desk Return

Date: `2026-10-16`

Status: `CURRENT_ENGINEERING_BASELINE / DOCUMENTARY_GAPS / NO_ACTIVATION`

Authority: `A0 SCIENCE DESK`

Identity: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`

Navigator lens: `SG:LENS:A0_ORIENTATION_EVIDENCE`

## Return

The Orientation Controller Bench (OCB) is current at `v0.11.0`. Its local
deterministic suite passes 65 checks. The implemented surface includes the
Pascal × Antipode phase journey, controlled iris, local `C8` octagon
projection, source-bound MIWA/ERITH/LOKI/E8 views, state exports and bounded
Return controls.

The blue circle is an **aperture/iris**. The octagon is a **projected view**.
Neither is identified with the source carrier, a physical object or a general
mechanism.

## Open work

The controlling gap register is
[`100_A0_ORIENTATION_CONTROLLER_BENCH_GAP_REGISTER_2026-10-16.md`](100_A0_ORIENTATION_CONTROLLER_BENCH_GAP_REGISTER_2026-10-16.md).
Its first priority is an explicit three-measure trace
`M3(t)=(h(t),A(t),I(t))` rendered without carrier mutation as:

```text
UNROLLED -> CYLINDRICAL -> TOP VIEW -> APERTURE SLICE
```

Calibration stack, Observing Cut, I/L/A/U record, binder exchange and bounded
return remain partial or source-only. These are backlog items, not an active
Study or build authorization.

## Authority boundary

- A0 Science Desk owns scientific currentness, evidence interpretation,
  backlog routing and claim ceilings.
- Science Navigator exposes a read-only source and relation projection under
  the existing A0 lens.
- Mission Control records portfolio currentness, priority, lifecycle and
  release state only.
- Human Owner retains activation, adoption, publication and STOP.

No new Navigator entity, canonical relation, Family, Study, scientific
finding, physical model or public claim is created by this return.

## Verification

```text
node A0_BOOK/a0-orientation-controller-bench-tests.cjs
=> PASS / version 0.11.0 / 65 checks
```

Return disposition:
`BOUND_TO_SCIENCE_DESK / NAVIGATOR_READ_ONLY / MISSION_CONTROL_CURRENTNESS_ONLY`.
