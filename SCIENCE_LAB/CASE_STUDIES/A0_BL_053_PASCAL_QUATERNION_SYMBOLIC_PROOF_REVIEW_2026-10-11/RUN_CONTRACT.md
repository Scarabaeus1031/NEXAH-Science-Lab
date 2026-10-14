# A0-BL-053 — Run Contract

Source revision: current working tree; exact file hashes frozen in `LOCK.json`.

Environment: local Node.js with standard library only; Python standard library
for the separate verifier.

Data access: generated finite triples only; no network, personal or external
data.

Commands:

```bash
node clean_room_review.mjs artifacts/PRIMARY_RESULT.json
node clean_room_review.mjs artifacts/REPLAY_RESULT.json
python3 verify_review.py artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
```

Expected outputs: canonical JSON Primary and Replay, byte-identical SHA-256,
six passing clean-room controls and classification
`INTERNAL_SYMBOLIC_PROOF_PASS` only when the separately written proof audit
discharges P1–P7.

Resource bound: under one minute, under 100 MiB, local filesystem only.

Side effects: writes only the two declared result files.

Failure semantics: any mismatch, missing test, collision, wrong cycle,
non-exact Return or verifier failure yields `INVALID_REVIEW` or a narrower
scientific classification; no repair after exposure without a documented gate.

Claim boundary: internal proof/reimplementation evidence only; not external
independence, R4 replication, publication, historical intent or physics.
