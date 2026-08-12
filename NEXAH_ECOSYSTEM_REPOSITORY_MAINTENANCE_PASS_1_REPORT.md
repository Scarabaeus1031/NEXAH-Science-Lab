# NEXAH Ecosystem Repository Maintenance Pass 1 Report

Pass date: 2026-08-13 (Europe/Berlin)

## 1. Repositories inspected

Maintenance Pass 1 reinspected the nine checkouts recorded in
`NEXAH_ECOSYSTEM_REPOSITORY_CURRENTNESS_AUDIT.md`:

1. NEXAH-Science-Lab;
2. clean canonical NEXAH;
3. historical NEXAH-CODEX (R3);
4. historical NEXAH_REPO_CLONE (R4);
5. embedded NEXAH feature checkout (R5);
6. NEXAH-ORION;
7. NEXAHEDRON;
8. clean canonical NEXAH-Experience;
9. embedded NEXAH-Experience feature checkout.

All Git mutations used exact path allowlists. No pull, merge, rebase, reset,
clean, restore, checkout, stash, deletion or force-push was performed.

## 2. Exact commits created

| Repository | Commit | Message |
|---|---|---|
| NEXAH-Science-Lab | `664dcf627ea59fc068065a8fbd1637d48dfdc9b8` | `docs: record ecosystem repository currentness audit` |
| NEXAH-Science-Lab | `cadb6c086970e8d9a4981adffa27f9236bafdf86` | `chore: ignore Python cache artifacts` |
| NEXAH-ORION | `d023b96672d6c29c8fadda1b91e247f48d9b1288` | `docs(architecture): record adopted ORION master architecture` |

No NEXAH governance commit was created because its branch-ancestry gate did
not pass. No Experience commit was authorized.

## 3. Exact commits pushed and remote SHAs

| Remote branch | Pushed commits | Resulting remote SHA |
|---|---|---|
| `NEXAH-Science-Lab:codex/z3885-verification` | `664dcf6`, `cadb6c0` | `cadb6c086970e8d9a4981adffa27f9236bafdf86` |
| `NEXAH-ORION:codex/orion-orientation-operators` | `d023b96` | `d023b96672d6c29c8fadda1b91e247f48d9b1288` |

Both local branches are `0 ahead / 0 behind` their upstreams after push.
Neither remote default `main` was merged or modified. The NEXAH feature remote
remains at `cc402e8adca47baa7e86b86e4e074d5c6eb9a402` because its gate was blocked.

## 4. Exact files included per commit

### `664dcf627ea59fc068065a8fbd1637d48dfdc9b8`

- `NEXAH_ECOSYSTEM_REPOSITORY_CURRENTNESS_AUDIT.md`

### `cadb6c086970e8d9a4981adffa27f9236bafdf86`

- `.gitignore`, containing only:
  - `__pycache__/`
  - `*.py[cod]`

The rule now excludes exactly 77 observed Python cache files. No output, CSV,
JSON, NPZ, log, experiment or Science Lab package ignore was added.

### `d023b96672d6c29c8fadda1b91e247f48d9b1288`

- `docs/adr/0009-orion-master-architecture-adoption.md`
- `docs/architecture/ORION_MASTER_ARCHITECTURE.md`
- `docs/adr/README.md`
- `docs/architecture/README.md`
- `docs/governance/OWNERSHIP.md`

All five committed bytes exactly match their frozen 2026-08-11 SHA-256
values. Their working-tree paths are clean after commit/push.

## 5. Remaining dirty checkouts and reasons

| Checkout | Why it remains dirty |
|---|---|
| NEXAH-Science-Lab | 160 substantive untracked top-level groups remain. SL-1 through SL-4 were deliberately excluded; 2,260 nonignored untracked files remain after 77 caches became ignored. The continuity ledger and this Pass 1 report are also untracked pending a future exact maintenance-package commit. |
| R3 NEXAH-CODEX | Divergent historical history, one preserved historical Markdown deletion, tracked/untracked `.DS_Store` state. Mutation prohibited. |
| R4 NEXAH_REPO_CLONE | Historical clone with the pre-existing staged deletion of `chimera_state_overlap.png`. Mutation prohibited. |
| R5 embedded NEXAH | Local NF-1 commit remains one ahead of its feature upstream; NF-2 remains one modified plus one untracked governance file. Ancestry gate blocked mutation. |
| NEXAH-ORION | OR-2, OR-3 and OR-4 remain: `Makefile`/`README.md`, orientation/review files, POA/experiment proof packages, Runtime 1.1, deployment and release material. They were explicitly outside Pass 1. |
| Embedded NEXAH-Experience | EX-1 remains two modified files and one untracked deployment-status file. Pass 1 authorized verification only. |

