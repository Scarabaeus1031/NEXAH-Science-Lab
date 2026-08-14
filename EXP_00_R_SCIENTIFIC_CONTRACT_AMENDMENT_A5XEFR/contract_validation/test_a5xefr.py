from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import a5xefr_schema as s
import derive_a5xefr_reference as ref
import derive_a5xefr_independent as ind


def reject(bundle, path=ref.derive):
    out = path(bundle)
    return out["execution_state"] == "INVALID_INTERFACE" and out["classification"] is None


class F47FastAdversarial(unittest.TestCase):
    def setUp(self):
        self.fixture = s.build("FIXTURE", "F47_SHARED")
        self.registered = s.build("REGISTERED", "F47_SHARED")

    def mutate(self, bundle, function):
        value = copy.deepcopy(bundle); function(value); s.refresh(value); return value

    def test_A_registered_identity_is_accepted_by_both_validators(self):
        self.assertEqual(ref.validate(self.registered)["evidence_mode"], "REGISTERED")
        self.assertEqual(ind.audit(self.registered)["evidence_mode"], "REGISTERED")

    def test_B_contradictory_flags(self):
        for key, value in [("registered",False),("registered_data",False),("fixture",True)]:
            bad=self.mutate(self.registered,lambda x,k=key,v=value:x["execution_identity"].__setitem__(k,v))
            self.assertTrue(reject(bad)); self.assertTrue(reject(bad,ind.derive))

    def test_C_registered_without_authority(self):
        bad=self.mutate(self.registered,lambda x:x["execution_identity"].pop("authority"))
        self.assertTrue(reject(bad));self.assertTrue(reject(bad,ind.derive))

    def test_D_fixture_claims_registered_provenance(self):
        bad=self.mutate(self.fixture,lambda x:x["evidence"]["authority_binding"].update({"registered_data":True}))
        self.assertTrue(reject(bad));self.assertTrue(reject(bad,ind.derive))

    def test_E_mode_mutation_after_hash(self):
        bad=copy.deepcopy(self.fixture);bad["execution_identity"]["evidence_mode"]="REGISTERED"
        self.assertTrue(reject(bad));self.assertTrue(reject(bad,ind.derive))

    def test_J_schema_capability_is_not_authorization(self):
        bad=self.mutate(self.registered,lambda x:x["execution_identity"]["authorization"].update({"present":True,"reference":"NOT_AUTHORIZATION"}))
        self.assertTrue(reject(bad));self.assertTrue(reject(bad,ind.derive))

    def test_K_simulation_cannot_claim_registered_science(self):
        for key,value in [("scientific_result_claimed",True),("payload_origin","REGISTERED"),("conformance_only",False)]:
            bad=self.mutate(self.registered,lambda x,k=key,v=value:x["execution_identity"].__setitem__(k,v))
            self.assertTrue(reject(bad));self.assertTrue(reject(bad,ind.derive))

    def test_registered_scientific_structure_requires_external_authorization(self):
        candidate=copy.deepcopy(self.registered);i=candidate["execution_identity"];i.update({"payload_kind":"REGISTERED_SCIENTIFIC_EVIDENCE","payload_origin":"REGISTERED","conformance_only":False,"scientific_result_claimed":True});s.refresh(candidate)
        self.assertEqual(ref.validate(candidate)["payload_kind"],"REGISTERED_SCIENTIFIC_EVIDENCE")
        self.assertEqual(ind.audit(candidate)["payload_kind"],"REGISTERED_SCIENTIFIC_EVIDENCE")
        self.assertTrue(reject(candidate));self.assertTrue(reject(candidate,ind.derive))

    def test_generic_schema_has_no_fixture_only_registered_const(self):
        schema=json.loads((s.PKG/"A5XEFR_GENERIC_RAW_SCHEMA.json").read_text())
        self.assertNotIn('"registered":{"const":false}',json.dumps(schema,separators=(",",":")))

    def test_L_old_A5XEF_counterexample(self):
        bad=s.build("FIXTURE","F47_COUNTER");bad["evidence"]=s.base.favorable_counterexample();s.refresh(bad)
        self.assertTrue(reject(bad));self.assertTrue(reject(bad,ind.derive))


class F47EndToEnd(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        fixture=s.build("FIXTURE","F47_SHARED");registered=s.build("REGISTERED","F47_SHARED")
        cls.ff=ref.derive(copy.deepcopy(fixture));cls.fi=ind.derive(copy.deepcopy(fixture))
        cls.rf=ref.derive(copy.deepcopy(registered));cls.ri=ind.derive(copy.deepcopy(registered))

    def test_fixture_mode(self): self.assertEqual(self.ff["execution_state"],"CONFORMANCE_ONLY")
    def test_registered_interface_mode(self): self.assertEqual(self.rf["execution_state"],"CONFORMANCE_ONLY")
    def test_two_implementers_fixture(self): self.assertEqual(self.ff["scientific_derivation"],self.fi["scientific_derivation"])
    def test_two_implementers_registered(self): self.assertEqual(self.rf["scientific_derivation"],self.ri["scientific_derivation"])
    def test_F_populations_invariant(self): self.assertEqual(self.ff["scientific_derivation"]["population_hashes"],self.rf["scientific_derivation"]["population_hashes"])
    def test_G_model_invariant(self): self.assertEqual(self.ff["scientific_derivation"]["model_spec_sha256"],self.rf["scientific_derivation"]["model_spec_sha256"])
    def test_H_rng_nulls_invariant(self): self.assertEqual(self.ff["scientific_derivation"]["nulls_sha256"],self.rf["scientific_derivation"]["nulls_sha256"])
    def test_I_classification_invariant(self): self.assertEqual(self.ff["scientific_derivation"]["classification"],self.rf["scientific_derivation"]["classification"])
    def test_exact_complete_scientific_invariance(self): self.assertEqual(self.ff["scientific_derivation"],self.rf["scientific_derivation"])
    def test_no_top_level_scientific_result(self):
        for result in [self.ff,self.fi,self.rf,self.ri]: self.assertFalse(result["scientific_result"]);self.assertIsNone(result["classification"]);self.assertFalse(result["release_permitted"])


if __name__ == "__main__": unittest.main()
