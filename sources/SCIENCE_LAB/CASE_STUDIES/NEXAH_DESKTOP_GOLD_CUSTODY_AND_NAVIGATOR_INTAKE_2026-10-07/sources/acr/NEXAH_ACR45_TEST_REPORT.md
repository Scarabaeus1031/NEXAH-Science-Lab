# NEXAH ACR-45 — Final Multimodal Closure Gate

## Scope

Bounded synthetic integration of optic geometry, video frames, a micro-aperture,
stereo audio and the final film container. The test asks what closes and what
still drifts when the modalities share one event ledger.

## Construction

- Four events at `[0.45, 1.2, 1.95, 2.7]` seconds.
- Video: 30 fps; audio: 48000 Hz.
- Registered control: shared event ledger and aperture.
- Fault control: video delayed by two frames (66.7 ms),
  right audio delayed by 80 ms, micro-frame shifted and the
  measured Visual 6→7 scale residual reproduced as −1.18%.

## Result

- Event identity and order survive all registered representations.
- Baseline frame quantization stays within half a video frame.
- The two-frame video drift, 80 ms audio drift and −1.18% scale jump are detected.
- Muxing streams into an MP4 does not prove synchrony. Film is a binder only
  when timebase, event ledger, aperture and direction metadata are preserved.

## Decision

```text
MULTIMODAL_FILM_CARRIER = SUPPORTED_WITH_SHARED_LEDGER_AND_TIMEBASE
OPTIC_VIDEO_MICRO_AUDIO_IDENTITY = NO
REGISTERED_CLOSURE = PASS
DRIFT_CONTROL = DETECTED
FILM_AS_BINDER = CONTAINER_NOT_PROOF_OF_SYNCHRONY
FINAL_ACR_GATE = CLOSED_SYNTHETIC_DEMONSTRATOR
REAL_INSTRUMENT_VALIDATION = OPEN
NEW_SCIENTIFIC_CLAIM = NO
```

## Reproduction

```bash
python run_acr45.py
```
