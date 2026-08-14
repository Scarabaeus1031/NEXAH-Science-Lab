# Translation Study Verification

The runner verified both canonical source hashes before each execution. It ran
twice with the frozen protocol and Anaconda Python 3.12.7, NumPy 1.26.4 and
scikit-learn 1.5.1.

```text
PRIMARY_SHA256 = 69aa9f65cd90589722274093758a899da2d0a182093ae5dad1a9cababd092055
REPLAY_SHA256  = 69aa9f65cd90589722274093758a899da2d0a182093ae5dad1a9cababd092055
BYTE_COMPARISON = IDENTICAL
PROTOCOL_SHA256_IN_RESULT = f8080f2e96f1d7f17a230bf26ce0a24ceacfb0c3a9c03431a693d74cc7993973
```

The joblib physical-core warning affected neither exit status nor bytes. No
retry, threshold change, cluster/window/seed change, fixture change or
post-result exclusion occurred.

The verification establishes deterministic software execution for this local
environment. It does not establish scientific novelty, portability, external
validity or physical meaning.
