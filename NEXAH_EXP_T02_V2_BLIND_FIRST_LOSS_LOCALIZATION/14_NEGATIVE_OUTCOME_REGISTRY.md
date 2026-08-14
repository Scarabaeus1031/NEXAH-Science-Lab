# Negative Outcome Registry

Allowed terminal statuses:

- `BASELINES_SUFFICIENT`
- `NEXAH_REDUNDANT`
- `FIRST_LOSS_LOCALIZATION_NOT_SUPPORTED`
- `FIRST_LOSS_LOCALIZATION_SUPPORTED_NO_INCREMENTAL_VALUE`
- `INCREMENTAL_DIAGNOSTIC_VALUE_SUPPORTED_BOUNDED`
- `PRECONDITION_FAILED`
- `PROTOCOL_INVALID`
- `INCONCLUSIVE`

`NO_LOSS` is a valid case truth and prediction. A method is not forced to invent
a stage. Construction failure never counts for or against H0/H1. Controls never
enter primary results. No status authorizes retuning or a second seed.

