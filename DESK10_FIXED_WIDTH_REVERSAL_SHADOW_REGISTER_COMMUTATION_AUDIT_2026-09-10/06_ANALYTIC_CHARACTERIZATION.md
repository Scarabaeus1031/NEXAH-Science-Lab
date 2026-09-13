# Analytic characterization

For arbitrary base b and width w, let M=b^w-1. Every digit of M is b-1. Subtraction M-x is carry-free digit complement, so digit reversal commutes with T_M. This proves N=b^w-1 is a sufficient universal class for all positional bases and fixed widths.

The five requested width-4 bases confirm the theorem exhaustively. Within the complete decimal sweep N=1,...,10000, T_N is universal only at N=9999. S_N is universal at N=1 (degenerate zero residue) and N=9999; S and T are nevertheless distinct definitions.

A palindromic or repdigit register is not sufficient: 1111 through 8888 all have failures. Carries/borrows are the obstruction. Leading-zero preservation is essential to the word-level proof. Modular reduction keeps T in the fixed word space but does not by itself imply commutation.

This audit proves sufficiency. It supplies an empirical finite-width decimal necessity result, not a general necessity theorem.

Classifications: POSITIONAL_BASE_GENERAL, DIGIT_COMPLEMENT, CARRY_FREE_COMPLEMENT, SUFFICIENT_CONDITION_CONFIRMED, NECESSITY_NOT_DEMONSTRATED.
