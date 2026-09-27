# HZ_FZ_PUBLIC_01 — Kernel 0.7 Attachment Contract

Date: `2026-09-15`

Status: `FROZEN_FOR_EXECUTION`

## Purpose

Attach the verified RWTH before/after cuts to the installed NEXAH `0.7.0`
source and backend adapters without changing the frozen `HZ_FZ_01` admission
decision.

## Mapping

| Public record | Runtime meaning |
|---|---|
| each selected CSV | one immutable source record identified by SHA-256 |
| `REFERENCE_A` | Cut A, recorded before the earthquake campaign |
| `RETURN_B` | Cut B, recorded after the earthquake campaign |
| four numeric channels | actuator 1/2 displacement in mm and force in kN |
| CSV `Time` | relative source time in seconds |
| Kernel fit | one local fit per cut; cluster identifiers never cross the cut boundary |

The source adapter receives every eighth sample (64 Hz effective rate) in order
to make the historical kernel tractable while retaining 64 or 128 samples per
nominal cycle. The original 512 Hz files remain the authority for all signal
and robustness calculations.

## Fixed primary configuration

`n_clusters=4`, `window=32`, `random_state=42`, `normalize=true`.

The attachment must record NEXAH version `0.7.0`, adapter identifiers, source
hashes, downsampling, full canonical OrientationState hashes, and a
permutation-invariant A/B similarity. Canonical states are stored as
deterministic gzip records and referenced by SHA-256.

## Robustness battery

Signal robustness first divides the records into 16 nominal one-period
windows. A paired window is active only when both cuts reach at least 90% of
the declared displacement amplitude. Statistics are reported for active
windows and again after excluding the first and last active window; inactive
tail windows are retained and reported, not treated as driven cycles. Kernel sensitivity uses the
fixed set `(clusters, window, seed)`:

`(3,16,42)`, `(4,16,42)`, `(4,32,7)`, `(4,32,42)`, `(4,64,42)`, `(5,32,42)`.

No universal pass threshold is invented. The report publishes observed ranges,
median/IQR signal changes, and the range of the kernel's own
permutation-invariant similarity heuristic.

## Claim boundary

This is external E2 computational evidence. It describes a before/after
relation in an open laboratory dataset. It is not an independent replay, a
causal earthquake-effect estimate, calibrated uncertainty, or evidence that
activates `hz-fz-transfer`.
