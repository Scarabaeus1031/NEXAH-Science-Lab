# Navigator Internal / Public Field Matrix v1

Status: `PLANNING CONTRACT / DENY BY DEFAULT`

| Field or class | Internal | Public | Export rule |
|---|---:|---:|---|
| stable entity ID | yes | yes | unchanged |
| public title and summary | yes | yes | required for public |
| internal working title | yes | no | never exported |
| entity and relation type | yes | yes | namespaced and validated |
| module/family membership | yes | yes | only for released endpoints |
| local filesystem path | yes | no | hard rejection |
| repository-relative custody path | yes | no | replaced by public URL or record ID |
| stable HTTPS or bundle-relative URL | optional | yes | required for released surface |
| SHA-256 | yes | release receipt only | raw local asset hashes remain internal unless intentionally published |
| source state: incoming/private/custody | yes | no | item excluded rather than relabelled |
| public release state | yes | yes | deny by default |
| package-local verdict | yes | yes when relevant | must be paired with current interpretation |
| current interpretation | yes | yes | required for historical evidence |
| claim ceiling | yes | yes | required and never weakened in export |
| residual/open questions | yes | yes when relevant | summarized without private operational detail |
| controlling source ID | yes | yes | public source must itself be released or publicly summarized |
| full controlling source path | yes | no | never exported |
| relation explanation | yes | yes | required for every public edge |
| preserves / does-not-imply | yes | yes | required for every public edge |
| confidence and review flags | yes | yes where material | provisional state cannot be hidden |
| rights and attribution | optional during intake | yes | required before public admission |
| owner notes and deliberation | yes | no | never exported |
| activation and priority detail | yes | public summary only | no private queue or action data |
| validation diagnostics | yes | release receipt summary | raw local failures stay internal |
| contact, identity or secret data | only when governed | no | hard rejection/redaction review |
| embedded external URL | inspected | allowlisted only | HTTPS and sandbox/link policy required |

## Export precedence

```text
EXCLUDE
  > REDACT
  > PUBLIC SUMMARY
  > RELEASED SOURCE
```

When a field cannot be classified safely, the entity remains internal. The
exporter must never infer public permission from repository visibility,
filename, existing web deployment or visual quality.
