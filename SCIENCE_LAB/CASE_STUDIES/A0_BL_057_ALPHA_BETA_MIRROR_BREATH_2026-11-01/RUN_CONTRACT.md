# A0-BL-057 — Run Contract

| Field | Contract |
|---|---|
| source revision | Science Lab `c535e64494587782f7ddc0cd7f3ac4d5913bafaf` plus dirty-tree declaration; exact files in `LOCK.json` |
| referenced sources | Core `run_026_v2_multilayer_animation.py` SHA-256 `ab23c9f7...`; CA-IDENT-05 result SHA-256 `df80ea8e...` |
| environment | local Python `3.9+`, standard library only |
| data access | no dataset; fixed analytic functions and repository-local source references |
| lock command | `python3 verify_lock.py` |
| Primary command | `python3 run_experiment.py --output artifacts/PRIMARY_RESULT.json` |
| Replay command | `python3 run_experiment.py --output artifacts/REPLAY_RESULT.json` |
| verify | `python3 verify_result.py artifacts/PRIMARY_RESULT.json`; same for Replay; `cmp` Primary/Replay |
| render | `python3 render_result.py artifacts/PRIMARY_RESULT.json artifacts/MIRROR_BREATH_RESULT.svg` |
| expected outputs | canonical JSON plus deterministic SVG; one of four frozen classifications |
| numeric tolerance | `1e-12` mirror/Return; cutoff gates exactly as preregistered |
| resource bound | under one minute; no network; under 100 MB memory |
| side effects | writes only inside this package's `artifacts/` directory |
| failure semantics | lock/schema/contract mismatch produces no scientific result |
| STOP | after Primary, Replay, verification and bounded return; no post-exposure repair |
| claim boundary | analytic/synthetic operator test only; no physical breathing, universal ratio, mechanism, utility or publication claim |
