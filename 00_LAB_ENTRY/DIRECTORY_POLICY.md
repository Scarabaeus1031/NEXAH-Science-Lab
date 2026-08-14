# Science Lab Directory Policy

Status: `NAVIGATION AND INTAKE POLICY — NO SCIENTIFIC EFFECT`

## Stable control surfaces

- `00_LAB_ENTRY/` — Human-visible entrance and navigation.
- `LAB_DESK/` — Research Director working state, queue, ledgers and cleanup
  artifacts.
- `SCIENCE_LAB_MASTER_STATUS.md` — current scientific-status orientation.
- `README.md` — full repository and research-program navigation.

These surfaces point to authorities; they do not replace them.

## New-work intake

Do not create a new top-level research folder merely because an idea or draft
exists. New work should first receive:

1. a named owner or role;
2. a bounded question or operational purpose;
3. a status (`IDEA`, `DESIGN`, `PREREGISTERED`, `EXECUTED`, `CLOSED`, or
   explicitly historical);
4. a destination decision: existing package, Lab intake, another Desk, or no
   repository object;
5. an explicit authority and claim boundary.

Only then should a new top-level package be created.

## Existing package movement

Do not bulk-move existing package directories into category folders. Before any
move, verify:

- tracked and untracked state;
- root-relative links and imports;
- frozen path and hash manifests;
- replay and environment scripts;
- references from other repositories and reports;
- current authority and historical-provenance requirements.

A move requires an exact allowlist, an old-to-new path map, pre/post hash
verification and separate owner approval. If those conditions are absent, keep
the package in place and organize it through the entry and ledger instead.

## End state

The intended end state is not a visually empty root. It is a root where every
remaining package has one owner, one status, one reason to exist and one visible
route from the Lab entry.
