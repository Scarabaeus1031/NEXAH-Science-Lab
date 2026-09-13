# Modulo-11 indexing and prime-stick audit

11 is prime. Every positive multiple k*11 with k>=2 is composite. Therefore the only prime in residue class 0 modulo 11 is 11.

For labels n=0,...,999999: residue class 0 has 90910 labels. These comprise zero, prime 11, and 90908 positive composite multiples. There are 78498 primes below one million, of which 78497 occupy residue classes 1 through 10.

## Spatial derivation

Let row=r and column=c.

| policy | formula modulo 11 | width 11 | width 111 | width 1000 |
|---|---|---|---|---|
| row-major | r*w+c | c=0 | r+c=0 | c-r=0 |
| column-major | c*w+r | r=0 | c+r=0 | r-c=0 |
| centered signed linear | y*w+x; x=c-floor(w/2), y=r-floor(w/2) | centered x=0 | y+x=0 | x-y=0 |
| coordinate sum | x+y | anti-diagonal residue bands | same | same |
| coordinate difference | x-y | diagonal residue bands | same | same |

All equations are congruences modulo 11. For width 11, row-major class 0 is a vertical column and column-major is a horizontal row. Since 111 is congruent to 1 modulo 11, row-major and column-major yield anti-diagonal bands. Since 1000 is congruent to -1 modulo 11, they yield diagonal bands. Centering can translate the phase; it does not create a canonical physical pattern.

The generated MOD11_PRIME_STICK_G1000.png uses row-major indexing. Gray marks zero, white the unit 1, gold prime 11, red other residue-0 composites, cyan other primes, and black remaining composites. It is a reproducible software layer, not a physical sensor.

Classifications: MODULO_11_SIEVE_CONFIRMED, PRIME_STICK_CONFIRMED, INDEXING_DEPENDENT_PATTERN, SENSOR_OPERATOR_ONLY, PHYSICAL_SENSOR_NOT_DEMONSTRATED.
