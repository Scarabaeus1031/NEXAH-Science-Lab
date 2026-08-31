# Invalid-State Control

Validation records must preserve:

| Field | Required content for `29.02.1974` |
|---|---|
| attempted value | exact string/components `29.02.1974` |
| declared rule | Gregorian calendar validity |
| syntactic result | well-formed date-shaped string |
| semantic result | invalid |
| reason | February 1974 has 28 days |
| provenance | authorized RETURN-01 control plus validator/rule version |
| repair | none |
| hidden interpretation | abstain |

Typed boundaries:

- outside a state space: parsed value not a member of declared `S`;
- syntactically malformed: cannot be parsed under declared syntax;
- semantically invalid: parsed, but violates declared rules;
- undefined: the current model lacks a rule/value needed to decide;
- absent: no attempted value was supplied.

These outcomes are not zero and are not interchangeable. `29.02.1974` is semantically invalid, not a special state. Fail-closed behavior retains the attempt and reason but emits no valid date and performs no automatic repair.

