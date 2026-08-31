# Artifact and Duplicate Ledger

## Collection-level inventory

| Class | Count | Authority treatment |
|---|---:|---|
| Markdown | 63 | package authority or companion documentation according to native role |
| CSV | 27 | structured results/ledgers; all syntax-valid |
| JSON | 1 | OVI bounded-corpus manifest; syntax-valid |
| SVG | 5 | visual reference/derived presentation; not independent evidence |
| PNG | 1 | visual reference/derived presentation; not independent evidence |
| `.DS_Store` | 1 | pre-existing noncanonical filesystem metadata; preserved |
| ZIP | 0 | no container/extracted double count |
| Source code / executable scripts | 0 | no execution surface |
| DOCX / PDF | 0 | none received |
| Total | 98 | original collection before stewardship metadata |

## Folder role summary

| Folder | Canonical authority files | Companion documentation | Structured results | Visual references | Code/execution | Unresolved objects |
|---|---:|---:|---:|---:|---:|---:|
| GPT-01 folder | 2 | 0 | 1 | 0 | 0 | 0 |
| CROA-01 | 2 | 4 | 2 | 0 | 0 | 0 |
| ATS-01 | 2 | 4 | 3 | 0 | 0 | 0 |
| PAT-01 | 2 | 3 | 5 | 0 | 0 | 0 |
| IPG-01 | 2 | 6 | 2 | 0 | 0 | 0 |
| ASY-01 | 2 | 7 | 2 | 1 | 0 | 0 |
| IOTB-01 | 2 | 9 | 1 | 1 | 0 | 0 |
| OVI-01 | 2 | 4 | 7 | 1 | 0 | 0 |
| OVR-01 | 2 | 8 | 4 | 1 | 0 | 0 |
| NVC-01 | 1 | 0 | 0 | 2 | 0 | 0 |

Here “canonical authority” means the native package’s specification/final authority within its bounded scope; it does not mean ecosystem architecture adoption. Companion documents and structured ledgers remain evidential parts of the package. Visual exports preserve presentation only.

## Integrity and duplicate findings

- Every CSV parses with a consistent declared row shape per file.
- `OVI01_MANIFEST.json` parses and its counts agree with `12_OVI01_FINAL_INVENTORY.md`.
- Exact duplicate groups inside the collection: `0`.
- Exact file matches against the inspected NEXAH ecosystem: `0`.
- ZIP/extracted relations: `NONE`.
- Nested copies of download folders: `NONE`.
- Destination collision before filing: `NONE`.
- Duplicate deletion: `NONE`.

`PRESERVATION_NE_AUTHORITY`

`REPRESENTATION_NE_INDEPENDENT_CONFIRMATION`

`ZIP_CONTAINER_NE_SECOND_EVIDENCE_SET`
