# Validator Authorization Gate

| Gate | Result | Reason |
|---|---|---|
| sufficiently typed source/target | `FAIL` | free subtype is not a representation contract |
| reproducible operator boundaries | `FAIL` | all four cases contain boundary disagreements |
| operational provenance | `PARTIAL` | strong for T01, forced/partial for abstract and legacy cases |
| preservation/loss evidence exposed | `PARTIAL` | references exist, operational criteria do not |
| negative results cannot be overwritten | `FAIL` | empty replacement array remains valid |
| unknown states first-class | `PARTIAL` | several fields support them; origin does not |
| syntax/science validation separated | `PASS` | documentation states the boundary |
| symbolic evidence cannot promote status | `FAIL` | only correctly labeled symbolic content is blocked |
| reconstruction agreement acceptable | `FAIL` | one evidence conflict and three interpretive differences |
| no blocking ambiguity | `FAIL` | seven blockers remain |

`MINIMAL_VALIDATOR_AUTHORIZED = NO`

The next action is schema revision and a new independent review of actual conforming instances, not validator implementation.

