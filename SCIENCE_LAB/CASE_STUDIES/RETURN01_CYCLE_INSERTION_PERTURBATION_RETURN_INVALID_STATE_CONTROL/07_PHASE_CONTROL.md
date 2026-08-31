# Phase Control

For an explicitly periodic system of period `P`, define `phi(t)=t mod P`. With declared offset `Delta`, define `phi'(t)=(t+Delta) mod P`.

Two independent controls follow:

1. A displayed/observed state may be constant while `phi'(t) != phi(t)`. Thus the same observation need not identify phase.
2. Two full states may share phase while another state field, such as residual or amplitude, differs. Thus phase equality need not identify full state.

An insertion can shift index and hence phase in an index-based periodic model without changing a later object's identity. Whether phase is part of full state must be declared in the state schema.

- `SAME_OBSERVED_STATE_IMPLIES_SAME_PHASE=NO`
- `SAME_PHASE_IMPLIES_SAME_FULL_STATE=NO`
- `PHASE_DISTINCT_FROM_FULL_STATE=YES`
- `PHASE_OFFSET != NEW STATE` unless phase is included in the declared state.

