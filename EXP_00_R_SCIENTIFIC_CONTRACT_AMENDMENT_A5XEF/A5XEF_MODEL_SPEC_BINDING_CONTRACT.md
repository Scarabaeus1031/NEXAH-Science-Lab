# A5XEF Model-Specification Binding Contract

One canonical specification controls every observed, null, bootstrap, attribution, diagnostic and sensitivity fit: standardized L2-logistic Newton fitting, `C=1`, `max_iter=100`, tolerance `1e-9`, linear-predictor/probability clipping, feature order and intercept treatment.

Both implementations accept the specification as an explicit argument, verify it before fitting, use its values in loop/penalty/clipping behavior and attach its canonical hash to each model output. No independent operative fit constant is authoritative.

The former `recorded=12 / executed=100` state is rejected before fitting. A model cache is valid only when its bound spec hash equals the consumed canonical specification.
