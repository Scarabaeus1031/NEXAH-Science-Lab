# A0-BL-058 — Run Contract

| Field | Contract |
|---|---|
| source revision | Science Lab `c535e64494587782f7ddc0cd7f3ac4d5913bafaf` plus dirty-tree declaration; exact run files in `LOCK.json` |
| referenced result | A0-BL-057 Primary SHA-256 `af641d10b2baa9158d6661f60cf810e1306cfe6d7af74d20f0116408ae2a7af6` |
| environment | local Python `3.9+`, standard library only |
| data access | no dataset; fixed analytic functions and repository-local result reference |
| lock command | `python3 verify_lock.py` |
| Primary command | `python3 run_experiment.py --output artifacts/PRIMARY_RESULT.json` |
| Replay command | `python3 run_experiment.py --output artifacts/REPLAY_RESULT.json` |
| verify | `python3 verify_result.py artifacts/PRIMARY_RESULT.json`; repeat for Replay; `cmp` results |
| render | `python3 render_result.py artifacts/PRIMARY_RESULT.json artifacts/PULSE_PERSISTENCE_RESULT.svg` |
| expected outputs | canonical JSON and deterministic SVG; one frozen primary classification plus optional phase qualifier |
| numeric tolerance | exactly as frozen in `FROZEN_PROTOCOL.json` |
| resource bound | under two minutes; no network; under 150 MB memory |
| side effects | writes only inside this package's `artifacts/` directory |
| failure semantics | lock/schema/contract mismatch produces no scientific result |
| STOP | after Primary, Replay, verification, integration and bounded return; no post-exposure protocol repair |
| claim boundary | analytic/synthetic event-origin test only; no physical breathing, mechanism, utility or publication claim |
