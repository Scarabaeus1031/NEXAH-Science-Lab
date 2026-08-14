# SL-GOV-003 — Public Frontstage / Private Backstage Boundary

Date: `2026-08-14`

Status: `OWNER_ADOPTED`

## Decision

The root `README.md` is the public entrance to NEXAH Science Lab.

The Science Lab Research Director Desk is private operational infrastructure
and lives in the private NEXAH Mission Control repository under:

`00_LAB_RESEARCH_DIRECTOR_DESK/`

## Public Science Lab owns

- understandable scientific orientation;
- bounded protocols, methods and implementations;
- evidence manifests and reproducibility records;
- positive, negative, invalid, inconclusive and uninformative results;
- the public Lab Register, Constitution, reports and contribution boundary.

## Private Mission Control owns

- daily and weekly scheduling;
- WIP selection and personal role check-in;
- owner decisions and unresolved bottlenecks;
- cleanup queues and local archive inventory;
- publication and repository handoff preparation.

Private records may point to public science. They cannot silently adopt,
reinterpret or modify a public scientific result. Public scientific records do
not create a private task unless Mission Control accepts one.

## Migration rule

The previously public `00_LAB_ENTRY/`, Active Work and Lab Desk management
files remain temporarily as explicit historical migration snapshots. Public
artifact manifests remain at their existing `LAB_DESK/ARTIFACTS/` paths to
avoid breaking evidence links. Removal or relocation requires a later exact
allowlist after the private Desk is remote-durable.

## Machine-readable conclusion

```text
PUBLIC_REPOSITORY_ENTRY = README.md
PRIVATE_RESEARCH_DIRECTOR_DESK = 00_LAB_RESEARCH_DIRECTOR_DESK
PUBLIC_SCIENTIFIC_AUTHORITY_TRANSFERRED = NO
SCIENTIFIC_RESULT_CHANGED = NO
LAB_OPERATIONS_STATE = STRUCTURE_FREEZE
```
