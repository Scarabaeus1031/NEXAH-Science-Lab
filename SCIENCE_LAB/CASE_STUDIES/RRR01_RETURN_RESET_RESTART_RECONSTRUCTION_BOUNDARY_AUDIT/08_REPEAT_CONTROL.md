# Repeat Control

Let deterministic rule `f(x)=x+1`. Register:

```text
event e1 in execution r1: f(2)->3
event e2 in execution r1: f(2)->3
```

Then:

| Field | Equality |
|---|---:|
| rule | yes |
| input value | yes |
| result value | yes |
| event ID | no |
| event position/time | no |
| provenance record | no, because event lineage differs |

`REPEAT_CREATES_DISTINCT_EVENT=YES`

`REPEAT_CONTROL_PASSED=YES`

`SAME_RULE_INPUT_OUTPUT_EQUALS_SAME_EVENT=NO`

Restart is also not repetition: it creates a new execution context, whereas repetition reapplies a rule within a declared execution context.
