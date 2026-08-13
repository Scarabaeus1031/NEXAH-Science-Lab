# Architecture drift check

The drift check is read-only. It compares source hashes, status statements,
adoption records, repository state and visual metadata. It never repairs or
adopts anything.

## Status rule

```text
ARCHITECTURE_DRIFT_STATUS =
  CLEAN             # all checks pass; no review/update queue
  REVIEW_REQUIRED   # incomplete disposition, pending authorized update,
                    # stale/missing derived artifact, or ambiguous repo state
  DRIFT_DETECTED    # confirmed semantic/authority contradiction or
                    # unadopted promotion
```

`DRIFT_DETECTED` outranks `REVIEW_REQUIRED`. Every non-clean status must list
finding ID, source, expected state, observed state, owner and next action.

## Repeatable checks

| Check | Question | Evidence comparison | Finding condition |
|---|---|---|---|
| ADC-01 | Has a CLOSED Labreport appeared without disposition? | Closed portfolio/index vs ledger source IDs/hashes | Missing row → `REVIEW_REQUIRED` |
| ADC-02 | Has an Owner decision reached every declared canonical target? | Decision record/manifest vs target path/hash | Pending target → `REVIEW_REQUIRED`; contradictory target → `DRIFT_DETECTED` |
| ADC-03 | Does canonical ORION agree with Master Architecture? | ADR/master/ownership/index/status text and hashes | Semantic disagreement → `DRIFT_DETECTED` |
| ADC-04 | Does NEXAH agree with adopted ecosystem boundaries? | NEXAH governance vs ledger baseline | Authority contradiction → `DRIFT_DETECTED` |
| ADC-05 | Does Experience/NEXAHEDRON claim unowned authority? | Current architecture/public docs vs authority matrix | Meaning/science/decision claim → `DRIFT_DETECTED` |
| ADC-06 | Is LYRA shown active? | Current docs/visuals vs `INACTIVE / OUTSIDE CERTIFIED V1` | Current active claim → `DRIFT_DETECTED` |
| ADC-07 | Is LUCY shown as Runtime/system/agent? | Current docs/visuals vs Phase 4B freeze | Current system claim → `DRIFT_DETECTED` |
| ADC-08 | Is Interface V1 shown implemented? | Current docs/visuals/code claims vs interface decision | Implemented claim without adoption/evidence → `DRIFT_DETECTED` |
| ADC-09 | Is Research presented as product capability? | Research status + Owner adoption vs product/release docs | Promotion without adoption → `DRIFT_DETECTED` |
| ADC-10 | Does a current architecture plate contradict Markdown? | Plate metadata/baseline vs controlling source hashes | Current contradiction → `DRIFT_DETECTED`; historical label absent → at least `REVIEW_REQUIRED` |
| ADC-11 | Is the Master Visual older than represented architecture? | Visual baseline/manifest vs ledger current hashes/dates | Stale or missing required refresh → `REVIEW_REQUIRED` |
| ADC-12 | Are canonical architecture changes uncommitted/ambiguous? | Repository HEAD/status vs ledger targets | Ambiguous state → `REVIEW_REQUIRED` |

## Operating procedure

1. Read the ledger and collect rows changed since `LAST_VERIFIED`.
2. Enumerate newly CLOSED Labreports from the authoritative Lab index/status.
3. Hash only controlling sources and compare immutable manifest references.
4. Inspect repository status for declared canonical targets.
5. Search current documentation/visual metadata for the frozen status tokens.
6. Add exact findings to the queue; never edit target repositories.
7. Set the aggregate status by the rule above and update `LAST_VERIFIED` only
   after the check is complete.

## Concise output template

```text
ARCHITECTURE_DRIFT_STATUS = <CLEAN | REVIEW_REQUIRED | DRIFT_DETECTED>
BASELINE = <ledger/version/hash reference>
CHECKED_AT = <timestamp>

FINDINGS:
- <ID> | <source> | expected=<...> | observed=<...> |
  owner=<...> | next=<...>
```

## Initial baseline check — 2026-08-11

