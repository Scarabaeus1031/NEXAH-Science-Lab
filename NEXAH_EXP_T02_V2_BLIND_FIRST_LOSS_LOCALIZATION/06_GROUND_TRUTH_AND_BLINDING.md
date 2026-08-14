# Ground Truth and Blinding

Generator, diagnostics and scorer are separate modules. `generator.py` emits:

1. public cases: stage pairs, task query and correspondence;
2. sealed truth: survival vector and `true_first_loss_stage`.

Diagnostics receive a deep JSON round-trip of public cases only. They do not
receive seed, generator configuration, truth objects or scorer functions.
Diagnostic outputs are serialized and SHA-256 frozen before truth is passed to
`scorer.py`.

Static leakage audit forbids diagnostic imports/access to `generator`, `scorer`,
filesystem, environment, reflection, import machinery, seed/truth identifiers,
and dynamic code execution. Diagnostic modules are pure functions over their
arguments. A violation has precedence over every scientific result.

Blinding is procedural/software isolation, not cryptographic protection against a
malicious operating-system administrator. The operator must not inspect the
sealed seed/truth before diagnostic output freeze. That limitation is recorded.

Ground truth is independently computed in the generator from exact target values;
NEXAH independently recomputes a prediction from public values. They share the
task definition but no truth Boolean or implementation helper.

