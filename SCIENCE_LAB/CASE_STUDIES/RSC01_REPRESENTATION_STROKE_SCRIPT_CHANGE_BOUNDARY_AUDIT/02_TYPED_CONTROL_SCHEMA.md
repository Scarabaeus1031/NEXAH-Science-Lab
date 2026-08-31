# 02 — Typed Control Schema

## Common documentary stack

```text
MATERIAL_EVENT --leaves--> MARK
MARK(S) --realize--> FORM
FORM --recognized_in_system_as--> UNIT
UNIT + REQUIRED_CONTEXT --maps_to--> VALUE
VALUE --may_contribute_to--> MEANING
ATTESTATION --supports--> each asserted mapping
```

`MARK`, `FORM`, `UNIT` and `VALUE` survive all controls. None is sufficient alone.

## Process extension for brush production

```text
TOOL + MEDIUM + SUBSTRATE + GESTURE_PARAMETERS
    -> PRODUCTION_EVENT
    -> VISIBLE_TRACE

GESTURE_PARAMETERS = direction, pressure, speed, contact, sequence, ink/moisture state
VISIBLE_TRACE contains partial evidence of PRODUCTION_EVENT
VISIBLE_TRACE does not uniquely identify the complete PRODUCTION_EVENT
```

`TOOL`, `PROCESS`, `EVENT`, `TEMPORAL_ORDER` and `PROVENANCE` are domain extensions/fields. They are not replacements for the SFM types.

## Script-change control

```text
LANGUAGE_VARIETY + PERIOD + REPRESENTATION_SYSTEM + ORTHOGRAPHIC_CONTEXT
    -> DOCUMENTED_FORM/UNIT/VALUE MAPPINGS
```

Changing `REPRESENTATION_SYSTEM` can change the representational properties while the represented language remains Vietnamese. Neither total identity nor total discontinuity is asserted.

## Relational address/reference extension

```text
LEXICAL_UNIT
  + SPEAKER
  + ADDRESSEE_OR_REFERENT
  + KIN_OR_SOCIAL_RELATION
  + RELATIVE_GENERATION_OR_AGE
  + DISCOURSE_ROLE
  + CONTEXT
    -> CONTEXTUAL_REFERENCE_OR_ADDRESS_VALUE
```

`RELATION` is a required mapping relation, not an operator or a new universal type.

