# Cycle-Closure Semantics

## Repeated-origin closure

For a declared 17-state cycle:

```text
p0,p1,...,p16,p17
p17 = p0
```

There are 17 distinct spatial states and 18 temporal records. The final record is `RETURN_RECORD_PLUS_ONE`: it records return but does not add a new spatial state.

## External-anchor addition

```text
q not in {p0,...,p16}
```

This is `EXTERNAL_ANCHOR_PLUS_ONE`: a genuinely introduced state, not a repeated origin.

## Archive test

The archive does not distinguish these constructions for 17:

- Visible historical GIFs contain 30 frames and show frame 17 as an intermediate temporal index.
- The retrospective report offers 24 — not 17 — as an example cycle length and treats 17 as a state index in that 24-state construction.
- No historical artifact declares `p17=p0`, an external `q`, or a 17-state return boundary.
- “Alpha +1” in the retrospective PDF is a quarter rotation, not a return-record or external-anchor count.

Therefore the archive classification is:

```text
UNRESOLVED_PLUS_ONE
```

`TEMPORAL_RETURN_CROWN` remains at most a provisional metaphor for an explicitly declared closed sequence. Such a sequence is not recovered here.

## Boundary to the completed crown lab

```text
SPATIAL_CROWN:
  completed synthetic finding about persistent boundary corrugation

TEMPORAL_RETURN_CROWN:
  provisional representation term; not established for this archive

HISTORICAL_CROWN_ORIGIN:
  not established
```

Nothing in this lab changes `C_STRUCTURED_GEOMETRY_REQUIRED` within the prior lab's preregistered synthetic operator family.