```text
ARCHITECTURE_DRIFT_STATUS = REVIEW_REQUIRED
BASELINE = EASL-001..EASL-010 / 2026-08-11

FINDINGS:
- ADC-12 / UQ-001 | ORION architecture documentation |
  expected=unambiguous canonical repository state |
  observed=ADR-0009 and Master Architecture untracked; Ownership modified |
  owner=Owner/ORION repository authority |
  next=separately authorize and verify intended repository action

- ADC-11 / UQ-002 | Master Ecosystem Visual |
  expected=derived artifact after separate generation authorization |
  observed=not yet generated |
  owner=documentation Owner |
  next=generate from frozen baseline only when authorized

- ADC-01 / UQ-003 | historical CLOSED Labreport corpus |
  expected=material closed reports have explicit disposition |
  observed=pre-ledger coverage not yet established |
  owner=Science Lab governance; Owner only for adoption |
  next=one-time materiality-filtered backfill, default NOT_ADOPTED
```

No confirmed semantic authority contradiction was found in the verified current
baseline. Therefore the initial status is `REVIEW_REQUIRED`, not
`DRIFT_DETECTED`.

## Post-generation update — 2026-08-11

Master Ecosystem Visual V1 was generated as a derived artifact and registered
under EASL-009 with SHA-256
`42da93f0fc8cb851f99ed8efb6bfcece66f50782a5b4c6e27d1674e14af76d1b`.
ADC-11/UQ-002 is resolved. The aggregate status remains `REVIEW_REQUIRED`
because ADC-12/UQ-001 and ADC-01/UQ-003 remain open. No semantic contradiction
was introduced by the visual.

## Pre-Application sync audit — 2026-08-11

| Check | Result | Evidence / finding |
|---|---|---|
| ADC-01 | PASS | Canonical CLOSED Labreport dispositioned; material pre-ledger groups MHB-001..MHB-007 default to `NOT_ADOPTED`; future work is a bounded trigger queue. |
| ADC-02 | `REVIEW_REQUIRED` | Adopted ORION targets are committed at `d023b96672d6c29c8fadda1b91e247f48d9b1288` and promoted to default `main`. The Phase 4B LUCY freeze remains uncommitted; the minimal NEXAH status transcription is durable on review branch `codex/maintenance-pass-3-governance` at `6da37e76` but not on default `main`. |
| ADC-03 | PASS | ADR-0009, Master Architecture, Ownership and indexes agree semantically and retain exact adopted hashes. |
| ADC-04 | PASS | NEXAH Constitution/Governance contains no contradictory authority claim; proposed compact status transcription is consistent. |
| ADC-05 | PASS | NEXAHEDRON and Experience remain within presentation/interaction authority. Existing unrelated Experience working-tree changes were not absorbed. |
| ADC-06 | PASS | LYRA is not shown as active certified V1. |
| ADC-07 | PASS | Current sources and Master Visual show LUCY as a Human Reflection Boundary with no runtime/system/agent. |
| ADC-08 | PASS | Interface V1 remains `MEMBRANE_V1_APPROVED_NOT_IMPLEMENTED`; legacy Gateway material is not treated as Interface V1. |
| ADC-09 | PASS | Research remains external; reviewed historical results default to `NOT_ADOPTED`. |
| ADC-10 | PASS | No current plate contradiction found; historical LUCY/architecture plates remain lineage/reserved rather than current Runtime authority. |
| ADC-11 | `REVIEW_REQUIRED` | Visual semantics verify, but the embedded abbreviated ledger baseline is not independently reconstructible and the HTML is not in a versioned publication repository. |
| ADC-12 | `REVIEW_REQUIRED` | ORION default-main provenance is resolved at `d023b96`. NEXAH governance remains on a review branch, and the Science Lab continuity package is pending this controlled integration pass. |

```text
ARCHITECTURE_DRIFT_STATUS = REVIEW_REQUIRED
BASELINE = EASL-001..EASL-012 / 2026-08-11
CHECKED_AT = 2026-08-11T05:03:04+02:00
```

There is no semantic/authority contradiction and no unadopted Research
promotion. Remaining findings are repository-history and derived-publication
maintenance items; they do not require a new architecture decision.

## Controlled integration update — 2026-08-13

ORION remote feature provenance was recorded at
`d023b96672d6c29c8fadda1b91e247f48d9b1288`. The commit remained an exact
one-commit fast-forward from the prior default-main baseline and was promoted
to `origin/main` on 2026-08-13. Its exact five-file scope and frozen content
hashes were preserved; OR2, OR3 and OR4 were not included.

The aggregate status remains `REVIEW_REQUIRED`: Phase 4B is intentionally
outside this pass, NEXAH governance is pending default-main review, and Master
Visual publication traceability is handled as a separate derived-artifact
transaction. No semantic or authority contradiction was found.
