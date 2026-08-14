# Negative-Result Architecture

## Status vocabulary

| Status | Meaning |
|---|---|
| `ACTIVE` | authorized work with satisfied gates |
| `CONDITIONAL` | coherent candidate with named unmet gates |
| `REDUCED_TO_PRIOR_ART` | observed concept is established in substance |
| `NOT_DISTINCT` | strongest comparison removes the claimed NEXAH-specific difference |
| `FAILED` | frozen test rejected the claim |
| `FROZEN` | no execution or extension until explicit reopening conditions are met |
| `RETIRED` | claim/label must not return as current evidence |
| `AWAITING_EXTERNAL_ANCHOR` | only independent task-owner action can reopen |

## Applied decisions

- Exact Translation Fidelity hierarchy: `FAILED` and `RETIRED` as decoder-independent claim.
- General robustness/discrimination principle: `REDUCED_TO_PRIOR_ART`.
- Internal translation branch: `FROZEN` after bounded completion.
- Legacy Morse/Lyapunov semantics: `RETIRED`; proxy implementations preserved historically.
- T02: `FROZEN`, `AWAITING_EXTERNAL_ANCHOR`.
- ORION as NEXAH validation: `FROZEN`; external application `AWAITING_EXTERNAL_ANCHOR`.
- Early-warning, prediction, control, and universal invariance: `RETIRED` as current claims unless new independent evidence passes fresh gates.

Negative results are durable evidence about boundaries. They must retain protocol, outcome, reason, strongest falsifier, and reopening condition. Replacing them with a renamed nearby hypothesis would destroy information and recreate researcher degrees of freedom.

`NEGATIVE_RESULTS_PRESERVED = YES`

