# C3 Rotation Control

Define `S={0°,120°,240°}` and `T(theta)=theta+120° mod 360°`.

| Step | State | Event appended to history |
|---:|---:|---|
| 0 | 0° | none |
| 1 | 120° | `T(0°)` |
| 2 | 240° | `T(120°)` |
| 3 | 0° | `T(240°)` |

Thus `T^3(0°)=0°`: the final and initial states are exactly equal under the declared angular representative. The history at step 3 is `[0°,120°,240°,0°]`, whereas the initial history contains no transition.

- `C3_STATE_RETURN=YES`
- `C3_HISTORY_RETURN=NO`
- `FINAL_STATE=INITIAL_STATE`
- `FINAL_HISTORY!=INITIAL_HISTORY`

This is standard mathematics and a clean exact-return control. It is not a claim of physical rotation and imports no new historical meaning into R240-01.