The clean canonical NEXAH, NEXAHEDRON and canonical NEXAH-Experience checkouts
remain clean.

## 6. NF-1 disposition

`105074f88573f0d091fa9a56ee858d20a5aac877` changes eight terminology and
repository-positioning files relative to parent
`cc402e8adca47baa7e86b86e4e074d5c6eb9a402`:

- `.github/REPOSITORY_METADATA.md`;
- `ARCHITECTURE/README.md`;
- `ARCHITECTURE/SYSTEM_STATE.md`;
- `CITATION.cff`;
- `MANIFESTO.md`;
- `README.md`;
- `REPOSITORY_MAP.md`;
- `pyproject.toml`.

Against current NEXAH `main` (`923362e141170f06f2f0f26992136b5979047c42`),
the feature checkout is `2 ahead / 10 behind`. Its parent and current `main`
are not ancestors of one another. Current `main` contains related terminology
but does not reproduce the complete eight-file patch.

**NF-1 = TRANSFER_TO_MAIN_CANDIDATE**

It is not unambiguously safe to keep/push on the stale feature ancestry. No
push, cherry-pick, merge, deletion or rewrite was performed.

## 7. NF-2 disposition

The two governance files still match the frozen baseline exactly:

- `GOVERNANCE/README.md`:
  `f32ac0287157c1ea61eb8796aa0829582961acf7eddc83c87e8a87b275dd98ee`;
- `GOVERNANCE/CURRENT_ECOSYSTEM_ARCHITECTURE_STATUS.md`:
  `e8d0d83c22886c87eb672d6ace460531b257eff7d080724a8f5413291c146f05`.

No authority contradiction was found. However, the task required safe ancestry
in addition to semantic correctness. NF-1 failed that gate.

**NF-2 = BLOCKED_BY_BRANCH_ANCESTRY**

Both files remain untouched and uncommitted.

## 8. OR-1 provenance status

**OR-1 = REMOTE_FEATURE_BRANCH_PROVENANCE_RECORDED**

The ambiguous local five-file state is resolved: exact frozen content is now
durable in commit `d023b96` on remote branch
`codex/orion-orientation-operators`. The remote contains the commit, and the
five working-tree paths are clean.

The remote default `main` remains at `d34fbb2f99334534f4db89465a29f8bdb16d14d3`.
Promotion/merge to the default branch was not authorized, so canonical
default-branch disposition remains an Owner review item.

## 9. OR-2 status

**OR-2 = UNTOUCHED / FUTURE REVIEW WORKSTREAM**

Orientation infrastructure, architecture extraction, ecosystem review, NTO,
structural grammar and derived visual documentation were not staged or
committed.

## 10. OR-3 status

**OR-3 = UNTOUCHED / FUTURE PROOF-PACKAGE WORKSTREAM**

POA-001/002/003, Gate-0 and experiment/proof artifacts remain uncommitted and
require manifest-level review and bounded commits.

## 11. OR-4 status

**OR-4 = UNTOUCHED / FUTURE RUNTIME-RELEASE WORKSTREAM**

Runtime 1.1, deployment, release, tests, scripts, `Makefile` and `README.md`
changes remain outside this pass. The prior `ACCEPT WITH CONDITIONS` status
was not upgraded.

The digest of every unauthorized dirty ORION path was
`3550f54d72d82d9d912ef34beb11a76f15e521febd112462fa9b3d295a50d2b7`
both before and after the OR-1 commit.

## 12. Experience deployment and documentation status

Read-only live verification on 2026-08-13 found:

- `https://nexah.de/` reachable with current public NEXAH content;
- `https://nexah.de/visitor-guide/` reachable;
- `https://nexahedron.com/` reachable as a Phase II bounded public research
  demonstrator;
- no 40-character source commit SHA in the inspected live HTML;
- no repository/hosting evidence binding the live artifact to a deploy commit.

The local Experience branch is three commits behind current remote `main`.
Its modified Visitor Guide text is not the live page text. The local
`docs/DEPLOYMENT_STATUS.md` is dated 2026-07-26, while tracked
`DEPLOYMENT_READINESS.md` already records a 2026-08-01 reachability check.

**EXPERIENCE_DOCS_UPDATE_REQUIRED**

The deployed revision remains unknown. EX-1 was not modified or committed.

## 13. Master Visual publication status

Both registered V1 artifacts exist and retain exact hashes:

