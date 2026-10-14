# Transition & Identifiability Observatory · Navigator binding

Status: `INTERNAL / READ-ONLY / NAVIGATOR V2 LENS / NOT PUBLIC`

This package binds the frozen Observatory V1.3 result into the existing NEXAH
Science Navigator without changing the frozen v1 registry, adding a Functional
Family or transferring authority from any source instrument.

The binding keeps two namespaces distinct:

- `CF:F1–F7` are the seven canonical Connection Families;
- `TF:01–TF:08` are the eight fields of the canonical inspection record.

The Family↔Field crosswalk records emphasis for navigation. It is not an
identity matrix and does not assert that a family owns a field exclusively.

## Build and validate

From the repository root:

```sh
node SCIENCE_LAB/NAVIGATION/EVIDENCE/TRANSITION_IDENTIFIABILITY_OBSERVATORY_2026-10-07/validate_observatory_binding.mjs
node SCIENCE_LAB/NAVIGATION/EVIDENCE/TRANSITION_IDENTIFIABILITY_OBSERVATORY_2026-10-07/build_observatory_data.mjs
node SCIENCE_LAB/NAVIGATION/APP/audit_app.mjs
```

The generated `observatory.internal.js` keeps the route usable under `file://`.
All scientific and provenance authority remains in the Observatory package.
