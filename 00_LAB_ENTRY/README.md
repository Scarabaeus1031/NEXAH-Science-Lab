# NEXAH Science Lab — Start Here

Status: `NAVIGATION SURFACE — NO AUTHORITY CHANGE`

Role at this entrance: **Science Lab Research Director**

This folder is the visible entrance to the Science Lab. It provides orientation
over the repository without moving, renaming, adopting or reclassifying any
research package.

## Start in five minutes

1. **What is scientifically current?** Read the
   [Science Lab Master Status](../SCIENCE_LAB_MASTER_STATUS.md).
2. **What is the Lab working on now?** Read the
   [Research Director Current State](../LAB_DESK/CURRENT_STATE.md).
3. **What decision or cleanup comes next?** Open the
   [Cleanup Queue](../LAB_DESK/CLEANUP_QUEUE.md).
4. **Where is a package endpoint?** Search the generated
   [Endpoint Reconstruction](../LAB_DESK/ENDPOINT_RECONSTRUCTION.md).
5. **How is the complete repository organized?** Use the
   [Repository Entry](../README.md) and the map below.

## The four Lab views

| View | Purpose | Authority |
|---|---|---|
| **Master Status** | Current scientific portfolio and bounded dispositions | Scientific-status orientation authority |
| **Lab Desk** | Current assignment, cleanup queue and owner gates | Operational management only |
| **Repository Entry** | Programs, constitutions, studies and historical routes | Navigation only |
| **Package itself** | Protocol, evidence, reports, hashes and local outcome | Authoritative only within its declared scope |

The entry folder never replaces a package report and never promotes a result.

## Why the root still contains many folders

The root currently contains both versioned scientific packages and a large
historical untracked corpus. Many packages use root-relative paths, frozen hash
manifests, replay scripts or provenance references. Physically grouping them
before reconciliation could break those bindings.

Therefore the cleanup proceeds in two stages:

1. **Logical organization now:** one entry, one Master Status, one Desk and one
   deterministic package ledger.
2. **Physical migration later:** only for a reviewed package family, with an
   exact path-impact audit and explicit owner approval.

See [Directory Policy](DIRECTORY_POLICY.md) before creating or moving a package.

## Current working rule

Do not browse the root as a to-do list. Enter through this folder, select one
queue item, work within that package's authority boundary, and return the result
to the Lab Desk.

`ENTER → ORIENT → SELECT ONE PACKAGE → VERIFY → RECORD → EXIT`
