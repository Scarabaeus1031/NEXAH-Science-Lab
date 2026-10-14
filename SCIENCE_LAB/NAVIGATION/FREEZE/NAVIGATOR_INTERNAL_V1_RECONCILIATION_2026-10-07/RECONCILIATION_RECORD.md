# Navigator Internal v1 — P5R Freeze Reconciliation

Date: `2026-10-07`

Status: `RECONCILED / INTERNAL / NOT ADMITTED / NOT PUBLIC`

Authority: Human Owner continuation instruction after review of the P5 return.

## Result

This package resolves the six-file hash ambiguity discovered before LIFE01 P5
without modifying or replacing the original freeze. It preserves two explicit
states:

1. the original seventeen-file v1 baseline in
   `../NAVIGATOR_INTERNAL_V1_2026-10-07/`;
2. the reconciled seventeen-file current internal baseline in this directory.

Eleven file hashes are identical across both states. Six files have an exact
old/new hash pair in `RECONCILIATION_DELTA.json`:

- `APP/index.html`;
- `APP/app.js`;
- `APP/styles.css`;
- `APP/audit_app.mjs`;
- `APP/build_entry_data.mjs`;
- `APP/entry.internal.js`.

The pre-P5 snapshot proves that all six differences existed before the
LIFE//ORBIT Navigator candidate was constructed. P5 and P5R changed no
Navigator application file.

## Interpretation

This is an evidence-preserving hash successor, not a retroactive claim that
every semantic edit between the two states belonged to the original v1
freeze. The original freeze remains the historical baseline. The reconciled
manifest is the controlling integrity baseline for the current internal app
state.

The current application separately passes its own Navigator audit. That audit
tests the current internal behavior; it does not rewrite the historical
`99/99` receipt in the original freeze record.

## Boundaries

- LIFE//ORBIT remains an isolated Navigator-v2 candidate.
- No candidate route or entity is canonically admitted by this reconciliation.
- No public entity, publication, deployment, research activation or outreach
  is authorized.
- Any admission step requires a new Human Owner decision.

## Verification

From the Science Lab repository root:

```sh
node SCIENCE_LAB/NAVIGATION/FREEZE/NAVIGATOR_INTERNAL_V1_RECONCILIATION_2026-10-07/verify_reconciled_freeze.mjs
node SCIENCE_LAB/NAVIGATION/APP/audit_app.mjs
```

The first command verifies the original manifest and record hashes, the P5
baseline, all six old/new pairs, all seventeen current hashes, eleven unchanged
files and the non-admission boundary.
