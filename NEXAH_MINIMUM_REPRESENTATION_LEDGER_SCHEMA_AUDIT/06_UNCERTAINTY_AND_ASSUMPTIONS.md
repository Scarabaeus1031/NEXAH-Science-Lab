# Uncertainty and Assumptions

## Minimum uncertainty interface

An uncertainty item contains `category`, `state`, `description`, and optionally value/unit/method/evidence. Categories are `NUMERICAL`, `SAMPLING`, `PARAMETER`, `MODEL`, `DISCRETIZATION`, `CLASSIFICATION`, `CALIBRATION`, and `OTHER`.

States are `QUANTIFIED`, `BOUNDED`, `NOT_QUANTIFIED`, `NOT_APPLICABLE`, and `UNKNOWN`. No probability distribution is required without justification.

## Assumptions

Machine-readable keys use a conservative token syntax and retain a human-readable assertion. Examples from the legacy chain include:

- `implicit_unit_grid_spacing`;
- `critical_gradient_threshold_fixed` with value `0.02`;
- `euclidean_metric`;
- `nearest_seed_assignment`;
- `ordered_seed_tie_break`;
- `undirected_unweighted_adjacency`;
- `four_neighbor_contact_scan`.

`OPERATOR_ASSUMPTION` describes execution. `SCIENTIFIC_INTERPRETATION` describes meaning and cannot upgrade edge verification. Thus “nearest seed” is operational; “attraction basin” is an unsupported interpretation for the audited code.

