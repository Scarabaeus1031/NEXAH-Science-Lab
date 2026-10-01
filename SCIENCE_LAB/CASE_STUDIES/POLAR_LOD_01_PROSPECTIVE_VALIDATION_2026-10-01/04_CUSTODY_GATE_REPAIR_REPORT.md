# POLAR-LOD-01 — custody gate Repair 1

Date: 2026-10-02
Reviewed commit: `264200ef332700dd1d5c9faf9eb23d1dc04e81c7`
Status: `FIRST_REVIEW_FAIL / REPAIR_1_IMPLEMENTED / INDEPENDENT_RE-REVIEW_REQUIRED`

## Review result

The first independent review accepted the fail-closed `NOT_GRANTED` path,
runtime binding, basic ledger and raw-byte verification, HTTP rules, EAM
Issue-Date derivation and cutoff logic. It found four material admission
paths, so the initial custody implementation was not accepted:

1. an EAM filename could carry a path parameter or an empty query or fragment
   delimiter while still passing the filename grammar;
2. an authorized release was not bound strongly enough to its exact identity,
   package manifest and a clean commit already present at the tracked remote;
3. the ledger lock ended before anchor creation, allowing concurrent captures
   to produce anchors for inconsistent ledger prefixes;
4. a pre-existing `raw/c04` symlink could redirect the opaque-byte write
   outside the custody root.

The review also advised syncing parent directories after durable file writes.

## Repair 1

Repair 1 is limited to those custody boundaries:

- EAM vintage admission now requires the complete URL to equal the frozen
  prefix plus the grammar-matched filename. Parameters, queries, fragments,
  alternate ports, redirects and final URLs outside that exact form fail.
- The release record has a compiled SHA-256 and exact release ID. An authorized
  path additionally verifies the package manifest, requires no staged or
  unstaged package changes and requires local `HEAD` to equal its upstream
  commit. Every receipt and anchor records that release commit.
- Receipt and anchor creation remain inside the same exclusive ledger lock.
  Anchor verification binds each anchor to the exact ledger-prefix byte hash,
  entry count, chain head, release, commit and raw-byte hash.
- Custody directories must be real directories. Raw, receipt, ledger, lock and
  anchor writes use directory-relative creation with exclusive create and
  `O_NOFOLLOW` where the platform provides it. File and parent-directory state
  is synced before the capture returns.

## Local verification

The no-network suite contains nine passing tests covering the original
controls plus exact-URL suffix rejection, compiled-release tamper rejection,
raw-directory symlink rejection before write and two-thread prefix-anchor
consistency. The bound wrapper also verifies an empty custody root and refuses
the canonical collection command before constructing a network opener or
writing custody data while the owner record remains `NOT_GRANTED`.

## Decision boundary

This report does not accept its own repair. Independent re-review is required.
It grants neither collection nor execution authority. No C04 or EAM source was
retrieved or opened, no model was run and no Research Result was created.
