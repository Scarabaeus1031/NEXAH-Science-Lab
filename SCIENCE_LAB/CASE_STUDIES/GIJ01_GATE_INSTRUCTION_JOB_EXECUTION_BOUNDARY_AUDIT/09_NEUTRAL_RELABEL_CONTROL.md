# GIJ-01 - Neutral Relabel Control

Relabel the roles:

```text
A = instruction
B = environment
C = authority / satisfied permission
D = dispatch or trigger occurrence
E = execution event
F = outcome
G = trace
```

Neutral dependency structure:

```text
(A,B,C)
   |
   v
preconditions satisfied
   +
   D
   |
   v
attempt
   |
   +---- no attested E
   |
   +---- attested E
             / \
            F   G, if recorded
```

The result survives removal of GIJ, GTI, GTA, GIT, Git, GitHub, names, NEXAH terms and suggestive wording.

```text
NEUTRAL_RELABEL_SURVIVES=YES
LABEL_DEPENDENT_RESULT=NO
LEXICAL_ORDER_IMPLIES_EXECUTION_ORDER=NO
```

