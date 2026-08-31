# Calibration / Unit / Uncertainty

## Calibration

A calibration rule connects raw response to a registered quantity scale and carries instrument/configuration identity, validity interval, parameters and reference provenance. It may change while the observable definition remains the same.

`CALIBRATION_SEPARATE_TYPE_USEFUL=YES`

## Unit

A unit states scale and dimensional metadata. The number `100` does not identify rpm, km/h, °C or pixels. Unit conversion can change a readout while preserving the represented quantity.

`UNIT_SEPARATE_TYPE_USEFUL=YES`

`UNIT_EQUALS_QUANTITY=NO`

## Uncertainty and resolution

Uncertainty or bounded resolution is part of measurement provenance, not decoration. QAW-01's image-plane angle estimates and EMP-02's finite-resolution limits show why a bare number is incomplete.

`UNCERTAINTY_SEPARATE_TYPE_USEFUL=YES`

## Frame

Direction, translational velocity, angular velocity and similar quantities require their declared reference frame. Frame identity is not a view.

`FRAME_DEPENDENCE_PRESERVED=YES`

`FRAME_EQUALS_VIEW=NO`
