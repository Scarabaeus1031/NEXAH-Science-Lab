# Multiple-Representation Control

For the same registered state `X(t0)`:

| Representation | Example | Preserved / lost |
|---|---|---|
| Scalar time-series | `c(t0)=2.0` at `t0` | Preserves one value/time; omits `dc` and other state fields |
| State-space point | `(c,dc)=(2.0,-0.5)` | Preserves two declared coordinates; omits unrepresented state |
| Discrete regulator state | `BAND_2 + FALLING` under registered bins | Preserves class/direction; loses within-bin magnitude |

Different visible forms therefore need not imply different source identity. The
same state can lawfully produce multiple views with separate render rules and
declared losses.

The reverse is also false: rounding, projection, binning or observational loss
can map different source states to the same point/readout. OTC-01 ambiguity is
preserved.

```text
MULTIPLE_VIEWS_OF_SAME_STATE_SUPPORTED=YES
SAME_VIEW_MULTIPLE_STATES_POSSIBLE=YES
```
