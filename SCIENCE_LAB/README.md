# NEXAH Science Lab — Operating System

Status: `ADOPTED_V1 / STRUCTURE_FREEZE`

This directory is the controlled operating layer of the NEXAH Science Lab. It
does not own the detailed scientific content of distributed studies; it owns
Lab admission, active-work control, reproducibility classification, closure
navigation and the return of bounded results to Mission Control.

## Required reading order

1. [Lab Constitution V1](LAB_CONSTITUTION.md)
2. [Active Work](ACTIVE_WORK.md)
3. [Lab Register](LAB_REGISTER.md)
4. [Contributor Onramp](CONTRIBUTOR_ONRAMP.md)
5. [Run Contract](RUN_CONTRACT.md)

Operational procedures:

- [Science Lab Protocol](PROTOCOLS/SCIENCE_LAB_PROTOCOL.md)
- [Research-Cycle Lifecycle](PROTOCOLS/RESEARCH_CYCLE_LIFECYCLE.md)
- [Knowledge-Promotion Rules](PROTOCOLS/KNOWLEDGE_PROMOTION_RULES.md)
- [Lab Close Protocol](PROTOCOLS/LAB_CLOSE_PROTOCOL.md)
- [Canonical Labreport Schema](PROTOCOLS/LABREPORT_SCHEMA.md)

## Current operating state

`LAB_OPERATIONS_STATE = STRUCTURE_FREEZE`

No experiment, replay, new Lab admission or package-level cleanup may begin
until the constitutional exit gate in `ACTIVE_WORK.md` passes and the Human
Owner records a separate reopen decision.

Repository maintenance necessary to establish this operating system is allowed.
It must not modify scientific evidence or silently change a study's status.
