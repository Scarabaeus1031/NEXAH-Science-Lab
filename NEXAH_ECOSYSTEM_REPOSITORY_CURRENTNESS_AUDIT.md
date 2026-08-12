# NEXAH Ecosystem Repository Hygiene + Currentness Audit

Audit date: 2026-08-13 (Europe/Berlin)
Mode: read-first / classify-first
Content mutations during audit: this report only
Git mutations during audit: remote metadata fetch only; no pull, merge, checkout,
restore, reset, clean, stash, stage, commit, push, rebase, deletion, or force-push

## 1. Executive status

Nine local checkouts representing five public NEXAH ecosystem remotes were
inspected. Three checkouts are clean and current with their upstreams. Six are
dirty or otherwise require disposition. No designated clean reference or
active feature branch is behind its upstream; two historical `main` checkouts
of the NEXAH remote are substantially diverged/behind current remote `main`, one embedded
NEXAH feature branch is one commit ahead of its upstream, and all other active
feature branches are current with their upstreams.

The repository ecosystem is not ready for a global cleanup or mass commit.
There are 19 coherent pending path groups. Some contain intended current work,
some contain already reviewed architecture synchronization, some are generated
or experimental artifacts, and some require Owner decisions before even a
commit allowlist can be defined.

Repository hygiene and semantic architecture drift remain separate:

- dirty working trees and uncommitted adopted documentation are repository
  provenance/maintenance problems;
- no semantic architecture contradiction was established by this audit;
- architecture continuity remains `REVIEW_REQUIRED`, not `DRIFT_DETECTED`;
- the Z3885 result remains finite-algebra-only with
  `NO_ARCHITECTURE_IMPACT` and `NOT_ADOPTED`.

## 2. Repository matrix

Remote SHAs were verified on 2026-08-13 using fetch/`ls-remote`. Paths sharing
one remote are retained as distinct local states.

| ID | Logical repository / checkout | Local path | Branch | HEAD | Upstream | Remote default / SHA | Tree |
|---|---|---|---|---|---|---|---|
| R1 | NEXAH-Science-Lab | `/Users/tho2020/Documents/NEXAH SCIENCE LAB ⭐⭐⭐⭐⭐` | `codex/z3885-verification` | `c27dff4b92a5863b495b2cbb802f6b760f9e22ce` | `origin/codex/z3885-verification` | `origin/main` / `635dbe6d677170cd855db7e82b522565fac7ebca` | dirty: 161 top-level status entries after this report; no tracked edits before report; 2,338 untracked files including this report |
| R2 | NEXAH canonical clean checkout | `/Users/tho2020/Documents/GitHub/NEXAH` | `main` | `923362e141170f06f2f0f26992136b5979047c42` | `origin/main` | `origin/main` / same | clean |
| R3 | NEXAH-CODEX historical duplicate | `/Users/tho2020/Documents/GitHub/NEXAH-CODEX` | `main` | `cc1962237940867becb7beb7d4d9fb9f6b613253` | `origin/main` | `origin/main` / `923362e141170f06f2f0f26992136b5979047c42` | dirty: 16 tracked changes, 6 untracked files |
| R4 | NEXAH historical clone | `/Users/tho2020/Documents/NEXAH_REPO_CLONE` | `main` | `a0539b9a951de557fbf71f4b0a3526708f3cbecc` | `origin/main` | `origin/main` / `923362e141170f06f2f0f26992136b5979047c42` | dirty: one staged deletion |
| R5 | NEXAH embedded feature checkout | `/Users/tho2020/Documents/NEXH x LLAMA _orion_/.workspace/repositories/NEXAH-framework-ci` | `codex/limit-actions-permissions` | `105074f88573f0d091fa9a56ee858d20a5aac877` | `origin/codex/limit-actions-permissions` | `origin/main` / `923362e141170f06f2f0f26992136b5979047c42` | dirty: one modified, one untracked |
| R6 | NEXAH-ORION | `/Users/tho2020/Documents/NEXH x LLAMA _orion_` | `codex/orion-orientation-operators` | `d34fbb2f99334534f4db89465a29f8bdb16d14d3` | `origin/codex/orion-orientation-operators` | `origin/main` / same | dirty: 5 tracked changes, 108 untracked files |
| R7 | NEXAHEDRON | `/Users/tho2020/Documents/NEXAHEDRON` | `main` | `f9cbe359b08fdb4d63c3ff11eb2ae0ade9ecd1ab` | `origin/main` | `origin/main` / same | clean |
| R8 | NEXAH-Experience canonical checkout | `/Users/tho2020/Documents/ARE.NA LIBRARY CLEANUP/NEXAH-Experience` | `main` | `1adbaf1865b22a6d3e1ab4cbf115ff5116167285` | `origin/main` | `origin/main` / same | clean |
| R9 | NEXAH-Experience embedded feature checkout | `/Users/tho2020/Documents/NEXH x LLAMA _orion_/.workspace/repositories/nexah-experience` | `codex/dependency-maintenance` | `7473736ff5e6077fda41e7302b041e79e57673e3` | `origin/codex/dependency-maintenance` | `origin/main` / `1adbaf1865b22a6d3e1ab4cbf115ff5116167285` | dirty: two modified, one untracked |

