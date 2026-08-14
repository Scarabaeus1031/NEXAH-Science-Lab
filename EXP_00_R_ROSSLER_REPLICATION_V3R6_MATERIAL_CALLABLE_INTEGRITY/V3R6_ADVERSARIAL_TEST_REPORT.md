# V3R6 Adversarial Test Report

Final command: `/opt/anaconda3/bin/python3 -B -m unittest tests.test_v3r6 -v`

Result: **11 tests passed in 342.639 seconds**.

| Case | Verification / consumption outcome | Altered behavior executed | Valid classification reached |
|---|---|---:|---:|
| A. `_implementation.__code__` replacement | rejected before consumption | NO | NO |
| B. dispatcher preserved, `__wrapped__` replaced | rejected relationship | NO | NO |
| C. implementation function replacement | runtime object refuses assignment; V3R6 remains valid | NO | NO |
| D. callable alias substitution | rejected alias/dispatcher identity | NO | NO |
| E. monkey-patched `numpy.quantile` | rejected dispatcher identity | NO | NO |
| F. mutation after initial verification | second immediate pre-consumption check rejects | NO | NO |
| G. clean historical runtime | accepted | legitimate only | synthetic reference only |
| H. unchanged legitimate callable path | accepted; both verifiers agree | legitimate only | synthetic reference only |

Supplementary gates passed: 24-tree authority, inherited V3R3 malformed-schema/failure-state/firewall suite, exact canonical and alternate complete objects, and unauthorized zero-resolve/zero-read behavior.
