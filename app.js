/* Langscope · dados de uso: Stack Overflow Developer Survey 2026, ODbL 1.0.
   Notas de dificuldade: estimativas analíticas (não dados da pesquisa).
   Os exemplos mostram saídas previstas, não executam código externo. */
'use strict';

const LANGUAGES = [
  {id:'py',name:'Python',symbol:'Py',pct:58,tags:['IA e dados','Backend','Automação'],f:[2,2,2,2],code:'print(2 + 2)',reason:'Fácil de ler e escrever, é muito usada em automação, dados e IA.'},
  {id:'ruby',name:'Ruby',symbol:'Rb',pct:5.8,tags:['Backend','Automação'],f:[2,3,2,2],code:'puts 2 + 2',reason:'Prioriza código fácil de entender e é bastante usada em aplicações web.'},
  {id:'lua',name:'Lua',symbol:'Lu',pct:9.4,tags:['Games','Sistemas'],f:[2,3,2,3],code:'print(2 + 2)',reason:'Leve e simples, costuma ser usada em jogos e dentro de outros programas.'},
  {id:'gd',name:'GDScript',symbol:'Gd',pct:4,tags:['Games'],f:[2,3,5,2],code:'extends Node\n\nfunc _ready():\n    print(2 + 2)',reason:'Criada para desenvolver jogos no Godot, com escrita simples e direta.'},
  {id:'js',name:'JavaScript',symbol:'JS',pct:62,tags:['Web','Backend','Automação'],f:[3,5,2,3],code:'console.log(2 + 2);',reason:'Essencial para sites interativos, mas algumas regras podem confundir no início.'},
  {id:'php',name:'PHP',symbol:'PHP',pct:17.7,tags:['Web','Backend'],f:[3,4,3,4],code:'<?php\necho 2 + 2, PHP_EOL;',reason:'Muito usada em sites e servidores, com um começo relativamente acessível.'},
  {id:'r',name:'R',symbol:'R',pct:4.5,tags:['IA e dados','Pesquisa'],f:[3,5,3,3],code:'print(2 + 2)',out:'[1] 4',reason:'Voltada à análise de dados, gráficos e cálculos estatísticos.'},
  {id:'bash',name:'Bash / Shell',symbol:'sh',pct:51.3,tags:['Automação','Sistemas'],f:[3,5,2,4],code:'echo $((2 + 2))',reason:'Automatiza comandos do computador; tarefas maiores exigem mais cuidado.'},
  {id:'ps',name:'PowerShell',symbol:'PS',pct:24.6,tags:['Automação','Sistemas'],f:[4,5,3,4],code:'Write-Output (2 + 2)',reason:'Automatiza tarefas e ajuda a administrar computadores e servidores.'},
  {id:'ts',name:'TypeScript',symbol:'TS',pct:43.8,tags:['Web','Backend'],f:[4,6,4,3],code:'const resultado: number = 2 + 2;\nconsole.log(resultado);',reason:'Adiciona tipos ao JavaScript para ajudar a encontrar erros no código.'},
  {id:'go',name:'Go',symbol:'Go',pct:16.5,tags:['Backend','Sistemas'],f:[4,5,4,5],code:'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println(2 + 2)\n}',reason:'Boa para serviços e aplicações de servidor, com regras relativamente simples.'},
  {id:'dart',name:'Dart',symbol:'Dt',pct:4.9,tags:['Mobile','Web'],f:[4,6,4,4],code:'void main() {\n  print(2 + 2);\n}',reason:'Usada em aplicativos com Flutter, com recursos comuns a outras linguagens.'},
  {id:'cs',name:'C#',symbol:'C#',pct:27.1,tags:['Backend','Games'],f:[5,6,5,4],code:'Console.WriteLine(2 + 2);',reason:'Usada em sistemas, sites e jogos, especialmente com tecnologias Microsoft.'},
  {id:'kt',name:'Kotlin',symbol:'Kt',pct:10.8,tags:['Mobile','Backend'],f:[5,6,5,5],code:'fun main() {\n    println(2 + 2)\n}',reason:'Muito usada em aplicativos Android e também no desenvolvimento de servidores.'},
  {id:'java',name:'Java',symbol:'Ja',pct:27.6,tags:['Backend','Mobile'],f:[6,6,5,4],code:'class Main {\n    public static void main(String[] args) {\n        System.out.println(2 + 2);\n    }\n}',reason:'Comum em sistemas empresariais; exige mais estrutura desde o começo.'},
  {id:'swift',name:'Swift',symbol:'Sw',pct:5.9,tags:['Mobile'],f:[5,6,6,5],code:'print(2 + 2)',reason:'Criada para aplicativos Apple, tem início simples e regras de tipos mais rígidas.'},
  {id:'c',name:'C',symbol:'C',pct:21.8,tags:['Sistemas'],f:[7,7,7,9],code:'#include <stdio.h>\n\nint main(void) {\n    printf("%d\\n", 2 + 2);\n    return 0;\n}',reason:'Permite trabalhar perto do funcionamento do computador e da sua memória.'},
  {id:'hs',name:'Haskell',symbol:'Hs',pct:2.3,tags:['Pesquisa'],f:[7,10,6,7],code:'main :: IO ()\nmain = print (2 + 2)',reason:'Organiza programas em torno de funções, com um jeito diferente de pensar.'},
  {id:'rs',name:'Rust',symbol:'Rs',pct:18,tags:['Sistemas','Backend'],f:[8,9,7,9],code:'fn main() {\n    println!("{}", 2 + 2);\n}',reason:'Busca desempenho e segurança com regras rígidas sobre o uso da memória.'},
  {id:'cpp',name:'C++',symbol:'C++',pct:24.3,tags:['Sistemas','Games'],f:[8,9,8,10],code:'#include <iostream>\n\nint main() {\n    std::cout << 2 + 2 << \'\\n\';\n}',reason:'Presente em jogos e programas de alto desempenho, com muitos recursos e regras.'},
  {id:'asm',name:'Assembly',symbol:'asm',pct:7.2,tags:['Sistemas'],f:[10,10,10,10],code:'section .data\n    output db \'0\', 10\n\nsection .text\n    global _start\n\n_start:\n    mov al, 2\n    add al, 2\n    add byte [output], al\n    mov eax, 1\n    mov edi, 1\n    lea rsi, [rel output]\n    mov edx, 2\n    syscall\n    mov eax, 60\n    xor edi, edi\n    syscall',reason:'Trabalha diretamente com instruções do processador e exige entender hardware.'},
  {id:'sql',name:'SQL',symbol:'SQL',pct:58.4,tags:['IA e dados','Backend'],f:null,code:'SELECT 2 + 2 AS resultado;',out:'resultado\n---------\n4',reason:'Usada para consultar e modificar informações em bancos de dados.'}
];

