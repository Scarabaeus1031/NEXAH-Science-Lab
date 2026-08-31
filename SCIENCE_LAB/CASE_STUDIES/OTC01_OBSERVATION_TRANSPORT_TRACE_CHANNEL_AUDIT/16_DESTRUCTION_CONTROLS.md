# Destruction Controls

| Unsupported collapse | Result | Reason |
|---|---|---|
| SOURCE = SIGNAL | REJECTED | Generator/state is not generated carrier/variation. |
| SIGNAL = TRACE | REJECTED | Trace is downstream and channel-dependent. |
| TRACE = SOURCE | REJECTED | Mapping can be many-to-one. |
| TRACE = TRUTH | REJECTED | Trace has loss, uncertainty and interpretation boundaries. |
| LIGHT = IMAGE | REJECTED | Optical/sensor transformations intervene. |
| IMAGE = OBJECT | REJECTED | Representation is not source identity/state. |
| FLAME = LIGHT | REJECTED | Combustion state is not emitted radiation. |
| FLAME FORM = FLOW FIELD | REJECTED | Visible geometry underdetermines surrounding flow. |
| FLOW FIELD = SCHLIEREN IMAGE | REJECTED | Directional, integrated transform only. |
| MEDIUM = GRADIENT | REJECTED | Gradient is a relation/derivative of a field. |
| GRADIENT = TRACE | REJECTED | Deflection, cutoff and sensor intervene. |
| APERTURE = LENS | REJECTED | Opening/boundary differs from refractive element/system. |
| APERTURE CHANGE = SOURCE CHANGE | REJECTED | Passive channel setting can change independently. |
| EXPOSURE TIME = EVENT DURATION | REJECTED | Observation window differs from physical event. |
| SENSOR GAIN = SOURCE INTENSITY | REJECTED | Response scaling differs from source state. |
| BLACK = NOTHING | REJECTED | Multiple source/path/sensor/display causes. |
| WHITE = EVERYTHING | REJECTED | Maximum code may be clipping or mapping. |
| SATURATION = MAXIMUM INFORMATION | REJECTED | Saturation collapses input differences. |
| HIGH CONTRAST = HIGH TRUTH | REJECTED | Contrast can be introduced downstream. |
| STABLE IMAGE = STABLE SOURCE | REJECTED | Integration can average fluctuations. |
| READOUT = UNIQUE SOURCE STATE | REJECTED | Source/channel ambiguity demonstrated. |
| ATMOSPHERIC REFRACTION = SOURCE MOTION | REJECTED | Path effect can shift apparent position. |
| MOONLIGHT = INDEPENDENT VISIBLE-LIGHT EMISSION | REJECTED | Bounded visible moonlight is reflected sunlight. |
| SCHLIEREN TRACE = DIRECT DENSITY FIELD | REJECTED | Calibration/reconstruction would be required. |
| OBSERVABILITY WINDOW = TRUTH WINDOW | REJECTED | Criterion-relative detectability only. |
| BOUNDARY = BARRIER | REJECTED | Boundaries may transmit/transform conditionally. |
| TRANSPORT = MOTION IN ALL DOMAINS | REJECTED | Domain-specific transfer semantics required. |
| HISTORICAL EXPRESSION = FORMAL TYPE | REJECTED | Expression has zero evidential authority. |

The model survives all 28 destruction controls without changing the frozen
architecture.
