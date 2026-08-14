# NEXAH Science Lab

Open, evidence-bounded research on a practical question:

> When a dynamical system is translated between representations, which
> structural properties remain operationally useful, what information is lost,
> and how should robustness be distinguished from fidelity and discrimination?

This repository is the public laboratory record. It contains inspectable
protocols, implementations, evidence manifests, reports, negative results and
explicit scientific limits. It is intended to become useful to readers,
reviewers, replicators and contributors without requiring access to NEXAH's
private planning environment.

## Current status

`LAB_OPERATIONS_STATE = STRUCTURE_FREEZE`

No experiment, scientific replay or new Study is currently authorized. This is
a governance state, not a scientific result. Existing package-level findings
retain their own scope and status.

Start with:

1. [What the Lab currently knows](SCIENCE_LAB_MASTER_STATUS.md)
2. [Maintained Study and report register](SCIENCE_LAB/LAB_REGISTER.md)
3. [Science Lab Constitution](SCIENCE_LAB/LAB_CONSTITUTION.md)
4. [Contributor and replicator onramp](SCIENCE_LAB/CONTRIBUTOR_ONRAMP.md)
5. [Run Contract](SCIENCE_LAB/RUN_CONTRACT.md)

## What this repository is — and is not

The Lab tests bounded claims about representation, translation, information
loss, structural certificates, dynamical systems and deterministic operators.
It preserves positive, negative, invalid, inconclusive and uninformative
outcomes when their evidence boundaries are inspectable.

The repository does **not** establish universal NEXAH validity, a new physical
law, general prediction or control capability, external-domain validity or
human benefit. File presence, visual similarity, a passing implementation test
or a completed report does not promote a scientific claim.

## Find the work

| Need | Public entry |
|---|---|
| current bounded dispositions | [Master Status](SCIENCE_LAB_MASTER_STATUS.md) |
| Studies and canonical reports | [Lab Register](SCIENCE_LAB/LAB_REGISTER.md) |
| scientific lifecycle and result classes | [Science Lab Protocol](SCIENCE_LAB/PROTOCOLS/SCIENCE_LAB_PROTOCOL.md) |
| research-cycle requirements | [Research-Cycle Lifecycle](SCIENCE_LAB/PROTOCOLS/RESEARCH_CYCLE_LIFECYCLE.md) |
| promotion and non-promotion rules | [Knowledge-Promotion Rules](SCIENCE_LAB/PROTOCOLS/KNOWLEDGE_PROMOTION_RULES.md) |
| closure requirements | [Lab Close Protocol](SCIENCE_LAB/PROTOCOLS/LAB_CLOSE_PROTOCOL.md) |
| canonical report form | [Labreport Schema](SCIENCE_LAB/PROTOCOLS/LABREPORT_SCHEMA.md) |
| current machine-readable portfolio | [Portfolio JSON](SCIENCE_LAB_PORTFOLIO.json) |

Research packages remain authoritative only within their declared scope. The
Lab Register points to them; it does not replace their evidence or conclusions.

## Reproduce or review

Before presenting a command as a scientific run, use the
[Run Contract](SCIENCE_LAB/RUN_CONTRACT.md). It distinguishes documented work,
verification of existing evidence, local replay, portable replay and external
replication.

Some large raw or generated datasets are intentionally excluded from ordinary
Git history. Their public manifests and disposition records remain under
`LAB_DESK/ARTIFACTS/` as a historical path. A manifest is not proof that an
external artifact is currently downloadable; inspect the relevant disposition
before claiming reproducibility.

During Structure Freeze, contributors may review documentation, inspect
manifests and report broken paths or ambiguous boundaries. Do not silently
repair frozen evidence or describe a failed replay as a pass.

## Repository map

- `SCIENCE_LAB/` — public governance, protocols, register and Labreports.
- named experiment and audit packages — bounded scientific objects with their
  own status and authority.
- `LAB_DESK/ARTIFACTS/` — historical public reproducibility manifests and data
  disposition records; not the active management desk.
- `RESEARCH_PROGRAM_*` and `RESEARCH_INSTITUTE_*` — research navigation and
  program context with their own documentary status.

The local workstation also contains a large untracked historical archive. It is
not part of the public repository and does not create public claims or current
tasks. Private prioritization, daily queues, owner decisions and archive
management live in the private NEXAH Mission Control repository.

## Frontstage / backstage boundary

This public repository owns the inspectable scientific record. Private Mission
Control owns scheduling, prioritization, personal workflow and the Science Lab
Research Director Desk. The private Desk may point here; it cannot silently
change a public Study's evidence or status.

The boundary is recorded in
[SL-GOV-003](SCIENCE_LAB/GOVERNANCE/SL_GOV_003_FRONTSTAGE_BACKSTAGE_BOUNDARY.md).

The older `00_LAB_ENTRY/`, `SCIENCE_LAB/ACTIVE_WORK.md` and management files in
`LAB_DESK/` are retained temporarily as historical migration snapshots. They
are not current entry points or task authority.

## License and contribution boundary

Inspect the license and provenance of the specific package before reuse. A
repository-wide contribution route does not override third-party data,
historical artifact or package-specific restrictions.

No contribution, issue, replay or pull request becomes an adopted scientific
result without the documented audit, integration and closure path.
