# Gregorian Calendar Control

Declared system: proleptic Gregorian validity for the supplied dates. A year divisible by 4 is a leap year unless the century exceptions apply; neither supplied year is a century year.

| Attempted value | Rule result | Type | Repair | Interpretation |
|---|---|---|---|---|
| `29.02.1972` | 1972 divisible by 4; February has 29 days | `VALID_LEAP_DAY` | none | literal date |
| `29.02.1974` | 1974 not divisible by 4; February has 28 days | `INVALID_UNDER_DECLARED_GREGORIAN_CALENDAR` | none | none inferred |
| `12.03.1974` | valid day/month combination | `VALID_DATE` | none | literal date |
| `12.05.1974` | valid day/month combination | `VALID_DATE` | none | literal date |

The leap day is a `RULE_GOVERNED_CALENDAR_INSERTION`, not an arbitrary perturbation. Relative to a hypothetical sequence lacking that inserted day, later ordinal positions/weekday alignment shift by one. This is a rule-governed index/phase offset in the calendar model, not physical wobble.

`29.02.1974` is neither zero, absent, rare, special nor an out-of-grid portal. It is retained as an attempted value with a failed semantic validation result and no automatic conversion to `01.03.1974`.

