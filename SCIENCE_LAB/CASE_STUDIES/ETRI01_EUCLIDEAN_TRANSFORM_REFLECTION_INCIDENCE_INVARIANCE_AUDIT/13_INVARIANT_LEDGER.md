# Invariant Ledger

The first five transform columns act on a fixed embedded graph. “Augment” means the explicit `G -> G+` construction. View change refers to observed appearance, not mutation of the source.

| Property | Translation | Rotation | Reflection | Uniform positive scale | General affine shear | Augment by perpendicular | Observation/view change |
|---|---|---|---|---|---|---|---|
| adjacency | YES | YES | YES | YES | YES | NO: graph changes | CONDITIONAL: source preserved, recoverability may fail |
| degree | YES | YES | YES | YES | YES | NO | CONDITIONAL |
| path structure | YES | YES | YES | YES | YES | NO | CONDITIONAL |
| cycle structure | YES | YES | YES | YES | YES | NO | CONDITIONAL |
| incidence | YES | YES | YES | YES | YES | CONDITIONAL: original incidences plus new ones | CONDITIONAL |
| collinearity | YES | YES | YES | YES | YES | YES for existing points; new collinearity added | CONDITIONAL |
| parallelism | YES | YES | YES | YES | YES | YES for existing lines | CONDITIONAL |
| perpendicularity | YES | YES | YES | YES | NO in general | NEW perpendicular relation added | CONDITIONAL/NO in projected appearance |
| distance magnitude | YES | YES | YES | NO: scaled | NO in general | YES for original coordinates; new distances added | NO in general |
| unsigned angle magnitude | YES | YES | YES | YES | NO in general | YES for original angles; partition added | NO in general |
| oriented angle | YES | YES | NO: sign reversed | YES | NO in general | CONDITIONAL | CONDITIONAL |
| orientation/handedness | YES | YES | NO | YES | CONDITIONAL on determinant sign | YES for original frame | CONDITIONAL |
| triangle angle sum | YES | YES | YES | YES | YES for every nondegenerate Euclidean image triangle | YES; applies to each resulting triangle | CONDITIONAL as visible/measured claim |
| coordinate values | NO | NO | NO | NO | NO | YES for old points, new coordinate added | NOT_APPLICABLE/source coordinates need not display |
| visual placement | NO | NO | NO | NO | NO | NO | NO |
| labels/colors | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | CONDITIONAL rendering only |

The table distinguishes source invariance from visual recoverability. It does not claim that an arbitrary view preserves metric geometry.
