# 18 — Croatian Glagolitic / Croatian Church Slavonic Control

## Scope

`ADDITIONAL_FROZEN_FOREIGN_CONTROL / CLOSED`

This section stress-tests only the SFM-01 distinctions `FORM / UNIT / VALUE`. It does not open a palaeoslavistic research program and does not modify VOR-01, CUN-01 or GRB-01.

## Authoritative source ledger

| ID | Source | Bounded evidence |
|---|---|---|
| CG1 | [Staroslavenski institut — Hrvatski crkvenoslavenski jezik](https://stin.hr/hrvatski-crkvenoslavenski-jezik/) | Croatian Church Slavonic is a Croatian literary-language recension and distinctively retained Glagolitic script; surviving use is bounded by genres and periods. |
| CG2 | [Institut za hrvatski jezik — Povijest jezika](https://ihjj.hr/uploads/content/Hrvatski_jezik_IHJJ.pdf) | Croatian medieval culture is described as tri-script (Latin, Glagolitic, Cyrillic) and tri-lingual; Croatian was recorded in all three scripts, while Croatian Church Slavonic was associated with Glagolitic in the stated historical account. |
| CG3 | [Hrvatska enciklopedija — mislite](https://www.enciklopedija.hr/clanak/mislite) | `MISLITE` is the fifteenth Old Church Slavonic Glagolitic/Cyrillic letter, names the sonorant `/m/`, carries lexical meaning in its name, and has numeric value 60 in Glagolitic versus 40 in Cyrillic; forms vary by script/style/period. |
| CG4 | [Hrvatska enciklopedija — jeri/jery](https://www.enciklopedija.hr/clanak/jeri) | `JERY` is explicitly digraphic in both Glagolitic and Cyrillic, composed from a yer plus `i/izhe` variants; its historical sound and Croatian replacement are source-bounded, and its numeric value is reported as unknown. |
| CG5 | [Hrvatska enciklopedija — glagoljica](https://www.enciklopedija.hr/clanak/glagoljica) | Glagolitic is phonographic/alphabetic, used letter names and numeric values, has variant grapheme inventories/functions across historical development, and identifies `JERY` as the proper digraph. |
| CG6 | [Staroslavenski institut — Misal kneza Novaka](https://stin.hr/nomis/o-projektu/o-misalu/) | A source-bounded example of Croatian Church Slavonic written in formal Glagolitic script. |

## 1. Script and language

The sources independently distinguish writing system from language:

- Croatian historical literacy used Latin, Glagolitic and Cyrillic scripts.
- Croatian could be written in more than one script.
- Glagolitic was used for Croatian Church Slavonic and also, in the broader Croatian written tradition, for vernacular/hybrid texts.

```text
SCRIPT_EQUALS_LANGUAGE=NO
CROATIAN_CHURCH_SLAVONIC_GLAGOLITIC_RELATION=HISTORICALLY_ATTESTED_AND_SOURCE_BOUNDED
```

This does not imply free interchangeability across every period, genre or manuscript.

## 2. MISLITE: form, name and typed values

The encyclopedic entry supplies one bounded comparison:

| Field | Attested record |
|---|---|
| letter/sign identity | `MISLITE` / Old Church Slavonic `MYSLITE` |
| letter name | `mislite` |
| phonetic value | sonorant `/m/` |
| lexical meaning of name | corresponds to the lexical meaning of *mislite* |
| Glagolitic numeric value | `60` |
| Cyrillic numeric value | `40` |
| grapheme form | historically/script-variant; Croatian angular adaptation changed the prevalent form |

Therefore:

```text
FORM_EQUALS_VALUE=NO
VALUE_TYPE_EQUALS_VALUE=NO
PHONETIC_VALUE_EQUALS_NUMERIC_VALUE=NO
LETTER_NAME_EQUALS_PHONETIC_VALUE=NO
LETTER_NAME_EQUALS_LEXICAL_MEANING=NO
SAME_NUMERIC_VALUE_ROLE_IMPLIES_SAME_VALUE_ACROSS_SCRIPTS=NO
```

The numeric values are ordinary source-attested alphabetic functions. They are not a hidden code and are not connected to NEXAH.

## 3. JERY composite-unit control

The *Hrvatska enciklopedija* explicitly describes `JERY` as digraphic in Glagolitic and Cyrillic, with components from a yer plus `i/izhe` and documented variants. This is sufficient for a historical composite-unit control:

```text
JERY_COMPOSITE_CONTROL=SUPPORTED_SOURCE_BOUND
MULTIPLE_FORMS_OR_COMPONENTS_CAN_COMPOSE_ONE_UNIT=YES
VISUAL_COMPOSITION_ALONE_ESTABLISHES_VALUE=NO
```

The source also states that its numeric value is unknown. SFM-01 records that uncertainty and does not infer a value.

## 4. Alphabet inventory boundary

No source-specific abecedarium inventory was selected for an exact-count test. Historical forms, functions and inventories vary by source, period and script variant.

```text
CROATIAN_GLAGOLITIC_ALPHABET_SIZE_CLAIM=NOT_MADE
ALPHABET_INVENTORY_REQUIREMENT=SOURCE_BOUND_PERIOD_BOUND_SCRIPT_VARIANT_BOUND
```

In particular, `CROATIAN_GLAGOLITIC_ALPHABET_SIZE=40` is not asserted.

## 5. Effect on SFM-01 reduction

The control reinforces the existing four types:

- marks/forms realize a historical letter/sign unit;
- the unit participates in several typed value relations;
- form, concrete value, value type, name and meaning remain distinct;
- script/language and object/evidence boundaries remain necessary.

`VALUE_TYPE` is a relation/classification field over values, not an additional object layer. No change to `MINIMAL_CORE_TYPE_COUNT=4` is required.

## 6. Nonclaims

```text
SACRED_GEOMETRY=NO
HIDDEN_NUMBER_CODE=NO
ANCIENT_NEXAH_CLAIM=NO
INTRINSIC_GLYPH_SEMANTICS=NO
UNIVERSAL_SLAVIC_ALPHABET=NO
HISTORICAL_TO_MODERN_CROATIAN_CONTINUITY_CLAIM=NO
NEW_OPERATOR_INVENTED=NO
NEXAH_ARCHITECTURE_CHANGED=NO
SCIENTIFIC_CLAIM_DELTA=NONE
NEW_RESEARCH_ACTIVATION=NO
IMPLEMENTATION_ACTIVATION=NO
CONTROL_STATUS=CLOSED
NEXT_ACTION=STOP
```
