# 05 — Croatian Multigraph Control

The selected standard is Croatian. The official *Hrvatski pravopis* states that the Croatian Latin alphabet contains 27 single-character letters and three `dvoslovi`: `dž`, `lj`, and `nj`. They occupy their own positions in the alphabet, receive unit-sensitive capitalization, and are not divided at line breaks.

```text
SOUTH_SLAVIC_MULTIGRAPH_STATUS=CROATIAN_DZ_LJ_NJ_ARE_OFFICIAL_TWO_CHARACTER_LETTERS
CHARACTER_COUNT=2
FUNCTIONAL_ALPHABET_UNIT_COUNT=1
```

This is not generalized to Serbian, Bosnian or all South Slavic standards. `DJ` was not imported because the selected Croatian orthography supplies `đ` as a different single character. Personal names such as `SRDJAN` and `SREBRENICA` are not evidence and were not analyzed.
