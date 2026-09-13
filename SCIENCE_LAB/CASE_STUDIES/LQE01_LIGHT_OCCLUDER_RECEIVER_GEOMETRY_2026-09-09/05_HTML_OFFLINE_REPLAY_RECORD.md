# HTML offline replay record

The copied `NEXAH_Light_Three_Shadows_Destruction_Test.html` was opened from the local filesystem in a headless local Chrome process. All HTTP and HTTPS requests were blocked. This was an interface replay only, not a new scientific destruction test.

```text
HTML_SHA256 = a4580abfc62d283330d9a6349fe73d6835153ffceb72fcd0f30318474de207cf
HTML_OFFLINE_REPLAY = PASS
HTML_CONTROLS_VERIFIED = 3_OF_3
PROJECTION_ANGLE_CHANGED_STATE = YES
SOURCE_WIDTH_CHANGED_STATE = YES
RECEIVER_DISTANCE_CHANGED_STATE = YES
CORE_REQUIRES_REMOTE_NETWORK = NO
```

Two optional remote UI-library requests were observed and blocked. Their absence did not prevent the embedded core demonstrator from loading or responding to all three controls.

The machine-readable record is `results/html_offline_replay.json`.