Remote URLs:

- R1: `https://github.com/Scarabaeus1031/NEXAH-Science-Lab.git`
- R2–R5: spelling variants of `https://github.com/Scarabaeus1031/NEXAH.git`
- R6: `https://github.com/Scarabaeus1031/NEXAH-ORION.git`
- R7: `https://github.com/Scarabaeus1031/NEXAHEDRON.git`
- R8–R9: `https://github.com/Scarabaeus1031/NEXAH-Experience.git`

## 3. Ahead/behind matrix

Counts are `ahead / behind` relative to each checkout's configured upstream.

| ID | Ahead / behind | Classification | Note |
|---|---:|---|---|
| R1 | 0 / 0 | `CURRENT_WITH_REMOTE` | Z3885 branch exists locally and remotely. It is two commits ahead of remote default `main` by design. |
| R2 | 0 / 0 | `CURRENT_WITH_REMOTE` | Canonical clean NEXAH reference checkout. |
| R3 | 4,351 / 8,689 | `DIVERGED` | Old, unrelated NEXAH history under the label NEXAH-CODEX; not a safe current-work base. |
| R4 | 0 / 6,493 | `BEHIND` | Historical NEXAH clone; additionally contains a staged deletion. |
| R5 | 1 / 0 | `AHEAD` | Local commit `105074f8` (“Editorial: unify NEXAH ecosystem terminology”) is not on upstream feature branch `cc402e8a`. Its own fetch did not finish within 60 seconds, but authoritative remote SHAs were independently verified. |
| R6 | 0 / 0 | `CURRENT_WITH_REMOTE` | Branch and remote default currently point to the same SHA; working tree is nevertheless large and dirty. |
| R7 | 0 / 0 | `CURRENT_WITH_REMOTE` | Clean. |
| R8 | 0 / 0 | `CURRENT_WITH_REMOTE` | Clean canonical Experience reference. |
| R9 | 0 / 0 | `CURRENT_WITH_REMOTE` | Feature branch current; remote `main` has advanced independently. |

No inspected checkout is `NO_UPSTREAM`. R3 and R4 must not be pulled, merged,
reset, rebased, or cleaned until their local material is separately dispositioned.

## 4. Working-tree inventory and classification

Classification codes are those required by the task. A single path group may
receive two codes where the hygiene treatment and semantic role differ.

### R1 — NEXAH-Science-Lab: six groups

Before this audit report, R1 contained 160 untracked top-level status entries,
2,337 untracked files, 265 tracked files, no staged files, and no tracked
unstaged modifications. The untracked corpus contains 1,355 Markdown files,
500 JSON files, 223 Python files, 76 CSV files, 42 log files, 36 NPZ files,
and 77 Python cache files. Several output CSVs exceed 8 MB. This is substantive
Lab material, not a generic build directory.

