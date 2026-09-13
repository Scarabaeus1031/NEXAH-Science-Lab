# Backspace operator test

Backspace is defined on decimal strings:

```text
B("31000")  = "3100"
B^2("31000") = "310"
B^3("31000") = "31"
B^4("31000") = "3"
```

Under ordinary base-10 integer conversion these are distinct integers: `31000 != 3100 != 310 != 31 != 3`.

Classifications: `STRING_TRANSFORMATION`, `DECIMAL_PROJECTION`, `NON_ARITHMETIC_CUT`.

Let `C` convert a nonempty canonical decimal string to an integer and let `D` print a canonical nonnegative integer. At `"31000"`:

- `S_31000(C(B("31000"))) = S_31000(3100) = 27900`.
- `C(B(D(S_31000(C("31000"))))) = C(B("0")) = C("")`, which is `UNDEFINED`.

On a witness where both compositions are defined:

```text
S_31000(C(B("11357"))) = S_31000(1135) = 29865
C(B(D(S_31000(11357)))) = C(B("19643")) = 1964
```

Since `29865 != 1964`, Backspace and modular shadow are `NONCOMMUTING`. The composition is additionally `UNDEFINED` at strings whose modular shadow prints as a single digit and Backspace produces the empty string, including the specified `"31000"` boundary case.
