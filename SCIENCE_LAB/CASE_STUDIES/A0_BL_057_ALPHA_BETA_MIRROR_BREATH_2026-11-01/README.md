# A0-BL-057 · Alpha/Beta Mirror Breath

Status: `RUN_COMPLETE / 8_OF_8_GATES_PASS / AWAITING_OWNER_DISPOSITION`

## Result

The exact complement pair

```text
alpha = 63/64
beta  = 1/64
```

becomes the signed pair `+31/32` and `-31/32` under the locked map
`S(x)=2x-1`. The centered amplitude `q=31/64` generates reciprocal positive
view scales:

```text
s_alpha(t) = exp(+q W(t) sin(0.8 t))
s_beta(t)  = exp(-q W(t) sin(0.8 t))
```

Their sampled product differs from one by at most `2.220446049e-16`; the pure
one-cycle state Return error is the same machine-scale value. Reversing the
labels swaps the channels exactly. Equal weights yield a zero-amplitude unit
view.

The recovered hard `t=25` cutoff is strongly local-pulse-sensitive. Relative
to the preregistered logistic window, its local maximum absolute second
derivative is `15721.889×` larger and its rotation-angle peak is `187.394×`
larger. The adjacent hard jump is `0.151209`; the smooth jump is `0.000905`.

## Classification

`PASS_EXACT_COMPLEMENT_MIRROR_RETURN_WITH_CUTOFF_SENSITIVITY`

This is an exact analytic/synthetic display-scale result. It is not evidence
of physical dilation, biological breathing, universal Alpha/Beta roles,
golden-ratio identity, predictive utility or cross-domain mechanism.

The prior negative `CA-IDENT-05` Fourier/Memory classification result remains
unchanged. The present Study tests a different object.

## Reproducibility

- pre-output lock: `6/6 PASS`;
- Primary and Replay: byte-identical SHA-256
  `af641d10b2baa9158d6661f60cf810e1306cfe6d7af74d20f0116408ae2a7af6`;
- independent structural verifier: `PASS` twice;
- result SVG SHA-256
  `fae26efa842b05c35f55bfbc480fc715f702ceeaa6e3d72392d3777d4bc811bf`.

## Entry points

- [Admission](00_ADMISSION_RECORD.md)
- [Preregistration](01_PREREGISTRATION.md)
- [Run Contract](RUN_CONTRACT.md)
- [Primary result](artifacts/PRIMARY_RESULT.json)
- [Result assessment](02_RESULT_ASSESSMENT.md)
- [Evidence map](04_EVIDENCE_MAP.md)
- [Labreport candidate](../../LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_057_ALPHA_BETA_MIRROR_BREATH_001.md)
