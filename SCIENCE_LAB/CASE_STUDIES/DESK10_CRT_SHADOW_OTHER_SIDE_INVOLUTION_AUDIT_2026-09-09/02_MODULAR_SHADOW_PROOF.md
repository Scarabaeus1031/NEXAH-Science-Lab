# Modular shadow proof

For `N=31000`, define `S_N(x)=(-x) mod N`. On representatives `0<=x<N`, `S_N(0)=0`; otherwise `S_N(x)=N-x`.

## Selected pair

```text
11357 + 19643 = 31000
S_31000(11357) = 31000 - 11357 = 19643
S_31000(19643) = 31000 - 19643 = 11357
```

## Involution

`S_N(S_N(x)) = -(-x) mod N = x mod N`. Since the domain already uses canonical representatives, the returned representative is exactly `x`.

Classifications: `MODULAR_NEGATION`, `ADDITIVE_INVERSE`, `INVOLUTION`.

`ADDRESS_PRESERVING_RETURN_CANDIDATE` is not assigned. Existing sources define addresses for a carrier preserved through views. Here shadow maps an address to its componentwise additive inverse; equality of the original and returned address holds only at the two fixed points. No source contract defines this address change as preservation.
