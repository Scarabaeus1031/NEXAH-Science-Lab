# Temporal Window Control

```text
physical_event_duration ≠ exposure_window ≠ sampling_interval ≠ readout_time
```

| Setting | Preserves | Can lose/introduce |
|---|---|---|
| Short exposure | Instantaneous/transient spatial structure when enough signal is detected | Low signal, noise dominance, missed events |
| Medium exposure | Compromise within a declared question | Partial blur and partial averaging |
| Long exposure | Integrated energy/mean structure | Motion blur, averaged fluctuations, erased ordering |

A stable long-exposure image can result from a fluctuating flame. Therefore
`STABLE_READOUT_REQUIRES_STABLE_SOURCE=NO`.

Aliasing requires repeated sampling: distinct temporal behaviors can produce the
same sampled sequence when the sampling rule lacks enough temporal resolution.
The exposure interval determines integration; the sampling interval determines
when integrations are repeated; readout time is a later instrument event.

Returning to an earlier exposure setting restores a setting, not history. The
previous and later observations remain distinct events with distinct provenance.
