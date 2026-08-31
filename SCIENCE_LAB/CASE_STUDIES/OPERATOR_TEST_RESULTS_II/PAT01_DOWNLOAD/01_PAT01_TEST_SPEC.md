# 01 — PAT-01 Test Specification

## Frozen domain and rules

- Prime indices: 23 through 27.
- Integer inspection window: 83 through 104 inclusive.
- Transition imported from closed ATS-01: `T(n)=n+1`.
- Anchor predicate: primality.
- Trace: every integer from one consecutive prime anchor through the next.
- Tested gap-profile classes only: constant, monotone increasing, monotone
  decreasing, alternating, or none.
- Composite properties only: parity, prime-factor count with multiplicity
  `Omega(n)`, and distinct-prime-factor count `omega(n)`.

The sole boundary extension is the minimum needed to identify the next prime
after `p27=103`; inspection stops at 107. No symbolic or secondary-number
encoder is defined.
