# NEXAH Navigator — Entry Architecture Review

Date: `2026-10-07`  
Status: `REVIEW COMPLETE / IMPLEMENTATION NOT YET APPLIED`  
Scope: Navigator capability register, architecture blueprint, build plan, visual language, Start/About copy and current application shell

## Decision

The Navigator has the right content and the correct epistemic safeguards, but
its first layer is currently too dense. The landing page tries to explain the
framework, show the inventory, expose the family architecture, demonstrate a
cross-system visual, state the research question, offer primary entrances,
list secondary routes and repeat the invitation in one continuous page.

The next change should therefore be an **entry-architecture pass**, not another
module or top-level route. The existing deep links and governed registries
remain stable.

## Sources reviewed

1. `NEXAH_NAVIGATOR_CAPABILITY_AND_CONNECTOR_REGISTER_2026-10-06.md`
2. `NEXAH_MASTER_NAVIGATOR_ARCHITECTURE_BLUEPRINT_2026-10-05.md`
3. `NEXAH_MASTER_NAVIGATOR_BUILD_PLAN_V2_2026-10-06.md`
4. `NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md`
5. `APP/START_AND_ABOUT_COPY_V1_2026-10-06.md`
6. `APP/index.html`, `APP/app.js` and the current validated internal manifest
7. Navigator utility and contract review documents

Current technical state at review time:

- application audit: `PASS 91/91`;
- 170 internal entities;
- 23 typed relations;
- 15 modules;
- 140 surfaces;
- 15 evidence entities;
- public admission remains empty and fail-closed.

## What the capability register actually says

The Navigator is an orientation, retrieval, comparison and connection
instrument. It is not the authority for currentness, scientific adoption,
publication or OLS vocabulary.

Its capabilities fall into four practical groups:

1. **Orient** — explain the place, the question, the boundaries and the roles.
2. **Explore** — enter frameworks, families, sequences, modules and instruments.
3. **Verify** — inspect evidence, provenance, claim ceilings and negative results.
4. **Govern internally** — inspect currentness, admission, paths, hashes and
   unresolved records.

The first three are reader tasks. The fourth is an internal control layer and
should not compete with them on the first screen.

## Current implementation versus the intended architecture

### What already works

- The opening language is clear and bounded.
- The three verbs `Understand · Explore · Verify` are correct.
- Comparison and identity are explicitly separated.
- Framework, families, objects and evidence are distinguished.
- About explains UTG as exploratory rather than universal.
- Evidence and claim ceilings remain visible.
- Deep links, keyboard routes and instrument-first actions are implemented.
- The Atlas, Sequence, Lineage, Catalog and Admission views each have a valid
  role once a reader has entered the instrument layer.

### Where the entrance has become overloaded

The current home renders, in order:

1. hero and three actions;
2. starting questions;
3. claim boundary;
4. value statement;
5. inventory metrics;
6. four-level architecture;
7. Family Connection Map action;
8. interactive family map including candidate and historical F8 distinctions;
9. comparative-dynamics visual bridge;
10. central research question;
11. a second set of three entrances;
12. seven secondary links;
13. a second invitation.

All of these parts are individually defensible. Together they make the first
screen behave like a compressed encyclopedia rather than an orientation
threshold.

The current sidebar has fourteen equal top-level routes. This does not yet
implement the six-domain decision already recorded in the capability register:

`Orientation · Framework · Families · Language · Atlas · Evidence`

About is correctly persistent but currently appears as another numbered work
route instead of a utility destination.

### Documentation drift

The maintained capability register still states an older baseline of 14
families/modules, 39 surfaces, 121 HTML artifacts, 150 entities and 21
relations. The validated current manifest contains 15 modules, 140 surfaces,
170 entities and 23 relations. The architectural decision remains valid, but
the baseline paragraph must be regenerated or marked as a historical snapshot.

## Recommended three-layer entrance

### Layer 1 — Orientation threshold

This is what belongs visibly at the front:

- product identity: `NEXAH Science Navigator`;
- one concise value statement;
- one central question;
- the three actions `Understand · Explore · Verify`;
- one persistent boundary: `Comparison is not identity`;
- one small **Current focus** panel showing what was recently integrated and
  its status, not a general news feed;
- a quiet handoff to About.

The Current focus panel should initially point to:

- Primegrid / Pascal / 101;
- OIL/RIS Multi-Lens;
- Readout Reconstruction;
- the GLB Gateway;
- the open archaeology intake queue.

Each item must state `current`, `bounded`, `candidate`, `deferred` or another
registered lifecycle value. Recency must never imply promotion.

### Layer 2 — Six-domain map

The primary navigation should group existing routes without changing their
hashes:

| Domain | Existing destinations |
|---|---|
| Orientation | Home, Current focus |
| Framework | UTG, Dynamics, Ladders |
| Families | Family map, Sequence, Lineage |
| Language | Envelope and future governed grammar views |
| Atlas | Connection Atlas, Catalog, module and instrument entrances |
| Evidence | Evidence, Relations, Admission |

`About` remains permanently reachable outside the numbered research workflow.

This is a grouping layer, not a taxonomy rewrite. `CF:F1–F7`, `HL:F1–F8` and
`CAND:F8_AXIS_EXTENSION` remain separate namespaces.

### Layer 3 — Instrument and custody depth

Only after a reader chooses a domain should the interface expose:

- complete module and surface counts;
- IDs, paths, hashes and source receipts;
- candidate/historical namespace distinctions;
- admission diagnostics;
- full secondary route rails;
- complete catalogs and archaeology queues.

This layer may remain dense because the user has deliberately entered an
instrument or governance context.

## Start-page recommendation

Retain:

- the existing hero language;
- the three starting questions;
- `Understand · Explore · Verify`;
- the persistent comparison/identity boundary;
- one visual preview or current-focus panel.

Move down or relocate:

- inventory metrics → Atlas or internal status drawer;
- full four-level explainer → About / Framework;
- complete F1–F7 plus candidate/historical grid → Families;
- comparative dynamics bridge → Explore / Dynamics;
- secondary seven-link rail → grouped domain navigation;
- repeated final invitation → remove or merge with the hero.

The landing page should answer five questions within one viewport:

1. Where am I?
2. What is this useful for?
3. What is the governing question?
4. What can I do next?
5. What must I not infer?

## About-page recommendation

About should explain identity, responsibility and method, not act as a second
home page. Its preferred order is:

1. What the Navigator is.
2. Why it exists.
3. How the four levels relate: framework → families → objects → evidence.
4. What it can and cannot establish.
5. Where authority lives: Mission Control, Science Lab, OLS, ORION,
   NEXAHEDRON and the Navigator.
6. How the Navigator fits into the wider NEXAH journey.

The current ecosystem grid is strong and should stay. The repeated central
question and repeated invitation can be shortened. A compact `Does / does not`
table would make the authority boundary faster to understand than additional
prose.

## Proposed implementation order

1. Correct the documented baseline counts.
2. Introduce the six-domain navigation grouping while preserving all hashes.
3. Reduce Home to the Orientation threshold.
4. Add the lifecycle-aware Current focus panel.
5. Refactor About around identity, authority and `does / does not` boundaries.
6. Re-run the app audit, keyboard checks and narrow-screen checks.
7. Perform a Human Owner walkthrough focused on the five first-viewport
   questions before adding more top-level material.

## Claim and publication boundary

This review changes no scientific status, OLS term, Connection Family,
Mission Control authority, public allowlist or release state. It recommends a
clearer projection of already governed content.
