# KAPPA-01 — Acquisition Contract

## One file per uninterrupted session

Each raw session CSV must contain exactly these columns in this order:

```text
sample_index,t_s,phase_label,event_marker,drive_v,displacement_mm,force_n,temperature_c
```

Rules:

- `sample_index` starts once and increases by exactly one;
- `t_s` is generated from the declared hardware clock and is strictly
  increasing;
- all analogue channels are sampled synchronously or have a measured fixed
  skew corrected by a preregistered rule;
- `phase_label` is one of `PRE`, `EVENT`, `POST`, `RECOVERY`;
- `event_marker` is zero except for the source-bound event marker state;
- no resampling, smoothing or gap filling is permitted in the raw file;
- raw files are write-once and hashed immediately after acquisition.

## Per-session sidecar

Each CSV has a JSON sidecar containing:

- blinded condition code;
- randomized block and order position;
- apparatus and calibration IDs;
- acquisition device and clock IDs;
- fixed frequency, drive amplitude, preload and sample rate;
- start time and operator;
- intervention receipt hash;
- safety and anomaly log;
- raw CSV SHA-256.

The active/sham decoding key is stored separately and unavailable to the
primary analyst until all admissions, exclusions and primary outputs are
sealed.

## Admission before analysis

A session fails closed if it contains a reset clock, missing/duplicate sample,
missing phase, missing event marker, non-finite value, unapproved clipping,
metadata mismatch or invalid calibration. Failed sessions remain in the
provenance ledger and are never silently replaced.
