"""Read-only source binding checks; no geometry or historical source writes."""
import csv
import hashlib
import json
import pathlib
import struct
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

BASE = pathlib.Path(__file__).resolve().parent
data = json.loads((BASE / 'assets/a0-nsn-glb-source-return-v1.json').read_text())
checks = 0
def check(condition, label):
    global checks
    assert condition, label
    checks += 1
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

census = BASE / data['census']['path']
check(sha(census) == data['census']['sha256'], 'historical census unchanged')
rows = list(csv.DictReader(census.open()))
check(len(rows) == data['census']['rows'], 'census count')
for item in data['models']:
    row = rows[item['census_line'] - 2]
    check(row['path'] == item['historical_path'], 'exact historical row')
    check(row['family_id'] == item['census_family'], 'historical family')
    p = pathlib.Path(item['path'])
    check((BASE / item['href']).resolve() == p, 'relative source link')
    check(sha(p) == item['sha256'], 'model hash')
    raw = p.read_bytes()
    check(raw[:4] == b'glTF' and struct.unpack_from('<I', raw, 4)[0] == 2, 'GLB v2')
    check(len(raw) == item['bytes'] == struct.unpack_from('<I', raw, 8)[0], 'GLB length')
    doc = json.loads(raw[20:20 + struct.unpack_from('<I', raw, 12)[0]])
    check(len(doc.get('nodes', [])) == item['nodes'], 'nodes')
    check(len(doc.get('meshes', [])) == item['meshes'], 'meshes')
    check(len(doc.get('animations', [])) == item['animation_count'] == 0, 'no invented animation')
    node_names = [n.get('name') for n in doc['nodes']]
    if 'node_names' in item:
        check(node_names == item['node_names'], 'all node names')
    else:
        packed_names = json.dumps(node_names, ensure_ascii=False, separators=(',', ':')).encode()
        check(hashlib.sha256(packed_names).hexdigest() == item['node_name_sha256'], 'node-name digest')
        check([name for name in node_names if name][:len(item['node_names_sample'])] == item['node_names_sample'], 'node-name sample')

by_name = {x['file']: x for x in data['models']}
enki = by_name['Enki_Matryoshka_Enlil_v2.glb']['node_names']
check([x for x in enki if x.startswith('Floor_')] == ['Floor_' + str(i) for i in range(1,18)], '17 exact floor names')
check(all(x in enki for x in ['ENKI_shell','ENLIL_crystal','Gate_234','Gate_312','Gate_432']), 'named components')
check(by_name['Enki_Matryoshka_Enlil.glb']['sha256'] == by_name['Enki_Matryoshka_Enlil2.glb']['sha256'], 'duplicate preserved')
for item in data['media']:
    check(sha(pathlib.Path(item['path'])) == item['sha256'], 'media hash')
for item in data['motion_sources']:
    check(sha(BASE / item['path']) == item['sha256'], 'original motion source unchanged')
check(sha(BASE / data['nsn']['binder']) == data['nsn']['sha256'], 'NSN original binder unchanged')
cat = data['nsn']['cathedral']
check(sha(pathlib.Path(cat['absolute_path'])) == cat['sha256'], 'existing Cathedral ID and hash')
check(data['canonical_count_effect'] == 0 and not data['publication_authorized'], 'authority unchanged')

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'a' and 'href' in a:
            self.links.append(a['href'])
html = (BASE / 'A0_ORIENTATION_CONTROLLER_BENCH.html').read_text()
parser = Links()
parser.feed(html)
check(len(parser.ids) == len(set(parser.ids)), 'unique Bench IDs')
for anchor in ['nsnGlbSources','sewingSourceWindow','sewingSourceOpen','sewingSourceClose','sewingSourceFrameHost']:
    check(anchor in parser.ids, 'Bench anchor ' + anchor)
check('a0-bench-sewing-source-window.js?rev=20261019-r1' in html, 'live source window loaded')
section = html.split('<section id="nsnGlbSources"',1)[1].split('<section id="augustSourceTrail"',1)[0]
links = Links()
links.feed(section)
for href in links.links:
    u = urlsplit(href)
    if not u.path:
        check(u.fragment in parser.ids, 'local section target')
        continue
    target = BASE / unquote(u.path)
    check(target.exists(), 'source link ' + href)
    if u.fragment and target.suffix == '.html':
        check('id="' + u.fragment + '"' in target.read_text() or target.name == 'index.html', 'source anchor')
check('iframe' not in section, 'no automatic source frame')
print(json.dumps({'status':'PASS','checks':checks,'browser_acceptance':'OPEN','boundary':'Source integrity and static linkage, not rendered visual equivalence.'}))
