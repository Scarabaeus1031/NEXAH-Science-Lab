# Case C — Partition / Selection / Ratio Display

## Two authorized examples

```text
C1={a,b,c,d,e,f,g}
P1 selects {a,b}
count=(2 selected, 7 total)
ratio=2/7
```

```text
C2={h1,h2,h3,h4,h5,h6,h7,h8}
P2 selects {h1,h2,h3,h4}
count=(4 selected, 8 total)
ratio=4/8=1/2
```

Typed chain:

```text
CarrierSet -> PartitionRule -> SelectedSubset
           -> Count -> RatioValue -> Readout -> View
```

The ratio is a reduction of a registered selection. It does not preserve element identities, ordering, labels, partition rationale or other source structure.

Within this same case, `1/2`, `2/4`, `3/6` and `4/8` demonstrate that equal reduced ratios can arise from different carrier and subset sizes. This is a counterexample, not an additional application case.

`RATIO_EQUALS_STATE=NO`

`RATIO_EQUALS_GEOMETRY=NO`

`RATIO_EQUALS_VIEW=NO`

`SAME_RATIO_IMPLIES_SAME_SOURCE_STRUCTURE=NO`

`RATIO_IDENTIFIES_SOURCE_STRUCTURE=NO`

No prime, calendar, symbolic, biological or historical meaning is inferred.
