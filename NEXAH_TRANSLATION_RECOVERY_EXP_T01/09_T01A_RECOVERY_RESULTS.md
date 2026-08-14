# T01-A Recovery Results

Protocol bundle: `6f0b807d1d18c9db3825dbaa98dd413cba0d52ea5f8e9bc319aa137865119b53`  
Primary result SHA-256: `0f860a7986476f63125d7832187e3b02367485ecbd10b1820173eabc647b8aac`  
Independent replay: `PASS / BYTE_IDENTICAL`

## Primary outcomes

| Family | Registered | Outcome |
|---|---:|---|
| Exact / bijective | 5 | 4 `EXACT_RECOVERY`; 1 `TOLERANCE_RECOVERY` |
| Invertible but perturbed | 6 | 6 `STRUCTURE_CHANGED` |
| Lossy / non-injective | 4 | 3 `INFORMATION_LOST`; 1 `UNIDENTIFIABLE` |

The maximum exact-control error was `2.220446049250313e-16` in the rotation
round trip, below the frozen `1e-12` tolerance. All other exact controls had
zero measured error.

## Perturbation ledger

| Run | E_rec | Frozen bound | Preserved non-state certificates |
|---|---:|---:|---|
| noise `1e-6` | `1.000000000139778e-6` | `1.01e-6` | C3, C4 |
| noise `0.1` | `0.10000000000000009` | `0.101` | C3, C4 |
| noise `0.8` | `0.7999999999999998` | `0.808` | none |
| quantization `0.001` | `0.0004467505076900108` | `0.000714177848998413` | C1, C2, C3, C5 |
| quantization `0.05` | `0.030865704891007484` | `0.03570889244992065` | C1, C2, C3, C5 |
| quantization `0.5` | `0.2999999999999998` | `0.3570889244992065` | C3 |

Noise error scaled essentially one-for-one with epsilon. Quantization error was
monotone over the three frozen steps, but not proportional by a fixed factor.
All values remained within their prospective numerical bounds.

The strict frozen primary rule includes C0 exact state among applicable
certificates. Therefore every nonzero perturbation changes at least C0 and is
classified `STRUCTURE_CHANGED`; the individual certificate columns retain the
more informative partial-preservation evidence. No threshold or rule was
changed after observing this consequence.

## Loss controls

`L1_SIGN_SQUARE` was correctly `UNIDENTIFIABLE` with two exhibited preimages.
Projection, coarse quantization, and edge deletion were correctly
`INFORMATION_LOST`. Their recovery states and errors are JSON `null`. False
recoveries: **0**.

Evidence class: `EMPIRICAL_SYNTHETIC / SOFTWARE_CHECK`. The behavior is fully
consistent with ordinary inverse, numerical reconstruction, and information
loss mathematics.
