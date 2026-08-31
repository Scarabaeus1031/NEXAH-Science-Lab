# 08 — Return / History Control

Use in-place reversible operators:

```text
X0 --F--> X1 --G--> X2
X2 --G^-1--> X3 --F^-1--> X_return
```

The inverse sequence restores the registered observable state:

```text
OBS(X_return)=OBS(X0).
```

Under this in-place convention, identity, provenance node and generation also
remain the same. The histories do not:

```text
HISTORY(X_return)=HISTORY(X0) + four attested execution events.
```

Hence return to the same state is not return to the same history. Inverse
operators are rules; completed return is an executed path.

```text
RETURN_TO_STATE_IMPLIES_RETURN_TO_HISTORY=NO
INVERSE_EQUALS_RETURN=NO
```
