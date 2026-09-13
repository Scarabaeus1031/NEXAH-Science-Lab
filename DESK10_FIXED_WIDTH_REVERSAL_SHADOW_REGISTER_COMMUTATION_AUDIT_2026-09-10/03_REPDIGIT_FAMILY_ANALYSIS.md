# Repdigit family analysis

For T_dddd in base 10 the exhaustive equality counts are:

| d | N | equality | failure |
|---:|---:|---:|---:|
|1|1111|16|9984|
|2|2222|81|9919|
|3|3333|256|9744|
|4|4444|625|9375|
|5|5555|1296|8704|
|6|6666|2401|7599|
|7|7777|4096|5904|
|8|8888|6561|3439|
|9|9999|10000|0|

The exact count is (d+1)^4. Equality holds on the carry-free subdomain whose four input digits are each at most d. Thus the counts are monotone in d, not symmetric under d -> 9-d, and shared across all repdigits rather than unique to 8888. Only d=9 covers the complete domain.

S_N is different: its repdigit equality counts are 556, 1035, 1981, 2343, 2944, 3007, 4256, 6583, 10000. These are not the T_N carry-free formula. Domain restriction does not cause the primary N<=10000 pattern because every S result is four-digit representable.

Decision: REPDIGIT_FAMILY_LAW_CONFIRMED for T_N; BORROW_DEPENDENT below the maximal digit.
