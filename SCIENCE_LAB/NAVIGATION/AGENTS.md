# NEXAH Navigator persistent operating rule

For every Navigator, Source Graph, source binding, Family, relation, evidence
lens, book, paper, HTML, GLB, application or Mission Control integration task:

1. Treat the Navigator as a Science Lab instrument governed by
   `../LAB_CONSTITUTION.md`, then read
   `GOVERNANCE/NAVIGATOR_GOVERNANCE_INDEX_2026-10-10.md`.
2. Run `node GOVERNANCE/validate_source_graph.mjs` before structural changes.
3. Search the canonical graph and Mission Control Source Field before creating
   a new identity, route, registry or database.
4. Reuse an existing stable ID when the object already exists; prefer typed
   relations or a source-bound lens over duplicated nodes.
5. Keep source authority, evidence state, lifecycle, visibility and
   publication status separate.
6. Preserve explicit non-identity, negative, null, open and historical states.
7. Never change canonical counts through an unadmitted lens.
8. Refresh the Source Graph index and generated Mission Control projection
   after material graph changes.
9. Run the relevant binder validators and `APP/audit_app.mjs` after changes.
10. Report reused and new IDs, changed relations, unresolved duplicate risks,
    validation and authority effects.

Mission Control governs currentness, priority, activation and release. Source
repositories retain scientific and implementation authority. Navigation is
not admission, identity, validation, activation or publication.
