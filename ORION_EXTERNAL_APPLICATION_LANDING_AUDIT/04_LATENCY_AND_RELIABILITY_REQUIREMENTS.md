# Latency and Reliability Requirements

## External source facts

- ASTM E3124-17(2025) gives a standardized procedure and uncertainty reporting for
  optical-tracking system latency, while explicitly leaving suitability limits to
  the user's application
  ([ASTM E3124](https://store.astm.org/Standards/E3124.htm)).
- ECSS-E-ST-60-30C distinguishes real-time from a-posteriori attitude knowledge
  and associates probabilities/statistical interpretations with requirements
  ([ECSS AOCS requirements](https://ecss.nl/standard/ecss-e-st-60-30c-satellite-attitude-and-orbit-control-system-aocs-requirements/)).
- ECSS-E-ST-60-20C defines probabilities of correct, false and invalid attitude
  determination and sensor settling/recovery concepts
  ([ECSS star-sensor standard](https://ecss.nl/wp-content/uploads/2019/05/ECSS-E-ST-60-20C_Rev.2%2815May2019%29.pdf)).
- OpenXR defines a common time domain and predicted display-time semantics, but
  not one universal acceptable tracking latency
  ([OpenXR specification](https://registry.khronos.org/OpenXR/specs/1.1-khr/html/xrspec.html)).

## Audit classifications

| Requirement | Classification | Why it does not yet close the contract |
|---|---|---|
| latency as a measurable quantity | `EXTERNALLY_ESTABLISHED` | ASTM defines measurement, not acceptable application limit |
| spacecraft real-time/reacquisition metric | `EXTERNALLY_ESTABLISHED` | mission must insert time values |
| correct/false/invalid solution probabilities | `EXTERNALLY_ESTABLISHED` | project must specify probability targets and conditions |
| ORION `t_max` | `EXTERNALLY_MOTIVATED_BUT_NOT_FIXED` | no task owner/mission |
| ORION `1-alpha` | `EXTERNALLY_MOTIVATED_BUT_NOT_FIXED` | no task owner/mission |

Sensor frame rate, IMU sampling rate and solver throughput are capabilities, not
external decision latency. They cannot populate these fields.

