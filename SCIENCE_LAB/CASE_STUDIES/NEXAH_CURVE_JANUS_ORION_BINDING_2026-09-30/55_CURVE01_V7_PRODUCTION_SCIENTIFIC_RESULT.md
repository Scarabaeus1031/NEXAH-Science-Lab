# CURVE01 V7 production scientific result

Date: `2026-10-01`

Status: `VALID_NEGATIVE / CLOSED_BOUNDED / NO_ACTIVATION`

## Decision

The separately authorized, manifest-locked 200,000-draw CURVE01 production
run completed successfully. The scientific decision is:

```text
VALID_NEGATIVE
```

The registered hypothesis that prime-sampled curve states are closer to the
declared phase-return targets than matched composite controls is not supported
in the frozen mixed-shell analysis domain. This is a valid negative scientific
result, not a runner, replay, control or representation failure.

## Registered decision evidence

| Measure | Observed | Registered support condition | Result |
|---|---:|---:|---|
| `delta_zero` | `+0.0014300840248901892` | `<= -0.020` | fail |
| `g_declared` | `+0.004912102060724621` | `<= -0.050` | fail |
| raw permutation `p` | `0.6182869085654572` | `<= 0.010` | fail |
| adjusted zero `p` | `1.0` | `<= 0.010` | fail |
| negative blocks | `6 / 10` | `>= 8 / 10` | fail |
| leave-one-out robustness | mixed; eight positive, two slightly negative | every value `<= -0.010` | fail |

The production test used exactly `200,000` deterministic permutation draws.
The raw exceedance count was `123,657`; the adjusted-zero exceedance count was
`200,000`.

## Population and validity

- source population: `49,992` records (`9,586` prime; `40,406` composite)
- analysis population: `25,993` records (`9,585` prime; `16,408` composite)
- mixed shells: `8,206`
- excluded shells: `7,708`
- representation status: `PASS`
- control status: `PASS`
- production artifact validation: `ARTIFACT_VALID`
- output schema: `PASS`
- expected bundle membership: exact, `21` files

Primary and replay candidate bytes were identical. Independent finalization
reproduced the same scientific-result bytes, and the online supervisor returned
`IMPLEMENTATION_VALID` before atomic publication.

## Claim boundary

This result rejects support for the preregistered directional effect within
the declared mixed-winding-shell population, targets, matching rule,
statistics and thresholds. It does not prove that no prime-associated pattern
exists under every possible representation or population. It creates no
causal, physical, predictive, navigation, exceptional-prime or general
number-theory claim and activates no ORION or NEXAH capability.

## Locked provenance

- design-manifest SHA-256:
  `6373d9f0a47e7bdb665fdf4217dd74b3040c62976a26e30cdaaf20633dc43fd9`
- implementation-manifest SHA-256:
  `fc684a294af07a9befc4bd91569e0b7a1a2ca4dd0481dce94a4baebdacd2c8e8`
- independent V7 audit SHA-256:
  `53ef4f865efc3498eca9ac11721784fd7543b53030b2434d20e974638832485a`
- formal preflight SHA-256:
  `8bdd691dd2575e370788cacdffda37d2a39fe6e9bc12d90585a0221a63b74b02`
- final `scientific_result.json` SHA-256:
  `5a02d638d31036e0d4ec442623de0c04887b2221e563f08cb1bc41d8eb15985b`
- conservation digest:
  `88a9bdbd0a8acc9a5f9a8dc63003dffcb332b79f1f7be28b2e78810e655f18c6`

The controlling machine-readable bundle is
`outputs/curve01_production_v7/`. The scientific result is closed and filed;
there is no automatic successor experiment.
