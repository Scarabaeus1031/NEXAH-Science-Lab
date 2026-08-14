# Package Integrity

The producer seal was reconstructed independently. All seven declared members matched their byte counts and SHA-256 values.

```text
EXPECTED TREE: 05beedf4bbfc47b7ed684c17da137bc52e93be1d4fcb3885459c9ea14f54c5fb
RECONSTRUCTED: 05beedf4bbfc47b7ed684c17da137bc52e93be1d4fcb3885459c9ea14f54c5fb
RESULT: PASS
```

Relevant upstream seals also remained valid and unchanged:

- Generator R2: `82ff760b17fa99998eedad1d5c7c471f5c7fdfded2e2cb36dace8415a7c8b5d4`
- independent Generator R2 review: `9847c76cf08abc63e947b3dd723049d5dabc127b23addbf1fed452bf5c84a719`
- historical stopped producer: `5b60a0653020d26529024bbfc5e645ae0d58ba7f87ca57ae6911b1901b2e3d17`

Reviewed producer source SHA-256: `40373e7f22f11c165794a660c591b2bb2f7c18aaf39ed9e96f461b902d7b71bc`.
