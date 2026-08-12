# Board XXIII / Z3885 — Source and Provenance Map

## 1. Forensic scope

This map records the read-first search performed before the verifier was
written. The search was read-only. No canonical NEXAH or ORION source was
modified.

Search terms included `board-xxiii-z3885.md`, `board-xxiii-z3885.png`,
`Board XXIII`, `Z_3885`, `Z3885`, `Z_777`, `Z777`, `T_1301`, `T_524`,
`1301`, `3885`, `777`, `Gold Sparkles`, `Gold Fixpoints`, `Gold Chords`,
`Janus Mirrors`, `Amber Lattices`, and `Cyclic Fields`.

Methods:

- filename search over `/Users/tho2020/Documents`;
- content search over the Science Lab working tree and the local NEXAH,
  NEXAH-CODEX, NEXAHEDRON, NEXAH-ORION, and NEXAH-Experience checkouts;
- filename search over all visible local Git histories of those repositories;
- exact public-web searches for the named Board file and operator notation;
- a read-only query through the available GitHub connector (which returned no
  repositories for the requested owner and therefore supplied no evidence).

## 2. Existing Board XXIII source result

No `board-xxiii-z3885.md`, `board-xxiii-z3885.png`, or other substantive
Board XXIII / Z3885 source was found in the searched working trees or their
visible local Git histories. Exact public-web searches also returned no
result. Consequently:

- historical terminology is known only from the supplied task specification;
- the expected orbit counts are not evidenced as statements in a located
  repository source;
- it cannot be established from located repository evidence whether those
  counts had previously been computed or merely asserted;
- comparison of the task definitions against an original historical Board
  source is not possible.

This is a provenance limitation, not an algebraic definition conflict. The
operators specified in the task are unambiguous and can be verified
independently.

The only local content-search hits for `3885` in the Science Lab were ordinary
numeric fields in seven primary and seven replay trajectory CSV files under
`ORION_EXP_ORION_L1_001_V1_1_EXECUTION/`. They do not discuss Board XXIII,
modular arithmetic, or the claim under review and are excluded as controlling
evidence. One analogous incidental numeric hit appeared in an unrelated
animated HTML file in the NEXAH-CODEX checkout.

## 3. Repository states searched

State was captured before package creation. “Changes” is the count reported by
`git status --porcelain`; these pre-existing mixed working-tree changes were
not modified.

| Local repository | Branch | HEAD | Changes | Origin |
|---|---|---|---:|---|
| NEXAH Science Lab | `main` | `635dbe6d677170cd855db7e82b522565fac7ebca` | 161 | `Scarabaeus1031/NEXAH-Science-Lab` |
| GitHub/NEXAH | `main` | `923362e141170f06f2f0f26992136b5979047c42` | 0 | `Scarabaeus1031/NEXAH` |
| GitHub/NEXAH-CODEX | `main` | `cc1962237940867becb7beb7d4d9fb9f6b613253` | 22 | `Scarabaeus1031/NEXAH` |
| NEXAH_REPO_CLONE | `main` | `a0539b9a951de557fbf71f4b0a3526708f3cbecc` | 1 | `Scarabaeus1031/NEXAH` |
| NEXAHEDRON | `main` | `f9cbe359b08fdb4d63c3ff11eb2ae0ade9ecd1ab` | 0 | `Scarabaeus1031/NEXAHEDRON` |
| NEXAH-ORION | `codex/orion-orientation-operators` | `d34fbb2f99334534f4db89465a29f8bdb16d14d3` | 31 | `Scarabaeus1031/NEXAH-ORION` |
| NEXAH-Experience | `main` | `1adbaf1865b22a6d3e1ab4cbf115ff5116167285` | 0 | `Scarabaeus1031/NEXAH-Experience` |

## 4. Controlling inputs and hashes

SHA-256:

| Label | Source | SHA-256 | Role |
|---|---|---|---|
| `task_spec` | supplied `pasted-text.txt` | `617a23f854b46e2cc52cbbba9e2b6087f3760897b3dd83bc5c1a75466f940631` | Defines the claim and acceptance requirements |
| `lab_closure` | `LAB_SESSION_CLOSURE_2026-08.md` | `e971156943e954fd34c35c4c209f54d9210db2481f7146ea3434ed44a7842321` | Continuity context only |
| `lab_master_status` | `SCIENCE_LAB_MASTER_STATUS.md` | `c14a70373699cb770909d5f62aef14fb933129b82b6fb6ba875912eb4f700816` | Lab status context only |
| `lab_portfolio` | `SCIENCE_LAB_PORTFOLIO.json` | `12409616e9f7446c23bfcab94cd02e13298a9846c97d3d89cf68ff73fc7e7b4e` | Lab portfolio context only |

The task specification is the sole located source defining the modular claim.
The independent script, not the expected count table, derives the result.

## 5. Terminology handling

The verifier uses neutral mathematical terms. Historical labels from the task
are retained only parenthetically:

| Neutral term | Historical label(s) supplied in task |
|---|---|
| period-1 orbit / fixed point | Gold Sparkle / Gold Fixpoint |
| period-2 orbit | Janus Mirror / Gold Chord |
| period-4 orbit | Cyclic Field / Amber Lattice |

No claim is made that these labels were recovered from an original Board
source.

