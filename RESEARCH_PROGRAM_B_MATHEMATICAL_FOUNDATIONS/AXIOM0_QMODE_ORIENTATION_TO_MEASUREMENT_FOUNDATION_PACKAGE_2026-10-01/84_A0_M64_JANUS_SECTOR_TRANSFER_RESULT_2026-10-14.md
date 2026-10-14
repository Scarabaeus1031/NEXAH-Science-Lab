# Check 84 — M64 Janus-Sector Transfer Result

Date: `2026-10-14`  
Run: `A0_M64_JANUS_SECTOR_TRANSFER_RUN_001`  
Status: `VALIDATED BOUNDED ENGINEERING RESULT / STOP REACHED`

## Result

```text
CARRIER_BOUND_JANUS_SECTOR_AT_365_NO_NONTRIVIAL_TRANSFER_TO_2501
```

For a multiplier `a` on `Z_m`, agreement with the mirror is the equalizer

```text
Ea(m) = {x : ax = -x mod m}
      = ker(Ma+1,m),
|Ea(m)| = gcd(a+1,m).
```

The exhaustive enumeration agrees with this formula on both frozen carriers
and on both preregistered controls.

## `M64` on `Z_365`

```text
gcd(65,365) = 5
E64(365) = {0,73,146,219,292} = 73*Z_5.
```

On this factor axis,

```text
64 mod 5 = 4 = -1 mod 5.
```

Therefore `M64` is exactly the mirror on the complete five-state axis. Its
restricted cycle structure is one fixed point and two transpositions:

```text
0 -> 0
73 <-> 292
146 <-> 219
```

The other factor axis `5*Z_73` is not a mirror sector: its induced multiplier
is `64 mod 73`, of order `3`, and only zero agrees with the mirror.

## `M64` on `Z_2501`

```text
gcd(65,2501) = 1
E64(2501) = {0}.
```

The two factor-axis actions are:

```text
61*Z_41: induced multiplier 23 mod 41, order 10
41*Z_61: induced multiplier  3 mod 61, order 10
```

Neither is `-1`; neither is a nontrivial mirror sector.

## Transfer classification

What transfers:

- the typed multiplier class;
- CRT channelwise action;
- the equalizer equation `(a+1)x=0 mod m`;
- the cardinality rule `gcd(a+1,m)`.

What does not transfer:

- existence of a nontrivial Janus sector;
- which factor axis carries mirror action;
- local orders and global orbit census.

The exact Janus behavior of `64` on the established five-axis is therefore not
an intrinsic property of the numeral `64`. It arises because `65` and `365`
share the factor `5`, equivalently because `64=-1 mod 5`.

## Machine return

- protocol: `A0_BOOK/assets/a0-m64-janus-sector-transfer-r1-protocol.json`;
- deterministic runner: `A0_BOOK/run_m64_janus_sector_transfer_r1.mjs`;
- result: `A0_BOOK/results/a0-m64-janus-sector-transfer-r1-result-2026-10-14.json`;
- result lock: `A0_BOOK/assets/a0-m64-janus-sector-transfer-r1-result-lock.json`;
- validator: `A0_BOOK/validate_m64_janus_sector_transfer_r1_result.mjs`;
- reused registry: `A0_BOOK/operator-registry/modular-crt-operator-registry-v0.1.json`.

## STOP

- exhaustive mirror equalizer on `365`: `PASS`;
- exact five-axis identification: `PASS`;
- exhaustive mirror equalizer on `2501`: `PASS`;
- factor-axis transfer to `2501`: `REJECTED`;
- general cardinality rule and controls: `PASS`;
- physical Janus mechanism: `NOT ESTABLISHED`;
- privileged modulus or universal meaning of `64`: `NOT ESTABLISHED`;
- new Navigator/ORION identity: `NONE`;
- claim promotion/publication: `NOT AUTHORIZED`.

