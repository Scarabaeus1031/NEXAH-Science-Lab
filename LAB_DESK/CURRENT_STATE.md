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

The first package disposition is now locally prepared:

- `NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION` is split into a 52-file Git-core
  allowlist and a 2,990-file raw-data manifest;
- the raw corpus is packaged as a deterministic 950.5 MiB `tar.zst` artifact;
- member-by-member stream verification and a second identical build passed;
- upload and deletion remain unauthorized;
- active owner gate:
  `SELECT_PRIVATE_DURABLE_OBJECT_STORAGE_AND_AUTHORIZE_UPLOAD`.

The second package disposition is also complete:

- the EXP-00-R current-authority bundle is registered as 30 selected roots and
  414 repository files across scientific-authority, engineering/export and
  generator/producer lineages;
- 32 historical roots remain excluded under `HISTORICAL_PRESERVE` and are
  hash-recorded in the bundle manifest;
- the current local Python `3.12.7` environment is correctly rejected by the
  exact frozen Python `3.12.13` runtime gate;
- this runtime mismatch does not alter the preserved reviews, but no exact
  operational replay or readiness claim is made;
- registered evidence generation and experiment execution remain unauthorized.

The third package disposition is registered:

- ten completed ORION execution packages were split into an exact 151-file Git
  core and 402-file primary/replay data layer;
- the 92.2 MiB data layer is preserved as a deterministic 11.2 MiB local
  `tar.zst`, member-verified and reproduced byte-identically;
- its SHA-256 is
  `3793f5a96407d64f9ef3592f0d3dce625908fb39ec8e94489da7dd459fa68579`;
- all 327 checked package-manifest file bindings match current bytes;
- package outcomes remain bounded: four `INVALID_EXPERIMENT`, one
  `UNINFORMATIVE_BENCHMARK`, and the remaining PASS/demonstration statements
  retain their package-specific restrictions;
- the exact ORION execution core is remote-durable at
  `73a0f97c05547b025bacc7f609c600008d58bbdb`.

Active owner gate:
`SELECT_PRIVATE_DURABLE_OBJECT_STORAGE_AND_AUTHORIZE_UPLOAD`.

The terminal NEXAH review is also complete:

- six Translation Fidelity source roots are already hash-mapped into the
  tracked, self-contained RC1 release bundle;
- the untracked T02 adversarial v1 review is historical provenance behind the
  tracked v2/v3 authority chain;
- Application, architecture and repository-currentness records are routed to
  their responsible Desks rather than treated as new Lab science;
- `NEXAH_TRANSLATION_RECOVERY_EXP_T01` is the sole separate science candidate:
  27 files, tree
  `836b2f3aee8b0dd8d13704adf3621e5af01b9b5cce50ffdea564c98f1f7b8648`,
  with all **26 / 26** frozen manifest bindings verified;
- EXP-T01 remains `SCIENCE_LAB_NOT_ADOPTED` and is remote-durable at
  `bf2c34a3ca66c053fb3c412e86206ccf9f9cf1b7`.

EXP-T01 registration is complete; no adoption or execution follows from it.

## Definition of done for SL-CLEAN-001

- every untracked top-level package has a deterministic content-tree hash;
- endpoint candidates and status signals are recorded;
- raw/generated-data weight is visible separately;
- each package has a bounded review class;
- the next cleanup sequence is small enough to execute package-by-package.
