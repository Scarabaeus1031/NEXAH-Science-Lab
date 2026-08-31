# 09 — GLF-01 Invariance Matrix

| quantity / relation | translation | rotation / relabel | rescaling | local/global | classification |
|---|---|---|---|---|---|
| geometric trajectory | same object under chart change | covariant | covariant if units/map declared | global path made of local states | COVARIANT |
| coordinate samples | values shift | components rotate/relabel | values scale | representation only | REPRESENTATION_DEPENDENT |
| probability density | translation-covariant | covariant with measure/Jacobian | magnitude changes with Jacobian | global estimate, local value | COVARIANT and ESTIMATOR_DEPENDENT |
| histogram/KDE estimate | shifts if grid follows | isotropic KDE can be rotation-covariant | bandwidth must transform | finite-sample summary | PARAMETER_DEPENDENT |
| gradient vector | unchanged by translation of coordinates | vector covariant under consistent metric transform | components/magnitude scale | local vector only | COVARIANT |
| gradient components | coordinate dependent | rotate/relabel | scale dependent | not global object | REPRESENTATION_DEPENDENT |
| model flow vector | coordinate covariant | vector covariant | time/state units matter | local rule over domain | COVARIANT |
| cosine alignment | translation-invariant | invariant under common orthogonal transform | invariant only under compatible positive scalar scaling; not general anisotropic scaling | local scalar | CONDITIONALLY_INVARIANT |
| thresholded low-density set | shifts with coordinates | covariant if field/grid follows | numeric threshold may not survive | global subset from local values | PARAMETER_DEPENDENT |
| gate candidate in visuals | not testable | not testable | not testable | underdefined | UNDERDEFINED |

`COVARIANCE_INVARIANCE_DISTINCTION_PRESERVED=YES`.

The correct survival property for gradients and flows is usually covariance, not unchanged coordinate components. No inference from local direction to global object is allowed.

