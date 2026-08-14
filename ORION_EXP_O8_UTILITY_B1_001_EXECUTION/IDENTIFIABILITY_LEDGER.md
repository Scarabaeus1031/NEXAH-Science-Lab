# Identifiability ledger

Status: PASS.

- TEST-FRAME: 1024
- IDENTIFIABLE: 1024
- AMBIGUOUS: 0
- primary: `8*floor(1024/8)=1024`
- minimum-N gate: `1024 >= 512`, PASS
- eight pairwise-distinct canonical orbit outputs: 1024/1024
- trivial stabilizer: 1024/1024
- distinct-orbit/stabilizer agreement: 1024/1024
- retained identifiable remainder: 0
- retained natural ambiguous sources: 0

The complete per-source orbit hashes and stabilizers are in
`primary/strata.json`; replay regenerated them byte-identically.
