# 06 — Inverse versus Return

On the integer carrier, `T(n)=n+1` is bijective and has inverse

```text
T^-1(n)=n-1.
```

The inverse is a one-step transition rule. It is not itself a completed return
path. Starting from 101, four applications produce

```text
101→100→99→98→97.
```

Only that executed sequence returns to the registered start anchor.

```text
INVERSE_OPERATOR = T^-1(n)=n-1
INVERSE_EXISTS = YES_ON_INTEGER_CARRIER
INVERSE_EQUALS_RETURN = NO
FOUR_INVERSE_ITERATIONS_RETURN_101_TO_97 = YES
RETURN_PRESENT_IN_PRIMARY_FORWARD_TRACE = NO
```
