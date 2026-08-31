# PRR Return Fixed-Point Control

Assume the registered PRR domain `d>0`, `R>0` and:

`J_R(d)=R^2/d`.

Let `s=ln(d/R)`. For `d'=J_R(d)`:

`s' = ln(d'/R) = ln((R^2/d)/R) = ln(R/d) = -ln(d/R) = -s`.

Therefore:

- `s<0` maps to `s'>0`;
- `s>0` maps to `s'<0`;
- `s=0` maps to itself;
- `s=0 iff d=R`;
- applying the map twice returns the state coordinate: `J_R(J_R(d))=d`.

Typed classifications:

- fixed point: `s=0` / `d=R`;
- reflection: `s -> -s` in the registered log coordinate;
- involution: the map is its own functional inverse;
- return map: inherited registered PRR role.

PRR-01 fully explains the formal part of the Human intuition. The equality with sign reversal holds only for this map in this coordinate; it is not a universal identity between the roles `RETURN` and `SIGN_REVERSAL`.
