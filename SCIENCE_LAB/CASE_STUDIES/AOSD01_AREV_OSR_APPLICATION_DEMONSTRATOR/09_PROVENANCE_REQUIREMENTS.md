# Provenance Requirements

## Geometry-derived value

Must reference:

- source graph/relation;
- embedding identity and coordinates or generator;
- frame where directional interpretation is used;
- metric and unit;
- measurement method and uncertainty when read from a view.

## Measurement-derived value

Must reference:

- source state or source record;
- observable definition;
- observation map and configuration;
- measurement event;
- calibration where applicable;
- unit and uncertainty/resolution where applicable.

## Readout

Must reference source value(s) and the display transformation, including rounding, unit conversion, thresholding or category mapping.

## View

Must carry a source-kind tag and all upstream IDs required by that kind. A composite view must preserve both provenance branches rather than flattening them into one unexplained picture.

These links prevent identical numerals, ratios or layouts from being treated as source identity.

`VIEW_SOURCE_TYPING_REQUIRED=YES`

`DISPLAY_EQUALS_SOURCE=NO`
