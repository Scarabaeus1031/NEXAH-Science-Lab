# Cross-Domain Type Matrix

| Field | Candle | Biology | Ferrofluid | Clocks |
|---|---|---|---|---|
| System | wick/fuel/flame system | organism/plant | magnetic fluid/interface | clock/ion system |
| Regime | gravity/transport/oxidizer conditions | gravity and sensory/growth-cue environment | field, gravity, interface/boundaries | motion/gravitational conditions |
| Frame | laboratory coordinates | apparatus/body/reference coordinates | container/field coordinates | coordinate frame for description |
| Constraints | pressure, oxygen, enclosure | genotype, development, light/media | surface tension, density, geometry | trajectory, height, protocol |
| Available cues | transport/oxidizer conditions, not sensory cues | visual/vestibular or tropic cues | not an orientation-cue case | clock comparison signals |
| Dynamics | combustion/transport | neural/behavioral or growth/signaling | ferrohydrodynamics | clock evolution along worldline |
| State | thermal/chemical/flow state | physiological/developmental state | magnetization/flow/interface state | clock state/readout state |
| Realized form | flame geometry/color | behavior/growth/morphology | surface shape | accumulated phase/time result |
| Observation | imaging/instruments | video, microscopy, measurements | surface measurement | frequency comparison |
| View | image/plot | image/readout | profile/image | displayed comparison |
| History | ignition/exposure | development/adaptation/exposure | field path/hysteresis where applicable | worldline/protocol history |

The generic bookkeeping schema

```text
REALIZED_STATE(t) = F(SYSTEM, REGIME, CONSTRAINTS, HISTORY)
```

is acceptable only as a modelling placeholder. `F` is domain-specific and may be stochastic, history-dependent, underdefined, or unknown. No common physical mechanism is claimed.

CROSS_DOMAIN_TYPING_SURVIVES = YES

