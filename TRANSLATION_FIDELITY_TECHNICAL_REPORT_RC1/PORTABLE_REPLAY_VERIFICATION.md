# Portable Replay Verification

## Setup

- Date: 2026-08-14
- Platform: macOS 26.5.2 / Darwin 25.5.0 / arm64
- Python: Anaconda 3.12.7
- Package identity: exact versions in `environment-lock.yml`
- Historical dependency: commit
  `923362e141170f06f2f0f26992136b5979047c42`, minimal bundled snapshot
- Frozen runners/protocols/results modified: NO
- Entry point: `PYTHON_BIN=/opt/anaconda3/bin/python ./replay_all.sh`

## Results

| Study | Expected SHA-256 | Generated SHA-256 | Result |
|---|---|---|---|
| 1 | `69aa9f65cd90589722274093758a899da2d0a182093ae5dad1a9cababd092055` | same | PASS |
| 2 | `589c2195bc2388059c8ba449a02be51a63851c713021caa19dbf5017d9ee3af1` | `14a9afc0e724c202bdfc9c852d40c0e98e265e6ace2cf329ebde906514622c9d` | FAIL |
| 3 | `36657449bd48eb498a65e30bdda27a2d42735e357455b42aa9126f3b32f1d0d9` | same | PASS |

The Study-2 mismatch is not caused by the compatibility path replacement. The
unchanged frozen runner, executed against the original historical checkout at
its original absolute path, produced the same `14a9…` hash. A single-thread
diagnostic produced a third hash (`8a4b…`), confirming unresolved numerical or
cluster-label sensitivity rather than a portable deterministic identity.

Field comparison against the frozen result found multiple weighted-graph label
permutations and one aggregate change: W2 representation preservation changed
from 71/160 (0.44375) to 70/160 (0.4375), with the F8/C3/R1 W2 outcome changing
from `PARTIALLY_PRESERVED` to `BROKEN`. This is a replay discrepancy only; this
release-engineering task does not reinterpret or replace the frozen result.

The harness fails closed before declaring overall success.

`STUDY_1_REPLAY = PASS`  
`STUDY_2_REPLAY = FAIL_HASH_MISMATCH`  
`STUDY_3_REPLAY = PASS`  
`PORTABLE_REPLAY = BLOCKED`

