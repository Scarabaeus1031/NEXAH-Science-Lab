# Formal-core extract

Status: `ESTABLISHED_MATHEMATICAL_TOOLKIT / HISTORICAL FORMULATION REQUIRES REPAIR`

## Candidate toolkit

A bounded formal lane can begin with a finite set `C` and relation
`R ⊆ C × C`.

```text
(C, R)
  -> reflexive-transitive reachability R*
  -> mutual-reachability equivalence
  -> strongly connected components
  -> quotient set Q
  -> quotient directed acyclic graph
  -> induced partial order
  -> rank, covers and transitive reduction
  -> declared monotone or extensive operators
  -> finite stabilization where its hypotheses hold
```

These are established graph-, order- and closure-theoretic constructions. The
value for NEXAH would lie in their disciplined application and interfaces, not
in relabelling them as new mathematics.

## Necessary distinctions

- `C` is not automatically the quotient `Q`.
- a relation is not automatically a function or group action;
- direct reciprocity under `R` is not mutual reachability under `R*`;
- a cycle relation is not an arbitrary finite relation;
- monotonicity does not by itself imply that every finite-poset operator has a
  fixed point;
- extensivity on a finite poset can support stabilization of iterates;
- operator compatibility must be stated as an assumption or proved;
- topology, metric, geometry and physical space do not follow from order
  alone.

## Candidate formal questions

1. Which source objects and relations are intended?
2. Which equivalence relation defines the quotient?
3. Which information survives quotienting?
4. Which operators are defined on `C`, on `Q`, or on another carrier?
5. Which operators are monotone, extensive, idempotent or closure operators?
6. Under which hypotheses do iterations stabilize?
7. Which representation maps preserve reachability, order or closure?

## Non-novelty boundary

No theorem or novelty claim is adopted by this extract. A later NEXAH result
would need a precise problem, a proof or bounded computational evidence, prior
art and a clear statement of what is contributed beyond standard theory.