| Group | Exact scope | Count | Classification | Disposition |
|---|---|---:|---|---|
| SL-1 | `EXP_00_R_ROSSLER_REPLICATION*/`, `EXP_00_R_SCIENTIFIC_CONTRACT*/`, other `EXP_00_*` | 64 top-level groups / 952 files | C, D, I | Historical/frozen experiment and contract lineages. Keep uncommitted pending a package-level provenance/retention decision; never mass-commit. |
| SL-2 | `ORION_EXP_*/`, other `ORION_*/` execution, preregistration, review, closure and architecture packages | 43 top-level groups / 1,022 files | C, D, F, I | Mixed experimental outputs and architecture/governance candidates. Requires materiality-filtered package allowlists, not one commit. |
| SL-3 | `NEXAH_*/` packages and standalone NEXAH planning/outreach files | 26 top-level groups / 145 files | C, E, F, I | Planning, audits, visuals and architecture candidates. Owner must decide which are durable Science Lab records. |
| SL-4 | `SCIENCE_LAB*/`, `PHASE_1_ARCHITECTURE_DECISION/*`, repository/orientation/governance/runtime/mission/publishing/research groups and standalone status files | 27 top-level groups / 218 files | A, C, E, F, I | Includes current continuity/status records but also broad historical material. Review as bounded packages. |
| SL-5 | all `__pycache__/` and `*.pyc` beneath untracked packages | 77 files in 13 cache directories | H | Strong `.gitignore` candidate: `__pycache__/` and `*.py[cod]`. Do not use ignore rules to hide scientific outputs. |
| SL-6 | `NEXAH_ECOSYSTEM_REPOSITORY_CURRENTNESS_AUDIT.md` | 1 file | E | This audit report. Candidate for one dedicated documentation commit only after Owner authorization. |

### R2 — NEXAH canonical checkout

No pending paths. Clean reference checkout.

### R3 — NEXAH-CODEX historical duplicate: three groups

| Group | Exact scope | Count | Classification | Disposition |
|---|---|---:|---|---|
| NC-1 | 15 tracked `.DS_Store` modifications and 6 untracked `.DS_Store` files at the paths reported by `git status` | 21 files | G, H | macOS metadata. Do not commit content changes. Add `.DS_Store` ignore only in a separately authorized cleanup on the canonical branch; tracked copies need an explicit removal decision. |
| NC-2 | `SYSTEM_7_UCRT/UCRT_Superprime_Genesis/prime_spiral_projection.md` | 1 tracked deletion | C, I | Historical content deletion requires Owner review; do not accept as cleanup. |
| NC-3 | entire checkout identity/history (`cc196223…` vs current `923362e…`) | one checkout | G, I | Strong duplicate/redundant checkout candidate. Preserve untouched until Owner decides archival/export/retirement handling. |

### R4 — NEXAH_REPO_CLONE historical clone: two groups

| Group | Exact scope | Count | Classification | Disposition |
|---|---|---:|---|---|
| NR-1 | `ENGINE/nexah_kernel/research/experiments/structured_oscillator_networks/output/chimera_state_overlap.png` | 1 staged deletion | D, I | The deletion is already staged but unaudited. Do not commit it. Owner must decide whether this generated experiment image is retained, regenerated, or deliberately removed. |
| NR-2 | entire clone at `a0539b9…`, 6,493 behind `origin/main` | one checkout | G, I | Historical/duplicate checkout; not a current synchronization base. |

### R5 — embedded NEXAH feature checkout: two groups

| Group | Exact scope | Count | Classification | Disposition |
|---|---|---:|---|---|
| NF-1 | local commit `105074f88573f0d091fa9a56ee858d20a5aac877` | 1 commit | A, E, I | One commit ahead of upstream. Owner must decide whether it belongs on this feature branch or should be superseded/cherry-picked elsewhere. |
| NF-2 | `GOVERNANCE/README.md`, `GOVERNANCE/CURRENT_ECOSYSTEM_ARCHITECTURE_STATUS.md` | 2 files | E, F | Exact minimal NEXAH ecosystem-status transcription previously queued as UQ-004; hash-verified and still uncommitted. Candidate for its own authorized governance-documentation commit after NF-1 branch disposition. |

### R6 — NEXAH-ORION: four groups

The working tree contains 5 tracked changes and 108 untracked files. They are
not one coherent commit.

