import json,unittest
from pathlib import Path
import validate_a5xr_contract as v
class Contract(unittest.TestCase):
 def test_complete(c):
  r=v.validate_all();c.assertEqual(r["classification"],"REPLICATED");c.assertTrue(all(r["P"].values()))
 def test_no_decisions(c):
  b=json.loads((v.PKG/"fixtures/canonical_raw_artifact_bundle.json").read_text());v.no_authoritative_decisions(b)
  b["P1"]=True
  with c.assertRaises(ValueError):v.no_authoritative_decisions(b)
if __name__=="__main__":unittest.main()
