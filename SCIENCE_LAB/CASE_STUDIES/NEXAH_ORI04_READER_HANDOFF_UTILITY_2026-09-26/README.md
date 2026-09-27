# NEXAH-ORI-04 — Reader and Handoff Utility

Status: `READY_NOT_EXECUTED`.

This package prepares a randomized equal-information reader pilot comparing a strong plain-language structured record with the NEXAH orientation labels.

## Preflight

```bash
python3 run_preflight.py
```

## Local instrument preview

From this directory:

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765/participant_instrument.html`.

The instrument performs no network submission. It exports one local JSON response file. Do not collect human responses until participant route, consent, privacy/storage and ethics requirements receive a separate Human Owner decision.

## Package files

- `00_PREREGISTRATION.md` — frozen design, endpoints and outcome space
- `01_CASES.json` — eight case records and answer key
- `02_ASSIGNMENT_FORMS.json` — generated eight-form counterbalancing
- `03_SCORING_SPEC.md` — frozen machine and rater scoring
- `04_PREFLIGHT_RESULTS.json` — material and balance validation
- `participant_instrument.html` — local response/export interface
- `run_preflight.py` — deterministic form builder and validator
- `FINAL_RETURN.md` — readiness return after preflight
