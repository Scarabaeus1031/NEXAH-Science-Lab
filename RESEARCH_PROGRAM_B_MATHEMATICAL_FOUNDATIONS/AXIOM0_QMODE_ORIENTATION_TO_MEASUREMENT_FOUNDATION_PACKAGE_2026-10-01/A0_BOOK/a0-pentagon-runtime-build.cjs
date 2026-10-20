'use strict';
// Pure build transform: returns text; callers save through the normal patch workflow.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),P=require('./a0-pentagon-contract.js');
function build(){
 const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
 const original=read('assets/core-snapshots/PASCAL_PENTAGON_EXPLORER_2026-10-15.html');
 if(crypto.createHash('sha256').update(original).digest('hex')!==P.SOURCE_HASH)throw Error('unmatched frozen source');
 const start=original.indexOf('<div id="pascal-pentagon-suite">'),end=original.indexOf('</script>',start)+9;
 if(start<0||end<9)throw Error('source fragment not found');
 let fragment=original.slice(start,end)+'\n</div>';
 const hook=`      globalThis.A0PentagonChild.install(window,{
        getState:()=>({mode,op,growthStep,couplingView,dRegister,branchWord}),
        setState:s=>{mode=s.mode;op=s.op;growthStep=s.growthStep;couplingView=s.couplingView;dRegister=s.dRegister;branchWord=s.branchWord;render();},
        readRendered:()=>({
          mode:root.querySelector('[data-mode][aria-selected="true"]').dataset.mode,
          op:root.querySelector('[data-op][aria-pressed="true"]').dataset.op,
          growthStep:root.querySelector('[data-step][aria-pressed="true"]').dataset.step,
          couplingView:root.querySelector('[data-coupling-view][aria-pressed="true"]').dataset.couplingView,
          dRegister:Number(root.querySelector('#pps-d-register').value),branchWord:root.querySelector('#pps-branch-word').value
        }),resultText:()=>result.textContent,svgElements:()=>svg.querySelectorAll('*').length
      },globalThis.A0PentagonContract);
      render();`;
 const marker='      render();\n    })();';
 if(fragment.split(marker).length!==2)throw Error('ambiguous final render hook');
 fragment=fragment.replace(marker,hook+'\n    })();');
 const base=original.match(/<style>([\s\S]*?)<\/style>/)[1];
 const scripts=[read('a0-pentagon-contract.js'),read('a0-pentagon-child.js')].map(s=>'<script>'+s+'</script>').join('\n');
 const shim=`<script>window.openai={widgetState:null,setWidgetState:async function(s){this.widgetState=s;if(window.__pentagonNativeChange)window.__pentagonNativeChange();}};</script>`;
 return '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:; connect-src \'none\'; frame-src \'none\'; object-src \'none\'; base-uri \'none\'; form-action \'none\'"><title>PENT runtime adapter · source-derived UI</title><style>'+base+'\nbody{padding:14px}.adapter-notice{padding:12px;border:1px solid var(--border);margin-bottom:14px;font:12px/1.5 monospace}</style></head><body><div class="adapter-notice">A0 Laufzeitadapter · abgeleitete Bedienoberfläche aus dem gefrorenen Core-Snapshot · sechs UI-Felder, kein vollständiger 106-Knoten-Zustand · Source SHA-256 '+P.SOURCE_HASH+'</div>'+scripts+shim+fragment+'</body></html>\n';
}
module.exports={build};if(require.main===module)process.stdout.write(build());
