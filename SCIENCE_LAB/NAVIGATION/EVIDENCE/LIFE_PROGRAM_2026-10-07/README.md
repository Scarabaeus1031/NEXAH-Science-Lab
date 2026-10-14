# LIFE Program · Navigator lens

Status: `INTERNAL / READ-ONLY / NOT PUBLIC`

This lens projects the authoritative LIFE Program Register into the existing
Navigator without rewriting package-local results or adding the records to the
frozen v1 entity registry.

It exposes four program lines, twenty records, eighteen dedicated HTML apps,
one Navigator host route and one non-HTML deterministic kernel. Valid-negative,
mixed and post-hoc explanatory results retain their original status and claim
ceiling.

```sh
node SCIENCE_LAB/NAVIGATION/EVIDENCE/LIFE_PROGRAM_2026-10-07/validate_life_program_binding.mjs
node SCIENCE_LAB/NAVIGATION/EVIDENCE/LIFE_PROGRAM_2026-10-07/build_life_program_data.mjs
node SCIENCE_LAB/NAVIGATION/APP/audit_app.mjs
```
