# Reset Control

## Scalar reset

```text
x0=0
x1=5
RESET_x_to_0(x1)=0.
```

The final scalar value equals the initial value. The transition to `5` and reset event remain in history and provenance.

```text
STATE_VALUE_RETURN=YES
HISTORY_RETURN=NO
EVENT_IDENTITY=NO
```

## Partial reset

Let the earlier whole state be `X0=(0,2)` and current state `X1=(5,7)`. Apply a reset that sets only `x` to zero:

```text
RESET_x(X1)=(0,7).
```

The `x` field returns to its reference value; the whole state does not equal `X0` because `7 != 2`.

`PARTIAL_RESET_CONTROL_PASSED=YES`

`RESET_ERASES_HISTORY=NO`

`RESET_EQUALS_WHOLE_SYSTEM_RETURN=NO_IN_GENERAL`
