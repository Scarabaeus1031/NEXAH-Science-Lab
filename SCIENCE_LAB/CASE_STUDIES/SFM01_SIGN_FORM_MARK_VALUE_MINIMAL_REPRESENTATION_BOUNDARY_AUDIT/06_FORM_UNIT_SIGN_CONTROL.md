# 06 — Form / Unit / Sign Control

## Form and unit

A form is a realization/configuration; a unit is recognized under a language or writing system. CUN-01 distinguishes sign form from sign identity. GRB-01 distinguishes visible components from a functional orthographic unit.

`FORM_EQUALS_UNIT=NO`

## Unit and sign

`SIGN` is required terminology within cuneiform and related sign-system descriptions. It is not required for every modern orthographic case, where `grapheme`, `digraph`, `trigraph`, `composite symbol` or `orthographic unit` is more precise.

```text
SIGN_STATUS=REQUIRED_ONLY_IN_SPECIFIC_DOMAINS
UNIT_EQUALS_SIGN=DOMAIN_DEPENDENT
FORM_EQUALS_SIGN=NO
```

Removing `SIGN` from the common four-type stack does not remove it from CUN-01. It remains a domain extension that can specialize `UNIT` while retaining separate form and value fields.
