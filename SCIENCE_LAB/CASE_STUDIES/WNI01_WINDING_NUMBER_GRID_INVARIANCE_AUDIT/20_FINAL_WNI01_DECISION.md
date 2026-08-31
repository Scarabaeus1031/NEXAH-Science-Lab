# Final WNI-01 decision

## Decision

B_STANDARD_WINDING_RULES_RECOVERED_GRID_PRESERVATION_CONDITIONAL

The standard winding number is operational with a closed ordered curve, reference off the curve, and declared traversal. Translation, rotation, and positive scaling preserve signed W. Reflection reverses sign and preserves magnitude. Q-Mirror is not a generic reflection: about 0 it negates W, while a finite transformed reference follows W(QC,Qp)=W(C,p)-W(C,0); singular curves are rejected.

With radius, order, closure, reference, and provenance retained, Q7/Q11/Q13/Q17 preserved W for valid controls C0–C5. This is conditional recovery, not prime/grid topology. Roundtrips returned W despite coordinate error. One-sector collapse lost winding; two-sector, shuffled, open, cropped, and underdocumented cases failed closed.

Historical winding vocabulary is materially attested, but no inspected source maps +11 WIND to winding. WFR-01 remains unchanged. Existing types suffice; no schema, operator, theory, implementation, ORION, Rust, or research delta exists.

WNI-01 is closed. Next action: STOP.
