# 02 — Formal Object and Role Ledger

| object/token | formal type | role | domain | codomain | depends on | generates/maps to | identity conditions | representation status |
|---|---|---|---|---|---|---|---|---|
| `C = ℂ` | set / parameter space | domain of quadratic-family parameters | — | — | chosen family | admits `c∈C` | set identity, not token equality | mathematical object |
| `c` | complex number / parameter value | selected family index and constant term | `C` | — | parameter selection | indexes `f_c`, `J_c`, `E_c` | equality as complex values | not a representation of `J_c` |
| `z` | complex number / dynamical state | current state in dynamical plane | `ℂ` | — | state selection | input to `f_c` | equality as complex values | state, not parameter by role |
| `f_c` | function `ℂ→ℂ` | parameterized generative rule, `z↦z²+c` | `ℂ` | `ℂ` | family definition and `c` | maps one state to the next | extensional function equality | rule specification |
| iteration event `e_n` | event occurrence | application of registered `f_c` to `z_n` | rule, parameter, state, execution context | event/outcome record | `f_c,c,z_n` and occurrence | produces `z_{n+1}` if completed | event identity needs occurrence index/context | execution, not rule |
| `z_{n+1}` | complex number / resulting state | outcome state of one iteration | `ℂ` | — | `f_c,z_n` and event | next possible input | value equality does not identify event | state/result |
| orbit `(z_0,z_1,...)` | ordered sequence | accumulated forward trajectory | initial state and iteration index | sequence in `ℂ` | `c,z_0,f_c`, occurrences | supplies boundedness/escape behavior | ordered-sequence equality under declared horizon | mathematical trajectory; finite record may be trace |
| `J_c` | subset of dynamical plane | exact Julia-set object for fixed `c` | `ℂ` | — | `f_c` | may be observed by a declared map | set identity, not image equality | exact object; not numerically constructed in MJPR-01 |
| `E_c^{W,G,N,R}` | finite integer-valued field | registered numerical intermediate | `W∩G` | `{1,…,N}` | `c,W,G,N,R` and iterated escape test | input to registered `P` | exact array equality only at frozen discretization | finite representation of orbit behavior associated with `J_c` |
| `P` | observation/projection map | registered reduction of `E_c` (or idealized observation of object) | explicitly registered source representation | observation space `Y_P` | view definition | maps source to `y` | map identity includes full rule/configuration | representation-generating rule, not execution event |
| `y` | element of observation space | realized registered observation | `Y_P` | — | `P` and source | indexes compatibility class | numerical equality under registered test | observation / representation |
| `Θ_y` | subset of registered parameter family | compatible-source/reconstruction set | registered candidate family `C_441` | power set `𝒫(C_441)` | `P`, equality/compatibility rule, `y` | lists parameters consistent with observation | set equality under fixed registry | inference result, not true parameter |
| Mandelbrot set `M` | subset of parameter space | parameter-space locus defined by critical-orbit boundedness | `C` | — | quadratic family | classifies `c` membership | set identity in parameter space | exact mathematical object |

The same mathematical value `c` can occur as the selected parameter, as the constant term in the rule expression, and as the index of an object/representation family. These are distinct registered roles/occurrences of one value, not multiple independent parameters.

