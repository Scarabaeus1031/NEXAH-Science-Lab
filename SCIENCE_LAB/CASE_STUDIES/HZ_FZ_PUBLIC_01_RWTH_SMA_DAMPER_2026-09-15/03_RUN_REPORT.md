# HZ_FZ_PUBLIC_01 — Kernel 0.7 Run Report

Date: `2026-09-15`

Classification: `ATTACHED_EXTERNAL_E2_ONLY`

Attachment SHA-256:
`6c742e6e03b69633bd46d9a8d683b9b734c65dff6bc78c1c8afe0db7daa1cf52`

## Result

All four verified public CSV cuts were loaded through
`pandas-table-source-v1` and analyzed by `nexah-v07` from NEXAH `0.7.0`.
The primary local-fit configuration is `k=4`, `window=32`, `seed=42`; the
kernel input is an ordered 64 Hz decimation of the immutable 512 Hz sources.
Four OrientationState records and four transition records are retained as
deterministic gzip objects with canonical JSON and compressed-file hashes.

## Cut robustness

The records contain 16 nominal period windows, but the driven portion ends
before the file does. The declared 90%-amplitude rule identifies:

- 0.5 Hz pair: active windows 1–10; inactive tail 11–16.
- 1.0 Hz pair: active windows 2–9; partial/idle windows 1 and 10–16.

Across active cycles, the median A/B fundamental-gain differences are:

| Pair | Actuator 1 | Actuator 2 |
|---|---:|---:|
| 0.5 Hz, 20 mm | 5.316% | 4.560% |
| 1.0 Hz, 40 mm | 5.185% | 6.046% |

Removing the first and last active window leaves the medians materially
unchanged: 5.284%, 4.560%, 5.185% and 6.113%, respectively. Active-cycle phase
differences remain below 1.01 degrees in all four channel/pair combinations.

## Kernel sensitivity

Six frozen `(clusters, window, seed)` configurations were evaluated for both
pairs. The NEXAH v0.7 permutation-invariant A/B similarity ranges were:

- 0.5 Hz pair: `0.987869–1.000000` (span `0.012131`).
- 1.0 Hz pair: `0.996905–1.000000` (span `0.003095`).

This means the kernel's coarse local transition signature is stable across the
declared battery. It does not mean the cuts are identical: the independent
signal analysis resolves a repeatable roughly 5–6% gain separation.

## Verification

- Public attachment tests: `10/10` passed.
- Existing admitted HZ/FZ integration tests: `10/10` passed.
- Common Runtime tests: `18/18` passed.
- NEXAH core suite: `302/302` passed.
- Attachment-to-result and eight compressed-record hashes: verified.
- PNG inspected at its native `2880 × 2340` resolution.

The NEXAH core repository and the frozen HZ_FZ_01 admission case were not
modified. The public evidence remains supplementary and cannot activate the
pending HZ/FZ profile.
