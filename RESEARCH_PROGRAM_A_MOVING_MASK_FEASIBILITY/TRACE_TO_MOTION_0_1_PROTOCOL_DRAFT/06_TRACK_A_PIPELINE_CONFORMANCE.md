# Track A — Pipeline Conformance

Status: `DRAFT — SYNTHETIC VALIDATION ONLY`

Verify deterministic transformations, opaque identity propagation, separation
of raw/normalized/trace/masked/reconstructed artifacts, schema enforcement,
reversal behavior, reconstruction, PGM rendering/parsing, topology, hashes,
leakage rejection and exact `UNKNOWN`/`INVALID`/`BLOCKED` propagation.

Nearest-neighbour distance is unordered and topology-blind. It must be paired
with a reversal-minimized order-sensitive comparison plus closure,
connectivity and self-intersection checks.

The bundled validator and fixtures share one implementation lineage. Valid
outcomes are `PASS_SELF_CONFORMANCE`, `FAIL`, `ERROR` and
`BLOCKED_INDEPENDENT_VALIDATION`. A pass is not scientific evidence and cannot
authorize acquisition.

Independent validation requires signed frozen oracle fixtures or a second
implementation authored without access to primary analysis code. Its interface
requires fixture/input/output IDs and hashes, expected status, oracle author,
implementation identity and authenticated reference. All independent fields
are currently `UNASSIGNED`.
