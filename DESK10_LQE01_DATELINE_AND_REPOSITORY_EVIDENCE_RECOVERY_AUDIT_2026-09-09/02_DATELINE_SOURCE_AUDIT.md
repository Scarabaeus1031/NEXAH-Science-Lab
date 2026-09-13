# Dateline Source Audit

The recovered preceding prompt contains neither a DATELINE field nor a calendar date.

- asserted range: **NONE**
- explicit calendar-dated claims: **0**
- temporal/chronology entries: **12**
- verified / unverified / contradicted: **5 / 2 / 0**
- not-a-date or not-applicable: **5**

Its filesystem timestamp is not promoted into content. It makes no EVENT_DATE, OBSERVATION_DATE, EXPERIMENT_DATE, PUBLICATION_DATE, SI_DEFINITION_DATE, or LATER_RETROSPECTIVE_DATE claim.

Authoritative context (not imported claims):

- IAU 1976 Resolution A1, Julian-year convention: https://www.iau.org/static/resolutions/IAU1976_French.pdf
- IAU 2012 Resolution B2, exact AU and D = 86,400 s: https://www.iau.org/static/resolutions/IAU2012_English.pdf
- 17th CGPM Resolution 1 (1983), metre via c: https://www.bipm.org/en/committees/cg/cgpm/17-1983/resolution-1
- BIPM current fixed c: https://www.bipm.org/en/si-base-units/metre

## Mixing tests

| Test | Result |
|---|---|
| Historical observation vs modern conversion | Rømer is undated; AU/c is definitional. Not merged. |
| Later convention vs earlier measurement | Exact values do not empirically determine c. |
| Publication vs experiment date | Neither is stated; remains UNVERIFIED. |
| Julian year vs observation | Typed as convention, not observation. |
| Coincidence vs causation | 31+23 and 365.54 remain untyped and causally inert. |

Although histories associate Rømer with 1676, that absent date is not backfilled.