- `master-ecosystem-overview-v1.html`:
  `42da93f0fc8cb851f99ed8efb6bfcece66f50782a5b4c6e27d1674e14af76d1b`;
- standalone wrapper:
  `a8d6dfaea98d411c626df68b439e528ae0791a748f754baffbb7604e3f6328e7`.

The represented architecture baseline remains semantically current. The
artifacts remain outside a versioned publication repository, and no movement
or republication occurred.

**MASTER_VISUAL_PRESENT_UNVERSIONED_PUBLICATION_HOME_PENDING**

`VISUAL_AUTHORITY = NONE`.

## 14. Historical R3/R4 disposition

- R3 status digest remains
  `a40465658bcba68526d8cc20b68a559ce8b37d9ead8c11a06afbee73f4890c2f`.
- R4 status digest remains
  `37e9ea60b8343838dbc631e1603684b8369aa2334d77cc357b59d08e441ac106`.

No status entry was changed, including the R4 staged deletion.

**R3 = HISTORICAL_CHECKOUT_REQUIRES_OWNER_DISPOSITION**  
**R4 = HISTORICAL_CHECKOUT_REQUIRES_OWNER_DISPOSITION**

Neither may be used as a current synchronization base.

## 15. Science Lab untracked-material status

SL-1 through SL-4 remain deliberately uncommitted. The new `.gitignore`
removes only Python cache noise. It does not confer commit intent on any
remaining package or scientific artifact.

The Z3885 package was not modified. Its hash manifest still passes, and its
scope/disposition remain:

- `PASS — EXACT_5X_CRT_ORBIT_SCALING_PROVEN` for finite modular systems only;
- `NO_ARCHITECTURE_IMPACT`;
- `NOT_ADOPTED`;
- no IEEE/physical scaling claim.

## 16. Continuity ledger update

Only EASL-001/UQ-001 was updated because only OR-1 provenance materially
changed. The ledger now records commit `d023b96` and preserves the remaining
default-branch decision as `REVIEW_REQUIRED`.

UQ-004 (NEXAH governance), UQ-005 (Master Visual publication) and UQ-006
(Science Lab continuity/Phase 4B durability) remain open. No unresolved item
was marked resolved merely because it was inspected.

The ledger remains inside the uncommitted continuity package; this report does
not silently promote or version that package.

## 17. Final Architecture Drift status

Repository hygiene improved:

- Science Lab audit and minimal cache policy are durable remotely;
- OR-1 exact bytes are durable remotely;
- harmless Python-cache noise is filtered;
- ambiguous work remained untouched.

Semantic architecture review found no authority contradiction. Remaining
issues are repository provenance/default-branch disposition, NF-1/NF-2
ancestry, visual publication traceability, Experience documentation currency,
and unreviewed workstreams.

**ARCHITECTURE_DRIFT_STATUS = REVIEW_REQUIRED**

This is not `DRIFT_DETECTED`.

## 18. Remaining Owner decisions

1. Merge or otherwise promote the Science Lab Z3885/audit branch to `main`, or
   retain it as review-only; no architecture adoption follows.
2. Decide whether ORION provenance commit `d023b96` should reach default
   `main` through a separately authorized merge/PR.
3. Decide NF-1 transfer strategy onto current NEXAH `main`; do not push the
   stale branch as-is.
4. After NF-1 resolution, authorize or reject the exact two-file NF-2 commit.
5. Disposition historical R3 and R4 without automated cleanup.
6. Define separate reviewed manifests for OR-2, OR-3 and OR-4.
7. Authorize an Experience documentation refresh after deploy-revision
   attestation is resolved or explicitly retained as unknown.
8. Select a versioned publication home for Master Visual V1 and its sidecar,
   or explicitly retain external-only publication.
9. Authorize a precise Science Lab continuity-package commit if UQ-006 is to be
   closed; do not absorb SL-1 through SL-4.

## 19. Recommended Maintenance Pass 2 scope

Limit Pass 2 to decision preparation and exact allowlists:

1. construct a clean-current-main comparison patch for NF-1 and determine
   whether each of its eight changes is still desired;
2. prepare NF-2 on a current-main-based branch only after NF-1 disposition;
3. review ORION commit `d023b96` for default-branch promotion without touching
   OR-2/3/4;
4. produce a current Experience deployment attestation/status rewrite proposal
   without deploying;
5. prepare, but do not execute, one exact Science Lab continuity-package
   allowlist and Master Visual publication-sidecar plan;
6. keep R3/R4 read-only until direct Owner disposition.

**ECOSYSTEM_MAINTENANCE_PASS_1_COMPLETE_REVIEW_REMAINS**
