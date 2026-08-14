# A5XR Adversarial Test Report

All required attacks are covered: contradictory P1/P5/classification cache; fake/duplicate seed and row identities; impossible support; sensitivity ID/path/value/digest/provenance; exact dominance half/above/nonpositive; N1/N2/N3/N4 metadata; RNG/action order; N5 count/order/aggregation/inverse; missing/duplicate-range/wrong-population null; P4 report-only mutation; P5 raw sign; invalid-positive prevention; Lorenz ceiling.

**PASS:** every mutation fails closed or deterministically changes the derived downstream result. No pipeline import or registered data is used.

