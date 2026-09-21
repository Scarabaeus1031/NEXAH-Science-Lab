# IEEE transfer gate

The existing IEEE geometry line is the strongest domain demonstrator, but its
maintained representation uses a standardized seven-feature state. AXIS08-QRR
must not manufacture an eighth feature merely to fit the operator name.

Phase B may pass only if source documentation independently supplies:

1. one eight-component state with stable units and provenance;
2. a domain-justified pair corresponding to positions 7 and 8;
3. a fixed weighting rule known before outcome comparison;
4. an inverse/reconstruction target with a meaningful error metric;
5. train/evaluation separation preserving IEEE-9 development and IEEE-14
   held-out evaluation;
6. classical baselines and the existing prohibited-claim boundary.

If any condition is absent, decision is
`STOP_NO_DOMAIN_JUSTIFIED_AXIS08_TRANSFER`.

Even after a pass, the permissible question is representation fidelity. It is
not stability prediction, early warning, risk estimation or control.

