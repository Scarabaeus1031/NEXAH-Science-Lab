# Track B — Direction Identifiability

Status: `DRAFT — SCIENTIFIC TEST BLOCKED`

For one source `p`, compare direction-free packets derived from `p` and exact
`rev(p)`. Both have identical geometry, count and support. Human F/R drawings
are repeatability observations only.

The evaluator returns `PACKET_A_IS_FORWARD`, `PACKET_B_IS_FORWARD`, `UNKNOWN`
or `INVALID_PACKET`. Packet labels are randomized and truth sealed.

Allowed input: frozen trace coordinates or rendering, opaque packet ID and
response schema. Forbidden: time, direction, velocity, source order, semantic
filename, template, pairing, derivation order, markers, Owner explanation and
any metadata encoding class. Leakage yields `BLOCKED_CONTAMINATION`.

An evaluable pair requires two valid, support-identical, leak-free packets and
one preserved response. `UNKNOWN` is a valid abstention and remains in the
denominator. Report correct, incorrect, abstention, invalid and blocked counts.

No evaluator, classifier, accuracy threshold, chance criterion, sample count or
aggregate rule is adopted. Current result: `BLOCKED`.
