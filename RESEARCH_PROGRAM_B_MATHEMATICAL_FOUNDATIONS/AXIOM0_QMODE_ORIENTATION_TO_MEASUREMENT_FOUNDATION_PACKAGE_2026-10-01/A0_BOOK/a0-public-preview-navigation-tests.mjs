import assert from 'node:assert/strict';
import vm from 'node:vm';
import {withPublicNavigation} from './a0-public-preview-navigation.mjs';
let checks=0;
const ok=value=>{assert(value);checks++;};
for(const play of [true,false]){
  const seed='<body><main>unchanged instrument</main></body>';
  const html=withPublicNavigation(seed,{play});
  ok(html.includes('position:sticky'));
  ok(html.includes('safe-area-inset-top'));
  ok(html.includes('min-height:44px'));
  ok(html.includes('aria-label="Öffentliche Test-Navigation"'));
  ok(html.includes('href="../index.html#arkade">ARKADE</a>'));
  ok(withPublicNavigation(html,{play})===html);
  ok(html.includes('<main>unchanged instrument</main>'));
  new vm.Script(html.match(/<script id="previewNavigationRuntime">([\s\S]*?)<\/script>/)[1]);checks++;
}
console.log(JSON.stringify({status:'PASS',checks,scope:'public navigation structure, idempotence, touch-target CSS and script syntax; not iPhone Safari acceptance'},null,2));
