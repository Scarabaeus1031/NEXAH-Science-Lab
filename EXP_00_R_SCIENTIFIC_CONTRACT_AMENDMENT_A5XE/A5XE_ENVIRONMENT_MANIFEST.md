# A5XE Synthetic Validation Environment

| Component | Frozen validation value |
|---|---|
| Python | bundled CPython 3.12 |
| NumPy | 2.3.5 |
| RNG | `numpy.random.Generator(numpy.random.PCG64(seed))` |
| Hash/canonicalization | SHA-256; UTF-8 canonical JSON |
| Registered inputs | none |

Validation command:

```text
PYTHONDONTWRITEBYTECODE=1 <bundled-python> -m unittest discover -s contract_validation -p 'test_*.py' -v
```

The machine contract semantically verifies the operative runtime-dependent RNG fields. This manifest records the synthetic audit environment; it does not authorize a registered run.
