# Replay Verification

Environment: Anaconda Python 3.12.7, NumPy 1.26.4, scikit-learn 1.5.1.

```text
PROTOCOL_SHA256 = 98c7856cb99d428492168a1bc0a4ab31f075b5b3504a92c8f4dfafa9635f4eb8
PRIMARY_RESULT_SHA256 = 589c2195bc2388059c8ba449a02be51a63851c713021caa19dbf5017d9ee3af1
REPLAY_RESULT_SHA256 = 589c2195bc2388059c8ba449a02be51a63851c713021caa19dbf5017d9ee3af1
BYTE_COMPARISON = IDENTICAL
NOT_TESTABLE_CELLS = 0
```

Canonical `nexah/core.py` and `nexah/backends/v07.py` hashes were checked at
entry. Replay establishes deterministic local software behavior only.
