# Check 87 — Fibonacci Ring Operator Comparator Protocol

Date: `2026-10-14`  
Status: `FROZEN_SYNTHETIC_ENGINEERING_PROTOCOL`  
Identity: reuses `MOD:TESSAREC`; no new Study, Family or Navigator identity

## Question

Can the visual chain `0.0 / 1.1 / 1.21 / ±1.84 / 4.048` be separated into
declared address, scalar and phase operators, and can Fibonacci sampling be
compared fairly with matched uniform and seeded-random controls?

## Frozen operator chain

The dot notation is typed before arithmetic is applied:

```text
(0,0) -> (1,1)                 address move
D(i,j) = i + j/10              declared decimal decoder
D(1,1) = 1.1                   scalar view
S(x) = x^2                     square-envelope operator
S(1.1) = 1.21
[-1.84°, +1.84°]               bilateral phase pair
span = 1.84 - (-1.84) = 3.68°
B(x,a) = x * (a - (-a))
B(1.1,1.84) = 4.048°
```

`(1,1)` and `1.1` are not identical objects. The decoder `D` is the explicit
bridge. The `!` visible in the supplied “1.1! Breach” image is not interpreted
as factorial in this fixture.

## Matched sampling fixture

- sample count: `N=48` for every arm;
- uniform: `u_k=k/N`;
- Fibonacci: `u_k=frac(k/phi)`;
- seeded random: deterministic `Mulberry32`, seed `110121`;
- target: `r(theta)=1+0.11 cos(theta)+0.21 cos(2theta)+0.184 sin(3theta)`;
- primary metric: RMSE of the recovered coefficient vector
  `[mean,c1,s1,c2,s2,c3,s3]`;
- secondary diagnostic: maximum circular angular gap.

The target is a synthetic harmonic fixture chosen to make the comparator
inspectable. It is not a fitted physical envelope.

## Gates

| Gate | Requirement |
|---|---|
| `O1_TYPE` | Address, scalar, envelope and phase remain separately typed. |
| `O2_EXACT` | `1.1²=1.21` and `1.1×3.68=4.048` reproduce exactly at the recorded precision. |
| `S1_MATCH` | All three schedules use the same `N=48`. |
| `S2_REPLAY` | The random arm is exactly reproducible from seed `110121`. |
| `S3_METRIC` | All arms use one frozen coefficient-RMSE metric. |
| `S4_PRIVILEGE` | Fibonacci is privileged only if it strictly beats both controls. |

## Expected vocabulary

- `PASS_FIBONACCI_PRIVILEGED_ON_SYNTHETIC_FIXTURE`
- `PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED`
- `FAIL_OPERATOR_CHAIN`
- `FAIL_MATCHED_COUNT`
- `FAIL_DETERMINISTIC_REPLAY`
- `FAIL_METRIC_CONTRACT`

## Replay

```bash
node A0_BOOK/a0-fibonacci-ring-operator-comparator-tests.cjs
node A0_BOOK/run_a0_fibonacci_ring_operator_comparator.cjs
node A0_BOOK/validate_a0_fibonacci_ring_operator_comparator_r1_result.mjs
```

## STOP / claim boundary

Stop after one deterministic synthetic fixture and its matched controls. The
result may validate the operator typing and comparator implementation. It does
not close scientific gate `G6_SAMPLING`, establish a Fibonacci law, privilege
`1.1` or `1.21`, identify the visual `e` with Euler's number, or establish a
physical resonance mechanism.
