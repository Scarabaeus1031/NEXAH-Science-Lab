# NEXAH Science Lab — Research Director Desk

This is the operating desk for the **Science Lab Research Director**. It is a
small control surface over the Lab; it is not a second scientific record.

Current state: **`STRUCTURE_FREEZE`**. Start with the
[Lab Constitution](../SCIENCE_LAB/LAB_CONSTITUTION.md),
[Active Work](../SCIENCE_LAB/ACTIVE_WORK.md) and
[Lab Register](../SCIENCE_LAB/LAB_REGISTER.md). This Desk currently performs
repository maintenance only.

## Authority boundary

- [`../SCIENCE_LAB_MASTER_STATUS.md`](../SCIENCE_LAB_MASTER_STATUS.md) remains
  the current Lab orientation and scientific-status authority.
- Research packages, frozen protocols, manifests and terminal reports remain
  authoritative within their explicitly stated scope.
- This Desk assigns review work and reconstructs package endpoints. It does
  not adopt claims, authorize experiments, modify evidence or promote drafts.

## Start here

1. Read [`../SCIENCE_LAB/ACTIVE_WORK.md`](../SCIENCE_LAB/ACTIVE_WORK.md).
2. Read [`CURRENT_STATE.md`](CURRENT_STATE.md).
3. Use [`CLEANUP_QUEUE.md`](CLEANUP_QUEUE.md) only after the Structure Freeze
   gate explicitly authorizes the queued maintenance item.
4. Consult [`ENDPOINT_RECONSTRUCTION.md`](ENDPOINT_RECONSTRUCTION.md) to locate
   package endpoints without browsing thousands of files.
5. Rebuild the inventory with
   `python3 LAB_DESK/tools/reconstruct_endpoints.py` after a bounded package
   disposition changes.

## Working rule

One package family at a time. Every action must end in an explicit disposition:
preserve as provenance, register a small endpoint set, separate data from Git,
or escalate for owner review. Never use `git add .` in this repository.
