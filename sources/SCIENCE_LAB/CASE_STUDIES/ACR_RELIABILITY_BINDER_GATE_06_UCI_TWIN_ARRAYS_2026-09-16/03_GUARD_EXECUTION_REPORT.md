# Gate 06 — sealed Unit-4 guard execution

Date: 2026-09-16  
Decision: `STOP_BEFORE_BLIND_TARGET`  
Control decision: `PASS_CONTROLS`  
Blind state: `UNIT_5_UNOPENED`

## What was executed

The sealed runner verified the preregistration hashes and source archive, fitted all preprocessing, standardization, centroids and reliability weights on Units 1–3, and evaluated the frozen models once on Unit 4. Because the guard did not pass every criterion, the runner did not read any Unit-5 measurement member.

## Frozen Unit-4 result

| Model | Balanced accuracy |
|---|---:|
| P1 — Cut A | 0.8375 |
| P2 — A+B, equal contribution | 0.9125 |
| P3 — A+B, reliability contribution | 0.9125 |

P3 versus P1:

- improvement: `+0.0750` (+7.50 percentage points);
- paired stratified-bootstrap 95% interval: `[0.0250, 0.1375]`;
- frozen improvement criterion: pass.

P3 versus P2:

- improvement: `0.0000`;
- paired stratified-bootstrap 95% interval: `[0.0000, 0.0000]`;
- required improvement: at least `+0.0200` with a strictly positive lower bound;
- frozen improvement criterion: fail.

P3 exceeded the absolute guard accuracy threshold of 0.45 and clearly improved on the single-cut P1 model. It did not improve on the equally weighted two-cut P2 model: P2 and P3 produced the same frozen Unit-4 score and class recalls. Therefore the preregistered guard correctly stopped the experiment.

## Access and integrity evidence

- Source members opened: 560 = 480 development + 80 guard.
- Unit-5 members opened: 0.
- Seal, archive hash, manifest, device roles, cut pairing, blind-access lock and event chain all passed.
- Result receipt: `8e4d8d5131929bcaacbc54ce6edb0b3ce512844b1c07bbaa595cd6d75aadab31`.
- Controls receipt: `c493f5a7d3eae37bd6c986add5f7633477c5f2879fa4e30e7c5ddc29a0c7a8b0`.

## Interpretation

The two-cut representation generalized strongly to Unit 4, but the proposed development-only reliability weighting added no observed discrimination benefit over equal weighting. This is a valid guard-stop result, not a runtime or adapter failure and not a blind Unit-5 result.

Unit 5 must remain unopened under Gate 06. Opening it would violate the sealed protocol. A different reliability rule requires a new gate ID, a new preregistration and a new untouched target.

## Claim boundary

This result supports neither a universal binder effect nor any physics, chemical-mechanism, consciousness, profile or product claim. Theory and physics status remain unchanged.
