# 14 — Relational Value Control

## Test result

`VALUE_IS_RELATIONALLY_ASSIGNED=MIXED`

The lexical unit has conventional constraints: `bà nội` and `bà ngoại` are not arbitrary interchangeable strings, and `anh`/`em` select different relative positions. But actual reference and address value is not intrinsic to the unit alone. It is assigned using speaker, addressee or referent, their relation, discourse role and context.

```text
UNIT + PARTICIPANTS + RELATION + DISCOURSE_ROLE + CONTEXT
  -> CONTEXTUAL_REFERENCE_OR_ADDRESS_VALUE
```

## Same person / different relational position

The sources establish that kin forms index relations and can function across address, self-reference and third-person reference. Therefore the following distinctions are required:

```text
PERSON_IDENTITY != RELATIONAL_CLASSIFICATION
PERSON_IDENTITY != ADDRESS_FORM
RELATIONAL_CLASSIFICATION != DISCOURSE_ROLE
```

RSC-01 does not construct an unsourced biographical example. It records only the source-supported structural consequence: changing speaker/addressee configuration or discourse role can change the appropriate form/value without changing the person.

## Effect on SFM

This does not break `VALUE` as a result type. It breaks any model in which `VALUE` is stored as an intrinsic, context-free property of a `UNIT`. SFM already required context; RSC-01 refines that field into a typed relational mapping for this domain.

```text
RELATIONAL_CONTEXT_REQUIRED=YES
RELATION_EXTENSION_REQUIRED=YES
NEW_RELATION_OPERATOR=NO
```

