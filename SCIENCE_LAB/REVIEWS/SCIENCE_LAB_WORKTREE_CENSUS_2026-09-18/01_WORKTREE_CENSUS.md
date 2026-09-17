# Worktree Census

Snapshot date: `2026-09-18`

Method: Git-aware enumeration of untracked files, grouped by top-level root
and compared with Mission Control
`CURRENT/RESEARCH_CORPUS_INVENTORY.csv`. Counts describe local custody; they
do not confer scientific status.

## What occupies the worktree

| Group | Files | Bytes | Current reading |
|---|---:|---:|---|
| `NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION` | 2,990 | 2,782,763,545 | registered bulk evidence; preserve |
| `SCIENCE_LAB/CASE_STUDIES` | 3,631 | 2,756,529,239 | registered research corpus with one new directory delta |
| `00_INCOMING` | 3,255 | 223,872,478 | active intake delta; prior inventory recorded 2,704 files |
| `ORION_EXP_ORION_L1_001_V1_1_EXECUTION` | 24 | 39,800,000 approx. | execution evidence; custody review, no deletion |
| `ORION_EXP_ORION_L3_001_EXECUTION` | 57 | 35,750,000 approx. | execution evidence; custody review, no deletion |
| `tmp` | about 105 | 19,220,000 approx. | mixed working copies, dependency tree, previews and unrelated PDFs |
| `EXP_00_REPRESENTATION_AGREEMENT` | 39 | 12,000,000 approx. | known package family |
| `EXP_00_V2_LEARNED_PARITY` | 44 | 10,300,000 approx. | known package family |
| `MISSION_CONTROL_ROEDELHEIM_ORIENTATION_RETURN_2026-09-16` | 21 | 9,480,000 approx. | known return package |
| `SCIENCE_LAB/EXPORTS` delta | 12 | 9,150,000 approx. | current visual/runtime exports requiring a release decision |

The two largest groups account for roughly `5.54 GB`, more than 93% of the
untracked bytes. They are evidence custody, not cleanup noise.

## Inventory coverage

Mission Control already locates most of the archive:

- `144 / 165` untracked top-level roots are represented in the Research Corpus
  Inventory;
- the principal bulk-evidence roots are represented;
- the Desk 04 and Desk 05 packages and their Human Owner closures are
  represented;
- only one observed case-study directory is absent:
  `SCIENCE_LAB/CASE_STUDIES/Orion ≠ Labreport`.

The local archive therefore needs a delta pass, not another full rediscovery.

## Highest-priority deltas

### 1. Incoming growth

`00_INCOMING` grew from `2,704` inventoried files to `3,255` observed files:
an aggregate difference of `+551` files. This arithmetic delta does not by
itself identify 551 individual newly arrived paths because the earlier
inventory preserved only a root count, not a per-file baseline. The largest
child is `THe Prime Genesis` with `86` files and about `191.5 MB`, dominated by
images. Several CRIC gate folders include build or runtime-shaped file trees.
These must be classified package by package; they must not be bulk-imported
merely because they are in Incoming.

### 2. Temporary workspace

`tmp` mixes several different roles:

- Mission Control migration and currentness scripts;
- before/after spreadsheet previews;
- a local `node_modules` dependency tree;
- working copies of Mission Control current dashboards;
- unrelated PDF and property-comparison material.

This is a reviewable cleanup candidate, but not a safe bulk-delete target.
The PDFs in particular are outside the scientific cleanup question and require
separate custody.

### 3. Loose repository-root material

Twenty loose root documents/assets and `tmp` are absent from the current
Research Corpus Inventory. The loose files are mainly outreach, builder,
ecosystem-currentness and scientific-interface reviews created during the
September consolidation. They need canonical routing, not silent archival.

### 4. Unregistered case-study directory

`SCIENCE_LAB/CASE_STUDIES/Orion ≠ Labreport` contains visual boards, three
DOCX lab reports and one work-package text. It has no observed package-level
README, manifest or current inventory row. Treat it as `UNASSESSED_INTAKE`,
not as an adopted case study.

### 5. Local exports

The export delta contains the MIWA/Pineal Aperture/Andromeda downloadable
instrument, a common runtime adapter view, current-status graphics, Five-H
One-Q, the HZ/FZ compass and three Rainbow Loom plates. These are useful
artifacts, but their presence in `EXPORTS` does not decide whether they are
source, release assets, demonstrations or generated output.

## Baseline comparison

The private Research Director Desk recorded `4,801` untracked files and about
`2.91 GB` on `2026-08-14`. The current snapshot is `12,283` files and about
`5.94 GB`. The growth is material, but it is substantially explained by named
evidence families and September review/intake activity. This reinforces the
need for delta-based intake discipline rather than periodic indiscriminate
cleanup.
