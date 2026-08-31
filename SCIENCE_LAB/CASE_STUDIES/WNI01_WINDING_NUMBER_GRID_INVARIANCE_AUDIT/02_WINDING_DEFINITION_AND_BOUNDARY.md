# Winding definition and boundary

For a closed oriented piecewise-smooth curve

    C: [0,1] → ℂ excluding {p}, with C(0)=C(1),

the standard winding number about p is

    W(C,p) = (1 / 2π) Δarg(C(t)-p)
           = (1 / 2πi) ∮ dz/(z-p).

It is integer-valued when the contract is valid.

## Required contract

- Curve closure is declared.
- p is not on C.
- Parametrization order is known.
- Orientation is declared or recoverable from that order.
- Representation retains adequate continuity/order to evaluate accumulated phase.

For ordered samples z_k, WNI-01 evaluates

    W_hat = (1 / 2π) Σ_k Arg((z_(k+1)-p)/(z_k-p)),

including the closing edge. A sample on p is UNDEFINED. Missing closure/order or any edge whose phase increment is aliased at π is UNRESOLVED; no value is forced.

Winding is relative to p, not a curve-only property. It is not grid size, rotation rate, phase value, visual loop count, flow, or return distance.
