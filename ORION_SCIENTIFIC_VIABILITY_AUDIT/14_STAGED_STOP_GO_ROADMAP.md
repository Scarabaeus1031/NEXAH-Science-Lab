# Staged Stop/Go Roadmap

| Stage | Question | Go evidence | Stop condition |
|---|---|---|---|
| A — geometry | can calibrated fiducials reconstruct `SO(3)` pose? | traceable angular error/coverage across frozen motion envelope | degeneracy or calibration error exceeds task tolerance |
| B — fusion | does optical+IMU improve bounded-latency estimation over strongest filters/smoother? | prospective error, calibration or latency benefit | no benefit beyond competent conventional method |
| C — dropout | do predicted unobservable directions and uncertainty match sensor-loss behavior? | correct coverage and legitimate `UNKNOWN` | unsafe confident estimates or artificial dropout question |
| D — decision | does calibrated abstain/remeasure reduce external loss? | owner-fixed loss and held-out advantage/equivalence result | no external loss contract or cost-selected conclusion |
| E — free motion | does a gimbal/probe introduce a useful physical dynamics question? | measured plant model and need unmet by rotary stage | friction/backlash/cable torque dominate or no scientific increment |
| F — multimodal | do additional channels independently constrain the expanded state/task? | observation-rank/information and task benefit | channels only report nuisance or duplicate existing sensors |

Full compass geometry is not the default endpoint. It may return after Stage E
only if its dynamics are the object of study. Magnetic suspension and magnetic
sensing require separate incompatible-risk gates. Triple beams require a direct
head-to-head design test against the fiducial geometry before adoption.

## Prior-art and novelty classification

| Contribution class | Current classification |
|---|---|
| instrument novelty | unusual visual/mechanical arrangement; function unvalidated |
| measurement novelty | not established; camera pose, IMU fusion and dropout are standard |
| algorithmic novelty | not established; strongest conventional estimators subsume current description |
| scientific novelty | not established; observability, sensor fusion and selective action are mature topics |
| systems contribution | possible: reproducible integration and failure-oriented benchmark |

A strong systems contribution is sufficient, but only after measurement accuracy,
calibration, comparators and external decision value are demonstrated.

