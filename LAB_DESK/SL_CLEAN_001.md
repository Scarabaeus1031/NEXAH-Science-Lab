# SL-CLEAN-001 — Endpoint Reconstruction

Status: **PAUSED_BY_STRUCTURE_FREEZE**

Owner: **Science Lab Research Director**

Opened: 2026-08-14

Pause note: the deterministic endpoint reconstruction remains a valid
repository-control record. Further package cleanup is not current work unless
`SCIENCE_LAB/ACTIVE_WORK.md` explicitly authorizes a bounded item.

## Objective

Turn the untracked Science Lab backlog into a deterministic, reviewable package
ledger without changing, deleting, staging or executing any research object.

## Allowed operations

- read untracked files;
- calculate file and package hashes;
- identify likely endpoint/status documents;
- extract bounded status labels from text and JSON;
- classify repository-review needs;
- write the generated ledger under `LAB_DESK/`.

## Not authorized

- adoption or rejection of scientific claims;
- experiment execution or replay;
- modification of research packages;
- bulk staging, publication or deletion;
- treating filename markers as scientific authority.

## Outputs

- `ENDPOINT_RECONSTRUCTION.json` — machine-readable deterministic inventory;
- `ENDPOINT_RECONSTRUCTION.md` — human review surface;
- `CLEANUP_QUEUE.md` — bounded sequence for owner decisions.
