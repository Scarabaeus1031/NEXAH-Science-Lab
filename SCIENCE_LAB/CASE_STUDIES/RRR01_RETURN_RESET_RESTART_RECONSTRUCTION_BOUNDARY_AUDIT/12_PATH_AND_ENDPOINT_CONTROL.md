# Path and Endpoint Control

Define two scalar histories from the same start:

```text
H1: 0 --(+1)/e1--> 1 --(+1)/e2--> 2
H2: 0 --(+3)/e3--> 3 --(-1)/e4--> 2.
```

Both finish at state value `2`, but the intermediate states, rules, event IDs and ordered provenance differ.

`FINAL_STATE_EQUAL=YES`

`PATH_EQUAL=NO`

`HISTORY_EQUAL=NO`

`PROVENANCE_EQUAL=NO`

`SAME_ENDPOINT_EQUALS_SAME_PATH=NO`

`PATH_ENDPOINT_CONTROL_PASSED=YES`

The same endpoint can also be reached by a direct event, further demonstrating that endpoint equality does not identify operation count or history.
