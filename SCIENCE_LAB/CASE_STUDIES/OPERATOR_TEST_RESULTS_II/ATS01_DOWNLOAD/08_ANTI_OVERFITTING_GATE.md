# 08 — Anti-Overfitting Gate

| Question | Result |
|---|---|
| Was `T` fixed before testing? | YES |
| Was the anchor predicate fixed? | YES |
| Was the next-anchor rule fixed? | YES |
| Were intermediate states generated mechanically? | YES |
| Were states skipped? | NO |
| Were symbolic annotations needed? | NO |
| Was a new operator introduced post-hoc? | NO |
| Does the architecture work for neutral `Q`? | YES |
| Is direction supplied explicitly by `T`? | YES |
| Is return distinguished from inverse? | YES |

The neutral predicate control `10→11→12→13→14→15` has the same typed
anchor/transition/trace/next-anchor architecture. Primality selects anchors but
does not define the architecture.