| Group | Exact scope | Count | Classification | Disposition |
|---|---|---:|---|---|
| OR-1 | `docs/adr/0009-orion-master-architecture-adoption.md`, `docs/architecture/ORION_MASTER_ARCHITECTURE.md`, `docs/adr/README.md`, `docs/architecture/README.md`, `docs/governance/OWNERSHIP.md` | 5 files | F | The previously adopted/current uncommitted architecture allowlist. All five SHA-256 values exactly match the frozen 2026-08-11 baseline. Candidate for one exact architecture-provenance commit only with ORION Owner authorization. |
| OR-2 | orientation and ecosystem documentation: `docs/architecture/MACHINE_READABLE_ORIENTATION_ARCHITECTURE.md`, `NEXAH_ARCHITECTURE_DISTILLED.md`, `OLS_1_0_REPOSITORY_ARCHITECTURE_EXTRACTION.md`, `ORIENTATION_INFRASTRUCTURE*`, `docs/architecture/visuals/*`, `docs/reviews/ecosystem-review/*`, `docs/reviews/nto/*`, `docs/reviews/structural-grammar/*`, `docs/reviews/visuals/*`, `docs/reviews/EXECUTIVE_PROGRAM_REVIEW.md`, `docs/roadmap/ORION_V1_1_IMPLEMENTATION_PLAN.md` | 24 untracked files, plus overlap with tracked indexes in OR-1 | E, F, I | Multiple review/architecture lineages. Require separate authority and semantic review; do not append to OR-1 merely because files are nearby. |
| OR-3 | experiment/proof packages: `docs/experiments/*`, `examples/poa-001/*`, `examples/poa-002/*`, `examples/poa-003/*`, Gate-0/POA review records and proof scripts | 39 untracked files | B, D, E, I | Verification examples, outputs and review evidence. Preserve pending verification of manifests and intended provenance; commit only as bounded proof packages if authorized. |
| OR-4 | Runtime 1.1 implementation/release/deployment: `.dockerignore`, `Dockerfile`, `deploy/*`, `docs/architecture/runtime/*`, `docs/development/ORION_RUNTIME_DEPLOYMENT.md`, Runtime audit/release reviews, `release/*`, Runtime scripts, `src/orion_runtime/*`, `tests/test_runtime_v1_1.py`, plus `Makefile` and `README.md` edits | 43 untracked files plus 2 tracked edits | A, E, F, I | Large current implementation candidate with explicit prior `ACCEPT WITH CONDITIONS` history. It must not be mixed with architecture adoption. Requires independent verification and a dedicated release/implementation commit series, not a hygiene commit. |

The ORION `.gitignore` is already strong and covers `.workspace/`, Python
caches, build/dist, logs, secrets, editor files and `.DS_Store`. No new ORION
ignore rule is justified by this audit.

### R7 — NEXAHEDRON

No pending paths. Clean and current.

### R8 — NEXAH-Experience canonical checkout

No pending paths. Clean and current.

### R9 — embedded NEXAH-Experience feature checkout: two groups

| Group | Exact scope | Count | Classification | Disposition |
|---|---|---:|---|---|
| EX-1 | `README.md`, `src/pages/visitor-guide.astro`, `docs/DEPLOYMENT_STATUS.md` | 3 files | A, E, I | Coherent deployment-status/visitor-boundary documentation candidate. The status is dated 2026-07-26 and says deployed source revision is unknown; it needs current factual revalidation before commit. |
| EX-2 | checkout placement inside ORION `.workspace/` while a clean canonical Experience checkout exists | one checkout | G | Valid feature-work checkout but redundant as a general reference. Retain until EX-1 is dispositioned; use R8 for clean/current comparisons. |

## 5. Z3885 branch and package status

Branch `codex/z3885-verification` exists locally and remotely. Local and remote
SHAs are identical (`0 / 0`):

- `24aa33d550f76ac379dd22eb241c734a72105561` —
  `analysis: add rational resonance null-model test`
- `c27dff4b92a5863b495b2cbb802f6b760f9e22ce` —
  `verification: certify Board XXIII Z3885 CRT scaling`

The branch contains exactly `null_model_test.py` and the eight intended
`BOARD_XXIII_Z3885_VERIFICATION/` files relative to `origin/main`.

Hash-manifest audit:

- seven listed file hashes: PASS;
- package digest expected/observed:
  `66616cd608c83f0b45dd8be02be450965d2a4524ae066aea0614aaa3447227a6`;
- all machine-readable invariants: PASS;
- verdict preserved: `PASS — EXACT_5X_CRT_ORBIT_SCALING_PROVEN`;
- scope: finite modular systems only;
- disposition: `NO_ARCHITECTURE_IMPACT`, `NOT_ADOPTED`;
- IEEE/physical scaling claim: not established.

Push status is complete. Merge to `main` remains a separate Owner decision.

## 6. ORION unresolved-state assessment

