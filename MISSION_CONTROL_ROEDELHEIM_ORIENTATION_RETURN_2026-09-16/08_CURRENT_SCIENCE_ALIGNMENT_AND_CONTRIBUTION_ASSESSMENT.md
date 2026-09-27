# NEXAH current-science alignment and contribution assessment

Assessment date: 2026-09-16  
Mode: targeted primary-literature alignment; not a systematic review  
Operational effect: `NONE`  
Science Lab effect: `NONE`

## Short answer

NEXAH is currently best described as an **observer-aware representation,
identifiability and provenance research architecture**.

It studies how distinctions in a source are preserved, collapsed, hidden or
made unavailable when the source passes through one or more observation maps,
records, masks and transformations, while retaining source identity and a path
back to the originating evidence.

NEXAH is not currently:

- a new physical theory;
- a new mathematical field;
- a validated universal algorithm;
- an externally established scientific contribution;
- an operational decision system.

It is more than an unstructured private pastime because it contains bounded
questions, implementations, tests, negative results, provenance records and
explicit non-claims. It is not yet a scientific contribution in the external
sense because no narrow novel result has completed frozen protocol, independent
reproduction, external comparison, peer criticism and public release.

Current classification:

```text
PRIVATE RESEARCH PROGRAM WITH RESEARCH-GRADE COMPONENTS
POTENTIAL CONTRIBUTION PATH IDENTIFIED
EXTERNAL SCIENTIFIC CONTRIBUTION NOT YET ESTABLISHED
```

## Scientific translation

| NEXAH working term | Established scientific language |
| --- | --- |
| source / field | latent state, object, model state or source space |
| observer cut | observation operator, measurement map or partial view |
| representation | measured record, feature map or encoded view |
| collapse | non-injectivity, equivalence class or non-identifiability |
| retained difference | distinguishability or identifiable component |
| Moving Mask | time-varying or intermittent observation model |
| joint / seam | declared interface, transition or representation boundary |
| memory | ordered retained records, state history or provenance graph |
| return to source | reconstruction check, cycle comparison or provenance trace |
| Ghostgrid | reference/projection architecture, not a physical field |

## Alignment with current science

### 1. Multi-view identifiability

Current multi-view representation research asks which latent components are
identifiable from several partially observed views. Yao et al. provide a 2024
framework and identifiability results for nonlinear partial views. This is a
more general and mathematically stronger setting than NEXAH's present finite
orthographic example.

