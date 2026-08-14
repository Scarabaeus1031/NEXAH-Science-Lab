# Stillpoint Protocol

`STILLPOINT` means only the preregistered equilibrium `x_eq=(0,0)` of a frozen
linear ODE `x_dot=A x`. It has no metaphysical, physical or universal meaning.

| System | Matrix A | Initial perturbations | Expected classification |
|---|---|---|---|
| `S_STABLE_DAMPED` | `[[0,1],[-1,-0.4]]` | `(0.1,0)`, `(1,0)`, `(0,1)` | `RETURNS_TO_EQUILIBRIUM` |
| `S_UNSTABLE` | `[[0.5,0],[0,-0.2]]` | `(0.1,0)`, `(1,0)` | `DOES_NOT_RETURN` |
| `S_NEUTRAL` | `[[0,1],[-1,0]]` | `(0.1,0)`, `(0,1)` | `NEUTRAL_NONIDENTIFIABLE` |

`F(x_eq)=0` is checked exactly. The stable system passes the subtest only if all
three perturbations meet the frozen return/dwell rule; the unstable system must
fail to return; the neutral system must not be coerced into either conclusion.

