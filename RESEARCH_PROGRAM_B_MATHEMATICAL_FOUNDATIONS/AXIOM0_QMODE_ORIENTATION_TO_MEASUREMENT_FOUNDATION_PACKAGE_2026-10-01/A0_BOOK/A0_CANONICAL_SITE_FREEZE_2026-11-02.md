# A0 Canonical Site Freeze · 2 November 2026

Status: `OWNER_FIXED / CANONICAL_SITE_SOURCE / INTERNAL`

Freeze ID: `A0_CANONICAL_SITE_FREEZE_2026-11-02`

Human Owner directive: `2026-11-02`

## Fixed baseline

The one canonical A0 site remains:

```text
AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/
└── A0_BOOK/
    └── index.html#top
```

`A0_BOOK/index.html#top` is the stable entrance. `A0_BOOK/` is the only
maintained A0 source root. The identity remains
`NEXAH:A0:FROM_DISTINCTION_TO_READOUT`; this freeze does not create A0 v2 or a
parallel edition.

## Accepted composition

- `index.html#top` — canonical A0 entrance and portal.
- `A0_SCIENCE.html#top` — the restored long Science reader and internal Owner
  staging view beginning with “Read the relations.” Its structural source is
  the accepted 21 October 2026 A0 edit (`7d8838f5`); its dark control/atlas
  shell, visible staging marker and `#science-status-plate` distinguish it from
  the public nexah.de research presentation. It projects released scientific
  currentness and exit boundaries without copying private Desk tasks.
- `A0_WERKBANK.html` and THE MACHINA routes — subordinate Builder/Workbench
  rooms, not home pages.
- `A0_DATA_AND_REGISTERS.html` — subordinate source-bound register room.
- `NEXAH_SCIENCE.html` — bounded public/editorial Science cut and nexah.de
  source candidate, not the internal A0 Science staging reader and not a
  canonical entrance.
- NEXAHEDRON, nexah.de and Scarabæus 1033 — separate projections/channels.

Temporary previews, browser tabs, copied deployment files and generated Desk
projections are non-authoritative. They cannot replace the fixed entry by
being newer or visually different.

## One-version rule

- Maintain the accepted site in place under `A0_BOOK/`.
- Do not create `A0 v2`, `A0 new`, dated successor homes or parallel Science,
  Builder or Workbench homes for ordinary changes.
- New rooms and instruments remain subordinate routes of this A0 identity.
- A replacement baseline requires an explicit Human Owner decision, a new
  dated freeze record, an updated active manifest and an archive receipt for
  the superseded freeze.
- `A0/index.html` remains a redirect-only alias to `A0_BOOK/index.html#top`.

## Current pointer and drift detection

`A0_CANONICAL_SITE_FREEZE_MANIFEST.json` is the active machine-readable
pointer. `validate_a0_canonical_site_freeze.mjs` verifies the fixed path,
authority marker, freeze marker, short alias, absence of competing Mission
Control entries and hashes of the accepted baseline files.

The superseded 29 October freeze is preserved under:

```text
ARCHIVE/A0_CANONICAL_SITE_FREEZE_2026-10-29/
```

## Governance effect

This is a route/currentness and source-baseline decision only. It reuses
`NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1` and creates no scientific identity,
Source Graph relation, Study activation, claim promotion, publication
authorization or canonical count change.

## Validation

```sh
node a0-compact-navigation-runtime-tests.cjs
node a0-reader-navigation-tests.cjs
node a0-navigation-currentness-tests.cjs
node a0-startpage-currentness-tests.cjs
node a0-orientation-map-tests.cjs
node validate_a0_canonical_site_freeze.mjs
```

The active manifest records exact file hashes after this suite passes.
