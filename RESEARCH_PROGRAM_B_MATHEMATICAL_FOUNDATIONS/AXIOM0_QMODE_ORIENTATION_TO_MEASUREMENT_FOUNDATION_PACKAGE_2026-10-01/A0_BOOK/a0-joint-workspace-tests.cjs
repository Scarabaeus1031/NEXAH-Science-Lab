const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {views,keyFromHash} = require('./a0-joint-workspace.js');
const html = fs.readFileSync(path.join(__dirname,'A0_FIELDS_AND_JOINTS_ATLAS.html'),'utf8');
const script = fs.readFileSync(path.join(__dirname,'a0-joint-workspace.js'),'utf8');
const navigation = fs.readFileSync(path.join(__dirname,'a0-context-navigation.js'),'utf8');
for(const [key,view] of Object.entries(views)) {
  assert.ok(html.includes(`id="workspace-${key}"`));
  assert.equal(keyFromHash(`#workspace-${key}`),key);
  if(view.file) {
    const source = fs.readFileSync(path.join(__dirname,view.file),'utf8');
    assert.ok(source.includes('a0-context-navigation.js'));
    assert.ok(navigation.includes(`"${view.file}"`));
  }
}
assert.equal(keyFromHash('#map'),'overview');
assert.equal(keyFromHash('#not-a-tool'),'overview');
assert.ok(html.includes('id="jointAtlasContent"'));
assert.ok(html.includes('a0-joint-workspace.css'));
assert.ok(html.includes('a0-joint-workspace.js'));

class Element {
  constructor(){this.children=[];this.attrs={};this.dataset={};this.listeners={};this.hidden=false;}
  append(...items){this.children.push(...items);}
  setAttribute(key,value){this.attrs[key]=value;}
  addEventListener(key,fn){this.listeners[key]=fn;}
}
const tabs = Object.keys(views).map(key=>Object.assign(new Element(),{dataset:{jointView:key}}));
const root = Object.assign(new Element(),{querySelectorAll:()=>tabs});
const nodes = {'joint-workspace':root,jointAtlasContent:new Element(),jointWorkspacePanels:new Element(),jointWorkspaceDescription:new Element()};
const listeners = {};
const location = {hash:''};
vm.runInNewContext(script,{
  document:{getElementById:key=>nodes[key],createElement:()=>new Element()},location,
  history:{pushState:(_state,_title,hash)=>{location.hash=hash;}},
  window:{addEventListener:(key,fn)=>{listeners[key]=fn;}}
});
const host=nodes.jointWorkspacePanels, atlas=nodes.jointAtlasContent;
assert.equal(host.children.length,0,'No tool loaded before selection');
assert.equal(atlas.hidden,false);
const click=key=>tabs.find(tab=>tab.dataset.jointView===key).listeners.click({preventDefault(){}});
click('mathfield');
assert.equal(host.children.length,1);
assert.equal(atlas.hidden,true);
assert.equal(host.children[0].children[1].src,'A0_MATHEMATICAL_JOINTS.html?embed=fugen');
click('pascal');
assert.equal(host.children.length,2);
assert.equal(host.children[0].hidden,true);
assert.equal(host.children[1].hidden,false);
click('mathfield');
assert.equal(host.children.length,2,'Revisit reuses iframe rather than resetting instrument');
assert.equal(host.children[0].hidden,false);
location.hash='#map';listeners.hashchange();
assert.equal(atlas.hidden,false,'Old atlas anchors restore map');
assert.ok(host.children.every(panel=>panel.hidden));
location.hash='#workspace-applications';listeners.popstate();
assert.equal(host.children.length,3,'History and direct hashes select the right tool');
assert.equal(tabs[3].attrs['aria-current'],'true');
let prevented=false;
tabs[1].listeners.click({ctrlKey:true,preventDefault(){prevented=true;}});
assert.equal(prevented,false,'Modified clicks retain standalone link behavior');

const header={dataset:{},style:{},querySelector:()=>({})};
vm.runInNewContext(navigation,{
  document:{querySelector:()=>header},
  location:{pathname:'/A0_MATHEMATICAL_JOINTS.html',search:'?embed=fugen'},
  window:{self:{},top:{}},URLSearchParams
});
assert.equal(header.hidden,true,'Embedded tool does not duplicate parent navigation');
assert.equal(header.style.display,'none');
console.log('PASS: one workspace, four views, lazy source tools, persistent frames, hash/history and embedded navigation');
