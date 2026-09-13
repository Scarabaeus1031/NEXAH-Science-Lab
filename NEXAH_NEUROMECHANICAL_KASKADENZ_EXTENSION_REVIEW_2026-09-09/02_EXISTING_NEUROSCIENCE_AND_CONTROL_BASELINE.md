# Existing Neuroscience and Control Baseline

## Currentness result

All scientific mechanisms needed for the bounded architecture already exist as standard motor-control, neuroscience, biomechanics and control concepts. The novelty candidate is only their explicit NEXAH audit binding. No search result supports a new physical or neural mechanism.

| Topic | Established baseline | Evidence type | Boundary for this review |
|---|---|---|---|
| Motor planning and internal models | Prepared commands and internal state predictions can support planning, state estimation and learning. | Primary human experiment: [Wolpert, Ghahramani & Jordan 1995](https://pubmed.ncbi.nlm.nih.gov/7569931/) | `z` is an abstract control state, not a localized brain module. |
| Feedforward plus feedback | Rapid action need not be purely open-loop; task-relevant deviations can be corrected while redundant variability is tolerated. | Formal theory plus experiments: [Todorov & Jordan 2002](https://www.nature.com/articles/nn963) | No optimality claim is made for the candidate controller. |
| Fast sensorimotor feedback | Long-latency upper-limb responses around 50-100 ms can scale with task urgency. | Primary experiments: [Crevecoeur et al. 2013](https://pubmed.ncbi.nlm.nih.gov/23825396/) | Range is task-, effector- and perturbation-dependent, not a universal constant. |
| Visual online correction | Fast reaches can use continuous vision; one experiment detected average corrections about 160 ms after perturbation. | Primary human experiment: [Saunders & Knill 2003](https://pubmed.ncbi.nlm.nih.gov/12904935/) | A visual result cannot be assumed to affect a release when insufficient time remains. |
| Proprioception | Muscle spindles and skin stretch contribute to limb position and movement senses; motor-command signals also matter. | Authoritative physiological review: [Proske & Gandevia 2009](https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/jphysiol.2009.175372) | Proprioception is not a single scalar channel. |
| Tactile/contact return | Cutaneous and proprioceptive streams jointly inform body-environment interaction and motor control. | Current authoritative review: [Tuthill et al. 2025](https://doi.org/10.1146/annurev-neuro-112723-042229) | Tactile observation carries information; actuator work remains mechanically separate. |
| Vestibular orientation | Vestibular, visual and somatosensory cues contribute to self-motion/orientation and motor control. | Authoritative review: [Lackner & DiZio 2005](https://doi.org/10.1146/annurev.psych.55.090902.142023) | No vestibular signal is inferred from a picture or glyph. |
| Gaze and target landmarks | Gaze can fixate task-critical landmarks and precede manipulation subgoals. | Primary experiment: [Johansson et al. 2001](https://pubmed.ncbi.nlm.nih.gov/11517279/) | Gaze does not equal intention and does not uniquely determine a motor plan. |
| Sprint start | A sprint start is a signal-triggered, prepared whole-body motor act with separable premotor and motor intervals. | Primary sport experiment: [Ille et al. 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6316484/) | It is not a pure reflex; reflex contribution does not reduce the whole act to reflex. |
| Ground reaction and center of pressure | A force plate resolves force components, point of application/CoP and a free moment; torque depends on reference point and lever arm. | Technical biomechanics source: [Robertson, Force Platforms](https://people.umass.edu/~gc/protected/Robertson_Force.pdf) | A GRF magnitude alone is insufficient for segment torque. |
| Muscle activation and joint torque | Muscle activation produces force through activation/contraction dynamics; net joint torque is a model-dependent aggregate and inverse dynamics does not identify unique muscle forces. | Textbook/standard biomechanics | The minimum extension uses an abstract bounded torque input, not a muscle-level human simulation. |
| Constrained multibody dynamics | Mass matrix, Coriolis/centrifugal terms, gravity, constraints, contact and hybrid events are conventional mechanics. | Standard analytical mechanics/control | No anatomy is merged into one rigid part. |
| Joint power, work and angular impulse | Power is torque dot angular velocity; work and angular impulse require declared frames and intervals. | Textbook standard | Timing cannot conceal uncounted work or momentum. |
| Variable stiffness/damping | Time-varying impedance is standard, but changing stiffness opens an energy port. | Standard control/mechanics; predecessor formalization | `1/2 phi^T K_dot phi` is mandatory. |
| Motor equivalence/UCM | Variability may be structured so task-relevant variables are stabilized while redundant dimensions vary. | Primary framework: [Scholz & Schöner 1999](https://doi.org/10.1007/s002210050738) | Elbow constraint is a testable variability hypothesis, not elimination of path/face error. |
| Post-result revision | Sensory prediction error can drive trial-to-trial motor adaptation. | Primary experiment: [Tseng et al. 2007](https://doi.org/10.1152/jn.00266.2007) | The review specifies a revision variable; it does not attribute a neural locus or learning law. |

## Classification rule

- **Textbook standard:** mechanics, feedback, work, delay and hybrid-state notation.
- **Primary finding:** the bounded empirical observations cited above.
- **NEXAH synthesis:** the auditable ordering and mappings in files 03-06.
- **Untested hypothesis:** transfer-corridor, elbow-variability, current-release and next-trial benefit questions.

## Mandatory physiological corrections

Neuromuscular control is not reducible to reflexes. A prepared feedforward plan, state estimation, spinal and long-latency feedback, task-dependent correction and later learning can coexist. Likewise, hands and grip are local interfaces in a multisegment system; they do not alone generate all distal speed.

`EXISTING_SCIENCE_COVERAGE=COMPLETE_FOR_BOUNDED_SPECIFICATION_NO_NEW_SCIENCE_REQUIRED`

