# Data and Provenance Contract

Status: `DRAFT — OWNER APPROVAL REQUIRED`

## 1. Package layout

```text
TTM-0.1_<run_id>/
├── README.md
├── protocol/
│   ├── PROTOCOL_SNAPSHOT.md
│   ├── protocol_manifest.json
│   └── SHA256SUMS
├── calibration/
│   ├── calibration_raw.csv
│   └── calibration_result.json
├── templates/
│   └── P01.csv ... P06.csv
├── raw/
│   └── <sample_uuid>_native.csv
├── sealed_truth/
│   ├── sample_identity.csv
│   └── transition_markers.csv
├── derived/
│   └── <sample_uuid>/
│       ├── source_normalized.csv
│       ├── trace_canonical.csv
│       ├── trace_render.pgm
│       ├── mask_static.csv
│       ├── mask_moving.csv
│       ├── reconstruction_static.csv
│       └── reconstruction_moving.csv
├── review_packets/
│   ├── trace_only/
│   ├── static_mask/
│   └── moving_mask/
├── results/
│   ├── sample_metrics.csv
│   ├── pair_metrics.csv
│   └── run_status.json
├── provenance/
│   ├── run_manifest.json
│   ├── environment.txt
│   ├── events.csv
│   └── file_inventory.csv
└── SHA256SUMS
```

No execution package is created by this draft.

## 2. Identifiers and filenames

- `run_id`: UTC timestamp plus eight random lowercase hexadecimal characters,
  formatted `YYYYMMDDTHHMMSSZ-xxxxxxxx`;
- `sample_uuid`: UUIDv4, generated before acquisition;
- public and reviewer filenames use `sample_uuid` only;
- `Pxx-F/R` appears only in `sealed_truth/sample_identity.csv`;
- replacements receive a new `sample_uuid` and preserve `replaces_uuid`.

No semantic title appears in scientific data filenames.

## 3. CSV serialization

All CSV files use:

- UTF-8 without BOM;
- LF newline;
- comma delimiter;
- one header row;
- decimal point `.`;
- no thousands separators;
- final newline required;
- empty numeric field only when paired with explicit `UNKNOWN` status.

### Native source schema

```text
native_index,t_seconds,device_x,device_y,contact
```

### Normalized source schema

```text
sample_uuid,tau,x_mm,y_mm,source_status
```

`source_status` is exactly `OBSERVED`.

### Canonical trace schema

```text
sample_uuid,trace_index,s_norm,x_mm,y_mm,closure_status
```

This file contains no `tau`, time, direction, speed or raw row index.

`trace_render.pgm` follows the exact PGM contract in the acquisition protocol.
It carries no embedded metadata and is not reverse-engineered for primary
geometry scoring.

### Mask schema

```text
sample_uuid,tau,mask_type,center_x_mm,width_mm,masked,record_status
```

Allowed `record_status` values:

```text
VISIBLE
WITHHELD
```

### Reconstruction schema

```text
sample_uuid,tau,x_hat_mm,y_hat_mm,reconstruction_status
```

Allowed `reconstruction_status` values:

```text
OBSERVED
INTERPOLATED
UNKNOWN
```

### Sample metrics schema

```text
sample_uuid,condition,metric_id,value,unit,status
```

Allowed `status` values:

```text
VALID
UNKNOWN
INVALID
BLOCKED
```

## 4. Required JSON metadata

`run_manifest.json` must contain:

```json
{
  "protocol_id": "TTM-0.1-DRAFT-01",
  "protocol_status": "OWNER_APPROVED_REQUIRED",
  "run_id": "",
  "scientific_owner": "UNASSIGNED",
  "data_owner": "UNASSIGNED",
  "acquisition_operator": "UNASSIGNED",
  "analysis_operator": "UNASSIGNED",
  "independent_reviewer": "UNASSIGNED",
  "device": {
    "manufacturer": "",
    "model": "",
    "firmware": "",
    "sample_rate_hz": null
  },
  "software": {
    "acquisition_name": "",
    "acquisition_version": "",
    "analysis_commit_or_hash": ""
  },
  "timestamps": {
    "protocol_frozen_utc": "",
    "acquisition_started_utc": "",
    "acquisition_finished_utc": ""
  },
  "authority_record": "",
  "result_status": "NOT_EXECUTED"
}
```

Required per-sample metadata:

- `sample_uuid`;
- acquisition order;
- device and calibration IDs;
- raw filename and hash;
- contact-down and contact-up timestamps;
- native sample count and duration;
- replacement relationship;
- technical events;
- QC status;
- derivation software hash;
- derived file hashes.

## 5. Provenance events

`events.csv` uses:

```text
event_id,timestamp_utc,actor,action,input_path,output_path,status,note
```

Required events include:

- protocol freeze;
- owner approval;
- calibration;
- each acquisition attempt;
- each raw-file seal;
- every derivation;
- review-packet construction;
- independent review receipt;
- analysis start and completion;
- any stop or contamination event.

Events are append-only. Corrections add a new event; they do not rewrite
history.

## 6. Hash manifest

Every file in the package except the outer `SHA256SUMS` hashes itself through
one sorted manifest line:

```text
<lowercase_sha256><two spaces><relative_posix_path>
```

Rules:

1. paths are relative to the run root;
2. sort by raw UTF-8 path bytes;
3. directory entries are excluded;
4. symbolic links are prohibited;
5. a nested protocol manifest freezes protocol files before acquisition;
6. any mismatch blocks execution or review;
7. regeneration after results are visible is prohibited.

## 7. Separation of access

| Package area | Acquisition operator | Reconstruction | Independent reviewer | Evaluator |
|---|---:|---:|---:|---:|
| raw source | read/write during capture | no | no | read |
| sealed truth | no after seal | no | no | read after submissions |
| canonical trace | read | trace-only packet | read | read |
| masked visible records | read | read | read | read |
| withheld coordinates | no | no | no | read after submissions |
| results | no before freeze | write | submit | read |

One person may not act as both analysis operator and independent reviewer.

## 8. Preservation and privacy boundary

The primary dataset contains coordinates and technical metadata only. It must
not contain names, free-text interpretation, audio, face images, handwriting
content, pressure, biometric claims or demographic inference.

Human-data retention, consent language and deletion policy remain
`UNASSIGNED` and require Owner and applicable ethics/privacy review before any
acquisition.
