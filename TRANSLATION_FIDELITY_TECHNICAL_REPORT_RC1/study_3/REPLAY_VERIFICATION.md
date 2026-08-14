# Replay Verification

The frozen runner was executed twice without modification.

```text
PROTOCOL_SHA256 = f9a71253c75fbbe22bf911f8774d4680b9cf206049d2a61f6deea40ad9090ad2
IMPLEMENTATION_SHA256 = 1576d97bcd25a9481b486ae42c0632ca3fa2f9bd7436af38356c1446f9814ee9
PRIMARY_RESULT_SHA256 = 36657449bd48eb498a65e30bdda27a2d42735e357455b42aa9126f3b32f1d0d9
REPLAY_RESULT_SHA256 = 36657449bd48eb498a65e30bdda27a2d42735e357455b42aa9126f3b32f1d0d9
BYTE_COMPARISON = IDENTICAL
FAITHFUL_NOT_TESTABLE = 0 / 120
LOSSY_NOT_TESTABLE = 2 / 60
```

Replay verifies deterministic behavior in this local environment only. It does
not establish external validity, universality or physical meaning.
