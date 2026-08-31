# Neutral Relabel Control

Remove RETURN, RESET, RESTART, RNJ, NRJ, NRG, ENERGY and NEXAH. Use:

```text
states S0,S1,S2
maps A,B,C,D
events e1,e2,e3,e4
executions r1,r2
histories H0,H1,H2
provenance records p1,p2
```

The conclusions survive:

- `B(A(S0))=S0` can hold while `[e1,e2] != []`;
- assigning selected fields to reference values does not erase events;
- a new execution with equal start values is not the previous execution;
- equal rule/input/output does not identify events;
- a reconstructed state can equal a stored representation without becoming the original event;
- equal endpoints do not identify paths or provenance;
- quotient equivalence does not identify numerical representatives.

`NEUTRAL_RELABEL_SURVIVES=YES`

The boundaries are type- and provenance-dependent, not label-dependent.
