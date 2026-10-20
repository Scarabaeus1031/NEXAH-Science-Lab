# A0-BL-048 — Frozen preregistration

Date: `2026-10-18`

## Objects

The target tuple is fixed as:

```text
T = (717717, 4774, 1771)
```

The motivating seed equalities are standard one-based prime indexing:
`p_4=7` and `p_7=17`. A *nesting hit* is one contiguous decimal substring
whose integer value is prime and whose one-based prime index also occurs as a
contiguous decimal substring somewhere in the same full string. Occurrences,
not merely distinct values, are counted. Leading-zero multi-digit substrings
are excluded.

## Exact null population

For each target, enumerate every unique permutation of its complete digit
multiset. The joint null is the Cartesian product of the three classes. No
sampling, fitted weights or selected examples are allowed.

Expected class sizes from multinomial counting are `15`, `6`, `6`; therefore
the joint population has `540` tuples.

## Frozen measures

1. `prime_nesting_score`: total nesting-hit occurrences across the tuple.
2. `prime_tail`: fraction of all 540 null tuples whose score is at least the
   target score.
3. `reversal_membership`: whether each reversed string remains in its matched
   permutation class; this is a closure control, not a selectivity measure.
4. `palindrome_score`: number of strings fixed by reversal.
5. `palindrome_tail`: fraction of null tuples with palindrome score at least
   the target score.
6. Report all multiplicities and ties.

## Decision rule

- `PASS_PRIME_INDEX_SELECTIVE` only if `prime_tail <= 0.05` and is strictly
  smaller than `palindrome_tail`.
- `FAIL_PRIME_INDEX_SELECTIVITY_PALINDROME_BASELINE_DOMINATES` if
  `palindrome_tail <= 0.05` and `prime_tail > palindrome_tail`.
- otherwise `UNINFORMATIVE_NO_REGISTERED_SELECTIVITY`.

The palindrome result is selection-conditioned because all three targets were
already supplied as visible decimal forms. It cannot be promoted to an
independent discovery p-value.

## Gates

1. exact class sizes `15/6/6` and joint size `540`;
2. exact `p_4=7`, `p_7=17` anchor verification;
3. complete enumeration and score histogram accounting;
4. exact prime-tail numerator and denominator reported;
5. reversal closure reported separately;
6. exact palindrome-tail numerator and denominator reported;
7. `4774+4114=8888` and `gcd(4774,4114)=22` verified but excluded from the
   nesting score;
8. classification follows the frozen rule and preserves the claim ceiling.

## Invalidity and STOP

Missing source hashes, incomplete permutation classes, changed targets,
post-exposure score definitions or omitted multiplicities invalidate the run.
After Primary, Replay and verification, stop for Owner disposition.

