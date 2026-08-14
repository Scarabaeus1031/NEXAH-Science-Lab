# NEXAH Science Lab — Start Here

Status: `STRUCTURE_FREEZE — CONSTITUTION V1 ENTRY`

Role at this entrance: **Science Lab Research Director**

This folder is the visible entrance to the Science Lab. It provides orientation
over the repository without moving, renaming, adopting or reclassifying any
research package.

## Start here

1. **What governs the Lab?** Read the
   [Science Lab Constitution V1](../SCIENCE_LAB/LAB_CONSTITUTION.md).
2. **May scientific work run now?** Check
   [Active Work](../SCIENCE_LAB/ACTIVE_WORK.md). The current answer is **no**:
   the Lab is in `STRUCTURE_FREEZE`.
3. **Which maintained Studies exist?** Use the single
   [Lab Register](../SCIENCE_LAB/LAB_REGISTER.md).
4. **What is scientifically current?** Read the
   [Science Lab Master Status](../SCIENCE_LAB_MASTER_STATUS.md).
5. **How can a third party enter safely?** Follow the
   [Contributor Onramp](../SCIENCE_LAB/CONTRIBUTOR_ONRAMP.md).
6. **Where is a package endpoint?** Search the generated
   [Endpoint Reconstruction](../LAB_DESK/ENDPOINT_RECONSTRUCTION.md).
7. **How is the complete repository organized?** Use the
   [Repository Entry](../README.md) and the map below.

## The Lab control surfaces

| View | Purpose | Authority |
|---|---|---|
| **Constitution** | Roles, admission, WIP, execution and closure gates | Owner-adopted Lab governance |
| **Active Work** | Current operational slots and Structure Freeze gate | Operational control |
| **Lab Register** | One maintained question→Study→report route | Owner-accepted navigation control |
| **Master Status** | Current scientific portfolio and bounded dispositions | Scientific-status orientation authority |
| **Lab Desk** | Repository maintenance, queues and owner gates | Operational management only |
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

Do not browse the root as a to-do list. During Structure Freeze, perform only
the authorized governance and repository-control work in Active Work. After a
separate Human Owner reopen decision, select one admitted Study and work within
its Run Contract and authority boundary.

`ENTER → CHECK FREEZE → CHECK REGISTER → SELECT AUTHORIZED WORK → RECORD → EXIT`
