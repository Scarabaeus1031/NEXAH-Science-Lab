# ROOT7 · LOOK orientation dossier

Status: `INTERNAL_READ_ONLY_ORIENTATION / SOURCE_BOUND / NO_REOPEN`

Date: `2026-10-08`

## Purpose

This package makes the already filed ROOT7 result legible without reopening it.
It joins two existing HTML instruments to the bounded closeout and keeps their
roles distinct:

1. the exact `8 → 16` sign-state fixture;
2. the historical ROOT7 bridge as a representation record;
3. the scientific closeout as decision authority.

The orientation page is [`index.html`](index.html). The machine-readable source
receipt is [`SOURCE_BINDING.json`](SOURCE_BINDING.json).

After the source audit passed, the dossier was exposed as the read-only
Navigator route [`#root7`](https://scarabaeus1031.github.io/NEXAH-Science-Lab/navigator/#root7). The Navigator
is a retrieval and orientation layer; this package remains the source record.

## Retained exact statements

- `2^3 = 8` is the three-bit sign carrier shown by the Q3 fixture.
- adding one independently declared binary channel gives `2^4 = 16`.
- the declared vector `(2,1,1,1)` has squared Euclidean norm
  `2² + 1² + 1² + 1² = 7`, hence length `√7`.

These are two related views, not one identity statement. The cardinality lift
`8 → 16` does not by itself derive the metric value `√7`.

## Scientific boundary

The governing ROOT7 closeout remains `CLOSED_BOUNDED`. It found:

- stretched-axis choice: `NON_IDENTIFIABLE`;
- endpoint routing: `ENDPOINT_INSUFFICIENT_HISTORY_REQUIRED`;
- SCN–ROOT7–angle–404 bridge: `NOT_IDENTIFIED`.

This dossier creates no new family, experiment, bridge, physical mechanism,
E8 identity or NEXAH Core claim. It is a read-only orientation layer over
existing evidence.

## Validation

Run:

```text
node audit.mjs
```

The audit verifies all four controlling source hashes, the two HTML links and
the visible claim boundary.
