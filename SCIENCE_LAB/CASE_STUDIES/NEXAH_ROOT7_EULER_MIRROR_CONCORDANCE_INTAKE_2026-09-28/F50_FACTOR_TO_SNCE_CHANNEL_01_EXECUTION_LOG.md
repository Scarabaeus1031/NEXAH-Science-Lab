# F50_FACTOR_TO_SNCE_CHANNEL_01 execution log

Date: `2026-09-29`

## Frozen inputs

- preregistration SHA-256: `eb8d6c4255a619fa90bc01ceea772240b8d219f9d743d936636a9649a37ae097`
- lock SHA-256: `454261f0ac71ae78d5765a9630dfc81b214b4db06e6b01d47aed15af64fc8c66`
- runner SHA-256: `88a30043ea0ef6846cc70a08296485fc4b4b66bf502b416b37fd92310ea94969`

## Runs

The frozen runner was executed once as the primary run and twice as replays.
All three result files were byte-identical.

```text
run 1  7618d275f5eb7b28e4296fb65b630cf0c95a184f217c09e0833993341eb7379a
run 2  7618d275f5eb7b28e4296fb65b630cf0c95a184f217c09e0833993341eb7379a
run 3  7618d275f5eb7b28e4296fb65b630cf0c95a184f217c09e0833993341eb7379a
```

## Primary output

```text
classification: FAIL_F50_TO_SNCE_FACTOR_BRIDGE
checks:         14/15
F_50:           12586269025
prime factors:  5
divisors:       48
rank-50 peers:  101, 151
```

## Failed frozen check

The preregistration predicted that decimal palindromy would uniquely identify
`101` among the prime factors of `F_50`. Execution falsified that prediction:

```text
palindromic prime factors in base 10: 5, 11, 101, 151
```

No rule was repaired after execution. The overall preregistered classification
therefore remains `FAIL`, even though the exact factor bridge itself passed.
