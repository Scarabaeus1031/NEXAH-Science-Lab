# Reproducibility

The bundle preserves frozen runners and results byte-for-byte. The release-level
entry point creates temporary study copies, adapts the historical dependency
path only in the temporary Study-1/2 copies, runs all studies, verifies exact
runtime/source identities, and fails on the first result mismatch.

```bash
conda env create -f environment-lock.yml
conda activate translation-fidelity-rc1-replay
./replay_all.sh
```

An existing exact environment can be selected explicitly:

```bash
PYTHON_BIN=/path/to/python3 ./replay_all.sh
```

## Study 1

The historical dependency is bundled and hash-bound. The original hard-coded
path remains unchanged in the frozen runner.

```bash
cd study_1
python run_translation_study.py --output /tmp/study1-replay.json
shasum -a 256 /tmp/study1-replay.json
```

Expected result SHA-256:
`69aa9f65cd90589722274093758a899da2d0a182093ae5dad1a9cababd092055`.

## Study 2

Prerequisites are the same external revision and hard-coded checkout condition.

```bash
cd study_2
python run_replication.py --output /tmp/study2-replay.json
shasum -a 256 /tmp/study2-replay.json
```

Expected result SHA-256:
`589c2195bc2388059c8ba449a02be51a63851c713021caa19dbf5017d9ee3af1`.

## Study 3

The runner is independent of the historical external implementation and imports
NumPy only.

```bash
cd study_3
python run_fidelity_experiment.py --output /tmp/study3-replay.json
shasum -a 256 /tmp/study3-replay.json
```

Expected result SHA-256:
`36657449bd48eb498a65e30bdda27a2d42735e357455b42aa9126f3b32f1d0d9`.

The original replay records remain in each study directory. The owner-gate
clean-room-style replay passed Studies 1 and 3 but Study 2 produced a different
scientific result hash in the exact declared runtime. The harness therefore
correctly returns nonzero and portability remains blocked.

`REPLAY_INSTRUCTIONS = COMPLETE_FAIL_CLOSED`
`PORTABLE_REPLAY = BLOCKED`
