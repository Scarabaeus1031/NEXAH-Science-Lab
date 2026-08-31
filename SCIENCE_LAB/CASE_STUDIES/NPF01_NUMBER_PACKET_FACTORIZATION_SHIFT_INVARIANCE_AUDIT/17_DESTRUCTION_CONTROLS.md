# Destruction Controls

Each required proposition was tested directly. “Rejected” means the asserted equality or implication does not survive typed arithmetic and neutral relabeling.

| ID | Candidate assertion | Result |
|---|---|---|
| D1 | Same digits = same packets | `REJECTED`; cuts change packets |
| D2 | Packet = integer | `REJECTED`; container differs from member object |
| D3 | Integer value = prime index | `REJECTED`; e.g. `23 != 9` |
| D4 | Prime = “special” semantic class | `REJECTED`; primality is arithmetic only |
| D5 | Factorization = interpretation | `REJECTED`; factorization is exact arithmetic representation |
| D6 | `33 = RED SPACE` | `REJECTED`; expression only |
| D7 | `99 = RED SPACE` mathematically | `REJECTED`; expression only |
| D8 | `11+13=24` implies universal prime-pair rule | `REJECTED`; one equality does not generalize |
| D9 | `46=2*23` makes 46 a prime object | `REJECTED`; 46 is composite |
| D10 | Adjacency = causal relation | `REJECTED`; adjacency is order, not cause |
| D11 | Window position = integer property | `REJECTED`; position changes with packet |
| D12 | Odd/even lane = universal architecture | `REJECTED`; bounded classification only |
| D13 | Same prime factor = same number type | `REJECTED`; shared factor does not identify integers or all types |
| D14 | Decimal approximation = exact structural relation | `REJECTED`; approximation is not equality |
| D15 | `425/232 ≈ 1.832` implies 1832/1836 relation | `REJECTED`; expression was not tested as a relation |
| D16 | Visual packing = arithmetic invariant | `REJECTED`; layout removal preserves only equations |
| D17 | One successful cut = structural necessity | `REJECTED`; alternative authorized cuts create different objects |
| D18 | Prime index = packet index | `REJECTED`; distinct ordinal systems |
| D19 | Consecutive numbers = same factor family | `REJECTED`; consecutive seeds have differing factors |
| D20 | Post-hoc subset = generated family | `REJECTED`; no independent generator was supplied |

`DESTRUCTION_CONTROLS=20_OF_20_COLLAPSES_REJECTED`
