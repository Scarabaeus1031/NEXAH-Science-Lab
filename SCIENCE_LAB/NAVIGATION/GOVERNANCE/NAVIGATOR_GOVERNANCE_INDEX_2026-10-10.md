# NEXAH Navigator Governance Index

Status: `CONTROLLING NAVIGATOR ENTRY / INTERNAL`  
Date: `2026-10-10`

## Read order

1. [Science Lab Constitution](../../LAB_CONSTITUTION.md)
2. [Navigator Constitutional Charter](NAVIGATOR_CONSTITUTION_V1_2026-10-10.md)
3. [Source Graph Policy](SOURCE_GRAPH_POLICY_V1_2026-10-10.md)
4. [Operating Workflow](NAVIGATOR_WORKFLOW_V1_2026-10-10.md)
5. [Machine-readable component index](SOURCE_GRAPH_INDEX_V1_2026-10-10.json)
6. [Science Lab & Navigator Handbook](../../NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07.md)
7. [Capability and Connector Register](../NEXAH_NAVIGATOR_CAPABILITY_AND_CONNECTOR_REGISTER_2026-10-06.md)
8. [Current-state record](../NEXAH_NAVIGATOR_V2_1_CURRENT_STATE_2026-10-07.md)

## One-system rule

The validated Navigator registry and declared components form one Source
Graph. Mission Control's Source Field is the broader discovery catalog. The
Mission Control Navigator Control page is a generated governance projection.
None is a second scientific authority.

## Commands

From `SCIENCE_LAB/NAVIGATION`:

```bash
node GOVERNANCE/validate_source_graph.mjs
node GOVERNANCE/build_mission_control_projection.mjs
node APP/audit_app.mjs
```

## Current composition

- canonical base: `329 entities / 29 relations`;
- admitted LIFE overlay: `3 entities / 3 relations`;
- composed internal view: `332 entities / 32 relations`;
- twenty governed component slices in the component index, including the
  read-only Lab Register lifecycle lens, the ORION capability/evidence lens and
  the public-safe internal THE EYE software-lineage lens, with private review
  receipts and Owner state retained in Mission Control, and
  the source-bound CRT/QRT 37 Carrier Ladder and MRB/ACR/NCS-Q106 Return
  Crosswalk lenses, plus the A0 Joint Application Return Protocol engineering
  lens and the Fold / Envelope / Frame / State comparison lens;
- public admission: `0`;
- publication authorized: `false`.

## Persistent instruction

`../AGENTS.md` makes this index the mandatory first read for future work in
the Navigator directory. The installed `nexah-navigator-governance` skill
applies the same preflight and return discipline across repositories.
