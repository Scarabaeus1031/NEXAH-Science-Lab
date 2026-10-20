# A0-BL-048 — Prime-index nesting controls result

Date: `2026-10-18`  
Status: `CLOSED / OWNER_ACCEPTED / FAIL_PRIME_INDEX_SELECTIVITY_PALINDROME_BASELINE_DOMINATES`

The source lock passes `10/10`. Primary and Replay are byte-identical at
SHA-256 `a14ad110ed00ee9f1b5616328427b1fb3fb02527b9bc10cb054201c2a5fd083f`.
Both structural verifiers pass `15/15`; all eight preregistered gates pass.

## Result

- the complete matched null contains `15 × 6 × 6 = 540` target tuples;
- the observed prime-index nesting score is `5`;
- `228/540 = 0.422222...` null tuples score at least as high;
- `4774` is maximally unselective under this rule: every one of its six
  permutations scores `2`, because each retains both `4` and two `7`s and
  therefore the standard relation `p_4=7`;
- all three target strings are reversal fixed points;
- only `12/540 = 0.022222...` matched tuples contain three palindromes;
- reversal class membership fails `0/540` times and is therefore closure, not
  selectivity;
- `4774+4114=8888` and `gcd(4774,4114)=22` remain exact source controls but
  were not counted in the nesting score.

## Interpretation

The registered prime-index score does not distinguish the selected strings
from their complete digit-multiset controls. The simpler palindrome fixed-point
baseline is more selective inside this finite ensemble. Because the strings
were already supplied in visible decimal form, even the palindrome tail is
selection-conditioned and is not an independent discovery p-value.

Not established: a privileged prime-index nesting law, natural-number
selection, `40/3` cycle, recurrence, physical mechanism, prediction, novelty
or publication readiness. The Human Owner accepted this bounded negative
classification by selecting the next ordered experiment on `2026-10-18`.

