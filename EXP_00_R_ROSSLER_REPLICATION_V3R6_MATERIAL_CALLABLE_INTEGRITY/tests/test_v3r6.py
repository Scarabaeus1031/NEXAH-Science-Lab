from __future__ import annotations

import json
import os
import subprocess
import sys
import textwrap
import unittest
from pathlib import Path

PKG = Path(__file__).resolve().parent.parent
LAB = PKG.parent
HISTORICAL_PYTHON = "/opt/anaconda3/bin/python3"
sys.path.insert(0, str(PKG / "src"))
import v3r6_engine as v6
sys.path.insert(0, str(PKG / "tests"))
import independent_callable_oracle as oracle

ATTACK_EXECUTED=[]

def hostile_quantile(*args,**kwargs):
    ATTACK_EXECUTED.append(True)
    return 999.0


def isolated(source):
    env = dict(os.environ); env.pop("PYTHONPATH", None)
    return subprocess.run([HISTORICAL_PYTHON,"-B","-c",textwrap.dedent(source)],cwd=LAB,env=env,text=True,capture_output=True)


class ACounterexampleAndCleanPath(unittest.TestCase):
    def test_v3r5_counterexample_reproduced(self):
        done = subprocess.run([HISTORICAL_PYTHON,"-B",str(PKG/"tests/reproduce_v3r5_counterexample.py")],cwd=LAB,text=True,capture_output=True)
        self.assertEqual(done.returncode,0,done.stderr)
        self.assertEqual(json.loads(done.stdout)["v3r5_counterexample"],"REPRODUCED")

    def test_clean_historical_runtime_and_two_verifiers(self):
        context = v6.prepare_runtime()
        self.assertTrue(v6.assert_callable(context))
        self.assertEqual(oracle.verify(context["v3r5"]._BOUND_NUMPY.quantile,context["authority"]["callable_authority"])["implementation"],"PASS")
        self.assertEqual(len(context["authority"]["lock"]["packages"]),24)
        self.assertFalse(context["v3r5_context"]["authorization"]["granted"])


class BMutationMatrix(unittest.TestCase):
    def setUp(self):
        self.context = v6.prepare_runtime()
        self.module = self.context["v3r5"]._BOUND_NUMPY
        self.quantile = self.module.quantile
        self.impl = self.quantile._implementation

    def test_a_exact_implementation_code_replacement_fails_closed(self):
        ATTACK_EXECUTED.clear()
        old=self.impl.__code__
        try:
            self.impl.__code__=hostile_quantile.__code__
            with self.assertRaisesRegex(v6.V3R6Failure,"MATERIAL_CALLABLE_INTEGRITY"):
                v6.assert_callable(self.context)
            self.assertEqual(ATTACK_EXECUTED,[])
        finally:self.impl.__code__=old

    def test_b_dispatcher_preserving_wrapped_replacement_rejected(self):
        old=self.quantile.__wrapped__
        try:
            self.quantile.__wrapped__=lambda *a,**k:999.0
            with self.assertRaisesRegex(v6.V3R6Failure,"MATERIAL_CALLABLE_INTEGRITY"):
                v6.assert_callable(self.context)
        finally:self.quantile.__wrapped__=old

    def test_c_implementation_function_replacement_is_not_permitted(self):
        with self.assertRaises(AttributeError):
            self.quantile._implementation=lambda *a,**k:999.0
        self.assertTrue(v6.assert_callable(self.context))

    def test_d_callable_alias_and_e_numpy_quantile_substitution(self):
        old=self.module.quantile
        try:
            self.module.quantile=lambda *a,**k:999.0
            with self.assertRaisesRegex(v6.V3R6Failure,"QUANTILE_(ALIAS|DISPATCHER)_IDENTITY"):
                v6.assert_callable(self.context)
        finally:self.module.quantile=old

    def test_f_mutation_after_verification_rejected_before_consumption(self):
        ATTACK_EXECUTED.clear(); old=self.impl.__code__
        def attack(context):
            self.impl.__code__=hostile_quantile.__code__
        try:
            with self.assertRaisesRegex(v6.V3R6Failure,"MATERIAL_CALLABLE_INTEGRITY"):
                v6.derive_synthetic_with_test_hook("V3R6_ATTACK_FIXTURE",attack)
            self.assertEqual(ATTACK_EXECUTED,[])
        finally:self.impl.__code__=old

    def test_g_h_unchanged_legitimate_callable(self):
        self.assertEqual(float(self.quantile([1.,2.,3.],.5,method="linear")),2.0)
        self.assertTrue(v6.assert_callable(self.context))


class CReferencesAndRegressions(unittest.TestCase):
    def test_complete_canonical_and_alternate_objects(self):
        expected={"V3R2_REVIEW_CANONICAL":"aa7777ba26486f5acd594456240c2678c342678750248802bba67f02215ff454","V3R2_REVIEW_ALTERNATE":"c2bdfe097288c21c9c2eee963390ef185fcd11759161efcdf32143d0c93df364"}
        for namespace,digest in expected.items():
            self.assertEqual(v6.digest_science(v6.derive_synthetic(namespace)),digest)

    def test_authorization_firewall_zero_resolve_zero_read(self):
        boundary={"resolve":0,"read":0}
        with self.assertRaisesRegex(v6.V3R6Failure,"EXECUTION_NOT_AUTHORIZED"):
            v6.run_registered_file("/tmp/V3R6_REGISTERED_SENTINEL",boundary)
        self.assertEqual(boundary,{"resolve":0,"read":0})

    def test_inherited_schema_and_authorization_regressions(self):
        done=subprocess.run([HISTORICAL_PYTHON,"-B","-m","unittest","tests.test_v3r3_regression"],cwd=LAB/"EXP_00_R_ROSSLER_REPLICATION_V3R3",text=True,capture_output=True)
        self.assertEqual(done.returncode,0,done.stdout+done.stderr)


if __name__=="__main__":
    unittest.main(verbosity=2)
