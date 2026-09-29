# H_Q_PIQ_MASK_COMPATIBILITY_01 execution log

Execution date: `2026-09-29`

## Frozen input

- preregistration SHA-256:
  `b5411cfb472c169f54008e5b82e401b9f25f2d1a4dcec04a0aab9e16a9fb7257`
- H_Q_RECORD_01 result SHA-256:
  `79d767e7d4df682a663c09a87af6f46f185c9894c16763eca4c2a53bb1433480`
- Double-Cut-0.2 model SHA-256:
  `35c49ac53760c0df79411822568f924e86b6bf697f2041690a04d705ab623849`
- runner SHA-256:
  `067a2c547d707066d45347de7c18b4225612f7ea86eb7d3392c52ee61c985a2f`

Every frozen source hash listed in the preregistration matched before the model
was evaluated.

## Primary run

```text
PASS_SOURCE_BOUND_PIQ_MASK_COMPATIBILITY__MASK_EFFECT_EVALUABLE
checks 10/10
zones inside=2 outside=6 boundary=0
positive-control max displacement=186.963005947719 px
```

Result SHA-256:

```text
226f3aace443b0ffff74dc58b45d7aa9e01ef2bb854fd2fc6168acf6949590bc
```

## Required replays

Two further executions wrote separate files in `/private/tmp`. Both replay
files had SHA-256

```text
226f3aace443b0ffff74dc58b45d7aa9e01ef2bb854fd2fc6168acf6949590bc
```

Byte comparisons returned:

```text
primary versus replay A: identical
replay A versus replay B: identical
```

The preregistered stop rule is satisfied.
