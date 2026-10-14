# Navigator Workflow V1

Status: `ACTIVE OPERATING PROTOCOL`  
Date: `2026-10-10`

## Before work

1. Read `NAVIGATOR_GOVERNANCE_INDEX_2026-10-10.md`.
2. Run `node GOVERNANCE/validate_source_graph.mjs` from
   `SCIENCE_LAB/NAVIGATION`.
3. Search stable IDs, paths, hashes, aliases and relation targets in the
   canonical manifest, admitted overlays and source-bound binders.
4. Search Mission Control's Source Field for unbound or supporting material.
5. State whether the work reuses, extends, relates to or genuinely creates an
   identity.

## During work

- preserve original files in their owning repository;
- use one stable ID per object;
- add typed relations instead of duplicating descriptions;
- record negative and open boundaries beside positive relations;
- do not modify base counts through a lens;
- do not use navigation placement as evidence or authority.

## After work

1. Validate every changed binder or registry.
2. Refresh `SOURCE_GRAPH_INDEX_V1_2026-10-10.json` when components or hashes
   change.
3. Run `node GOVERNANCE/build_mission_control_projection.mjs`.
4. Re-run `validate_source_graph.mjs`.
5. Run the Navigator application audit if its data or interface changed.
6. Rebuild the Mission Control Navigator catalog when visible source or
   governance entries changed.
7. Return one concise record of reused IDs, new IDs, changed relations,
   unresolved duplicates, validation and authority effects.

## STOP conditions

Stop and request Human Owner direction if the proposed work would:

- create a competing identity for an unresolved existing object;
- add a canonical Family or normative term;
- activate or reopen scientific work;
- change a claim ceiling or source authority;
- publish or expose internal sources;
- delete, merge or replace a stable identity.
