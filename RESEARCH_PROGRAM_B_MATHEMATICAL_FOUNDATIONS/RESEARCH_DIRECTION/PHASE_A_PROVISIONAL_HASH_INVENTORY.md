# Phase A — Provisional Hash Inventory

Status: `OBSERVED — NOT CANONICAL`

Audit date: `2026-08-01`

Hash algorithm: `SHA-256`

Operational effect: `NONE`

## Reading rule

These hashes identify files observed during the read-only Phase A audit. They
are not a freeze manifest, adoption record, clean-repository assertion or
execution authorization.

## Originating Lab 0.4 files

Base path:

```text
../NEXAH_CONTROL_DESK/ROEDELHEIM_OBSERVATORY_BUNDLE/
```

| File | Bytes | Observed modification time | SHA-256 |
|---|---:|---|---|
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.md` | 4,901 | `2026-07-29T00:30:40+0200` | `50c451623b8490d2e87490a698356daa9389bae65ddafbf498a2d3815746b40b` |
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_MODEL_0_4.js` | 6,369 | `2026-07-29T00:27:14+0200` | `f6f48b8a1d5c043ad4d59e4dc4c31937953f65d72cd139c3753ebf295462b56e` |
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.test.js` | 6,351 | `2026-07-29T00:34:11+0200` | `f382c1aac36470b578582a7afd81224cfbdc68e03c97eac44ba776597b5021ff` |
| `ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.html` | 18,646 | `2026-07-29T00:28:46+0200` | `d02c7046efb79efccdc86533fee3a885806e86c99b6f27cfe5b9de0a769ad1f6` |

All four files were untracked in the observed Control Desk worktree.
Modification times are descriptive only and do not establish provenance.

## Provenance documents

| File | SHA-256 | Limitation |
|---|---|---|
| `ROEDELHEIM_OBSERVATORY_BUNDLE/INDEX.md` | `4592c31b599a1a47e8ac9d1589599ecd4487d697be51e1f523f9997fc5c3cbc5` | bundle navigation and status; not a Lab 0.4 freeze manifest |
| `HOW_A_WORLD_IS_HELD/03_ROEDELHEIM_PROVENANCE/PROVENANCE_BRIDGE.md` | `ec2cbca4a7aa40dd74c8c50ac866efee90fdfab5f780e6c8d887f546e8fc0fd4` | historical route; not independent scientific evidence |
| `RESEARCH_PROGRAM_C_VALIDATION_LANDSCAPE/01_CLAIM_INVENTORY.md` | `9d7ea2e3a321ea16a28162f563288eb0c831ae59cb62808e61fca75e30c49ef6` | contains C-46; no independent source |
| `RESEARCH_PROGRAM_F_CROSS_PROGRAM_SYNTHESIS/05_PRIMARY_CHAIN_SCIENTIFIC_SPECIFICATION.md` | `427d2457d70205f01d6a4315d8d6e16d911000c2eeab356f8ff00eed257f7cd9` | finite scientific reduction; no execution |

## Program G Protocol 1.0 documents

Base path:

```text
RESEARCH_PROGRAM_G_PROTOCOL_DESIGN/
```

| File | SHA-256 |
|---|---|
| `README.md` | `68547ac39d6472ac41285d2929853fc859750c7618827ba11af64733336105e2` |
| `01_RESEARCH_PROTOCOL.md` | `2511481bc8816b5f7a5065ebb8f3badcdbd46c75163da0d5d6337a91571e6ab8` |
| `02_FROZEN_SCIENTIFIC_DEFINITIONS.md` | `56003ea92509c83356c3037dc863027e9a407dbf034b8d3631ba1683287b06ac` |
| `03_SCIENTIFIC_OBJECT_SPECIFICATION.md` | `fcfd1f606a14075e7ca8d57e55fd96baa3e5faa6d9f185520787fdc3e6dbd5ff` |
| `04_INPUT_SPECIFICATION.md` | `bfebd87c8fce19c970ad10864fa3fad1edf65a8a2dc043602c09b7ad096d313a` |
| `05_OUTPUT_SPECIFICATION.md` | `5e43b0dbffe845137c87675f21bc9f336e0c35b5ddf3563ef1476aa2f3df53d0` |
| `06_EQUIVALENCE_CRITERION.md` | `dbdb16822ff2dd5bbf6760be629b41c037b8b94d493125fe6b9c787e626aa7c9` |
| `07_EQUALITY_AND_TOLERANCE_RULES.md` | `7960041df7a319c0d54094e906efbb66b72f5eb48d2682941074695960ec9c54` |
| `08_VALIDATION_PROTOCOL.md` | `e66e298beba0640bc1c1df5e40551430b79a926e57656e6daf2029409a58598b` |
| `09_INDEPENDENT_REPLAY_PACKAGE_SPECIFICATION.md` | `0656b32b7b366240f395407401913ab369ca7d2c6c623c5562044016ca2c4481` |
| `10_EXTERNAL_REVIEW_PACKAGE.md` | `0b43e7895ca59c630fe08876002f974662b27d31e5e53f0ae772a2c3a1c4f1bd` |
| `11_FINAL_RECOMMENDATION.md` | `db7def2b81dda9cb266ff6347e2ddcf4ba33801a9bdadc2fdd1a443030720249` |

All Program G files were untracked in an unborn Science Lab repository during
the audit. These values may be compared during owner review, but they do not
become canonical until an authorized freeze record adopts them.

## Absent hash objects

No hash can yet be recorded for:

- `source_samples.csv`;
- `protocol_manifest.json`;
- `scientific_object.json`;
- `result_schema.json`;
- `validation_checklist.md`;
- the canonical replay archive;
- any originating Program G execution result;
- any independent replay result.

Those objects do not currently exist in the audited workspace.
