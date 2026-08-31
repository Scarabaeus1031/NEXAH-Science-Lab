# Transform History Control

Let

```text
E1 --T1/event_1--> E2 --T2/event_2--> E3
```

where `T1` and `T2` are reflections across intersecting lines. Their composite is the standard rotation by twice the directed angle between the reflection axes.

Required distinctions:

```text
TransformRule       map definition and parameters
TransformEvent      one application to one source embedding
TransformHistory    ordered event/provenance sequence
ResultEmbedding     coordinate result
View                rendering of a typed source
```

Different histories can produce the same composite map or the same final embedding—for example, a directly registered rotation versus its realization as two reflections. The final coordinates alone do not recover the event sequence.

`TRANSFORM_HISTORY_EQUALS_FINAL_EMBEDDING=NO`

`TWO_REFLECTIONS_COMPOSE_TO_ROTATION=YES_FOR_INTERSECTING_AXES`

`TRANSFORM_PROVENANCE_REQUIRES_ORDERED_RECORD=YES`
