# 11 — Vietnamese Kinship / Address Control

## Verified phenomenon

K1 reports that Vietnamese second-person reference typically uses kin terms even when the recipient is not a genealogical relative. It also reports obligatory selections involving relative age or generation, exemplified by `anh` (older brother/male senior within the relevant relation) versus `em` (younger sibling/junior).

K2 documents kin terms in self-reference and address. Its examples include a maternal grandfather using `ông ngoại` for himself and a paternal grandmother using `bà nội` for herself in speech to a grandchild. It also records regional and contextual variation and possible omission of lineage modifiers in vernacular speech.

## Typed result

| Dimension | Required or supported? | Boundary |
|---|---|---|
| lexical item | required | does not uniquely determine referent |
| speaker | required | discourse participant, not encoded person identity |
| addressee/referent | required | may be genealogical kin or socially addressed non-kin |
| relative age/generation | supported and often selection-relevant | context-relative, not absolute identity |
| genealogical relation | required for literal kin reference | distinguish from extended address use |
| discourse role | required | same kin term can be self-reference, address or third-person reference |
| sex/gender | supported for forms such as `anh` and the `bà` class | no complete gender system is claimed |
| regional/social context | required evidence field | practices vary; no universal fixed table asserted |

```text
VIETNAMESE_KINSHIP_RELATIONAL_ENCODING_SUPPORTED=YES
ADDRESS_FORM_EQUALS_PERSON_IDENTITY=NO
VALUE_IS_RELATIONALLY_ASSIGNED=MIXED_WITH_LEXICAL_CONSTRAINTS
```

The lexical item constrains candidate interpretations, but its actual referential/address value requires participant relations and discourse context.

