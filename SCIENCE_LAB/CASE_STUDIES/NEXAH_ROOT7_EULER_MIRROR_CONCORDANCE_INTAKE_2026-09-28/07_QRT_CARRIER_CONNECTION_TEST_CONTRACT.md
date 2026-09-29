# QRT carrier-family connection test contract

Date: `2026-09-28`

Status: `HUMAN_OWNER_CORRECTION / EXISTING_FAMILY_EXTENSION`

## Correction and question

The terminal value `11735` / suffix `735` is withdrawn as a transcription
error. The corrected observed sequence is:

```text
11537 -> 11573 -> 11357.
```

Does this sequence connect exactly to the existing CRT Elevator / QRT Format
Lens record, and which relations survive the two decimal cuts `2+3` and `3+2`?

## Frozen views

```text
2+3 cut: 11|537 -> 11|573 -> 11|357
3+2 cut: 115|37 -> 115|73 -> 113|57
grid address: n = 20q+r, 0 <= r < 20
CRT fingerprint: n mod (7,11,13,19)
```

The existing QRT boundary is retained: a format or cut may change the view of
one integer, but it does not turn distinct integers into one carrier.

The already supplied QRT `r=17` carrier column and exact Janus relations are
also frozen as connection controls: `11357 <-> 12537` around `11947`, plus the
separate nested shells around `12555` and the `12321+18m` translation.

## Pass rule

The connection passes only if both cuts reconstruct every integer exactly,
the digit-family invariants and address changes are computed without loss, and
the corrected values agree with the controlling CRT register. A common digit
multiset may define a carrier family, but `SAME_CARRIER` is rejected whenever
the integer or full numeric address differs. Shared nodes across Janus and QRT
views must not collapse their distinct centers or operators.

## Claim ceiling

Standard decimal decomposition, modular arithmetic and CRT only. No new number
theory, physical format law, Möbius mechanism, prime generator or capability.
