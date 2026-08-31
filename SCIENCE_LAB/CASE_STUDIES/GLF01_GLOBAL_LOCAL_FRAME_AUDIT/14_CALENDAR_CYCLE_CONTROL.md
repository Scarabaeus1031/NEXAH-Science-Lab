# 14 — Calendar / Cycle Control

## Abstract model first

A periodic phenomenon may be modeled by phase `R/Z` or `S^1`. A calendar is a human-defined representation that selects a year boundary, partitions the cycle into named units and assigns ordinal positions. Astronomical/seasonal processes supply observational constraints, but they are not identical to the calendar system.

```text
ASTRONOMICAL_OR_SEASONAL_CYCLE != CALENDAR_SYSTEM
YEAR_ORIGIN != INTRINSIC_START_OF_PERIODIC_PROCESS
MONTH_NAME != MONTH_ORDINAL_POSITION
SEASONAL_GROUPING != ARITHMETIC_PARTITION_ALONE
```

## Current bounded representation

The Gregorian calendar has twelve ordered month names with January as month 1. Rotating the abstract origin changes ordinal coordinates while leaving cyclic adjacency predictable; it does not rewrite the historically established Gregorian convention.

`CALENDAR_IS_ASTRONOMICAL_CYCLE=NO`: a calendar refers to and organizes time/cycles, but it is not the astronomical process itself.