const FACTORS = [
  {label:'Sintaxe',weight:0.30},
  {label:'Conceitos',weight:0.35},
  {label:'Ferramentas',weight:0.15},
  {label:'Técnica',weight:0.20}
];
const difficulty = item => item.f === null ? null : Math.round(item.f.reduce((acc,score,i)=>acc+score*FACTORS[i].weight,0)*10)/10;
const usageScore = item => Math.round(item.pct/62*100)/10;
const decimal = n => n.toFixed(1).replace('.',',');
const escapeHtml = text => String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
// Logotipos Devicon; os ícones de SQL e Assembly são representações genéricas.
const ICON_NAMES = {py:'python',ruby:'ruby',lua:'lua',gd:'godot',js:'javascript',php:'php',r:'r',bash:'bash',ps:'powershell',ts:'typescript',go:'go',dart:'dart',cs:'csharp',kt:'kotlin',java:'java',swift:'swift',c:'c',hs:'haskell',rs:'rust',cpp:'cplusplus'};
function logoMarkup(item){
  const alias=ICON_NAMES[item.id];
  const src=alias?`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${alias}/${alias}-original.svg`:`./icons/${item.id==='asm'?'assembly':'sql'}.svg`;
  return `<span class="lang-mark" aria-hidden="true"><img src="${src}" alt="" loading="lazy" decoding="async"><span class="fallback-mark">${escapeHtml(item.symbol)}</span></span>`;
}
// A fallback inicial permanece visível até a imagem carregar. Se falhar, exibe a sigla.
document.addEventListener('load',event=>{
  if(event.target.matches?.('.lang-mark img'))event.target.classList.add('is-loaded');
},true);
document.addEventListener('error',event=>{
  if(event.target.matches?.('.lang-mark img'))event.target.hidden=true;
},true);
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const readStore = (key,def) => {try{return localStorage.getItem(key)||def;}catch{return def;}};
const writeStore = (key,value) => {try{localStorage.setItem(key,value);}catch{/* storage may be blocked */}};
const selected = {left:readStore('langscope:left','py'),right:readStore('langscope:right','ts')};
const findLang = id => LANGUAGES.find(item=>item.id===id) || LANGUAGES[0];
selected.left=findLang(selected.left).id;
selected.right=findLang(selected.right).id;
let activeView = 'ranking';
let toastTimeout;
let openDropdown = null;

