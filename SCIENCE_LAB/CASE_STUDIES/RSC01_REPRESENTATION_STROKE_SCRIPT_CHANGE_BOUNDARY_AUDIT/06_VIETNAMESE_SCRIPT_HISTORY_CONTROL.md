# 06 — Vietnamese Script-History Control

## Source-bounded record

Cambridge V1 describes three historically relevant writing systems: sinograms associated with classical Chinese materials, Nôm adapted to Vietnamese, and Romanized Quốc Ngữ. V2 attests substantial Vietnamese documentary use of Nôm from the 10th into the 20th century. V1 places the formation of Quốc Ngữ from 1615 and its official status in 1945.

This history is not reduced to a clean linear switch. Systems and language varieties coexisted, served different institutions and genres, and changed over time. The audit asserts only the distinctions directly needed here:

```text
SCRIPT_EQUALS_LANGUAGE=NO
SCRIPT_CHANGE_EQUALS_LANGUAGE_CHANGE=NO
SCRIPT_CHANGE_PRESERVES_ALL_REPRESENTATIONAL_PROPERTIES=NO
```

## Typed ledger

| System | Language relation used here | Representational principle | Unit/value boundary | Period boundary |
|---|---|---|---|---|
| Chữ Hán / sinograms | associated with classical Chinese textual practice in Vietnamese history | sinographic | form/value cannot be transferred to Vietnamese without source context | historically broad; no single date asserted |
| Chữ Nôm | adapted/used to represent Vietnamese speech and texts | sinographic, with source-attested reading and construction relations | Nôm form, Nôm reading, Sino-Vietnamese reading and meaning remain distinct | attested broadly from 10th into 20th century by V2 |
| Quốc Ngữ | Romanized representation of Vietnamese | Latin-alphabetic with orthographic diacritics | base, combining mark, rendered unit, phonological value and lexical meaning remain distinct | development from 1615; official status since 1945 per V1 |

## Two rejected simplifications

1. `SCRIPT_CHANGE -> LANGUAGE_IDENTITY_CHANGE` is rejected because Nôm and Quốc Ngữ both represent Vietnamese in their attested contexts.
2. `SCRIPT_CHANGE -> NO_REPRESENTATIONAL_CHANGE` is rejected because the systems use materially and structurally different units and mappings.

The control makes no claim that language itself was static across centuries, nor that the systems were interchangeable or losslessly equivalent.

