# Multi-Timescale and Latency Boundary

## Admissible model

The candidate must distinguish preparation, execution, fast sensorimotor response, event timing, result evaluation and next-trial revision. These intervals overlap and vary with task, effector, stimulus, expertise and measurement definition.

| Layer | Operational boundary | Permitted inference |
|---|---|---|
| conscious goal/intention | Human-selected before or between attempts | owns task meaning and STOP; no neural localization |
| prepared feedforward plan | command available before relevant plant response | may dominate when little causal time remains |
| mechanical cascade | phase/event sequence in the frozen plant | conventional dynamics only |
| short/long-latency feedback | channel-specific signal available after declared delay | may change current movement if arrival plus actuator/plant response precedes endpoint |
| release/impact | hybrid event with localized pre/post state | terminates or changes controllability; does not erase prior path |
| visual result evaluation | frame-bound observation available after sensor/display delay | can inform current motion only while causal horizon remains |
| next-trial revision | map after result/residual record | may update a later plan; improvement is empirical |

## Physiological bounds

Long-latency upper-limb responses are often discussed in an approximately 50-100 ms epoch and can be task-sensitive, while one fast-reaching visual perturbation study observed responses on average around 160 ms. These are study-specific anchors, not constants ([Crevecoeur et al. 2013](https://pubmed.ncbi.nlm.nih.gov/23825396/); [Saunders & Knill 2003](https://pubmed.ncbi.nlm.nih.gov/12904935/)). Proprioceptive, tactile, vestibular and visual channels have different transduction, conduction, processing and action delays; a single undifferentiated `feedback latency` is inadequate.

For observation made at `t_o`, define:

    t_available,k = t_o + d_sensor,k + d_processing,k
    t_effect,k = t_available,k + d_actuation,k + d_plant,k

Channel `k` can materially affect a prerelease endpoint at `t_e` only if:

    t_effect,k < t_e

and the enabled controller has sufficient authority under the frozen work, torque, rate and contact bounds. Meeting this inequality permits an effect; it does not guarantee one.

## Evaluation of the proposed hypothesis

The statement

> The mechanical cascade may execute faster than conscious online correction, while slower sensory return updates the next action.

is admissible only as a conditional hypothesis:

> During a declared late movement interval, some consciously mediated or visual corrections may become available too late to affect release, while faster sensorimotor feedback may still contribute and the complete multisensory/result record may update a later attempt.

The stronger universal version is rejected. Fast feedback and rapid visual correction exist; `conscious`, `reflex` and `feedback` are not interchangeable latency bins. A sprint start is a prepared, signal-triggered whole-body act, not a pure reflex. Neuromuscular control combines prepared commands, feedback and state estimation and is not reducible to reflexes.

## Required latency record

Every specified run/condition must state: channel; perturbation/observation timestamp; sensor and computation delay; actuator/plant delay model; phase/event at arrival; remaining time to release/impact; controller enabled state; and whether information is used now, stored for next trial, or discarded.

`MULTI_TIMESCALE_MODEL_STATUS=PHYSIOLOGICALLY_BOUNDED_CONDITIONAL_SPECIFICATION_NOT_IMPLEMENTED`

