# Double-reflection Return Control

Let `T` be one Euclidean reflection and `E0` a registered embedding. Since a reflection is involutive,

```text
T(T(E0))=E0.
```

Register distinct events:

```text
E0 --T/e1--> E1 --T/e2--> E0'.
```

With exact formal coordinates, `E0'=E0` under embedding equality.

| Component | Finding |
|---|---|
| coordinates | returned |
| incidence | returned/preserved |
| orientation | restored after two reversals |
| final embedding | equal to original |
| event identity | no |
| transform history | `[e1,e2]`, not empty |
| provenance | retained and nonempty |

The expression `E0` alone and the sequence ending at equal `E0'` are state-equal but history-distinct.

`DOUBLE_REFLECTION_CONTROL_PASSED=YES`

`TRANSFORM_HISTORY_PRESERVED=YES`

`FINAL_EMBEDDING_EQUALS_EMPTY_HISTORY=NO`
