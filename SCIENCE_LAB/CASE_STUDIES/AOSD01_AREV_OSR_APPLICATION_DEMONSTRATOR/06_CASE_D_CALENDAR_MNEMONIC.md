# Case D — Calendar / Knuckle Mnemonic

## Source record

A `CalendarRecord` identifies the calendar system, year where relevant, ordered month identity and registered days-in-month value. The calendar metadata is the source; the hand is not.

## Typed chain

```text
CalendarRecord
 -> ObservableDefinition(days_in_month)
 -> retrieval/registration MeasurementEvent
 -> MeasurementValue(integer days, unit=day)
 -> MnemonicEmbedding(month -> hand position)
 -> remembered category Readout
 -> View(source=CompositeSource)
```

The mnemonic maps ordered months onto knuckles and valleys. Position acquires a reminder role only through the declared mapping. It has no intrinsic calendar value.

In the ordinary Gregorian sequence, July and August are consecutive 31-day months. Their adjacency shows that the traversal/layout rule and underlying month-length sequence are distinct: the representation must specify how it crosses or restarts at the hand boundary rather than deriving month length from physical alternation alone.

`MNEMONIC_EQUALS_CALENDAR=NO`

`KNUCKLE_EQUALS_31=NO_INTRINSICALLY`

`VALLEY_EQUALS_30=NO_INTRINSICALLY`

`CALENDAR_VALUE_SURVIVES_ALTERNATIVE_REPRESENTATION=YES`

`MNEMONIC_IDENTIFIES_SOURCE_OBJECT=NO`

The same calendar fact can be shown in a table, sentence, database record or mnemonic view.
