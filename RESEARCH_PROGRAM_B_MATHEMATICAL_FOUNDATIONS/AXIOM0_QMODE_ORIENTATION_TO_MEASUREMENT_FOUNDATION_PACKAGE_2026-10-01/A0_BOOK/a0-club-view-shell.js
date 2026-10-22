/* Standalone deck navigation only. The containing Jukebox owns its own header. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else api.mount(document,root);
})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function mount(doc,win){
  const header=doc.querySelector('.club-shell-header');if(!header)return false;
  if(win.self!==win.top){header.hidden=true;const hero=doc.querySelector('.hero');if(hero)hero.hidden=true;doc.documentElement?.setAttribute('data-club-embedded','true');return true;}
  return false;
 }
 return{mount};
});
