# External Tolerance Requirements

## Spacecraft attitude

`SOURCE_FACT`: ECSS-E-ST-60-10C defines absolute, relative, drift and
reproducibility performance-error classes for pointing
([ECSS-E-ST-60-10C](https://ecss.nl/wp-content/uploads/2008/11/ECSS-E-ST-60-10C%2815November2008%29.pdf)).
ECSS-E-ST-60-30C provides mission/project requirement templates for attitude
knowledge/performance with a confidence level, but uses mission-tailored `TBS`
values rather than one universal tolerance
([ECSS-E-ST-60-30C](https://ecss.nl/standard/ecss-e-st-60-30c-satellite-attitude-and-orbit-control-system-aocs-requirements/)).

Classification:

- existence and form of pointing/knowledge requirements:
  `EXTERNALLY_ESTABLISHED`;
- a numerical `tau_task` applicable to this platform:
  `EXTERNALLY_MOTIVATED_BUT_NOT_FIXED`.

## Stabilized antenna pointing

`SOURCE_FACT`: ETSI EN 301 360 specifies a fixed-satellite antenna pointing-
accuracy capability of 0.1 degrees or a declared value constrained by beamwidth
and emission-mask compliance
([ETSI EN 301 360](https://www.etsi.org/deliver/etsi_EN/301300_301399/301360/02.01.01_60/en_301360v020101p.pdf)).

`AUDIT_INFERENCE`: this is a real external one-/two-axis tolerance, but it applies
to the specified fixed-satellite terminal class. It cannot be imported into an
unrelated optical-inertial tracker without an antenna task owner and matching
environment.

## Optical tracking qualification

`SOURCE_FACT`: ASTM E3064 defined relative 6DOF pose-error tests but was withdrawn
in 2025; ASTM has an active reinstatement work item
([ASTM E3064 status](https://store.astm.org/Standards/E3064.htm),
[WK95304](https://store.astm.org/products-services/standards-and-publications/standards/workitem-wk95304)).
The test method lets users compare measured performance with their own application
requirements; it does not supply those limits.

Conclusion: externally established tolerance frameworks exist, and one adjacent
antenna standard contains a numerical limit, but no independently authorized
`tau_task` currently applies to the proposed primary landing.

