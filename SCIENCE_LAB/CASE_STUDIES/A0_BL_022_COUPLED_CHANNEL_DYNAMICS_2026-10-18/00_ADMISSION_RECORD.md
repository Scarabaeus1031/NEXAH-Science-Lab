# A0-BL-022 — Admission record

Date: `2026-10-18`

PROPOSAL_ID: `A0_BL_022_COUPLED_CHANNEL_DYNAMICS_2026_10_18`

OWNER: Human Owner

OWNER_AUTHORIZATION: prepare and start the next remaining experiment.

QUESTION: Does one explicitly typed `C5/C6` pulse channel have an exact full
Return distinct from the carrier-only Return, and does a one-sided phase kick
recover, persist or invalidate the model?

OBJECT: separate carriers `C5` and `C6`; declared ports in `C30`; one binary
channel memory bit; deterministic finite update.

METHOD: exact finite state-space enumeration, matched port control, phase-kick
control, Primary, Replay and independent verifier.

RESULT_VOCABULARY: `EXACT_PERIODIC_CHANNEL_WITH_PERTURBATION_MEMORY_AND_NONCANONICAL_PORTS`,
`NO_COUPLED_RETURN`, `PARTIAL`, `INVALID_DESIGN`, `UNINFORMATIVE`.

TARGET: `R2_LOCAL_REPLAY`.

IDENTITY_EFFECT: reuses existing `A0-BL-022`, `C5`, `C6`, `C30` and PENT-07
source records. Creates one lifecycle/run record, no canonical carrier,
Family, MONAD, flow law, vocabulary or Navigator identity.
