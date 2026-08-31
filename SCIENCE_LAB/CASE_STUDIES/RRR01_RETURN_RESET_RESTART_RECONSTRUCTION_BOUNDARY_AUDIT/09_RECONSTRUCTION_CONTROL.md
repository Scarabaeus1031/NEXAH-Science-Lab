# Reconstruction Control

Register an original history:

```text
X0 --e1--> X1 --e2--> X2.
```

Store sufficient state/provenance records to reconstruct the represented fields of `X1`. Later reconstruction event `eR` produces `X1'`.

If the declared state representation satisfies `X1'=X1`, then state reconstruction succeeds. Nevertheless:

- `X1'` is a later result object with its own ID;
- `eR` is not original event `e1`;
- original chronological history is not reversed;
- reconstruction provenance references surviving evidence and the reconstruction rule.

`RECONSTRUCTION_CONTROL_PASSED=YES`

`STATE_RECONSTRUCTION_SUCCESS=YES_UNDER_DECLARED_REPRESENTATION`

`RECONSTRUCTION_EQUALS_ORIGINAL_EVENT=NO`

`RECONSTRUCTION_EQUALS_HISTORY_REVERSAL=NO`

Reconstructable state content is not the same claim as attested original event identity.
