# Provenance and Evidence Authority

## Provenance minimum

For code-backed edges: repository, commit, file, callable, input/output artifact status, and verifying audit. Concrete artifacts use a URI/path plus hash where known. If origin cannot be reconstructed, `provenance_status: UNKNOWN` is mandatory; a nearby image is not substituted.

## Evidence redesign

The proposed single hierarchy was overlapping. Code, data, mathematics, external sources, and audits may jointly support one assertion, whereas `HISTORICAL_ONLY` and `SYMBOLIC_ONLY` describe content status rather than evidence authority.

The schema therefore uses repeatable evidence references with non-exclusive bases:

`CODE`, `DATA`, `MATHEMATICS`, `EXTERNAL_REFERENCE`, `AUDIT`.

Each reference includes a locator, assertion scope, and verification state `VERIFIED`, `PARTIAL`, or `UNVERIFIED`. Historical or symbolic content is represented by edge/content status and is explicitly non-technical. At least one verified technical basis is required for `VERIFIED`; audit prose alone cannot elevate an absent implementation.

This model makes evidence cumulative without pretending the categories form a total ordering.

