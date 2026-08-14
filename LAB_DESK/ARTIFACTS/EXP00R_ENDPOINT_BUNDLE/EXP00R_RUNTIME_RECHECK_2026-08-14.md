# EXP-00-R Current Runtime Recheck

Date: 2026-08-14

Scope: engineering preservation check only. No registered evidence, registered
seed, scientific analysis or experiment execution was accessed or performed.

## Observed environment

- Executable: `/opt/anaconda3/bin/python3`
- Python: `3.12.7`
- NumPy: `1.26.4`
- Frozen Generator-R2 requirement: Python `3.12.13`

## Focused results

### Generator R2

Command:

```text
/opt/anaconda3/bin/python3 -B -m unittest discover -s tests -v
```

Result: **34 of 35 tests passed; 1 runtime-gate error**.

The failing test was `test_g9_exact_registered_runtime`. Generator R2 rejected
the current Python `3.12.7` environment because the frozen contract requires
the exact Python `3.12.13` identity.

### Payload Producer R1

Command:

```text
/opt/anaconda3/bin/python3 -B -m unittest discover -s tests -v
```

Result: **setup blocked by the same exact Python-version gate; 0 tests run**.

### V3R6

The historical V3R6 suite was not rerun. Its recorded validation command is
bound to the historical runtime and its final recorded run required about 343
seconds. This cleanup pass does not recreate or substitute a runtime and does
not reopen the accepted historical review.

## Disposition

`CURRENT_LOCAL_RUNTIME_MISMATCH_PRESERVED`

This is not evidence of a scientific or implementation contradiction. The
gate behaved as designed by refusing an unregistered runtime. It does mean the
current machine cannot claim an exact replay of the frozen Generator-R2 /
Producer-R1 environment without recovering or separately authorizing the exact
Python `3.12.13` runtime.

The endpoint bundle may be registered for provenance and remote durability.
Registered evidence generation, experiment execution and a new operational
readiness claim remain unauthorized.
