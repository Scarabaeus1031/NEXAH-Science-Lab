# Cross-Control Matrix

This matrix compares type structure only; it does not claim a common physical mechanism.

| Control | State Space | Transition | Insertion | Perturbation | Return | History Preserved | Invalid State Possible |
|---|---|---|---|---|---|---|---|
| C3 rotation | `{0°,120°,240°}` | `+120° mod 360°` | no | no | exact after 3 | yes | yes if input outside declared representation/rule |
| Gregorian calendar | valid Gregorian dates | next calendar date | leap day by rule | no | recurring labels only under declared criterion | yes | yes |
| abstract insertion sequence | `{X0..X4,P}` | declared sequence edges | yes, P | not necessarily | X4 may remain same state | yes | yes |
| perturbed sequence | declared state plus residual | F plus registered delta | no | yes | exact/equivalent/coordinate/approximate/no return | yes | yes |
| two paths, same endpoint | X and Y states | path-specific edges | path-dependent | not required | exact endpoint | yes, histories differ | yes |
| representation return | source states plus rendering map | render/readout | no | view transformation possible | representation only | yes when provenance retained | undefined/invalid map possible |
| boundary/aperture | internal S plus external valid states | internal/crossing edges | no | not required | valid crossing back can return | yes | invalid crossing possible |

The recurring grammar is state–transition–criterion–history. It is not evidence for shared causation.

