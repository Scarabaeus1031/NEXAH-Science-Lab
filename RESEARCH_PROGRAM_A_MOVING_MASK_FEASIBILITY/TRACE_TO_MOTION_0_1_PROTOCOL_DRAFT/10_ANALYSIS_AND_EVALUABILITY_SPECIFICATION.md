# Analysis and Evaluability Specification

Status: `DRAFT — OWNER DECISIONS PENDING`

Track A units are fixture/check pairs; Track B units exact reversal pairs;
Track C units one source under two schedules; Human F/R remains a separate
repeatability unit.

Every attempt receives a UUID and remains in provenance. Failed first attempts
are `INVALID`; replacements link through `replaces_uuid`; repeated failure
blocks the case; incomplete sets yield no aggregate; malformed packets are
`INVALID_PACKET`; contamination and absent common support are `BLOCKED`.
Replacement count and complete-set requirements remain pending.

Track C keeps availability, conditional error and common-support error
separate. Each value carries its support count. `UNKNOWN` is never zero, an
error penalty, or evidence of no difference.

Historical thresholds `0.25/0.50 mm`, `120 Hz`, `1 ms`, `0.10 mm`, `25 ms`,
`1–8 s`, `5/10/15 mm`, `0.01 mm`, `2 mm`, `1 mm`, `0.05 tau` and H3 deltas lack
a complete documented basis. Duration is provisional; the others are
unsupported. H3 deltas and four-of-six are removed. Every future threshold
requires a declared evidence basis and pre-result sensitivity grid.

Terminal behavior: integrity failure `BLOCKED`; contract violation `INVALID`;
unavailable quantity `UNKNOWN`; valid diagnostics reported with support. No
aggregate scientific classification is currently defined.
