# ORION Capability & Evidence Lens

Status: `INTERNAL_READ_ONLY_SOURCE_BOUND_LENS`  
Maintained: `2026-10-10`

This Navigator lens separates five layers often compressed under the single
name ORION: OLS semantic authority, ORION Certified V1 product authority,
Science Lab L0–L4 evidence, historical implementations, and bounded external
interfaces with open Human Return gates.

It reuses existing identities. It creates no scientific entity or relation and
changes no canonical count. A Science Lab result does not silently extend
ORION product authority.

## Files

- `ORION_CAPABILITY_EVIDENCE_BINDER_V1_2026-10-10.json` — controlling lens;
- `validate_orion_binder.mjs` — source, status and boundary validation;
- `build_orion_data.mjs` — generates the internal browser payload;
- `../../APP/orion.internal.js` — generated payload.

## Rebuild

```sh
node SCIENCE_LAB/NAVIGATION/EVIDENCE/ORION_CAPABILITY_EVIDENCE_2026-10-10/validate_orion_binder.mjs
node SCIENCE_LAB/NAVIGATION/EVIDENCE/ORION_CAPABILITY_EVIDENCE_2026-10-10/build_orion_data.mjs
node SCIENCE_LAB/NAVIGATION/APP/audit_app.mjs
```

The lens is internal-only and does not authorize research, integration or
publication.
