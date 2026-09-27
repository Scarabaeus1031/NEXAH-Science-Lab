# NEXAH-ORI-02 — Vertex, Record and Symbol Collision

This bounded test separates particle identities, mathematical symbols, transition vertices, visible records and unresolved upstream histories.

It is a positive control for two known errors: glyph fusion and unique-source inference from an incomplete detector record. A strong typed decay-graph baseline receives the same information.

Replay:

```bash
python3 run_ori02.py
```

This fixture proposes no new decay, particle, Kappa mechanism or physical law. It tests bookkeeping and claim discipline only.
