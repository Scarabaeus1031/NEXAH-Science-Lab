import copy,json,unittest
from pathlib import Path
import derive
P=Path(__file__).resolve().parent.parent/"fixtures/canonical_raw_artifact_bundle.json"
class Raw(unittest.TestCase):
 @classmethod
 def setUpClass(c):c.b=json.loads(P.read_text())
 def test_chain(c):c.assertEqual(derive.end_to_end(copy.deepcopy(c.b))["classification"],"REPLICATED")
 def test_raw_p1_false_and_cache_conflict(c):
  b=copy.deepcopy(c.b);b["observed"]["agreement"]["mean_coherence"]=.1;r=derive.end_to_end(b);c.assertFalse(r["P"]["P1"])
  b["NONAUTHORITATIVE_CACHE"]={"P":{**r["P"],"P1":True},"classification":r["classification"]}
  with c.assertRaises(ValueError):derive.end_to_end(b)
 def test_raw_p5_false(c):
  b=copy.deepcopy(c.b);b["sensitivities"]["results"]["ACTION_AMPLITUDE_0.25"]["carrier_results"]["T"]["coefficient"]=-.1;r=derive.end_to_end(b);c.assertFalse(r["P"]["P5"])
 def test_invalid_never_positive(c):c.assertEqual(derive.classify(False,{f"P{i}":True for i in range(1,6)},c.b["observed"]),"INVALID EXPERIMENT")
if __name__=="__main__":unittest.main()
