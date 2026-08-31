# Information-Loss Ledger

| Stage | Input / transformation / output | Preserved | Lost or uncertain | Introduced / provenance requirement |
|---|---|---|---|---|
| Source | Physical state -> signal generation | Registered identity/time | Unobserved state variables | Event and source provenance |
| Signal generation | Source interaction -> emitted/reflected signal | Selected physical dependence | Non-generated/unobserved modes | Generation model and uncertainty |
| Medium/path | Signal -> propagated signal | Transmitted components | Absorbed/scattered components; unknown path state | Refraction/scattering/noise; medium state/time |
| Boundary | Incident -> admitted/rejected signal | Admitted modes | Blocked modes | Geometry, transmission rule, frame |
| Optics | Admitted signal -> image-plane field | Transfer-supported structure | Blur, cutoff, aberration, out-of-band detail | Transfer function/configuration |
| Temporal/spatial window | Field -> integrated samples | Windowed aggregate | Ordering, sub-pixel/sub-window variation | Sampling coordinates/timestamps |
| Sensor | Incident field -> response | Detectable response | Below-floor and above-saturation variation | Noise, calibration, quantization |
| Readout | Values -> rendered representation | Declared values/rules | Precision by rounding/thresholding | Display rule/version |
| Display/trace | Readout -> human/machine view | Selected visible relations | Gamut/scale/context detail | Tone/color/layout mapping and lineage |

Every row also records `SATURATED`, `BELOW_THRESHOLD` and `UNCERTAIN` as explicit
states, never as inferred absence. RID provenance/history, measurement and view
records can carry the referenced facts; this ledger is a useful composed review
record, not a new primitive.

`INFORMATION_LOSS_LEDGER_STATUS=NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE`
