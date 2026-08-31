# View Control

For the unchanged source `(G,E1)`, define:

- `V1`: all point labels and coordinate frame shown;
- `V2`: labels and frame hidden, with a different crop and line style.

Both cite the same source graph and embedding. No source mutation occurs.

`SAME_SOURCE_MULTIPLE_VIEWS_SUPPORTED=YES`

`VIEW_CHANGE_IMPLIES_SOURCE_CHANGE=NO`

`VIEW_EQUALS_SOURCE=NO`

A view of `(G+,E+)` must cite the augmented graph ID. It cannot be treated as merely another view of `(G,E1)` because its source structure contains `H`, `PH` and subdivided `AB`. Styling may hide these elements, but source provenance must not.

`SAME_PIXELS_OR_LAYOUT_IMPLIES_SAME_SOURCE=NO`

`VIEW_TYPE_ALREADY_SUFFICIENT=YES_SOURCE_TYPED_VIEW`
