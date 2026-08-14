# EXP-00-R Current-Authority Endpoint Bundle

Status date: 2026-08-14

Disposition: **BOUNDED_CURRENT_AUTHORITY_BUNDLE**

Scientific result: **UNKNOWN**

Registered evidence generated: **NO**

## Selection

- Selected roots: **30**
- Selected files: **414**
- Selected bytes: **1.2 MiB**
- Bundle tree: `ef1869651d1f96309160ee825e2922b9ec4eb53cef425172ebdbedd3d21c4eb0`

| Layer | Roots | Files | Size | Tree SHA-256 |
| --- | ---: | ---: | ---: | --- |
| `01_scientific_authority` | 21 | 332 | 960.5 KiB | `9d7aac5e990bd558434336c02a006411e52d293d6a221cedfac7e19db637440a` |
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
