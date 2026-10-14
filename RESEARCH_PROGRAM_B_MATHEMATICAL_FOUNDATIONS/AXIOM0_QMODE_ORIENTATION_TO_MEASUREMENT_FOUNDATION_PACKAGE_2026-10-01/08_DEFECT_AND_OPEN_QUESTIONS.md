# Defects and open questions

Status: `OPEN RECONCILIATION REGISTER`

## Confirmed or high-confidence formal defects

1. **Two-cycle composition:** a swap relation normally satisfies `R^2 = id`,
   not `R^2 = R`.
2. **Reciprocal reachability:** direct reciprocal edges under `R` do not define
   strongly connected components in general; mutual reachability must use
   `R*`.
3. **Finite-poset fixed points:** monotonicity alone does not guarantee that
   every self-map of a finite poset has a fixed point.
4. **Carrier-level drift:** historical texts mix the original set `C`, the SCC
   quotient `Q` and later operator domains.
5. **Unproved compatibility:** compatibility between operators such as
   `Gamma` and `Omega` is an additional condition unless derived.
6. **Unproved minimality:** the functional minimality of chains such as
   `!= -> Gamma -> tau -> Delta -> Omega` is asserted rather than established.
7. **Symbol drift:** the same symbols are used with different meanings across
   versions and visual families.
8. **Strict-order cycle:** the historical `Q < P < Q` visual cannot define a
   strict partial order as written; a process reading must distinguish
   `Q_0 -> P -> Q_1`.
9. **Name collision:** `ALGO`, Algol and `ALG°` occur or are recalled in
   different source contexts and cannot be merged by spelling similarity.

## Foundational open questions

1. Is AXIOM-0 meant as a definition, a methodological rule, a formal axiom or
   an ontological thesis?
2. What exactly is oriented, relative to which frame, and what counts as a
   change of orientation?
3. What persists, under which transformations, and by which identity rule?
4. What formal property is meant by closure in the measurement claims?
5. Which links in the orientation-to-measurement chain are definitions,
   empirical hypotheses or necessity claims?
6. Is the foundational mathematical object a special cyclic relation or an
   arbitrary finite relation?
7. Which historical Q° meanings are compatible with the current bounded
   observer-local estimator and which must be retired?
8. Which visual models can be reconstructed as explicit, falsifiable formal or
   computational objects?
9. Can the candidate BoundaryRelation schema be made consistent on one
   declared carrier while keeping geometric boundary, failure, censoring and
   unknown distinct?
10. What is the earliest exact source and intended meaning of the `ALG°`
    glyph, if it exists independently of `ALGO` and Algol?

## Reconciliation order

```text
terminology freeze
  -> source-to-claim traceability
  -> carrier and mapping definitions
  -> correction of known defects
  -> counterexample review
  -> formal or empirical question selection
  -> independent review
  -> possible adoption decision
```
