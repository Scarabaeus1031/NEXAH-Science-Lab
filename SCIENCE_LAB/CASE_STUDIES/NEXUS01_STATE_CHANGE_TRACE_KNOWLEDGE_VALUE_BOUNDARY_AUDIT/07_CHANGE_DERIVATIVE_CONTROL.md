# Change / Derivative Control

The name `dc` supplies no semantics. If it denotes a derivative, the record must
declare the differentiated quantity `c`, independent variable, derivative order,
method, unit, evaluation interval/time and uncertainty.

```text
c ≠ dc
value ≠ rate
rate ≠ event
finite difference ≠ analytic derivative
derivative coordinate ≠ force ≠ energy ≠ cause
```

A finite difference such as `(c(t1)-c(t0))/(t1-t0)` is an estimate under a
declared method. An analytic derivative is a property of a specified function or
model. A transition event records occurrence and before/after references; neither
derivative representation alone establishes the physical cause of that event.

`DERIVATIVE_RECORD_STATUS=DERIVED_RECORD_SUFFICIENT`
