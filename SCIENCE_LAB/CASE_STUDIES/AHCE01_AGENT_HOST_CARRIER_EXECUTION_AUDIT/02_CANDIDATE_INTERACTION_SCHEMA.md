# AHCE-01 — Candidate Interaction Schema

## Result

The proposed record has a useful common documentary core, but **material domain extensions are mandatory**. `domain_fields` is an extension container, not a new NVC-01 type.

## Field classification

| Field | Default class | Bounded function |
|---|---|---|
| `record_id` | REQUIRED | Unique documentary identifier. |
| `source_domain` | REQUIRED | BIOLOGY, MEDICINE, SOFTWARE, or NULL_CONTROL. |
| `entity_or_artifact` | REQUIRED | The acting/observed entity or stored artifact; not automatically an agent. |
| `entity_kind` | REQUIRED | Domain-specific kind. |
| `origin_relation` | REQUIRED | External, internal lineage, created artifact, or passive record origin. |
| `carrier` | REQUIRED | Physical/logical bearer when defined; may equal entity only with typed justification. |
| `carrier_kind` | REQUIRED | Cell, virion/genome-containing particle, tissue lineage, storage medium, etc. |
| `host` | CONDITIONAL | Biological host/host cell when applicable. |
| `host_kind` | CONDITIONAL | Organism/cell/tissue host type. |
| `environment` | REQUIRED | Physical, biological, or technical setting. |
| `interface_or_entry_boundary` | CONDITIONAL | Entry/contact/runtime interface when evidenced. |
| `information_present` | REQUIRED | True/false/unknown; presence is not execution. |
| `information_identity` | CONDITIONAL | Genome, program/model, mutation/regulatory record, etc. |
| `execution_present` | REQUIRED | True/false/unknown; independent of stored information. |
| `execution_environment` | CONDITIONAL | Host-cell machinery, cellular metabolism, runtime/hardware, or N/A. |
| `execution_dependency` | CONDITIONAL | Resources/machinery required for the registered process. |
| `replication_present` | REQUIRED | True/false/unknown; state change is not enough. |
| `replication_mode` | CONDITIONAL | Cell division, host-dependent viral propagation, software copy, etc. |
| `transformation_or_state_change` | CONDITIONAL | Observed/registered change distinct from replication. |
| `retained` | REQUIRED | What the record says persisted. |
| `lost` | REQUIRED | What the record says was lost. |
| `introduced` | REQUIRED | What appeared in the interaction/record. |
| `unresolved` | REQUIRED | Unknowns and untyped claims. |
| `trace` | REQUIRED | Attested event record or NOT_ATTESTED. |
| `provenance` | REQUIRED | Source/lineage/evidence origin; not event trace. |
| `evidence_status` | REQUIRED | Source strength and observation/mechanism boundary. |
| `authorization_status` | CONDITIONAL | Mandatory for software/AI; N/A for biological cases unless governance is at issue. |
| `claim_boundary` | REQUIRED | Explicit nonclaim and scope. |
| `domain_fields` | DOMAIN_SPECIFIC | Typed extension container; required where common fields cannot preserve essential distinctions. |

## Null and typing rules

- `NOT_APPLICABLE` is a distinct tagged value, never encoded as `false`, `0`, or an empty string.
- Boolean fields admit `UNKNOWN` where evidence is incomplete.
- `trace = NOT_ATTESTED` is not an invented trace.
- Agent status is not inferred from entity presence.
- Execution and replication are independent fields.

## Mandatory domain extensions

- Bacterium: strain/organism, colonization/infection/pathogenicity classification, growth conditions.
- Virus: viral genome/carrier, host cell, entry mechanism if sourced, replication dependency, expressed products.
- Cancer: source tissue/lineage, regulatory alteration, proliferation, invasion, dissemination/metastasis.
- Fungus: organism/strain, substrate, exposure, comparator, growth/function observation.
- Software/AI: artifact identity, storage, runtime, hardware, inputs, execution, outputs, authorization boundary.
