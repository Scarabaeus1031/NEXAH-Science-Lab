# Arithmetic Definitions and Method

For each frozen integer, NPF-01 computed:

- parity;
- prime/composite status;
- prime index when prime, with 2 as the first prime;
- canonical prime factorization;
- number of distinct prime factors, `omega(n)`;
- total prime-factor multiplicity, `Omega(n)`;
- perfect-power and square status;
- semiprime status;
- divisor count.

A semiprime is defined here as an integer with `Omega(n)=2`, including a square of a prime. A perfect power is an integer expressible as `a^b` for integers `a>1`, `b>1`. These conventions are declared before classification.

The audit used deterministic bounded trial division sufficient for the largest seed integer, 425. Prime indices were obtained by enumerating primes only up to each frozen prime. This is verification of the frozen corpus, not an unrestricted search.

Canonical factorization is treated as intrinsic to a fixed positive integer. Display order, packet membership, decimal concatenation, and cut position are not part of that factorization.

