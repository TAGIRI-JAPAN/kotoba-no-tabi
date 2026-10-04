(() => {
  const codes=['ja','en','my','si','id','fil'],names={ja:'日本語',en:'English',my:'မြန်မာဘာသာ',si:'සිංහල',id:'Bahasa Indonesia',fil:'Filipino'};
  let code='ja',base=null,observer=null,scheduled=false,applying=false,baseTitle='';
  const originals=new Map(),attributes=new Map();
  const dict=()=>window.KotobaLanguageData?.[code]||{};
  const folded=new Map();function insensitive(value){const d=dict();if(folded.get(code)?.source!==d)folded.set(code,{source:d,map:new Map(Object.entries(d).map(([k,v])=>[k.toLowerCase(),v])),values:new Set(Object.values(d))});return folded.get(code).map.get(value.toLowerCase());}
  function lookup(value){if(typeof value!=='string'||code==='ja'||code==='en')return value;const d=dict();if(value==='English')return names[code];if(d[value])return d[value];const trimmed=value.trim();if(d[trimmed])return value.replace(trimmed,d[trimmed]);const foldedValue=insensitive(trimmed);if(foldedValue!==undefined&&foldedValue!==trimmed)return value.replace(trimmed,foldedValue);
    if((trimmed.includes(' · ')||trimmed.includes(' / '))&&!/^\d+\s*\/\s*\d+/.test(trimmed)){const pieces=trimmed.split(/( · | \/ )/);const joined=pieces.map((v,i)=>i%2?v:lookup(v)).join('');if(joined!==trimmed)return joined;}
    const regionalTitle=trimmed.match(/^Listen: (.+)$/);if(regionalTitle)return lookup('Listen')+' · '+regionalTitle[1];
    const usageNote=trimmed.match(/^Usage note: (.+)$/);if(usageNote)return lookup('Usage note')+': '+lookup(usageNote[1]);
    const progress=trimmed.match(/^([\d\s/,]+) (learned|understood)$/i);if(progress)return lookup('Understood')+' '+progress[1];
    const quiz=trimmed.match(/^What does “(.+)” (mean|express)\?$/);if(quiz)return lookup('What does the key line mean?')+' 「'+quiz[1]+'」';
    const purpose=trimmed.match(/^What is “(.+)” used for\?$/);if(purpose)return lookup('Quick check')+' · 「'+purpose[1]+'」';
    const situation=trimmed.match(/^In what situation might you hear “(.+)”\?$/);if(situation)return lookup('Scene')+' · 「'+situation[1]+'」';
    const answer=trimmed.match(/^The answer is “(.+)”\.$/);if(answer)return lookup('Natural meaning')+' · 「'+lookup(answer[1])+'」';
    const colon=trimmed.indexOf(': ');if(colon>0&&d[trimmed.slice(colon+2)])return trimmed.slice(0,colon)+': '+d[trimmed.slice(colon+2)];
    const dynamic=trimmed.match(/^(Understood|Practice a dialogue|Dialogue|Audio practice|Showing|Collected)\s*([\d\s/·,]+)$/);if(dynamic&&d[dynamic[1]])return d[dynamic[1]]+' '+dynamic[2];
    const count=trimmed.match(/^(\d[\d,.]*)\s+(.+)$/);if(count&&d[count[2]])return count[1]+' '+d[count[2]];
    return value;
  }
  function apply(){if(applying||!base)return;applying=true;observer?.disconnect();document.documentElement.lang=code;document.body.dataset.displayLang=code;document.body.style.setProperty('--situation-label',JSON.stringify(lookup('Situation')));
    const root=document.body;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){const p=node.parentElement;if(!p||p.closest('script,style,[lang=ja],#display-language,.phrase-reading,.phrase-kana,.brand-title,.brand-sub,.intro-kicker'))continue;const original=originals.get(node)||node.nodeValue;const translated=lookup(original);if(translated!==original){originals.set(node,original);node.nodeValue=translated;}}
    for(const el of root.querySelectorAll('[data-en],[data-en-placeholder]')){if(el.dataset.en&&code!=='ja'){const v=lookup(el.dataset.en);if(el.childNodes.length===1&&el.firstChild.nodeType===3){originals.set(el.firstChild,el.dataset.en);el.textContent=v;}}if(el.dataset.enPlaceholder&&code!=='ja')el.placeholder=lookup(el.dataset.enPlaceholder);}
    for(const el of root.querySelectorAll('[aria-label],[title],[placeholder]')){if(el.id==='display-language')continue;for(const key of ['aria-label','title','placeholder']){const v=el.getAttribute(key);if(!v)continue;const next=lookup(v);if(next!==v){if(!attributes.has(el))attributes.set(el,{});if(!attributes.get(el)[key])attributes.get(el)[key]=v;el.setAttribute(key,next);}}}
    for(const el of root.querySelectorAll('.turn-translation p[lang=en],.dialogue-reply span[lang=en]'))el.lang=code==='ja'?'en':code;
    const title=root.querySelector('.title-en');if(title&&code!=='ja'&&code!=='en'){title.textContent=lookup('A little phrase. A whole new place.');}
    root.querySelectorAll('[data-translation-language-label]').forEach(el=>{el.textContent=code==='ja'?'English':names[code];});
    for(const reference of root.querySelectorAll('.english-reference')){reference.querySelector('summary').textContent=lookup('English reference');if(code==='ja'||code==='en'){reference.before(...reference.querySelectorAll(':scope > p'));reference.remove();}}
    if(!['ja','en'].includes(code))for(const paragraph of root.querySelectorAll('.meaning-note,.knowledge-card p,.region-description,.region-source')){if(paragraph.closest('.english-reference'))continue;const value=paragraph.textContent.trim();if(value.length<35||lookup(value)!==value||folded.get(code)?.values.has(value)||(/\b(the|you|your|means|should|with|when|this|region|workplace|Japanese)\b/gi.exec(value)===null))continue;if(/[\u1000-\u109f\u0d80-\u0dff]/.test(value))continue;const reference=document.createElement('details');reference.className='english-reference';const summary=document.createElement('summary');summary.textContent=lookup('English reference');reference.append(summary);paragraph.before(reference);reference.append(paragraph);}
    for(const [n]of originals)if(!n.isConnected)originals.delete(n);for(const[n]of attributes)if(!n.isConnected)attributes.delete(n);
    observer?.observe(root,{childList:true,subtree:true,characterData:true});applying=false;
  }
  function set(next){if(!codes.includes(next))return;observer?.disconnect();for(const[n,value]of originals)if(n.isConnected)n.nodeValue=value;for(const[n,attrs]of attributes)if(n.isConnected)for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);originals.clear();attributes.clear();const title=document.querySelector('.title-en');if(title)title.innerHTML=baseTitle;code=next;try{localStorage.setItem('kotoba-display-language',code);}catch{}base(code==='ja'?'ja':'en');apply();document.dispatchEvent(new CustomEvent('kotoba-language',{detail:{code}}));}
  window.KotobaI18n={get code(){return code;},get ready(){return!!base;},names,lookup,text:(ja,en)=>code==='ja'?ja:lookup(en),apply,set,init(fn){baseTitle=document.querySelector('.title-en')?.innerHTML||'';document.querySelectorAll('.meaning-label').forEach(el=>{if(el.textContent==='English')el.dataset.translationLanguageLabel='true';});base=fn;observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(()=>{scheduled=false;apply();});}});let saved='ja';try{saved=localStorage.getItem('kotoba-display-language')||'ja';}catch{}set(codes.includes(saved)?saved:'ja');}};
})();
