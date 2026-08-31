# AHCE-01 — Case Typing Matrix

Legend: **R** required, **C** conditional, **D** domain-specific, **N/A** not applicable.

| Case | Entity / origin | Carrier | Host | Execution environment | Replication | Required domain distinction | Common record fit |
|---|---|---|---|---|---|---|---|
| A Bacterium | Cellular organism; external/environmental or resident | Bacterial cell | C when interaction studied | Cellular metabolism + environment | R, conditional on conditions | colonization ≠ infection ≠ pathogenicity | PARTIAL_WITH_D |
| B Virus | Acellular infectious entity; usually external to target cell | Virion/genome carrier | R host cell | Host-cell machinery plus virus-specific factors | R when propagation observed | viral information ≠ host execution | PARTIAL_WITH_D |
| C Cancer cell | Altered internal cell lineage | Cell/tissue lineage | R host organism | Cellular/tissue environment | R proliferation status | proliferation ≠ invasion ≠ dissemination; internal ≠ external | PARTIAL_WITH_D |
| D Fungus | Cellular organism; environmental/host-associated | Fungal cell/mycelium | C | Cellular metabolism + substrate/environment | R when growth observed | growth ≠ colonization ≠ infection ≠ symbiosis | PARTIAL_WITH_D |
| E Software/AI | Created technical artifact | Storage medium/model files | N/A biologically | R runtime + hardware + energy/interfaces | C copying only; execution is not replication | artifact ≠ execution ≠ output ≠ authority | PARTIAL_WITH_D |
| F Passive record | Stored information; no acting entity inferred | Storage medium | N/A | N/A | FALSE | information present without execution or agency | FULL_NULL_FIT |

## Representative bounded records

### A — bacterium
`information_present=TRUE`, `execution_present=TRUE` for cellular processes, `replication_present=UNKNOWN/CONDITIONAL`, `origin_relation=EXTERNAL_OR_RESIDENT_AS_SOURCED`; infection status is not inferred from presence.

### B — virus
`information_present=TRUE`, `carrier=VIRION/GENOME`, `host=HOST_CELL`, `execution_environment=HOST_CELL_MACHINERY`, `replication_present=ONLY_IF_ATTESTED`; viral information and host execution remain separate.

### C — cancer cell
`origin_relation=INTERNAL_CELL_LINEAGE`, `host=HOST_ORGANISM`, separate domain fields for proliferation, invasion, dissemination and metastatic growth; no external-agent classification.

### D — fungus
`entity_kind=CELLULAR_FUNGUS`, separate environment/substrate/exposure/comparator fields. Radiation study supports a bounded growth/electronic-melanin observation, not photosynthesis or carbon fixation.

### E — software/AI
`information_present=TRUE` for stored code/model; `execution_present=TRUE` only with an attested runtime event; output and authorization are separate; no agency or biological infection inferred.

### F — null control
```text
information_present=TRUE
execution_present=FALSE
host_interaction=FALSE
replication_present=FALSE
trace=NOT_ATTESTED
inferred_agency=FALSE
```
