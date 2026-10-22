/* Presentation-only focus mode for the Human journey; original renderers and controls are moved, never copied. */
(function(root){
"use strict";
const allowed={
 "A0_TESSAREC_BLUE_BODY_LAB.html":["lab","blue-body-interior-crt16","fold-contact"],
 "A0_BLUE_PINK_DODECA_CELL_RETURN.html":["formation"]
};
function focus(doc,win){
 const url=new URL(win.location.href),file=decodeURIComponent(url.pathname.split("/").pop()),id=url.searchParams.get("human-stage");
 const defaultStage=file==="A0_BLUE_PINK_DODECA_CELL_RETURN.html"?"formation":"lab";
 const selected=id||defaultStage;
 if(!allowed[file]?.includes(selected))return false;
 const target=doc.getElementById(selected);if(!target)return false;
 // The source's existing guided mode hides expert sections; reveal only for this embedded view.
 if(selected==="fold-contact")win.A0BlueBodyReadingMode?.showExpert();
 const host=doc.createElement("main");host.id="a0-human-instrument-focus";host.dataset.station=selected;
 doc.body.append(host);host.append(target);
 const style=doc.createElement("style");style.textContent=`
 html{scroll-behavior:auto!important;scroll-padding:0!important}
 body{padding:0!important;margin:0!important;min-width:0!important}
 body>*:not(#a0-human-instrument-focus):not(script):not(style){display:none!important}
 #a0-human-instrument-focus{display:block!important;max-width:none!important;width:100%!important;margin:0!important;padding:8px!important}
 #a0-human-instrument-focus>section{display:block!important;padding:0!important;margin:0!important;max-width:none!important}
 #a0-human-instrument-focus .head,#a0-human-instrument-focus .finding,#a0-human-instrument-focus .links,
 #a0-human-instrument-focus .metrics,#a0-human-instrument-focus .interior-contract,
 #a0-human-instrument-focus .interior-ledger,#a0-human-instrument-focus .lab-head,
 #a0-human-instrument-focus .formation-head{display:none!important}
 #a0-human-instrument-focus .stage{height:440px!important;min-height:260px!important}
 #a0-human-instrument-focus .blue-body-camera-controls{position:relative!important;top:auto!important}
 #lab .controls>label:first-child,#lab #searchButton,#lab .readout,#lab .face-readout{display:none!important}
 #fold-contact .fold-grid{grid-template-columns:1fr!important}
 #fold-contact .fold-side>*:not(.fold-state):not(.audit-box){display:none!important}
 #fold-contact .equation{display:none!important}
 #fold-contact .fold-side{padding:12px!important}
 #fold-contact .fold-tools{display:flex!important;flex-wrap:wrap;gap:16px}
 #formation>:not(.formation-grid):not(.formation-controls):not(.formation-readout){display:none!important}
 #formation .formation-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important}
 #formation .flame-window,#formation .return-window,#formation .observer-pin{display:none!important}
 #formation .formation-panel{grid-column:auto!important;grid-row:auto!important;min-height:240px!important}
 #formation canvas{min-height:210px!important}
 #formation .layer-row{display:none!important}
 #blue-body-interior-crt16>p{display:none!important}
 button,input,select{touch-action:manipulation}
 button{min-height:44px}
 @media(max-width:650px){#formation .formation-grid{grid-template-columns:1fr!important}#a0-human-instrument-focus .stage{height:330px!important}.interior-views{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
 @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
 `;doc.head.append(style);
 const heading=doc.createElement("p");heading.textContent="A0 Originalinstrument · öffentliche Human-Ansicht";heading.style.cssText="font:11px/1.6 system-ui;color:#a9bcc7;padding:0 8px";host.prepend(heading);
 // Resize the same source canvases after changing their presentation container.
 win.dispatchEvent(new win.Event("resize"));win.scrollTo(0,0);
 return true;
}
const api={allowed,focus};if(typeof module!=="undefined"&&module.exports)module.exports=api;else{root.A0HumanInstrumentFocus=api;if(root.document.readyState==="complete")focus(root.document,root);else root.addEventListener("load",()=>focus(root.document,root),{once:true})}
})(typeof window!=="undefined"?window:globalThis);
