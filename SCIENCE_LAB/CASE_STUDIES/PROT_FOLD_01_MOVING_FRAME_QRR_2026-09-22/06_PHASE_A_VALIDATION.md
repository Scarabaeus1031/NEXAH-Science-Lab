# Phase A validation

Status: `PASS`

## Checks

- `SOURCE_BINDING.json`, `phase_a_protocol.json`, `phase_a_results.json`,
  `protocol.draft.json` and `protocol.repair_r1.draft.json`: valid JSON;
- source SHA-256: exact protocol match;
- Python implementation: syntax check passed under the bundled NumPy runtime;
- primary execution: all eleven gates passed;
- immediate clean replay: `phase_a_results.json`,
  `phase_a_per_residue.csv` and `phase_a_contact_occupancy.csv` were
  byte-identical to the primary outputs;
- source frame reconstruction and invariant tolerances: passed;
- reflection and identity-corruption controls: passed;
- result language: model/conformer index remains non-temporal;
- AXIS08 natural pair: unresolved and unexecuted;
- Phases B–D: hold;
- capability activation: none.

## Replay command

```text
/Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 run_phase_a.py
```

## Replay identities

```text
phase_a_results.json
c3bdb52c6c31d434cb71d8ee5386522e9a702ec9848fca03041eabbf48829df8

phase_a_per_residue.csv
409f1c1b06b8daa42fb68ebe431cc3315a33ed1171dc77bf708e4c04ca1140ad

phase_a_contact_occupancy.csv
aca63f758c1e208aa39affb492e4686ac3ee5cc9aab692839cb92b117f549a2c
```

The replay verifies deterministic local computation from the bound bytes. It
is not independent biological replication.