| Previous finding | Current assessment | Evidence |
|---|---|---|
| ORION architecture files existed in ambiguous uncommitted state | `STILL_OPEN` | The same five files remain modified/untracked, and their hashes exactly match the recorded baseline. No content drift was found, but Git provenance remains unresolved. |
| Historical CLOSED Science Lab reports required materiality-filtered coverage | `RESOLVED` for the bounded reviewed set | `05_HISTORICAL_MATERIALITY_BACKFILL.md` records MHB-001..MHB-007 with default `NOT_ADOPTED`; its recorded SHA-256 remains `b8d05a7f…`. A bounded future trigger queue correctly remains. |
| Master Ecosystem Visual missing | `RESOLVED` as existence/semantic registration | Both V1 HTML files exist and exactly match registered hashes `42da93f0…` and `a8d6dfae…`. |
| Master Visual publication/baseline traceability | `STILL_OPEN` | Files remain outside a versioned publication repository; embedded abbreviated ledger reference is not independently reconstructible. `VISUAL_AUTHORITY = NONE`; status stays `REVIEW_REQUIRED`. |
| Minimal NEXAH status transcription uncommitted | `STILL_OPEN` | The two NF-2 files remain exact and uncommitted. |
| Phase 4B / continuity package uncommitted | `STILL_OPEN` | Packages remain among Science Lab untracked content. |

## 7. Architecture continuity assessment

The continuity ledger and drift-control records remain internally coherent but
uncommitted. Their substantive state is:

- ADC-01/historical materiality: PASS for the bounded material set;
- ADC-11/Master Visual traceability: `REVIEW_REQUIRED`;
- ADC-12/canonical repository state: `REVIEW_REQUIRED`;
- no evidence in this audit supports `DRIFT_DETECTED`;
- a dirty working tree alone is not architecture drift.

The ledger should not be rewritten during hygiene cleanup. It should be updated
only after an Owner-authorized repository action actually changes a queued
state, preserving prior hashes and decisions.

## 8. Proposed commits — not executed

These are minimal candidate commits, in recommended order. Every commit and
push requires separate Owner authorization. “Exact paths” below are allowlists,
not permission to stage parent directories.

| Order | Repository | Exact paths | Classification / reason | Proposed commit message | Recommendation | Owner authorization | Risk if unchanged |
|---:|---|---|---|---|---|---|---|
| 1 | NEXAH-Science-Lab | `NEXAH_ECOSYSTEM_REPOSITORY_CURRENTNESS_AUDIT.md` only | E; durable audit snapshot | `docs: record ecosystem repository currentness audit` | Commit alone after review | Required | Currentness knowledge remains local and ephemeral. |
| 2 | NEXAH-Science-Lab | `.gitignore` only, containing `__pycache__/` and `*.py[cod]` | H; observed Python cache noise only | `chore: ignore Python cache artifacts` | Small standalone hygiene commit; do not add broad output/data ignores | Required | Repeated cache noise obscures substantive untracked material. |
| 3 | NEXAH | Decide disposition of local commit `105074f8` before file work | A/E/I; branch ancestry gate | no new commit proposed until decision | Owner selects push, supersession, or transfer path | Required | Subsequent governance commit may be based on unintended local history. |
| 4 | NEXAH | `GOVERNANCE/README.md`, `GOVERNANCE/CURRENT_ECOSYSTEM_ARCHITECTURE_STATUS.md` | E/F; exact queued minimal status sync | `docs(governance): record current ecosystem architecture status` | Separate two-file commit after Order 3 | Required | UQ-004 and reader-baseline ambiguity remain open. |
| 5 | NEXAH-ORION | exact five-file OR-1 allowlist | F; adopted hashes exact, provenance missing | `docs(architecture): record adopted ORION master architecture` | One architecture-only commit | Required | UQ-001 / ADC-12 stays open; adopted content lacks durable Git provenance. |
| 6 | NEXAH-ORION | OR-2 files only after an explicit reviewed manifest is produced | E/F/I; mixed architecture/review lineage | `docs: add orientation infrastructure review set` | Do not commit until semantic scope and exact list are independently reviewed | Required | Large local knowledge set remains ambiguous; premature commit may create authority confusion. |
| 7 | NEXAH-ORION | each of `examples/poa-001/`, `poa-002/`, `poa-003/` with its matching docs/reports/manifests; Gate-0 separately | B/D/E/I; proof packages | e.g. `verification: add POA-001 proof package` | Several bounded commits after manifest verification | Required | Evidence remains non-durable; mass commit would mix independent proof claims. |
| 8 | NEXAH-ORION | OR-4 Runtime allowlist after tests/release audit; keep normative runtime contracts separate from implementation if authority differs | A/E/F/I; Runtime implementation and conditional-release evidence | `runtime: add ORION 1.1 execution boundary` followed by separate `docs(runtime): record release verification` | Dedicated implementation/release series; never label as unconditional release | Required | Important work can be lost; premature commit could overstate operational compliance. |
| 9 | NEXAH-Experience | `README.md`, `src/pages/visitor-guide.astro`, `docs/DEPLOYMENT_STATUS.md` | A/E/I; deployment/boundary docs | `docs: clarify current Experience deployment status` | Commit only after revalidating live status and date | Required | Public docs may remain stale; committing stale facts creates false attestation. |
| 10 | NEXAH-Science-Lab | exact allowlist for `NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_CONTINUITY_AND_DRIFT_CONTROL/` and any separately Owner-approved Phase 4B package | E/F; UQ-006 durability | `docs(governance): version architecture continuity controls` | Separate from experiments and from Z3885; exact manifest review first | Required | Maintenance ledger remains unversioned and therefore fragile. |

