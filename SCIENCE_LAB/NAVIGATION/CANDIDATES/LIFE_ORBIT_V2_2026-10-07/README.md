# LIFE//ORBIT — Navigator v2 route candidate

Status: `INTERNAL CANDIDATE IMPLEMENTED / NOT ADMITTED / NOT PUBLIC`

This package is the isolated P5 route candidate for the validated LIFE//ORBIT
P4 instrument. Open `index.html` directly. It presents the family route,
typed relations, evidence boundary and an embedded local instrument without
editing the current Navigator APP.

The candidate source is:

```text
SCIENCE_LAB/NAVIGATION/NAVIGATOR_V2_DELTA_LIFE_ORBIT_2026-10-07.json
```

## Boundary

The original v1 freeze verifier already reported six pre-existing mismatches
at P5 start. P5 does not repair, overwrite or silently normalize them. Their
exact expected and actual hashes are recorded in
`results/V1_P5_BASELINE.json`; P5 modifies zero Navigator v1 files.

Validation:

```bash
npm run validate
shasum -a 256 -c SHA256_MANIFEST.txt
```