Source: [Multi-View Causal Representation Learning with Partial
Observability, ICLR 2024](https://proceedings.iclr.cc/paper_files/paper/2024/hash/956e5427549a82a7472e02adc88360e9-Abstract-Conference.html).

**Implication:** NEXAH's multiple-map idea belongs to an active and legitimate
field, but the general idea is not novel. NEXAH must contribute a bounded
result, benchmark, protocol or tool rather than claim the field itself.

### 2. Observation-operator choice and model error

Modern inverse-problem research explicitly analyzes the composition of model
and observation operator and asks how operator choice affects inference under
model discrepancy. Cvetkovic et al. derive criteria for choosing observation
operators that mitigate model error in Bayesian inverse problems.

Source: [Choosing Observation Operators to Mitigate Model Error in Bayesian
Inverse Problems, SIAM/ASA JUQ 2024](https://epubs.siam.org/doi/10.1137/23M1602140).

**Implication:** NEXAH's insistence that source, observation map and record stay
separate is scientifically well founded. To advance the field, it would need a
quantitative operator-selection or error result, not only the separation rule.

### 3. Indirect measurements and equivariance

Beckmann and Heilenkotter study neural architectures acting directly on
indirect measurements and formally relate forward measurement operators to
group representations and equivariance.

Source: [Equivariant Neural Networks for Indirect Measurements, SIAM Journal
on Mathematics of Data Science 2024](https://epubs.siam.org/doi/10.1137/23M1582862).

**Implication:** NEXAH's orientation and representation questions connect to
operator equivariance, but no new equivariant architecture or theorem is
currently present in NEXAH.

### 4. Intermittent observation and state estimation

Current control research gives precise observability criteria and estimators
for event-driven and incomplete sensor records. Liu et al. define
epsilon-observability and construct a multisensor estimator using both received
events and information implicit in no-event intervals.

Source: [State Estimation with Event Sensors: Observability Analysis and
Multi-sensor Fusion, SIAM JCO 2024](https://epubs.siam.org/doi/abs/10.1137/22M1539204).

**Implication:** the NEXAH Moving-Mask direction is scientifically legitimate,
but should be expressed as an intermittent-observation benchmark against
ordinary state-estimation baselines. A new label is not a contribution.

### 5. Reproduction, replication and provenance

Current methodology distinguishes reproduction with the original
implementation, replication with another implementation and reevaluation on
different data. This matches NEXAH's strongest governance instincts: frozen
inputs, independent implementations, failed replays and bounded claims.

Source: [Reproduce, Replicate, Reevaluate, AAAI
2024](https://ojs.aaai.org/index.php/AAAI/article/view/29515).

Recent workflow research also formalizes reproducibility tenets, provenance
capture and cryptographic execution signatures.

Source: [Formal definition and implementation of reproducibility tenets for
computational workflows, Future Generation Computer Systems
2025](https://www.sciencedirect.com/science/article/pii/S0167739X24006484).

The 2026 landscape is more demanding still. Universal Workflow Language now
offers a field-agnostic graph representation for scientific protocols, and
Workflow Run RO-Crate already records interoperable execution provenance across
multiple workflow systems.

Sources: [Universal workflow language and software enable geometric learning
and FAIR scientific protocol reporting, Joule
2026](https://www.sciencedirect.com/science/article/pii/S2542435126000012) and
[Recording provenance of workflow runs with
RO-Crate](https://pmc.ncbi.nlm.nih.gov/articles/PMC11386446/).

**Implication:** provenance discipline is a genuine NEXAH strength, but it is an
established and rapidly advancing research and engineering area. Innovation
would require a concrete schema, validator or cross-system result beyond
internal documentation and a direct comparison against UWL, RO-Crate and W3C
PROV-style models.

## Novelty assessment

| Layer | Current assessment |
| --- | --- |
| physical theory | not supported |
| general mathematical theory | not present |
| new observation or projection operator | not present |
| new estimator class | not present |
| finite synthetic identifiability example | present; bounded and elementary |
| reproducibility/provenance architecture | substantial internal implementation; external novelty untested |
| visual and conceptual synthesis | distinctive design language; not scientific novelty by itself |
| external validation | absent |
| peer-reviewed contribution | absent |

The finite four-projection example is a valid inverse-problem teaching and
control object. By itself it is probably too elementary for a strong
mathematical novelty claim because its collapse structure follows directly
from kernels of declared linear projections. Its value rises if it becomes a
rigorous benchmark for identity retention, missingness, tolerance handling and
reproducible claim boundaries.

## Most credible innovation thesis

The most defensible future NEXAH thesis is:

> A provenance-aware control layer for testing which source distinctions
> survive, collapse or become unavailable across multiple observer-dependent
> representations, with explicit identities, missingness semantics, claim
> ceilings and return-to-source checks.

This is an integration thesis, not yet a novelty claim. It becomes innovative
only if NEXAH demonstrates a measurable advantage over existing workflow,
provenance, inverse-problem or multi-view tools on declared tasks.

## Application position

### Defensible now, within narrow boundaries

1. reproducible benchmark geometry and provenance analysis;
2. deterministic comparison of representation maps;
3. synthetic demonstrations of observation-induced collapse;
4. structural graph inspection over declared inputs;
5. deterministic artifact and evidence processing;
6. research navigation with explicit source, claim and failure boundaries.

These are research instruments and engineering demonstrations, not validated
domain decision systems.

### Promising, but requiring validation

1. **Multi-sensor observability audit** — identify what each sensor or view can
   and cannot distinguish.
2. **Intermittent-observation benchmark** — compare ordinary filters and
   estimators under controlled missingness schedules.
3. **Representation-loss test harness** — quantify task-relevant loss across
   transforms after a loss functional and equivalence rule are frozen.
4. **Scientific workflow provenance** — machine-readable claim/source/run
   graphs with cryptographic bindings and independent replay checks.
5. **Human-facing orientation cartography** — test whether structured evidence
   maps improve navigation, error detection or decision quality for readers.

### Not currently supportable

- operational power-system control or early warning;
- medical, safety-critical or autonomous decisions;
- claims of hidden physical structure;
- universal information or orientation laws;
- causal conclusions from visual or numerical resemblance;
- production claims without external datasets, users and domain owners.

## Three realistic contribution routes

### Route A — finite inverse-problem benchmark

Freeze and independently reproduce the four-source/four-view identifiability
classification, including exact or tolerance-based equivalence, analytic
derivation, implementation agreement and negative controls.

Likely output: reproducibility or methods note, teaching benchmark, or appendix
to a broader paper.  
Risk: scientifically correct but too elementary as a standalone novelty.

### Route B — observer-aware provenance schema and validator

Formalize source, observation operator, record, mask, failure, claim and return
as a machine-readable schema; implement validation; compare with UWL,
Workflow Run RO-Crate and W3C PROV-style models on at least two independent
systems.

Likely output: research-software or reproducible-workflow contribution.  
Risk: novelty depends on demonstrated functionality not already supplied by
existing provenance systems.

### Route C — intermittent-observation estimator benchmark

Turn Moving Mask into a conventional, preregistered benchmark with ordinary
estimators, observation schedules, uncertainty, baselines and held-out cases.

Likely output: applied state-estimation benchmark or negative/limiting result.  
Risk: greatest implementation and review burden; no new estimator is presently
available.

## Required threshold for “research contribution”

NEXAH crosses from private research program to externally defensible research
contribution only when one narrow unit has all of the following:

1. a question stated entirely in established scientific language;
2. an explicit object, domain, forward map and observable;
3. a falsifiable hypothesis or classification rule;
4. frozen inputs, code, environment, tolerance and metrics;
5. standard baselines and negative controls;
6. a retained positive, negative, inconclusive or invalid-protocol result;
7. independent reproduction or adversarial review;
8. comparison with current primary literature;
9. public or reviewable release authority;
10. claims no broader than the evidence.

## Final classification

```text
WHAT_IS_NEXAH:
  observer-aware representation, identifiability and provenance architecture

SCIENTIFIC_HOME:
  inverse problems / state estimation / multi-view representation /
  formal provenance / reproducible computational science

STATUS_TODAY:
  private research program with research-grade components

SCIENTIFIC_CONTRIBUTION_TODAY:
  not yet externally established

INNOVATION_POTENTIAL:
  credible at the integration, protocol and research-tooling layer

BEST_FIRST_CONTRIBUTION:
  one independently reviewed finite identifiability and provenance benchmark

ACTIVE_AUTHORIZATION:
  none; Science Lab remains frozen
```
