# Same, Different and Task Equivalence

## Three comparison levels

| Level | Object compared | Required declaration | Valid output |
|---|---|---|---|
| State | `x_A(t)`, `x_B(t)` or full paths | common coordinates/map, time alignment, metric and tolerance | same/different/indeterminate at state or path level |
| Relation | `kappa(gamma_A)`, `kappa(gamma_B)` | event vocabulary, partial order/timing comparator and allowed warping | exact, similar, different or unbound relation structure |
| Return | `F[gamma_A]`, `F[gamma_B]` | output coordinates, scale, tolerance/acceptance partition and uncertainty | comparable, same class, different or unresolved return |

Admissible core statement:

> Two trajectories may differ at state level, resemble each other under a declared relation comparator, and belong to the same task-return class.

No implication runs automatically in either direction.

## Pairwise tolerance comparison

For a return metric `d_Y` and tolerance `epsilon >= 0`:

    gamma_A approx_(task,epsilon) gamma_B
      iff d_Y(F[gamma_A], F[gamma_B]) <= epsilon

This relation is reflexive and symmetric when `d_Y` is a metric, but it is generally not transitive. It is therefore called `TOLERANCE_COMPARABLE`, not an equivalence relation.

## Genuine task equivalence

Define before observing results a classification/partition map:

    kappa_r : Y -> L union {OUT_OF_SCOPE, UNRESOLVED}

Then:

    gamma_A ~_task gamma_B
      iff kappa_r(F[gamma_A]) = kappa_r(F[gamma_B]) in L

Equality of labels makes `~_task` an equivalence relation on the domain with resolved labels. A simple `kappa_r` may map every return inside a fixed target-tolerance cell to one class, but coarse classes discard within-cell differences and must record that loss.

For one-sided target success, the useful relation may instead be:

    success_r(gamma) iff F[gamma] in A_r

Two successful paths share task acceptance; that does not make their speed, work, load, stability or risk-proxy equal.

## Different bodies

Cross-body state equality is unavailable unless body-specific states are mapped to a shared representation. Return comparison can remain well typed if both models use the same task-output contract. Functional degeneracy is a contextual possibility, not a guarantee that all bodies can realize the same path or corridor.

## Forbidden promotions

- `all paths are equivalent` — false/unlicensed;
- `all bodies realize the same corridor` — unlicensed;
- `visual similarity proves dynamical equivalence` — false;
- `one golden body/path is universally optimal` — rejected;
- same return class implies same mechanism, energy, load or safety — false;
- similar Kaskadenz label order implies identical timing or trajectory — false.

`TASK_EQUIVALENCE_STATUS=FORMALLY_SPECIFIED_VIA_PREDECLARED_RETURN_PARTITION_PAIRWISE_TOLERANCE_KEPT_SEPARATE`

