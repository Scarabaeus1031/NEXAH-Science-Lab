# Scientific Estimand

For a case with paired representations `(X_k,X'_k)`, `k=0..6`, and a declared
task distinction `Delta`, the ground-truth oracle produces exact predicates:

```text
s_k = survives(Delta, X_k, X'_k) in {0,1}
```

Valid primary cases require `s_0=1` and monotonicity (`s_k=0 => s_j=0` for all
`j>k`). Then:

```text
k* = min{k in 1..6 : s_(k-1)=1 and s_k=0}
k* = NO_LOSS if s_0=...=s_6=1
```

Methods receive paired representations, the public task query and allowed public
correspondence, but not `s` or `k*`. Each predicts `k_hat` in
`{T1,...,T6,NO_LOSS,UNRESOLVED}`.

The estimand is conditional on the declared Delta and benchmark distribution.
“Recoverable” means only that the oracle's exact task projection differs across
the pair at that stage. It is not Shannon information, general invertibility or
human visual detectability.

Q1 is localization accuracy. Q2 is incremental diagnostic performance against
all frozen comparators. Q1 success does not imply Q2 success.

