# Human Judgment and Disagreement

## Judgment classification

| Field | Judgment mode |
|---|---|
| file/hash existence, enum syntax | `DETERMINISTIC` |
| callable arguments/defaults | `DETERMINISTIC` |
| operator boundary | `EXPERT_JUDGMENT` |
| representation subtype/contract | `RULE_GUIDED_JUDGMENT` if a contract exists; currently `EXPERT_JUDGMENT` |
| material assumptions | `EXPERT_JUDGMENT` |
| preservation/loss object selection | `EXPERT_JUDGMENT` |
| equivalence criterion | `RULE_GUIDED_JUDGMENT` when preregistered; otherwise `EXPERT_JUDGMENT` |
| uncertainty state | `RULE_GUIDED_JUDGMENT` |
| invertibility | deterministic for proven maps; otherwise `EXPERT_JUDGMENT` |
| provenance sufficiency | `RULE_GUIDED_JUDGMENT` |
| overall status | currently `SUBJECTIVE_INTERPRETATION` because dimensions are conflated |
| task relevance | deterministic presence; adequacy remains expert/owner judgment |

## Inter-reviewer disagreement risk

| Field | Risk | Reason |
|---|---|---|
| representation type | `MEDIUM` | broad type plus free subtype |
| operator boundary | `HIGH` | all four cases permit plausible composite/split records |
| assumptions | `HIGH` | no completeness criterion or assessor |
| preservation object | `HIGH` | evidence does not select a unique object |
| preservation level | `MEDIUM` | level clear only after criterion is chosen |
| loss object | `HIGH` | reviewers choose values, geometry, classes, or task distinctions |
| loss category | `MEDIUM` | `PROVEN` scope ambiguous |
| uncertainty state | `MEDIUM` | unknown versus unmeasured requires rubric |
| invertibility | `LOW` for A/B/C bounded maps; `HIGH` for composite D |
| evidence type | `LOW` | categorical bases are clear |
| provenance sufficiency | `MEDIUM` | depends on claim scope |
| status | `HIGH` | one enum conflates five meanings |
| task relevance | `LOW` | `UNDEFINED` is explicit in all samples |

No inter-rater coefficient is inferred.

