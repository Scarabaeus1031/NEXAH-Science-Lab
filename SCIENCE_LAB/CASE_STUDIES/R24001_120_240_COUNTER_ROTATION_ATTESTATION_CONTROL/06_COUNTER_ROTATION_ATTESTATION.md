# Counter-Rotation Attestation

## Standard relation

`R(120°)^-1=R(240°)` and the two compose to identity modulo 360°. Therefore `STANDARD_COUNTER_ROTATION_RELATION=YES`.

## Historical evidence

S1 applies `rotate(120)` and `rotate(240)` as same-sign copies completing a 27-tick ring. It does not call them mutual inverses, state that one undoes the other, or attest a return to a registered state. S1 separately labels a 0.17° adjustment as “counter-rotation”; that label does not transfer to the 120°/240° pair.

S2–S6 likewise do not explicitly pair 120° and 240° as inverse operations.

Therefore:

- `HISTORICAL_COUNTER_ROTATION_RELATION=NOT_ATTESTED`
- `STANDARD_RELATION != HISTORICAL_INTENTION`
- no physical rotation claim follows.

