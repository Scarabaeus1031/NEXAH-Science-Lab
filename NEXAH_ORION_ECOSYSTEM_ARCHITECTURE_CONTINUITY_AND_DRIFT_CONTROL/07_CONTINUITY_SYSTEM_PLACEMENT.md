# Continuity system placement

Decision type: maintenance placement, not architecture adoption

## One authoritative maintenance set

The authoritative operational home is this single package at the root of the
`NEXAH-Science-Lab` repository:

`NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_CONTINUITY_AND_DRIFT_CONTROL/`

Its placement at repository root, outside `SCIENCE_LAB/`, is deliberate. It is
ecosystem maintenance documentation, not scientific evidence and not Science
Lab Research authority. It receives synchronization authority only; it cannot
define semantics, adopt capability or overrule an owning repository.

| Maintenance responsibility | Sole authoritative artifact |
|---|---|
| Architecture status ledger | `01_ECOSYSTEM_ARCHITECTURE_STATUS_LEDGER.md` |
| Single update queue | The `Single update queue` section inside the ledger |
| Drift check ADC-01..ADC-12 | `02_ARCHITECTURE_DRIFT_CHECK.md` |
| Repository routing / update matrix | `03_REPOSITORY_UPDATE_MATRIX.md` |
| Visual versioning rule | `04_MASTER_VISUAL_VERSIONING_RULE.md` |
| Historical materiality backfill | `05_HISTORICAL_MATERIALITY_BACKFILL.md` |
| Master Visual V1 registration | `06_MASTER_VISUAL_V1_REGISTRATION.md` |

NEXAH Governance may contain a compact current-status reference. ORION,
NEXAHEDRON and Experience retain their own authority records. None receives a
copied ledger or parallel queue.

## One-builder operating rule

1. On a CLOSED Labreport or material architecture/status event, update one
   ledger row.
2. Run the twelve read-only drift checks.
3. Add only non-current actions to the queue.
4. Write to an owning repository only under that repository's authority.
5. Preserve old hashes and derived visual versions.

No dashboard, database, synchronizer, bot or second tracker is required.
