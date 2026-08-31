# GIJ-01 - Rust Type Relevance

`RUST_TYPE_RELEVANCE=MEDIUM`

Distinct wrapper types and state variants could represent:

- instruction versus information;
- environment versus event;
- authorized versus unauthorized dispatch;
- attempt versus event entry;
- event versus outcome;
- outcome versus result;
- outcome/result versus trace.

A type system could prevent some accidental field collapses and require explicit transitions. It cannot by itself establish that authority is genuine, that an external event occurred, that a trace is truthful, or that provenance is valid. Those remain runtime and evidence questions.

The names `Instruction<T>`, `Environment<E>`, `ExecutionEvent<I,O>`, `Outcome<T,E>` and `Trace<E>` are documentary examples only.

```text
RUST_PROJECT_CREATED=NO
RUST_CODE_CREATED=NO
RUST_IMPLEMENTATION_CREATED=NO
IMPLEMENTATION_ACTIVATION=NO
```

