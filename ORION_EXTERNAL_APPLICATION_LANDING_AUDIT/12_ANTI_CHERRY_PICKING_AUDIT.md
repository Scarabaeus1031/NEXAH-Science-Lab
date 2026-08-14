# Anti-cherry-picking Audit

## Counterfactual selection

Would spacecraft attitude continuity be studied without ORION? `YES`—the cited
standards and NASA guidance establish that.

Would this exact domain have been selected before knowing the MVP contains optics,
an IMU and a rotary reference? `UNKNOWN`. The match was found after the apparatus
was reduced, creating material selection bias.

## Ranking-reversal risks

- Choosing antenna pointing makes one axis and an explicit tolerance stronger but
  makes optical dropout less natural.
- Choosing spacecraft attitude makes dropout/reliability stronger but makes the
  fiducial analogue and one-axis stage less representative.
- Choosing tracker qualification maximizes apparatus fit but supplies no external
  task threshold and risks becoming metrology for its own sake.

No scoring weights were invented to force a winner. The primary candidate was
selected on independence/failure realism, not maximum device fit, and remains
unconfirmed.

## Safeguards

1. An independent AOCS/star-sensor task owner reviews the contract before seeing
   any method or benchmark outcome.
2. The owner may reject the bench analogy without penalty.
3. Mission requirements and outage population must be inherited, not tuned.
4. If no owner sees value beyond existing qualification practice, reclassify the
   setup as a standard metrology demonstrator.

Current cherry-picking risk: `HIGH`, because application search followed apparatus
definition and no independent owner has endorsed the selection.

