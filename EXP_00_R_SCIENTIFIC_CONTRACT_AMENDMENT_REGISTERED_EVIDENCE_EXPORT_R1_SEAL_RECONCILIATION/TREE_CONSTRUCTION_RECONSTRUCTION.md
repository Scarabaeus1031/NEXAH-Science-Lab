# Tree-Construction Reconstruction

All strings below are UTF-8. Every record ends with exactly one LF byte (`0x0a`). The historical seal file itself is excluded.

## Documented method

For each listed member, form:

```text
<lowercase_member_sha256><two ASCII spaces><basename><LF>
```

Sort records by basename and hash their concatenation with SHA-256.

This produces:

- Export R1: `8e7ca6710290e8774427569500e09ce212f0345e1af6697d7cdbf49cb1f16cf1`
- Independent review: `38de0b34b8e1d2751a529cc1400cc0d85c4e69b0b28b8e8f3095146cf5061a42`

It does not reproduce either declared legacy tree identifier.

## Actual historical Export R1 construction

For each of the 10 declared members, form:

```text
<lowercase_member_sha256><two ASCII spaces><basename><LF>
```

Sort the complete encoded records bytewise. Because each record begins with the lowercase digest, this is digest order, not basename order. Concatenate and hash with SHA-256.

Reproduced value:

`726132aa49973e32f420554c44d0a0ab891f0582301535de0c4fa80d02c5bc33`

## Actual historical independent-review construction

For each of the 7 declared members, form:

```text
<lowercase_member_sha256><basename><LF>
```

There is no delimiter between the 64 hexadecimal digest characters and the basename. Sort the complete encoded records bytewise (digest order), concatenate, and hash with SHA-256.

Reproduced value:

`5f7bdde15d9ca00e7212480562062f226010759ebccd2c8678162e68724fee35`

## Deterministic future verification rule

Future consumers shall:

1. require exact equality between the historical seal member list and actual non-seal files;
2. verify each historical byte length and member SHA-256;
3. reconstruct the historical Export R1 identifier using its digest-sorted, two-space-delimited rule above;
4. reconstruct the historical review identifier using its digest-sorted, no-delimiter rule above;
5. require the two reproduced values to equal their historical declared hashes; and
6. verify this additive reconciliation package seal.

The two legacy algorithms are object-specific compatibility rules. They are not a preferred general sealing method and create no new scientific or content identity.
