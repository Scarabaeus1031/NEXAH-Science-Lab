# Signed Axis Audit

For a real coordinate `x` with selected zero/reference:

- `x<0`: negative side;
- `x=0`: reference value in this coordinate;
- `x>0`: positive side.

This uses the order of the real numbers and the selected coordinate orientation. It does not assign moral, physical, or symbolic meaning.

## Sign-reversal control

Under `S(x)=-x`:

- negative and positive coordinate labels exchange;
- zero is fixed;
- equality and absolute distance from zero survive;
- the represented point need not move if the operation is a passive coordinate reversal;
- the point does move to its reflected point if the operation is an active reflection.

The active/passive role must therefore be declared.

Results:

- `NEGATIVE_REQUIRES_ORDER_OR_ORIENTATION=YES`
- `POSITIVE_REQUIRES_ORDER_OR_ORIENTATION=YES`
- `SIGN_DEPENDS_ON_CHOSEN_COORDINATE_CONVENTION=YES_IN_COORDINATE_REPRESENTATION`
- `VALUE_EQUALS_SIGN=NO`
- `SIGN_EQUALS_DIRECTION=NO`

