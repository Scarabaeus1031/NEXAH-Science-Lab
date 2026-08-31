# Positive Controls

| # | Case | Required typing | Result |
|---:|---|---|---|
| 1 | Same object, different camera | two views; one source/state | PASS |
| 2 | Same graph, different embedding | graph identity; distinct frame/metric/embedding | PASS |
| 3 | Same system, changed regime | shared system class; distinct regime records | PASS |
| 4 | Changed regime, negligible response | regime difference; equivalent state within criterion | PASS |
| 5 | Changed regime, continuous response | ordered parameters and continuous state comparison | PASS |
| 6 | Changed regime, qualitative form change | response-class criterion and form refs | PASS |
| 7 | Same entity, changed role | stable entity ID; context-bound role relation | PASS |
| 8 | Same entity, changed frame | stable identity/state; frame transform | PASS |
| 9 | Same observation value, different states | OSR ambiguity/fiber | PASS |
| 10 | Return to prior regime, history retained | prior regime ref plus distinct history/execution | PASS |

The controls pass through composition of existing OLS/RID distinctions. No new primitive or operator is needed.

