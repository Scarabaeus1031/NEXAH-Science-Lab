# Projection and Three-Cut Control

Neutral registered object `X` is processed by three independently identified projection rules:

```text
                 X
          /      |      \
        P1       P2       P3
        |        |        |
       V1       V2       V3
```

Each `Pi` is an operation rule/application pair. Each `Vi` is a view with `source_ref=X`, a projection reference, declared preserved relations, declared losses and provenance.

Views may preserve the same declared relation when every projection is relation-compatible. They may lose different information because kernels, crops, frames, resolutions or representation rules differ. Neither fact changes the number of registered source objects.

`THREE_VIEWS_EQUAL_THREE_OBJECTS=NO`

`DIFFERENT_PROJECTIONS_MAY_PRESERVE_SAME_RELATION=YES_CONDITIONALLY`

`DIFFERENT_PROJECTIONS_MAY_LOSE_DIFFERENT_INFORMATION=YES`

`RETURN_TO_SAME_STATE_ERASES_PATH_HISTORY=NO`

No dimensional or type meaning is inferred from `325`, `75`, `77`, `2!`, primes, roots, symbols, animals, wordplay or visual resemblance.

