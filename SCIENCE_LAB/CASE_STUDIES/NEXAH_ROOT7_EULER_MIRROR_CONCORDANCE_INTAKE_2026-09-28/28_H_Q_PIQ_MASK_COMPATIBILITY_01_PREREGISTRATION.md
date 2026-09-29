# H_Q_PIQ_MASK_COMPATIBILITY_01 preregistration

Freeze date: `2026-09-29`

Status before execution: `FROZEN / PRE-EXISTING OPERATOR TRANSFER TEST`

## Leadership decision

The next step is not a feedback test. The first missing link is the narrower
and independently sourceable chain

```text
Five-H phase record -> pre-existing Pi_Q projection -> pre-existing mask classifier.
```

The projection and mask are taken unchanged from the independently earlier
Rödelheim Observatory Double Cut Lab 0.2 dated `2026-07-28`. No weights, phase
offsets, mask thresholds or classes are fitted to the H_Q result.

## Single question

Can the complete keyed Five-H gate records be accepted by the pre-existing
Double-Cut-0.2 projection and mask contracts while preserving source identity,
classification coverage and explicit information-loss boundaries?

This is a compatibility test. It is not a test of improved prediction,
astronomy, feedback or physical coupling.

## Frozen sources

| Source | SHA-256 |
|---|---|
| `H_Q_RECORD_01` result | `79d767e7d4df682a663c09a87af6f46f185c9894c16763eca4c2a53bb1433480` |
| Double Cut Lab 0.2 contract | `5ed622e3bce1a51512e4a931ab398ccfea52af6d04850398c0f02a81918c74ce` |
| Double Cut Lab 0.2 model | `35c49ac53760c0df79411822568f924e86b6bf697f2041690a04d705ab623849` |
| Double Cut Lab 0.2 test | `d04c9cf8c4e421a968d10aa64a9d052ebbbfe283fe43a0d34d37dc8ab9f67449` |
| Double Cut Lab 0.2 HTML | `e766fed5e0f7086a7f71ebb099e0206e0dd608620e396528d22b7d6d1723ac71` |
| Thread Loom 0.4 contract | `50c451623b8490d2e87490a698356daa9389bae65ddafbf498a2d3815746b40b` |
| Thread Loom 0.4 model | `f6f48b8a1d5c043ad4d59e4dc4c31937953f65d72cd139c3753ebf295462b56e` |
| Thread Loom 0.4 test | `f382c1aac36470b578582a7afd81224cfbdc68e03c97eac44ba776597b5021ff` |

Before freeze, both unchanged source suites were rerun with the bundled Node
runtime: Double Cut `19/19 PASS`; Thread Loom `19/19 PASS`.

## Frozen adapter

For each gate, the Five-H record is ordered by declared clock ID:

```text
H1_SOLAR_DAY
H2_SYNODIC_MONTH
H3_ANNUAL_ORBIT
H4_PRINCIPAL_NODES
H5_AXIAL_PRECESSION
```

Each phase in turns is mapped to radians by

```text
angle_j = 2*pi*phase_turns_j.
```

The resulting five-angle vector is passed unchanged to the existing
`projectState({day, phases})` operator. The Double-Cut weights and offsets remain
exactly those of the source model:

```text
weights = [0.32, 0.27, 0.20, 0.13, 0.08]
```

No Double-Cut-native phase clock is substituted for an H_Q clock. The adapter
transfers a typed vector into an existing operator; it does not merge the two
period definitions.

## Frozen mask

Use the source test defaults unchanged:

```text
widthPercent          = 18
positionPercent       = 50
moving                = false
driftPercent          = 12
boundaryTolerancePx   = 0.75
fullTraceDeclared     = true / false comparison
```

Classes remain:

- `GENERATED_UNMASKED`;
- `GENERATED_MASKED_RECOVERABLE`;
- `UNKNOWN`;
- `BOUNDARY`.

## Primary tests

1. all frozen source hashes match;
2. the input contains exactly eight gates and five unique clock IDs per gate;
3. every projected point is finite and deterministic;
4. gate and clock identity remain attached to every projection record;
5. mask classification covers every projected gate exactly once;
6. no classification overlap occurs;
7. switching `fullTraceDeclared` may change only inside-mask points from
   `GENERATED_MASKED_RECOVERABLE` to `UNKNOWN`; geometry must remain identical;
8. shuffled input rows reconstruct the same keyed projected records;
9. applying the mask does not mutate the source Five-H phase record;
10. a frozen `+1/8`-turn all-channel control must change at least one projected
    point by more than `1e-6 px`.

## Conditional mask-effect rule

If none of the eight frozen projected points intersects the frozen mask, the
classification remains valid but the H_Q-specific Full-Trace effect is
`NOT_EVALUABLE_NO_MASK_INTERSECTION`. The mask must not be moved or widened
after observing this result.

If inside-mask points exist, all and only those points must switch from
recoverable to unknown when the Full-Trace Gate is disabled.

## Information-loss rule

The source state has five phase coordinates and the projection record has two
coordinates. No inverse or decoder is declared. Therefore:

- the full keyed Five-H source record must be retained as provenance;
- `(x,y)` alone is classified `NON_INVERTIBLE_WITHOUT_DECLARED_DECODER`;
- equality or proximity in the projected plane does not establish source
  identity;
- no reconstruction advantage may be calculated from the projection alone.

Thread Loom 0.4 is used only as an independent control for this boundary: it
shows that distinct source identities may collapse in a projection while their
source records remain separate.

## Decision rules

- `PASS_SOURCE_BOUND_PIQ_MASK_COMPATIBILITY` if all ten primary tests pass.
- Append `MASK_EFFECT_EVALUABLE` or
  `MASK_EFFECT_NOT_EVALUABLE_NO_MASK_INTERSECTION` according to the frozen
  conditional rule.
- `FAIL` on hash drift, missing/duplicate keys, non-finite projection,
  geometry mutation, illegal class transition, order dependence or failed
  positive control.

## Exclusions

- Re-feed or feedback benefit;
- fitting a projection, decoder or mask;
- physical observation or measured astronomy;
- SCN/NCS292/404, E8/H4 or M-Class;
- identifying the Double-Cut native periods with the Five-H periods;
- claiming that a projected coincidence is a source identity.

## Stop rule

One primary run and two byte-identity replays. Stop after classification. A
feedback experiment requires a separately sourced state-update operator and a
new preregistration.
