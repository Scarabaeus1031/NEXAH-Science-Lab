# Minimum Experiment Selection Review

Specification only; no equipment, purchase, construction, or execution.

## Explicit lexicographic rule

1. Require independent distance plus measured propagation time, not reproduction of a definition.
2. Prefer one-clock differential control and cancellation of fixed latency.
3. Then minimize medium, calibration, and model non-identifiability while retaining bounded uncertainty and reproducibility.
4. Use repository relevance and safety as feasibility discriminators.
5. Documentary audit is the current gate, not a physical experiment.

| Option | distance | time | one clock | medium | calibration | uncertainty | repo relevance | safety | reproducibility | answers question |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 Differential two-distance round-trip TOF | Surveyed ΔL | Calibrated raw timestamps | Yes | Air n_g | Moderate/high | Prospectively bounded | Highest | Optical review | High with ABBA/raw data | Yes: effective group speed and corrected consistency |
| 2 Fibre/delay differential | Material optical path | Calibrated timebase | Yes | Strong dispersion/temperature | High | Group-delay dominated | Moderate | Lower | High for device delay | Not free-space c alone |
| 3 Historical astronomy | External model geometry | Published conventional times | No local control | Ephemeris/eclipse model | High | Covariance-heavy | Moderate | Low | Reconstruction reproducible | Historical inference only |
| 4 Documentary only | None new | None new | N/A | None | Low | No measurement | Highest immediate | None | High audit | Existence question only |

The prior “exactly one” statement is supported once this rule is explicit. **Option 1 remains the sole retained future specification, not activated.** Option 4 is the documentary gate completed here, not the selected experiment.