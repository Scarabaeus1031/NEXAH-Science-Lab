# HZ_FZ_01 — Kernel v0.7 Integration Record

Date: `2026-09-15`

Decision: `AUTHORIZED_AND_IMPLEMENTED_AS_NON_ACTIVATING_E2_ATTACHMENT`

## Purpose

Connect an admitted HZ_FZ_01 measurement to the already implemented NEXAH
`TableSourceAdapter` and `V07BackendAdapter`, then bind the resulting typed
orientation records to the Common Runtime without duplicating either adapter.

```text
measurement → HZ_FZ admission → TableSourceAdapter → V07BackendAdapter
            → two independent OrientationStates → signed evidence attachment
```

The attachment is supplementary computational evidence. It cannot admit a
measurement, align local cluster identities, activate the runtime profile or
raise the evidence class above E2.

## Reused authority

- HZ_FZ_01 remains source and admission authority.
- NEXAH v0.7 remains the frozen descriptive analysis backend.
- `TableSourceAdapter` remains the tabular source boundary.
- `V07BackendAdapter` remains the only v0.7-to-`OrientationState` translator.
- Common Runtime remains receipt and attachment authority.
- RID-01 mapping remains future work.

## Exact implementation allowlist

Only these Science Lab files are authorized by this record:

1. `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-runtime-adapter.js`
2. `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/hz-fz-v07-evidence.py`
3. `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/attach-hz-fz-v07-evidence.js`
4. `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/test-hz-fz-v07-evidence.js`
5. `SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/README.md`
6. `SCIENCE_LAB/CASE_STUDIES/HZ_FZ_01_FREQUENCY_FORCE_ADMISSION_2026-09-15/00_README.md`
7. this decision record.

No change to the NEXAH repository, frozen kernel, ORION repository, ORION
membrane, Chemistry 6+1 profile, measurement contract or admission criteria is
authorized.

## Fail-closed rules

The adapter stops when any of the following is true:

- the measurement validator does not return `ADMISSIBLE`;
- the declared measurement hash changes between admission and analysis;
- the declared NEXAH repository is not the module actually loaded;
- the loaded NEXAH version is not `0.7.0`;
- a native adapter rejects a table, timestamp or trajectory;
- the evidence class or runtime effect attempts profile activation;
- the attachment hash does not verify.

REFERENCE_A and REPLAY_B are fitted separately. Their local cluster numbers,
states and transition maps must not be compared as shared identities.

## Current status

```text
SOFTWARE COMPOSITION   = IMPLEMENTED
SYNTHETIC CONFORMANCE  = ALLOWED FOR TESTING ONLY
REAL MEASUREMENT       = ABSENT
RUNTIME PROFILE        = ADMISSION_GATE_READY / FAIL_CLOSED
ORION                  = UNTOUCHED
```

