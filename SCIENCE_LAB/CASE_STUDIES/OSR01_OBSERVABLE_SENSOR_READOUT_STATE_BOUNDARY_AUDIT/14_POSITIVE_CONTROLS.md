# Positive Controls

## 1. Tachometer versus speedometer

Different observables and sensors can consume one vehicle state. Under different transmission ratios, rpm and speed are not mutually identifying. Passed.

## 2. Same graph, different embedding

The closed GARC/AREV `K_(1,3)` control preserves graph structure while changing a corresponding visible angle from `90°` to `45°`. Passed.

## 3. Same state, different sensors

One registered state can feed an engine-speed sensor, vehicle-speed sensor and gear-state indicator, producing distinct observables. Passed.

## 4. Same observable, different units/readouts

One speed measurement can be rendered in m/s or km/h, or as text versus a gauge, without changing the underlying observable definition. Passed.

## 5. Same numerical glyph, different observables

`100 rpm`, `100 km/h`, `100 °C` and `100 px` share a numeral but not quantity identity, unit, measurement provenance or meaning. Passed.

## Neutral relabel

Replacing type and field names with neutral tokens preserves every dependency and anti-collapse.

`POSITIVE_CONTROLS=5_OF_5_PASSED`

`NEUTRAL_RELABEL_SURVIVES=YES`
