# A5 Adversarial Mutation Report

The independent A5 suite mutates an in-memory copy of the reconstructive machine contract or an isolated temporary copy of sealed files. It imports no scientific pipeline and uses no registered data.

| Mutation | Expected rejection |
|---|---|
| single-view P4 role changed | P4 critical registry mismatch |
| P4 gain `>0` weakened | P4 predicate mismatch |
| validity derivation emptied | typed-gate failure |
| parity raw-table field removed | parity-schema failure |
| distinctness reduced | distinctness-predicate failure |
| sensitivity count 12→11 | registry failure |
| sensitivity gain output removed | output-schema failure |
| exact rational dominance→float | arithmetic-type failure |
| `2D3<=G`→`2D3<G` | boundary-rule failure |
| operative A5 prose appended with `P5 is optional` | manifest hash failure |
| V1 source byte appended | recomputed V1 composite failure |
| N3 direction reversed | N3 fingerprint failure |
| RNG generator changed | RNG fingerprint failure |
| N1 forward mapping changed | N1 fingerprint failure |
| N4 distance changed | N4 fingerprint failure |
| null repetitions 200→199 | repetition failure |
| null repetitions 200→201 | repetition failure |
| Monte Carlo `k<=4` weakened | boundary failure |
| N5 count 12→11 | N5 completeness failure |
| P5 intervals required at all amplitudes | P5 semantic failure |
| classification precedence reversed | precedence failure |
| Lorenz ceiling raised | cross-system ceiling failure |

Exact arithmetic fixtures additionally require six stored binary64 `0.1` contributions to pass exact equality, one `0.10000000000000002` plus five `0.1` to fail dominance, nonpositive `G` to fail, and fewer than three eligible seeds to invalidate.

**Result:** PASS — every listed material mutation is rejected by `contract_validation/test_a5_contract.py`; the exact execution transcript is produced locally after manifest sealing. No registered science is run.
