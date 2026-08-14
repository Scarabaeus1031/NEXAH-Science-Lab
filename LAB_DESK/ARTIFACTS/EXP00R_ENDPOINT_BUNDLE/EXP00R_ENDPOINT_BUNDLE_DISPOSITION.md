# EXP-00-R Current-Authority Endpoint Bundle

Status date: 2026-08-14

Disposition: **BOUNDED_CURRENT_AUTHORITY_BUNDLE**

Scientific result: **UNKNOWN**

Registered evidence generated: **NO**

## Selection

- Selected roots: **30**
- Selected files: **435**
- Selected bytes: **1.3 MiB**
- Bundle tree: `e586ad21d6a2b6de2249509e1f227500737246fa9538a594f16ab545a54427a6`

| Layer | Roots | Files | Size | Tree SHA-256 |
| --- | ---: | ---: | ---: | --- |
| `01_scientific_authority` | 21 | 353 | 1.0 MiB | `da3621901d2a065dd18643e08558c3c935ac092e6b96e945719209620053da93` |
| `02_engineering_export` | 5 | 47 | 88.1 KiB | `700fcb0f3f3a8bacb3de057b90f189fb1ca35f659e6f1ea81c3c04db8f1a7e67` |
| `03_generator_producer` | 4 | 35 | 140.8 KiB | `9e9c464f55a1066d36f3c40c898d6a18eda780eb1900867917bb74026c75fbfe` |

## Why this is bounded

The bundle contains the cumulative scientific authority named by the Master Status, the current V3R6 engineering endpoint, the closed Export R1 line, Generator R2 and Producer R1, together with their current reviews. It does not import obsolete authorizations, failed operations, superseded generators/producers or the full V2/V3 repair history.

Excluded historical roots: **32**. Of these, **11** are named in current-bundle provenance text and remain hash-recorded in the machine manifest.

## Authority boundary

- Registration makes the current reviewed objects remotely durable and navigable.
- It does not authorize evidence generation or experiment execution.
- It does not establish P1-P5 or any scientific classification.
- Historical references remain provenance; their mention does not make them current authority.
- `SCIENCE_LAB_MASTER_STATUS.md` remains the human orientation authority.

## Next operational frontier

`SEPARATE_REGISTERED_EVIDENCE_GENERATION_AUTHORIZATION_RECHECK_NOT_PERFORMED`
