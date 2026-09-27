# ORI-04 Instrument Verification

Date: 2026-09-26

## Passed

- eight unique cases loaded and schema-validated;
- four `ALLOW` and four `BLOCK` gold decisions;
- eight assignment forms generated;
- every form contains four Baseline and four NEXAH presentations;
- every case appears four times per condition across forms;
- every case occupies each serial position exactly once;
- condition values and claim text share one canonical payload per case;
- participant instrument, case JSON and form JSON returned HTTP 200 from the local server;
- embedded JavaScript passed `node --check`;
- no external submission endpoint, fetch target or analytics dependency is present.

## Environment-limited checks

- Codex in-app browser automation could not initialize because an authorized workspace root contains a symlink component.
- Bundled Playwright is present, but its Chromium executable is not installed. No browser download or installation was authorized.

These are environment limitations, not instrument passes. A manual browser smoke test remains required before any participant execution.

## Required manual smoke test

1. Start the documented local HTTP server.
2. Open the participant instrument in a normal browser.
3. Complete form `F1` with pseudonym `SMOKE-ONLY`.
4. Confirm all eight cases render and alternate across both label conditions.
5. Confirm incomplete responses are blocked.
6. Confirm confidence values and per-case timing are recorded.
7. Export the JSON file.
8. Verify eight response objects, condition codes `X` and `Y`, no gold answers, and no network request beyond the three local files.
9. Delete the smoke response; do not place it in the study corpus.

Human execution remains `NOT_STARTED`.
