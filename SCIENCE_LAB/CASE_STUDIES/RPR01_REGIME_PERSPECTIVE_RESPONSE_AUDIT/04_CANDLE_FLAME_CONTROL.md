# Candle Flame Control

## Typed comparison

| Field | Terrestrial candle | Microgravity/reduced-buoyancy candle |
|---|---|---|
| System identity/class | fuel, wick, oxidizer and combustion system | same system class under controlled comparison |
| Regime | terrestrial gravity; buoyancy-driven flow | strongly reduced buoyancy-driven convection |
| Constraints | pressure, oxygen, enclosure, wick/fuel, heat loss | corresponding conditions must be declared |
| Dynamics | reaction, diffusion plus buoyant transport | reaction/diffusion with altered transport |
| Realized form | elongated/teardrop luminous flame | more nearly spherical, blue/soot-reduced flame in the documented case |
| Observation/view | camera image of the flame | camera image; not the flame state itself |

NASA attributes the familiar terrestrial shape to gravity-driven buoyant convection and the microgravity shape to the absence/suppression of that transport contribution. NASA's technical paper also treats steady diffusion-flame behavior as possible without buoyancy.

Result: `SAME_SYSTEM_CLASS + DIFFERENT_TRANSPORT_REGIME → DIFFERENT_REALIZED_FLAME_FORM` is the accurate typing for the bounded comparison. Gravity alone does not determine form: fuel, oxygen, pressure, wick, enclosure, diffusion, kinetics, soot formation and heat loss remain relevant.

CANDLE_CONTROL_COMPLETE = YES

