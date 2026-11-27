# EMP-03 Dataset Freeze

Object: Tangent / Polar / Boundary Transition
Date: 2026-08-27
Status: CLOSED — CONDITIONAL PASS / DOMAIN MAPPED

This freeze contains analytic and synthetic ledgers for Runs 01–07. It is a bounded geometry case study, not a physical-instrument dataset. Ground truth is generated from the circle/tangent/polar formulas documented in the closeout report.

Core relations:
- OT * OT' = R^2
- beta = asin(R/d), d>R
- AB = 2R sqrt(1 - R^2/d^2), d>=R
- u = OT'/R, v = AB/(2R), u^2 + v^2 = 1 (real tangent domain)
- J_R(d) = R^2/d, J_R^2 = I

Key boundary: the real tangent representation ends for d<R, while the polar relation can be continued algebraically/projectively.

Run 07 adds an independent true boundary anchor d=R to distinguish reversibility from correctness.
