# TOP Return Card — TOP-ECOSYSTEM-02

**Template:** `TOP Return Card 0.1`
**Status:** `CLOSED_RETROSPECTIVE_RECORD`
**Claim ceiling:** one local artifact lineage; no theory, novelty, capability,
causality, physical identity or general ecosystem claim

## 1. Object and boundary

| Field | Record |
|---|---|
| Card ID / date | `TOP-E02-RC01 / 2026-09-25` |
| Owning source / authority | Science Lab owns the experiment and scientific claim; Core owns implementation contracts; Mission Control owns currentness routing; Human authority remains external to automation |
| Object | `AXIS08-QRR-01 / IEEE Projection Fidelity Sidecar V1` |
| Bounded question | Can this lineage cross Science Lab → Core → Mission Control and return with its differentiated states explicit? |
| Domain, frame and aperture | IEEE-9 development versus IEEE-14 evaluation without refit; local repositories and records observed on 2026-09-25 |
| Evidence inputs | Protocol and frame hashes frozen in `01_PROTOCOL_FREEZE.md`; two edges frozen in `02_EDGE_LEDGER.json` |
| Comparator / rule | Canonical Core result versus replay; Mission Control receipt versus Science Lab result; numerical tolerance `1e-12` |
| Stop condition | source/hash mismatch, invalid bundle, categorical or authority change, or numerical drift above tolerance |

## 2. Declared perspectives — `3 + 1`

| Role | Declared view | May establish | May not establish |
|---|---|---|---|
| A — Science Lab | preregistered evidence and bounded interpretation | experiment result and claim ceiling | Core contract, portfolio priority or Human adoption |
| B — NEXAH Core | reusable typed computation and evidence bundle | implementation integrity and replay result | scientific authority or product usefulness |
| C — Mission Control | currentness receipt and ecosystem routing | exact Science-source receipt and bounded status summary | independent replication or ownership of the result |
| +1 — TOP comparison | dated relation among A–C | per-edge I–L–A–U and differentiated return | shared core, merged authority or absolute view |

## 3. Path and operations

| Edge | From → to | Operation | Rule | Evidence |
|---|---|---|---|---|
| E1 | Science Lab → Core | translate result into typed implementation and bound bundle; replay | bundle hashes exact; categorical fields exact; drift ≤ `1e-12` | `02_EDGE_LEDGER.json`; `03_EXECUTION_RECORD.md` T1–T4 |
| E2 | Core → Mission Control | register bounded currentness and route back to Science authority | registered Science hash exact; semantics and authority preserved | `03_EXECUTION_RECORD.md` T5 |

## 4. I–L–A–U account

| I — retained | L — lost | A — introduced | U — unresolved |
|---|---|---|---|
| question, protocol and input hashes; categorical decision; tolerance-bound reconstruction; negative claims; separate authorities | complete Science narrative in Core; byte identity; Core artifact hashes in Mission Control; Human/public view | Core contracts, verifier and bundle; Mission Control routing; explicit edge ledger | external reproduction; platform-independent canonical bytes; hash-bound Core→MC receipt; Human usefulness; generalization |

## 5. Differentiated return test

| Return layer | Status | Test / comparison | Residual or failure condition |
|---|---|---|---|
| Byte identity | `FAIL_TYPED` | canonical SHA `b816…f23e7` versus replay SHA `4075…6564` | 128 numerical fields differ |
| Numerical agreement | `PASS_BOUNDED` | maximum absolute drift `1.3030919621407877e-13` | below declared `1e-12` tolerance |
| Semantic agreement | `PASS_BOUNDED` | status, decision, gate, protocol, inputs and claim ceiling | no non-numerical differences |
| Provenance continuity | `FAIL_TYPED` | package and cross-repository bindings | stale Science manifest entry at execution; Core→MC artifact binding partial |
| Authority continuity | `PASS_BOUNDED` | compare declared and returned repository roles | no authority transfer observed |

**Typed residual / epsilon trace:** `R1` stale Science manifest at execution;
`R2` tolerance-valid floating-point byte drift; `R3` partial Core→Mission
Control binding; `R4` dirty Mission Control state at execution; `R5`
governance-gated Human/public adapter.

Post-close note: `R1` was repaired in Science Lab commit `11ac160`; this does
not rewrite the execution-time observation or the closed overall result.

## 6. Return disposition

| Field | Record |
|---|---|
| Bounded result | `BOUNDED_PASS_WITH_TYPED_RESIDUALS` |
| Claim that survives | The one tested lineage preserves its categorical scientific result, claim ceiling and authority split across the declared path within tolerance. |
| Claim that does not survive | Byte identity and complete edge-provenance closure do not survive. |
| Open residual / next admissible test | Hash-bind one Core artifact receipt in Mission Control, then repeat the same card without expanding scientific scope. |
| Authority after return | unchanged: Science Lab / Core / Mission Control / Human remain distinct |
| Active research / build / publication effect | `NONE` |
| Reviewer / owner and date | Mission Control audit record / Human Owner review pending / 2026-09-25 |

The return closes this comparison cycle only. It does not establish global
identity, physical backflow, a universal invariant or a scientific TOP theory.
