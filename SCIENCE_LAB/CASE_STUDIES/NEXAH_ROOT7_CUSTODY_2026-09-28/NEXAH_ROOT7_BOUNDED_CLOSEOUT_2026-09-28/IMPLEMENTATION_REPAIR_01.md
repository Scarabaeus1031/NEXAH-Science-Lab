# Implementation repair 01

- Affected implementation SHA-256: `95f4b9e1bb09e76eb1c48b91e0d976ce0f64e443759ebc7e0603b54f6e8cef56`
- Retained affected outputs: `PRIMARY/`, `REPLAY/`
- Scientific decisions observed before repair: `NON_IDENTIFIABLE`,
  `ENDPOINT_INSUFFICIENT_HISTORY_REQUIRED`, `NOT_IDENTIFIED`

The first implementation represented both `gap_closed_at_both` and
`too_fast_at_both` by the same boolean pair `(False, False)`. Both frozen
scenarios correctly returned blocked for both routes, so the decisions did not
change, but the separate `open_gap` and `slow` inputs were not retained as
specified by the preregistration.

Repair: represent every site by an explicit five-field gate input and preserve
`open_gap=True, slow=False` for the speed control and
`open_gap=False, slow=True` for the closed-gap control. No domain, threshold,
candidate map, decision rule or source changed. The old outputs remain as an
invalidated implementation trace. New execution directories use suffix `R1`.
