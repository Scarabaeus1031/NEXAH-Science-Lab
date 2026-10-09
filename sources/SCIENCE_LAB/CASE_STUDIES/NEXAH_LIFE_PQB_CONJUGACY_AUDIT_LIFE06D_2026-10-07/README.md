# LIFE06D — P/Q/B Conjugacy & Identifiability Audit

LIFE06D restores the typed distinction between an additive comparison, an exact scale-conjugate pair, its integer representation and an observation fiber.

## Types

- `P`: prime reference window.
- `Q-/Q+`: exact real scale conjugates `P/α` and `Pα`.
- `B_P(Q)`: bound pearl record containing exact Q, integer display, recurrence observations and representation residual.
- `E_delta(r)`: all integer lengths `L=2…32` whose observed recurrence lies within tolerance `delta` of `r`.
- `mu_delta`: multiplicity of that conditional observation fiber.

For a prime `P`, exact positive integer solutions of `Q- Q+ = P²` are only `(1,P²)` and `(P,P)`. Therefore there is no nontrivial pair of distinct positive integer window lengths exactly scale-conjugate around a prime. Real conjugates remain exact; rounding them creates a representation residual.

LIFE06C's `P-1/P/P+1` comparison remains valid but is additive:

`(P-1)(P+1)=P²-1`, not `P²`.

Fiber multiplicity is explicitly tolerance-dependent. `mu > 1` means the recurrence observation alone is insufficient to identify the window length under that tolerance.

This audit does not reopen or reinterpret the negative LIFE06C result.
