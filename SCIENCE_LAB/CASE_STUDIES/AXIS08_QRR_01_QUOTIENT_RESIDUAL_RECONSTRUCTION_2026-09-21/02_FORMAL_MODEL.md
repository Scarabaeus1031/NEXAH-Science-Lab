# Formal model

Let `x = (x1,...,x8)` and `s = w7 + w8 != 0`.

```text
q78   = (w7*x7 + w8*x8) / s
delta = x7 - x8
Qw(x) = (x1,...,x6,q78)
Rw(x) = delta
```

The inverse of `(Qw,Rw)` is

```text
x7 = q78 + (w8/s)*delta
x8 = q78 - (w7/s)*delta.
```

Therefore `(Qw,Rw)` is an invertible linear change of coordinates, while
`Qw` alone has a one-dimensional kernel generated in the final two coordinates
by `(w8,-w7)`.

This is standard linear algebra. The research object is the audit protocol:
make the quotient, lost direction, residual sufficiency, reconstruction and
comparison boundary explicit in one reproducible record.

For vector-valued poles in `R^d`, the same equations operate componentwise and
the domain/codomain are `(R^d)^8 -> (R^d)^7`.

