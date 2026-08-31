# 15 — Reduction Pass

## Item decisions

| Item | Classification | Removed from minimal stack | Reason | Boundary preserved |
|---|---|---:|---|---:|
| `CARRIER` | domain extension | yes | Material support is required by CUN-01, not by every common mapping. | yes |
| `MARK` | type | no | Separates component occurrence from configuration. | yes |
| `FORM` | type | no | Separates realization/configuration from unit identity and value. | yes |
| `UNIT` | type | no | Separates system-recognized whole from components and value. | yes |
| `SIGN` | domain extension | yes | Required in sign-system domains; not a universal cross-domain term. | yes |
| `VALUE` | type | no | Preserves context-dependent mapping and polyvalence. | yes |
| `FEATURE` | domain extension | yes | Required in grammar but not every representation domain. | yes |
| `INFORMATION` | too-broad description | yes | Adds no discriminating precision. | yes |
| `CONTEXT` | required mapping field | yes | Constrains relations; not an object layer. | yes |
| `ATTESTATION` | evidence field | yes | Belongs to evidence model. | yes |

## Output

```text
CANDIDATE_LAYER_COUNT=10
MINIMAL_CORE_TYPE_COUNT=4
MINIMAL_CORE_TYPES=MARK,FORM,UNIT,VALUE
MINIMAL_CORE_RELATIONS=MARKS_COMPOSE_OR_REALIZE_FORM;FORM_IS_RECOGNIZED_AS_UNIT;FORM_OR_UNIT_WITH_REQUIRED_CONTEXT_MAPS_TO_VALUE
DOMAIN_EXTENSIONS=CARRIER,SIGN,FEATURE,MEANING,LANGUAGE_OR_SYSTEM_SPECIFIC_FIELDS
EVIDENCE_FIELDS=ATTESTATION,SOURCE,CORPUS,EVIDENCE_STATUS
```

This is a minimum documentary comparison schema within the three predecessor audits, not a universal representation architecture.

## Human shorthand

`! SIGN ? FORM` can be paraphrased only as Human meta-notation pointing to an observed/distinguished representation and an unresolved sign–form relation. No meaning is assigned to either punctuation mark.

`HUMAN_SHORTHAND_SIGN_FORM_STATUS=META_NOTATION_ONLY`

`VALUE_TYPE` remains a mapping/classification field rather than a fifth core type. The Croatian Glagolitic control confirms that a single unit may have phonetic, numeric, name-related and orthographic relations whose types and concrete values must be recorded separately.
