# Difference / Residual Boundary Control

Exploratory terms such as difference, rest, masked side, `Schnittmenge` and “M geometry of the rest” do not define one mathematical object.

| Standard object | Definition requirement | Not interchangeable with |
|---|---|---|
| set difference `A\B` | two sets and membership | numerical residual, complement without universe |
| intersection `A∩B` | two sets and shared membership | “rest” or difference |
| complement `U\A` | explicit universe `U` | masked or unobserved region |
| boundary | topology/geometry and source region | residual |
| unobserved region | observation coverage rule | nonexistent source content |
| occluded region | geometry and occlusion/view rule | set complement in general |
| projection loss | source and projection/observation map | geometric difference automatically |
| measurement residual | prediction, observation and subtraction rule | set difference |

No one of these is instantiated unless its inputs and rule are explicitly registered.

`DIFFERENCE_EQUALS_RESIDUAL=NO_IN_GENERAL`

`INTERSECTION_EQUALS_REST=NO`

`MASKED_REGION_EQUALS_COMPLEMENT=NO_IN_GENERAL`

`UNOBSERVED_EQUALS_NONEXISTENT=NO`
