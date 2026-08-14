# Epistemic Status — Single Source

Each epistemic dimension is one object containing exactly one controlled `status`, optional non-authoritative `note`, evidence references, and judgment:

- implementation;
- execution;
- reproducibility;
- provenance;
- claim support.

V2's duplicate top-level enum and unconstrained detail value are removed. No second machine-readable value exists. Notes cannot override status; a note saying “fully verified” beside `REJECTED` is misleading prose but cannot create a contradictory machine state.

