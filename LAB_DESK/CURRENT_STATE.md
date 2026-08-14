# Research Director — Current State

Status date: 2026-08-14

Role: **Science Lab Research Director**

## Current assignment

`SL-CLEAN-001` — reconstruct the endpoints and disposition needs of the
pre-existing untracked Science Lab packages without changing scientific
content or publishing raw data.

## What is known

- The repository contains a large, historically accumulated untracked research
  corpus. Its size is an orientation and repository-hygiene problem, not by
  itself evidence that the science is lost.
- Many package roots contain terminal reports, freezes, status records or
  manifests. Their presence is only an endpoint-location signal; it does not
  establish adoption, validity or current authority.
- Large generated datasets, especially the Early-Warning Level-1C trajectories,
  require a data-artifact decision separate from a Git source decision.
- The tracked [`../SCIENCE_LAB_MASTER_STATUS.md`](../SCIENCE_LAB_MASTER_STATUS.md)
  remains controlling where it already reconciles a research line.

## Current gate

No package deletion, bulk staging, raw-data upload, experiment execution or
scientific reinterpretation is authorized by this cleanup task.

## Definition of done for SL-CLEAN-001

- every untracked top-level package has a deterministic content-tree hash;
- endpoint candidates and status signals are recorded;
- raw/generated-data weight is visible separately;
- each package has a bounded review class;
- the next cleanup sequence is small enough to execute package-by-package.
