# 03 — Brush / Stroke Production Control

## Bounded tradition

This control is restricted to Chinese brush calligraphy, with one Smithsonian running-style example used only to test trace evidence. It does not generalize to East Asian cognition or culture.

## Typed production chain

| Object or property | Type/status | Evidence |
|---|---|---|
| flexible hair brush | production tool | B3 |
| brush hairs/bristles | physical tool components | B2/B3 |
| ink/moisture | medium state | B1/B2/B3 |
| paper/silk | substrate | B2/B4 |
| speed, pressure, direction, angle, lift/contact | gesture/process parameters | B1/B2/B3 |
| stroke execution | event/process segment | B1/B3/B4 |
| deposited ink | visible trace/mark | B1–B4 |
| recognized stroke shape | form | B1/B3 |
| stroke in a prescribed character sequence | system unit or component, context-dependent | B1/B3/B4 |
| character | higher orthographic unit | B1/B3 |
| reading/function | contextual value | not inferred from shape in this control |

## Component-count control

A brush is physically composite. B2 describes changes in how many bristles touch the paper and shows that varying ink gradations may occur within one brushstroke. Therefore physical tool-component count does not determine representational component count:

```text
BRUSH_HAIR_COUNT != STROKE_COUNT
BRISTLE_CONTACT_PATTERN != ORTHOGRAPHIC_UNIT_COUNT
MANY_PHYSICAL_COMPONENTS_CAN_PARTICIPATE_IN_ONE_RECOGNIZED_STROKE=YES
```

This is a role distinction, not symbolic multiplicity.

## Event and trace

Pressure, speed, ink loading, moisture, angle and tip/side use affect the visible trace. Prescribed stroke order and trace shape let a knowledgeable observer recover some movement evidence. B4 explicitly describes following motion and pauses from the trace. But none of the sources warrants unique recovery of every pressure, speed, contact or timing value.

```text
EVENT_EQUALS_TRACE=NO
TRACE_CONTAINS_EXECUTION_EVIDENCE=YES
EXECUTION_HISTORY_FULLY_RECOVERABLE_FROM_FORM=NO
```

## Effect on SFM

The trace can instantiate `MARK`; its recognized shape is `FORM`; a stroke or character can be a system `UNIT` at different levels; reading/function is `VALUE`. The four-type stack remains valid for the static documentary question. It is insufficient by itself for production-history questions, so `PROCESS`, `EVENT`, `TEMPORAL_ORDER` and `PROVENANCE` are required domain extensions or fields.

