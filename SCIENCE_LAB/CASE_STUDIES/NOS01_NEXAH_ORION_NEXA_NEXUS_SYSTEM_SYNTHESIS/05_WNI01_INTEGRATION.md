# WNI-01 Integration

WNI-01 is a concrete bounded answer to “what survives a change of representation?”

For closed ordered curves with a reference point off the curve and declared orientation, winding number survived translation, rotation and positive scaling; reflection changed the sign predictably. In tested Q7/Q11/Q13/Q17 representations, winding was recoverable when order, closure, reference and sufficient representation capacity were retained. Exact coordinates did not return: winding recovery therefore did not imply geometric identity.

The failure controls matter equally. Sector collapse, lost order, lost closure, cropping, inadequate documentation or a reference on the curve prevented a valid claim. Thus:

- `CURVE != REPRESENTATION`
- `REPRESENTATION != INVARIANT`
- `GRID_SIZE != WINDING`
- `PRIME_STATUS != WINDING`
- `GEOMETRIC_ERROR != TOPOLOGICAL_ERROR`
- `WIND != WINDING`
- `RETURN_OF_W != RETURN_OF_EXACT_COORDINATES`

WNI-01 supports conditional invariant recovery under an explicit contract. It does not establish a universal orientation law, prime-grid topology or a general ORION capability.

