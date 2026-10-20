# A0-BL-022 — post-run integration receipt

Date: `2026-10-18`

The pre-execution source lock passed `8/8` before Primary exposure. After the
authorized run and STOP, the mutable canonical A0 backlog was updated from
`A0-BL-022 ADMISSION_REQUIRED` to the returned result and A0-BL-020 was marked
closed. That required governance integration changes the current hash of one
locked parent document.

The frozen `LOCK.json` is intentionally not rewritten after result exposure.
Consequently, a later lock check against the live updated backlog reports that
single expected mismatch. The preregistration, protocol, runner, verifier,
PENT-07 result and visual-source manifest remain unchanged; Primary and Replay
remain byte-identical and both result verifiers pass `11/11`.

This receipt records lifecycle-currentness divergence, not scientific-source
repair. Future packages must lock an immutable backlog snapshot or omit a
mutable lifecycle ledger from the scientific source lock.
