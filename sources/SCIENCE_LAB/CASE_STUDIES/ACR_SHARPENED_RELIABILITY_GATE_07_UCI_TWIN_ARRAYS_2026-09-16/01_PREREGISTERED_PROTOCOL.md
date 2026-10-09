# Preregistered protocol — ACR_SHARPENED_RELIABILITY_GATE_07

Status: `SEALED_BEFORE_UNIT5_ACCESS`

## Question

Does the development-selected sharpened reliability binder (`w^8`) improve four-gas discrimination on untouched Unit 5 relative to both equal weighting (`w^0`) and the original Gate-06 binder (`w^1`)?

## Development and blind roles

- Development: Units 1–4, 560 files. Unit 4 became development data only after Gate 06 stopped.
- Blind target: Unit 5, 80 files. No Unit-5 measurement member was opened during Gate 06 or Gate-07 development.

The parser, 32 features, hardware cuts, standardization, nearest-centroid classifier, reliability equation and source archive are unchanged from sealed Gate 06. Standardization, centroids and reliability weights are refitted on Units 1–4 only.

## Frozen models

- P2: equal A+B contribution, exponent `alpha=0`.
- P3: original reliability contribution, exponent `alpha=1`.
- P4: sharpened reliability contribution, exponent `alpha=8`.

If Gate-06 reliability is `w=S/(S+D+1e-12)`, model distance contribution is `w^alpha`. The alpha grid was fixed to `{0, 0.5, 1, 2, 4, 8}` and selected by maximum mean leave-one-device-out balanced accuracy across Units 1–4, with the smaller alpha winning ties. The selected value was 8. No additional tuning is permitted.

## Blind success rule

Unit 5 is opened once after seal verification and model freeze. `PASS_SHARPENED_RELIABILITY_GATE` requires all of:

1. P4 macro balanced accuracy at least 0.85;
2. P4 exceeds P2 by at least 0.0125;
3. P4 exceeds P3 by at least 0.0125;
4. both paired stratified-bootstrap 95% lower bounds are strictly positive;
5. all integrity controls pass.

Otherwise a valid run is `FAIL_SHARPENED_RELIABILITY_GATE`; contract or control failure is `FAIL_CLOSED`. Bootstrap uses 5,000 within-gas paired draws with seeds 20260920 for P2 and 20260921 for P3.

## Integrity boundary

The runner verifies both Gate-06 and Gate-07 seals, the source hash, diagnostic handoff hash and receipt, exact manifest, fixed roles, selected alpha, event order and blind-access transition. Its self-test does not open the source archive.

## Claim boundary

A pass would support only this sharpened reliability rule for cross-device four-gas discrimination on UCI 361. It would not establish a universal binder, chemical mechanism, physics law, consciousness, profile activation or product readiness.