function showView(view,updateHash=true){
  closeDropdown();
  activeView = view==='lab'?'lab':'ranking';
  $('#ranking-view').hidden=activeView!=='ranking';
  $('#lab-view').hidden=activeView!=='lab';
  $$('.view-tab').forEach(btn=>{
    const active=btn.dataset.view===activeView;
    btn.classList.toggle('is-active',active);
    if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
  });
  $$('[data-footer-view]').forEach(link=>{
    if(link.dataset.footerView===activeView) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if(activeView==='lab')renderCompare();
  if(updateHash){const hash=activeView==='lab'?'#comparar':'#ranking';if(location.hash!==hash)location.hash=hash;window.scrollTo(0,0);}
}

function sortedLanguages(){
  const q=$('#search').value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const area=$('#area').value;
  const sort=$('#sort').value;
  const results=LANGUAGES.filter(item=>{
    const name=item.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return name.includes(q) && (area==='all'||item.tags.includes(area));
  });
  results.sort((a,b)=>{
    if(sort==='popular')return b.pct-a.pct||a.name.localeCompare(b.name);
    if(sort==='least')return a.pct-b.pct||a.name.localeCompare(b.name);
    if(sort==='name')return a.name.localeCompare(b.name);
    const da=difficulty(a),db=difficulty(b);
    if(da===null)return 1;if(db===null)return -1;
    return sort==='hard'?db-da||b.pct-a.pct:da-db||b.pct-a.pct;
  });
  return results;
}

function renderRanking(){
  const languages=sortedLanguages();
  $('#empty-state').hidden=languages.length>0;
  $('#results-count').textContent=`${languages.length} / ${LANGUAGES.length} linguagens`;
  $('#rankings-body').innerHTML=languages.map((item,i)=>{
    const diff=difficulty(item),usage=usageScore(item),tone=diff===null?'score-na':'';
    const scoreDisplay=diff===null?'N/A':decimal(diff);
    return `<tr><td><div class="lang-cell"><span class="rank-index">${String(i+1).padStart(2,'0')}</span>${logoMarkup(item)}<span class="lang-main"><button type="button" class="lang-name-button" data-lang="${item.id}" aria-label="Comparar código de ${escapeHtml(item.name)}">${escapeHtml(item.name)}</button><span class="lang-area">${escapeHtml(item.tags[0])}</span></span></div></td><td><span class="score ${tone}" title="Dificuldade estimada ${scoreDisplay} de 10">${scoreDisplay}</span></td><td><span class="metric-cell"><span class="metric-bar" aria-hidden="true"><i style="width:${item.pct/62*100}%"></i></span><span class="usage-note">${decimal(item.pct)}%</span></span></td><td><span class="usage-rating">${decimal(usage)}</span></td></tr>`;
  }).join('');
}

function optionList(selectedId){return LANGUAGES.map(item=>`<option value="${item.id}"${item.id===selectedId?' selected':''}>${escapeHtml(item.name)}</option>`).join('');}

function compareMarkup(item,side){
  const diff=difficulty(item);
  const factors=item.f===null
    ? '<p class="sql-note">A dificuldade de SQL não é comparada diretamente às demais linguagens.</p>'
    : `<div class="factor-grid">${FACTORS.map((factor,i)=>`<div><div class="factor-label"><span>${factor.label}</span><strong>${item.f[i]}/10</strong></div><div class="factor-track"><span style="width:${item.f[i]*10}%"></span></div></div>`).join('')}</div>`;
  return `<div class="compare-top"><div class="compare-identity">${logoMarkup(item)}<div class="select-wrap"><span class="sr-only">Linguagem ${side==='left'?'esquerda':'direita'}</span><select data-choice="${side}">${optionList(item.id)}</select></div></div><div class="small-rating"><strong>${diff===null?'—':decimal(diff)} <span class="outof">/10</span></strong><small>Dificuldade</small></div></div>
    <p class="description">${escapeHtml(item.reason)}</p>
    <div class="code-card"><div class="code-top"><span class="file-tag">${escapeHtml(item.name.toLowerCase())}</span><button type="button" class="copy-btn" data-copy="${side}" aria-label="Copiar código ${escapeHtml(item.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>Copiar</button></div><div class="code-body" tabindex="0" role="region" aria-label="Código ${escapeHtml(item.name)}"><pre><code>${escapeHtml(item.code)}</code></pre></div><div class="code-scroll-track" aria-hidden="true"><span class="code-scroll-thumb"></span></div></div>
    <div class="result-row"><span class="result-label">${item.id==='sql'?'Resultado da consulta':'Saída esperada'}</span></div><div class="result-box${item.id==='sql'?' result-box--multiline':''}">${escapeHtml(item.out||'4')}</div>
    <section class="difficulty-details" aria-label="Avaliação da Dificuldade: ${escapeHtml(item.name)}"><h2>Avaliação da Dificuldade</h2>${factors}</section>`;
}

// A dedicated visual track remains visible on browsers with auto-hidden scrollbars
// (including macOS/iOS). Native touch, wheel and keyboard scrolling stays intact.
function syncCodeScroll(code){
  if(!code.isConnected)return;
  const card=code.closest('.code-card');
  const track=card.querySelector('.code-scroll-track');
  const thumb=track.querySelector('.code-scroll-thumb');
  const overflow=code.scrollHeight>code.clientHeight+2;
  card.classList.toggle('has-vertical-overflow',overflow);
  if(!overflow)return;
  const thumbHeight=Math.max(22,Math.round(track.clientHeight*code.clientHeight/code.scrollHeight));
  const range=Math.max(0,track.clientHeight-thumbHeight);
  const progress=code.scrollTop/Math.max(1,code.scrollHeight-code.clientHeight);
  thumb.style.height=`${thumbHeight}px`;
  thumb.style.transform=`translateY(${Math.round(range*progress)}px)`;
}
const codeScrollObserver=typeof ResizeObserver==='function'
  ? new ResizeObserver(()=>$$('#lab-view .code-body').forEach(syncCodeScroll))
  : null;
// Keep side-by-side code boxes aligned, but reserve only the space the longer
// description actually needs. On mobile the cards stack and descriptions use natural height.
function alignDescriptions(){
  if($('#lab-view').hidden)return;
  const descriptions=$$('#lab-view .description');
  descriptions.forEach(el=>el.style.height='auto');
  if(window.innerWidth<=700)return;
  const required=Math.max(...descriptions.map(el=>el.scrollHeight));
  descriptions.forEach(el=>el.style.height=`${required}px`);
}
function renderCompare(){
  closeDropdown();
  codeScrollObserver?.disconnect();
  $('#compare-left').innerHTML=compareMarkup(findLang(selected.left),'left');
  $('#compare-right').innerHTML=compareMarkup(findLang(selected.right),'right');
  $$('#lab-view select[data-choice]').forEach(enhanceSelect);
  alignDescriptions();
  $$('#lab-view .code-body').forEach(code=>{
    code.addEventListener('scroll',()=>syncCodeScroll(code),{passive:true});
    codeScrollObserver?.observe(code);
    codeScrollObserver?.observe(code.querySelector('pre'));
    syncCodeScroll(code);
  });
}
window.addEventListener('resize',()=>{alignDescriptions();$$('#lab-view .code-body').forEach(syncCodeScroll);},{passive:true});

// Custom anchored listbox: the source <select> keeps the existing filter/change logic.
// Its native picker is left as a fallback if JavaScript fails to initialize.
let dropdownSeq = 0;
function enhanceSelect(select){
  if(select.dataset.enhanced==='true')return;
  const wrap=select.closest('.select-wrap');
  const label=wrap.querySelector('.sr-only')?.textContent || 'Selecionar';
  const id=`dropdown-${++dropdownSeq}`;
  const trigger=document.createElement('button');
  trigger.type='button';trigger.className='dropdown-trigger';
  trigger.setAttribute('aria-label',label);
  trigger.setAttribute('aria-haspopup','listbox');
  trigger.setAttribute('aria-controls',id);
  trigger.setAttribute('aria-expanded','false');
  const menu=document.createElement('div');
  menu.className='dropdown-options';menu.id=id;menu.setAttribute('role','listbox');
  menu.setAttribute('aria-label',label);menu.hidden=true;
  const isLanguage=select.hasAttribute('data-choice');
  for(const option of select.options){
    const item=document.createElement('div');
    item.className='dropdown-option';item.setAttribute('role','option');
    item.setAttribute('tabindex','-1');item.dataset.value=option.value;
    item.setAttribute('aria-selected',String(option.value===select.value));
    item.id=`${id}-opt-${menu.children.length}`;
    if(isLanguage){
      const lang=findLang(option.value);
      item.innerHTML=`${logoMarkup(lang)}<span class="chosen-label">${escapeHtml(option.textContent)}</span><span class="chosen-check" aria-hidden="true">✓</span>`;
    }else{
      item.innerHTML=`<span class="chosen-label">${escapeHtml(option.textContent)}</span><span class="chosen-check" aria-hidden="true">✓</span>`;
    }
    item.addEventListener('click',()=>{
      const changed=select.value!==item.dataset.value;
      select.value=item.dataset.value;
      syncSelect();closeDropdown();
      if(changed)select.dispatchEvent(new Event('change',{bubbles:true}));
      if(trigger.isConnected)trigger.focus({preventScroll:true});
    });
    menu.append(item);
  }
  function syncSelect(){
    const selectedOption=[...select.options].find(o=>o.value===select.value);
    // The comparison panel already displays its language logo beside the field.
    trigger.innerHTML=`<span class="chosen-label">${escapeHtml(selectedOption?.textContent || '')}</span>`;
    menu.querySelectorAll('[role="option"]').forEach(item=>item.setAttribute('aria-selected',String(item.dataset.value===select.value)));
  }
  wrap.append(trigger,menu);
  select.hidden=true;select.tabIndex=-1;select.dataset.enhanced='true';
  function open(){
    if(openDropdown===wrap){closeDropdown();return;}
    closeDropdown();
    menu.hidden=false;wrap.classList.add('is-open');
    wrap.closest('.compare-panel')?.classList.add('menu-open');
    trigger.setAttribute('aria-expanded','true');
    openDropdown=wrap;
    menu.scrollTop=0; // Open at the start of the list, never centered on the selected item.
    // Keep the menu under its field and allow the document to scroll to reveal it.
    requestAnimationFrame(()=>{
      if(openDropdown!==wrap)return;
      const bottom=menu.getBoundingClientRect().bottom;
      const limit=window.visualViewport?.height || window.innerHeight;
      if(bottom>limit-12)window.scrollBy({top:bottom-limit+18,behavior:'smooth'});
    });
  }
  trigger.addEventListener('click',open);
  trigger.addEventListener('keydown',event=>{
    if(['ArrowDown','ArrowUp','Enter',' '].includes(event.key)){
      event.preventDefault();if(openDropdown!==wrap)open();
      const first=menu.querySelector('[role="option"]');
      const last=menu.lastElementChild;
      (event.key==='ArrowUp'?last:first)?.focus({preventScroll:true});
    }else if(event.key==='Escape'&&openDropdown===wrap){event.preventDefault();closeDropdown();}
  });
  menu.addEventListener('keydown',event=>{
    const options=[...menu.querySelectorAll('[role="option"]')];
    const i=options.indexOf(document.activeElement);
    let next;
    if(event.key==='ArrowDown')next=options[Math.min(i+1,options.length-1)];
    else if(event.key==='ArrowUp')next=options[Math.max(i-1,0)];
    else if(event.key==='Home')next=options[0];
    else if(event.key==='End')next=options.at(-1);
    else if(event.key==='Enter'||event.key===' '){event.preventDefault();document.activeElement.click();return;}
    else if(event.key==='Escape'){event.preventDefault();closeDropdown();trigger.focus({preventScroll:true});return;}
    else if(event.key==='Tab'){closeDropdown();return;}
    else return;
    event.preventDefault();next?.focus();
  });
  select.addEventListener('change',syncSelect);
  syncSelect();
}
function closeDropdown(){
  if(!openDropdown)return;
  const wrap=openDropdown;openDropdown=null;
  wrap.classList.remove('is-open');
  wrap.closest('.compare-panel')?.classList.remove('menu-open');
  const menu=wrap.querySelector('.dropdown-options');if(menu)menu.hidden=true;
  const trigger=wrap.querySelector('.dropdown-trigger');if(trigger)trigger.setAttribute('aria-expanded','false');
}
document.addEventListener('pointerdown',event=>{
  if(openDropdown && !openDropdown.contains(event.target))closeDropdown();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&openDropdown){
    const trigger=openDropdown.querySelector('.dropdown-trigger');
    closeDropdown();trigger?.focus({preventScroll:true});
  }
});

function showToast(message){
  const el=$('#toast');el.textContent=message;el.classList.add('visible');
  clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),2100);
}

