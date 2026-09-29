# NEXAH Root7 bounded closeout

This Science Lab package closes three finite Root7 questions under a locked,
retrospective protocol. Start with `FINAL_REPORT.md`.

## Authoritative artifacts

- `00_PREREGISTRATION.md` — frozen questions and decision rules
- `01_SOURCE_MANIFEST.sha256` — exact intake sources
- `PREREGISTRATION_LOCK.md` — lock binding
- `run_root7_closeout.py` — valid repaired implementation
- `IMPLEMENTATION_REPAIR_01.md` — retained repair provenance
- `PRIMARY_R1/` — valid primary result
- `REPLAY_R1/` — valid clean replay
- `FINAL_REPORT.md` — bounded scientific decision

`PRIMARY/` and `REPLAY/` are retained invalidated implementation attempts and
must not be cited as the final execution.

## Reproduction

From this directory, using Python 3.10 or newer:

```text
python3 run_root7_closeout.py --source-root /path/to/Nexah_Root7 --output-dir NEW_REPLAY
```

The source directory must match all 13 hashes in the source manifest. The
runner uses only the Python standard library and never reads primary outputs.
