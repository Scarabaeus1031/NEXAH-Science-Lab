# NEXAH Navigator — registry adapter specification v1

Date: `2026-10-06`

Status: `WP2 INTERNAL ADAPTER / PUBLIC FAIL-CLOSED / NO ALLOWLIST`

## Inputs

| Input | Native objects | Adapter result |
|---|---:|---|
| Module Registry v2 | 14 modules, 33 surfaces, 8 relations | Module and Surface entities plus typed relations |
| HTML Artifact Registry v1 | 111 artifacts | Surface entities; overlapping Registry surfaces are enriched, not duplicated |
| Polar-Janus Evidence Slice v1 | 15 evidence nodes, 6 relations | Evidence entities plus evidence-specific typed relations |

## Identity rules

- Native `MOD:`, `ART:` and `EVID:` IDs are retained.
- Native `REL:` IDs are retained.
- `EVIDREL:` is normalized to `REL:EVIDENCE:` because the Navigator relation
  schema has one relation namespace.
- Surfaces found in both source registries become one entity with combined
  source metadata.
- Paths and source hashes are Internal fields only.

## Semantic mapping

- A module’s summary, status, claim ceiling, roles, related modules and
  connection families transfer directly.
- An HTML artifact’s explanation becomes its summary; assessment,
  representation, technology and review flags remain typed attributes.
- An evidence node retains both `local_verdict` and
  `current_interpretation`; neither overwrites the other.
- Module Registry `method` becomes `method-grammar`; `open` becomes
  `open-candidate`; `non-identity` remains `non-identity`.
- Evidence-specific relation types are retained as
  `historical-predecessor`, `post-hoc-context`, `qualified-comparator`,
  `operational-comparator`, `representation-expansion` and
  `negative-boundary`.

## Public boundary

No object is admitted automatically. Until an exact Human Owner allowlist
exists, the adapter emits:

- the complete validated Internal projection;
- an empty Public preview manifest;
- one rejection entry per Internal entity with reason
  `NO_PUBLIC_ALLOWLIST`.

Visual quality, an existing HTML page, an active Ring-1 role or a historical
PASS never substitutes for public admission.
