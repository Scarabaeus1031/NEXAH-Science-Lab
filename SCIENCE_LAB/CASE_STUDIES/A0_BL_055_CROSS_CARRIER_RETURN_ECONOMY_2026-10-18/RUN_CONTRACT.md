# A0-BL-055 — Run Contract

| Field | Contract |
|---|---|
| source revision | hashes in `FROZEN_PROTOCOL.json` and `LOCK.json` |
| environment | local Python 3 standard library only |
| data access | three repository-local closed Primary JSON artifacts; read-only |
| Primary command | `python3 run_experiment.py --output artifacts/PRIMARY_RESULT.json` |
| Replay command | `python3 run_experiment.py --output artifacts/REPLAY_RESULT.json` |
| verify | `python3 verify_lock.py`; `python3 verify_result.py <artifact>`; byte comparison |
| expected outputs | deterministic canonical JSON; one of four frozen classifications |
| tolerance | `1e-12` for positive saving; numeric results rounded to 12 decimals |
| resource bound | under one minute; no network; negligible memory |
| side effects | writes only the requested artifact file |
| failure semantics | source/hash/schema/contract mismatch → no scientific result |
| STOP | after Primary, Replay, verification and return; no post-exposure repair |
| claim boundary | finite cross-carrier comparison only; no universal compression, carrier identity, mechanism, utility or publication claim |

