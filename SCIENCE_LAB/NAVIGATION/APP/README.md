# NEXAH Navigator · internal read-only pilot

This directory contains the first functional WP3 Navigator shell. It consumes the
strictly validated internal manifest and presents the same registry objects through
four task-specific views: catalog, connection families, typed relations and evidence.

## Prime · Bridge lineage lens

The `#lineage` route adds a bounded visual and GLB evidence view without
changing the validated 140-entity manifest or public admission state. Its
source is:

- `../EVIDENCE/PRIME_BRIDGE_LINEAGE_2026-10-06/PRIME_BRIDGE_LINEAGE_BINDER_V1_2026-10-06.json`
- generated browser data: `lineage.internal.js`

The lens contains 11 hashed owner-supplied visuals, 4 currently verified GLBs,
3 census-only GLB recovery leads, 12 typed lineage nodes and 10 bounded links.
It keeps `8×8`, `8|8`, `v0.8`, `v8.8` and `PG88` distinct. It does not promote
a physical claim, Ramanujan theorem or graph-theoretic Euler-path result.

## Unified Transition Geometry lens

The `#utg` route places Unified Transition Geometry above the existing views as
an exploratory orientation framework. Its source is:

- `../EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/UTG_FRAMEWORK_BINDER_V1_2026-10-06.json`
- generated browser data: `utg.internal.js`

The lens contains four hashed owner-supplied plates, the maturity ladder
`Framework → Formal Model → Validated Application`, and four media
constellations linking plates, the Navigator, existing GLB lineage, equation
candidates, evidence and Mission Control return. Only Framework is current at
the UTG-wide level.

The Home and UTG routes now also expose a direct interactive family map. It
keeps canonical `CF:F1–F7`, candidate `CAND:F8_AXIS_EXTENSION` and historical
`HL:F8` distinct; no canonical F8 or F9 is implied.

## Open

Open `index.html` directly in a browser. The manifest is packaged as
`data.internal.js`, so the read-only pilot works under `file://` without a local
server or a remote dependency.

## Rebuild and audit

From the repository root:

```sh
node SCIENCE_LAB/NAVIGATION/BUILD/build_registry_exports.mjs
node SCIENCE_LAB/NAVIGATION/APP/build_app_data.mjs
node SCIENCE_LAB/NAVIGATION/EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/validate_utg_binder.mjs
node SCIENCE_LAB/NAVIGATION/EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/build_utg_data.mjs
node SCIENCE_LAB/NAVIGATION/APP/audit_app.mjs
```

The app data builder accepts only the internal profile. Public data is intentionally
not wired into this pilot. Publication still requires a separate admitted public
manifest, release receipt and explicit authorization.

## Implemented in WP3 pilot

- deterministic, framework-free static shell;
- full-text search and object/family filters;
- stable hash deep links and browser history;
- module, surface and evidence details;
- instrument-first module pages with a direct master-HTML action and direct
  launch controls for every registered module surface;
- a clickable seven-family system atlas with module nodes, direct master
  instruments and a launch into the full Family Connection Map;
- a directed Sequence View from envelope and observer frame through root/rest
  and Hopf/F40 to the explicitly open F6 frontier and transversal F7 audit;
- a namespace guard that keeps canonical `CF:F1–F7`, historical `HL:F1–F8`
  and the owner-proposed `CAND:F8_AXIS_EXTENSION` visibly distinct;
- an owner-hypothesis layer for the F4 sender / F5 axis-carrier / F6 receiver
  reading plus proposed pentagonal and hexagonal carriers, all retained as
  `OPEN_BRIDGE` or `NON-IDENTITY` until typed contracts exist;
- a carrier-comparison lens joining Q4, LOKI-Q4 and the registered E8 240-root
  carrier without transferring identity or evidence between them;
- functional-first display names while retaining ERITH, Tessarec, E8/H3,
  Hopf/F40 and other established terms as aliases and leaving IDs unchanged;
- typed relation paths with negative boundaries;
- package-local verdict versus current interpretation;
- internal source receipt, path and SHA when available;
- responsive and keyboard-visible interaction states.
- role filters, guided relation paths and a fail-closed admission inspector;
- deterministic five-task WP6 answerability preflight.

The current preflight receipt is
[`WP6_INTERNAL_PREFLIGHT_V1_2026-10-06.md`](WP6_INTERNAL_PREFLIGHT_V1_2026-10-06.md).
Its `10/10` score means only that the frozen answers are present and linked; it
is not a human utility result.

This is an internal orientation instrument, not a scientific claim engine and not a
public release.