No commit is proposed for R3 or R4. Their deletions and duplicate histories
require disposition, not preservation through new commits. No mass commit is
proposed for SL-1 through SL-4.

## 9. Proposed `.gitignore` candidates

| Repository | Candidate rules | Exact observed reason | Recommendation |
|---|---|---|---|
| NEXAH-Science-Lab | `__pycache__/`, `*.py[cod]` | 77 untracked Python cache files in 13 directories; repository currently has no tracked `.gitignore` | Strong candidate for a small standalone hygiene commit. Do not ignore `outputs/`, CSV, JSON, NPZ, logs or experiment directories globally without a data-retention decision. |
| NEXAH canonical repo | none | 21 `.DS_Store` changes/files occur only in obsolete R3; current `main` already ignores `.DS_Store` and `.AppleDouble`, and tracks no `.DS_Store` files | No canonical ignore update. R3 needs checkout disposition; an ignore rule cannot resolve its already tracked historical metadata. |
| NEXAH-ORION | none | Existing `.gitignore` already covers `.workspace/`, caches, build/dist, logs, secrets and OS/editor files | No update proposed. |
| NEXAHEDRON / Experience | none from observed state | Clean canonical checkouts; no generated noise observed | No speculative ignore change. |

## 10. Owner-review items

1. Decide whether Z3885 branch should remain review-only or receive a separate
   merge authorization. No architecture adoption follows from merge.
2. Decide the fate of R3 (`NEXAH-CODEX`): archive/export/retire versus preserve
   as an intentional historical checkout. Its divergence precludes routine sync.
3. Decide whether R3's deleted `prime_spiral_projection.md` is intentional.
4. Decide the staged R4 deletion before any operation on that checkout.
5. Decide the unpublished NEXAH commit `105074f8` before governance sync.
6. Authorize or reject the exact two-file NEXAH governance status commit.
7. Authorize or reject the exact five-file ORION adopted-architecture commit.
8. Define separate allowlists/authority for ORION orientation reviews, proof
   packages and Runtime 1.1; they must not be one commit.
9. Revalidate the current `nexah.de` deployment facts before Experience docs.
10. Decide which Science Lab historical/experimental packages are durable
    repository records versus local archives/data stores; do not infer from
    existence alone.
11. Authorize a small Science Lab Python-cache `.gitignore` change if desired.
12. Decide a versioned publication home for Master Visual V1 and its sidecar,
    or explicitly retain it as an external derived artifact.

## 11. Recommended execution order

1. Review and, if approved, version this audit alone.
2. Resolve destructive/ambiguous states first: R3 historical deletion and R4
   staged deletion; perform no automated cleanup.
3. Decide duplicate-checkout roles so future work uses R2/R8 as clean reference
   checkouts and does not accidentally act on R3/R4.
4. Resolve R5 local-commit ancestry, then separately review NF-2.
5. Commit OR-1 only with explicit ORION Owner authorization; then update the
   continuity ledger in a later Science Lab maintenance commit recording the
   completed action.
6. Independently review OR-2, OR-3 and OR-4; validate manifests/tests and create
   bounded commits by authority and artifact lineage.
7. Revalidate Experience public facts, then decide EX-1.
8. Perform a package-level Science Lab retention review; add only the narrow
   Python-cache ignore rules if separately authorized.
9. Decide Master Visual publication and Science Lab continuity-package
   durability last, using the now-stabilized repository states.

**ECOSYSTEM_REPOSITORY_MAINTENANCE_REQUIRED**
