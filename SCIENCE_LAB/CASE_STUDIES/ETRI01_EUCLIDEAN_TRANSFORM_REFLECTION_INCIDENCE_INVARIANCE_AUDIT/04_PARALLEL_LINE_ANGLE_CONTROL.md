# Parallel-line Angle Control

At `P`, let the leftward and rightward rays of `L1` be `r_-` and `r_+`. The lower half-plane straight angle from `r_-` to `r_+` is partitioned in order by rays `PA` and `PB`.

Because `L0 || L1`:

- `angle(r_-,PA)=a` by alternate-interior-angle equality for transversal `AP`;
- `angle(PB,r_+)=b` by alternate-interior-angle equality for transversal `BP`;
- `angle(AP,PB)=y` by definition.

The three adjacent angles partition a straight angle, hence

```text
a+y+b=pi.
```

The independent triangle-angle theorem gives the same equality inside triangle `APB`. Corresponding-angle formulations are equivalent when ray orientation is specified. Vertical angles are not needed for this proof.

If support lines `AP` and `BP` are extended through `P`, their opposite ray pairs define vertical angles. Equal magnitude then follows from the vertical-angle theorem, but these are different angle objects.

`VERTICAL_ANGLE_RELATION_OPERATIONALIZED=YES_WITH_INTERSECTION_PRECONDITIONS`

`VISUAL_OPPOSITION_EQUALS_VERTICAL_ANGLE=NO`