async function copyCode(side){
  const code=findLang(selected[side]).code;
  try{
    if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(code);}
    else{
      const input=document.createElement('textarea');input.value=code;input.setAttribute('readonly','');input.style.cssText='position:fixed;opacity:0;top:-1000px;';document.body.appendChild(input);input.select();
      const ok=document.execCommand('copy');input.remove();if(!ok)throw new Error('Falha ao copiar');
    }
    showToast('Código copiado');
  }catch{showToast('Não foi possível copiar o código');}
}

// Eventos, sem bibliotecas ou build.
$$('.view-tab').forEach(tab=>tab.addEventListener('click',()=>showView(tab.dataset.view)));
// Footer navigation uses the same SPA state as the header tabs (no page reload).
$$('[data-footer-view]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  showView(link.dataset.footerView);
}));
// Using scrollTo instead of a #top hash preserves the active Comparison view.
$('#back-to-top').addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
$('#search').addEventListener('input',renderRanking);
$('#area').addEventListener('change',()=>{writeStore('langscope:area',$('#area').value);renderRanking();});
$('#sort').addEventListener('change',()=>{writeStore('langscope:sort',$('#sort').value);renderRanking();});
$('#clear-filters').addEventListener('click',()=>{$('#search').value='';$('#area').value='all';$('#sort').value='easy';$('#area').dispatchEvent(new Event('change',{bubbles:true}));$('#sort').dispatchEvent(new Event('change',{bubbles:true}));renderRanking();});
$('#rankings-body').addEventListener('click',event=>{
  const button=event.target.closest('[data-lang]');if(!button)return;
  const id=button.dataset.lang;
  if(id===selected.right){selected.right=selected.left;writeStore('langscope:right',selected.right);}
  selected.left=id;writeStore('langscope:left',id);
  showView('lab');
});
$('#lab-view').addEventListener('change',event=>{
  if(!event.target.matches('[data-choice]'))return;
  const side=event.target.dataset.choice;
  selected[side]=findLang(event.target.value).id;
  writeStore(`langscope:${side}`,selected[side]);renderCompare();
});
$('#lab-view').addEventListener('click',event=>{
  const button=event.target.closest('[data-copy]');if(button)copyCode(button.dataset.copy);
});
window.addEventListener('hashchange',()=>showView(location.hash==='#comparar'?'lab':'ranking',false));
window.addEventListener('keydown',event=>{
  if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.activeElement.isContentEditable){
    event.preventDefault();showView('ranking');$('#search').focus();
  }
});

$('#sort').value=['easy','hard','popular','least','name'].includes(readStore('langscope:sort','easy'))?readStore('langscope:sort','easy'):'easy';
$('#area').value=['all','IA e dados','Backend','Web','Automação','Mobile','Sistemas','Games','Pesquisa'].includes(readStore('langscope:area','all'))?readStore('langscope:area','all'):'all';
$$('.filters select').forEach(enhanceSelect);
renderRanking();
showView(location.hash==='#comparar'?'lab':'ranking',false);
