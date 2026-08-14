# Runtime Environment

## Locked replay environment

- OS used for owner-gate replay: macOS 26.5.2, Darwin 25.5.0, arm64.
- Distribution: Anaconda, Python 3.12.7.
- NumPy 1.26.4; scikit-learn 1.5.1; SciPy 1.13.1; joblib 1.4.2;
  threadpoolctl 3.5.0; pandas 2.3.3; python-dateutil 2.9.0.post0;
  pytz 2024.1; tzdata 2023.3; six 1.16.0.

`environment-lock.yml` and `requirements-lock.txt` pin the runtime packages
actually imported transitively by the three studies. The lock does not assert
cross-platform numerical identity: Study 2 failed exact replay in this locked
environment, as recorded in `PORTABLE_REPLAY_VERIFICATION.md`.

Studies 1 and 2 additionally require historical source revision
`923362e141170f06f2f0f26992136b5979047c42`. The minimal transitively imported
source tree is bundled under `compat/historical_dependency/`; the compatibility
harness adapts only the path in a temporary runner copy.

`ENVIRONMENT_LOCK = COMPLETE_FOR_RECORDED_MACOS_ARM64_RUNTIME`
