# A5X Authority and Sealing Contract

`A5X_AUTHORITY_ROOT.json` is the local authority root. The validator recomputes the V1 24-file composite, A5 scientific hashes, and every listed A5X member byte/hash/size/role/count. It also scans operative A5X Markdown membership.

The root SHA-256 is hard-coded in the validator. To avoid an impossible literal hash cycle, the root records a normalized validator hash: its root-digest literal is replaced with `<NORMALIZED_ROOT_DIGEST>` before hashing. Tests and all other files use ordinary byte hashes.

Trust boundary: the independently obtained validator/root digest (also reported at handoff) is the local bootstrap anchor. No self-contained mutable directory can prevent an adversary from replacing every file and the executable used to verify it. Given the trusted validator/root digest, coordinated root+prose, root+machine or root+validator rewrites fail. A new root is a new freeze and cannot authorize itself.

