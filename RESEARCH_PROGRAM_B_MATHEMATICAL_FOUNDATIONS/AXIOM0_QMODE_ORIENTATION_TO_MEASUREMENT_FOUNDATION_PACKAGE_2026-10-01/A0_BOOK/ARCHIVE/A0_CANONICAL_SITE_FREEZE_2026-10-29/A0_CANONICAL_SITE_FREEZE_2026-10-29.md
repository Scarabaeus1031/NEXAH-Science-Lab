# A0 Canonical Site Freeze · 29 October 2026

Status: `OWNER_FIXED / CANONICAL_SITE_SOURCE / INTERNAL`

Freeze ID: `A0_CANONICAL_SITE_FREEZE_2026-10-29`

Reaffirmed by Human Owner: `2026-10-30`

## Decision

The one canonical A0 site is:

```text
AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/
└── A0_BOOK/
    └── index.html#top
```

`A0_BOOK/` is the only maintained source root for the A0 site. Its Science,
Builder, Workbench, books, instruments, registers and Desks are subordinate
rooms of the same site. File presence, a local route, a deployment copy or a
public projection does not create another A0 edition.

## One-version rule · reaffirmed 30 October 2026

- Continue the existing `A0_BOOK/` source in place.
- Do not create `A0 v2`, `A0 new`, dated successor homes, parallel Builder
  homes or reconstructed editions for ordinary navigation and interface work.
- New rooms, instruments and projections remain subordinate routes of this
  same A0 identity.
- Backups, exports and deployment bundles must be marked non-authoritative and
  must return to `A0_BOOK/index.html#top`.
- A competing A0 edition requires an explicit new Human Owner decision and a
  replacement freeze; visual redesign, file copying or route placement is not
  sufficient authority.

## Route rule

- `A0_BOOK/index.html#top` — canonical entry and source authority.
- `A0/index.html` — redirect-only convenience alias to the canonical entry.
- `A0_SCIENCE.html`, `A0_WERKBANK.html`, `A0_BUILDER_TOY_STORE.html` and the
  Desks — rooms inside A0, not competing home pages.
- NEXAHEDRON, nexah.de and Scarabæus 1033 — separate public projections or
  websites; they may reuse A0 assets but do not own the A0 source.

## Archive and projection classification

The inventory found no second full `A0_BOOK/index.html` source. Therefore no
maintained A0 source directory was destructively moved.

- `40 EXPERIENCE PRODUCTION/NEXAH deployment backups/` — already archived,
  immutable deployment snapshots; non-authoritative.
- `00 EXECUTIVE/NEXAH-Mission-Control/OWNER_READ_PORTAL/release/.../A0_BOOK/`
  and `staging/.../A0_BOOK/` — generated partial Desk projections; they contain
  no `index.html` and are not editions.
- `40 EXPERIENCE PRODUCTION/NEXAHEDRON/public/a0-human/` — bounded Human View
  projection; not an A0 source root.
- Historical or future alternative A0 editions belong under `A0_BOOK/ARCHIVE/`
  with an archive receipt. They must not retain an active canonical entry.

## Governance effect

This record reuses `NEXAH:A0:FROM_DISTINCTION_TO_READOUT` and
`NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1`. It creates no Study, scientific
identity, Source Graph relation, finding, claim promotion, publication or
canonical Family change. It is a route/currentness freeze only.

## Change gate

Content may continue to evolve inside the canonical root. Changing the
canonical root, canonical entry, alias destination or edition classification
requires an explicit Human Owner decision and a replacement freeze record.

Validation:

```sh
node validate_a0_canonical_site_freeze.mjs
```

The exact file hashes are recorded in
`A0_CANONICAL_SITE_FREEZE_MANIFEST.json`.
