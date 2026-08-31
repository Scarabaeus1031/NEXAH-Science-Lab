# Multi-Representation Control

A frozen integer may be represented as a decimal numeral, a factorization, a parity label, a prime/composite label, or a node in the bounded relation graph. These are views of one integer object, not identical representations.

Examples:

- `24`, `2^3*3`, `EVEN`, and `COMPOSITE` agree about one integer but serve different roles.
- `25` and `5^2` denote the same integer under standard arithmetic interpretation; the numeral form and factorization form remain distinct representations.
- Packet labels B and J both contain 24, but neither label changes 24's arithmetic.

The audit preserves source object, representation, relation, and packet context separately. No visual alignment or repeated digit form was treated as arithmetic evidence.

