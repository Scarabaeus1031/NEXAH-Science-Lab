# Factorization Invariance

For every fixed seed integer greater than 1, the prime factorization in the master ledger is unique up to the order of factors. Reordering factors does not change the integer.

This invariance does not extend across segmentation changes. For example, the displayed segments `23`, `24`, and `25` are three integer objects, while `232` and `425` are two different integer objects. Their factorizations differ because the cuts define different integers, not because factorization changed for the same integer.

Therefore:

- `FIXED_INTEGER_FACTORIZATION_INVARIANT=YES`
- `FACTORIZATION_INVARIANT_UNDER_RECUTTING=NO`
- `DIGIT_STRING_EQUALS_INTEGER=NO`
- `SEGMENTATION_EQUALS_FACTORIZATION=NO`

