/* Langscope · dados de uso: Stack Overflow Developer Survey 2026, ODbL 1.0.
   Notas de dificuldade: estimativas analíticas (não dados da pesquisa).
   Os exemplos mostram saídas previstas, não executam código externo. */
'use strict';

const LANGUAGES = [
  {id:'py',name:'Python',symbol:'Py',pct:58,tags:['IA e dados','Backend','Automação'],f:[2,2,2,2],code:'print(2 + 2)',reason:'Sintaxe enxuta, poucas exigências iniciais e ampla biblioteca padrão.'},
  {id:'ruby',name:'Ruby',symbol:'Rb',pct:5.8,tags:['Backend','Automação'],f:[2,3,2,2],code:'puts 2 + 2',reason:'Sintaxe expressiva e legível, com convenções e recursos dinâmicos próprios.'},
  {id:'lua',name:'Lua',symbol:'Lu',pct:9.4,tags:['Games','Sistemas'],f:[2,3,2,3],code:'print(2 + 2)',reason:'Linguagem pequena e direta; tabelas e integração com outras aplicações pedem adaptação.'},
  {id:'gd',name:'GDScript',symbol:'Gd',pct:4,tags:['Games'],f:[2,3,5,2],code:'extends Node\n\nfunc _ready():\n    print(2 + 2)',reason:'Sintaxe acessível, mas o código normalmente depende do motor Godot.',note:'Exemplo para um script associado a um Node no Godot.'},
  {id:'js',name:'JavaScript',symbol:'JS',pct:62,tags:['Web','Backend','Automação'],f:[3,5,2,3],code:'console.log(2 + 2);',reason:'Começar é fácil; coerção de tipos, assincronia e detalhes do runtime elevam a dificuldade.'},
  {id:'php',name:'PHP',symbol:'PHP',pct:17.7,tags:['Web','Backend'],f:[3,4,3,4],code:'<?php\necho 2 + 2, PHP_EOL;',reason:'Entrada acessível no desenvolvimento web, com particularidades da linguagem e do ambiente.'},
  {id:'r',name:'R',symbol:'R',pct:4.5,tags:['IA e dados','Pesquisa'],f:[3,5,3,3],code:'print(2 + 2)',out:'[1] 4',reason:'Expressiva em estatística, mas a semântica vetorial e suas estruturas de dados são próprias.'},
  {id:'bash',name:'Bash / Shell',symbol:'sh',pct:51.3,tags:['Automação','Sistemas'],f:[3,5,2,4],code:'echo $((2 + 2))',reason:'Os comandos iniciais são simples; aspas, expansões e scripts robustos exigem atenção.',note:'O exemplo usa Bash; a pesquisa agrupa todos os shells.'},
  {id:'ps',name:'PowerShell',symbol:'PS',pct:24.6,tags:['Automação','Sistemas'],f:[4,5,3,4],code:'Write-Output (2 + 2)',reason:'Boa integração com sistemas e objetos; pipelines e convenções aumentam o aprendizado.'},
  {id:'ts',name:'TypeScript',symbol:'TS',pct:43.8,tags:['Web','Backend'],f:[4,6,4,3],code:'const resultado: number = 2 + 2;\nconsole.log(resultado);',reason:'Acrescenta tipagem estática e ferramentas de compilação à base do JavaScript.',note:'Precisa de transpiler ou runtime com suporte a TypeScript.'},
  {id:'go',name:'Go',symbol:'Go',pct:16.5,tags:['Backend','Sistemas'],f:[4,5,4,5],code:'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println(2 + 2)\n}',reason:'Sintaxe relativamente enxuta, compilação explícita e conceitos graduais de interfaces e concorrência.'},
  {id:'dart',name:'Dart',symbol:'Dt',pct:4.9,tags:['Mobile','Web'],f:[4,6,4,4],code:'void main() {\n  print(2 + 2);\n}',reason:'Tipagem, objetos e programação assíncrona tornam o aprendizado mais denso.'},
  {id:'cs',name:'C#',symbol:'C#',pct:27.1,tags:['Backend','Games'],f:[5,6,5,4],code:'Console.WriteLine(2 + 2);',reason:'Entrada legível, mas .NET e os recursos avançados formam um ecossistema extenso.',note:'Instruções de nível superior em C# moderno.'},
  {id:'kt',name:'Kotlin',symbol:'Kt',pct:10.8,tags:['Mobile','Backend'],f:[5,6,5,5],code:'fun main() {\n    println(2 + 2)\n}',reason:'Tipagem estática, nulidade, objetos e recursos funcionais aumentam a densidade conceitual.'},
  {id:'java',name:'Java',symbol:'Ja',pct:27.6,tags:['Backend','Mobile'],f:[6,6,5,4],code:'class Main {\n    public static void main(String[] args) {\n        System.out.println(2 + 2);\n    }\n}',reason:'Exige mais formalidade desde o primeiro programa, com tipos, classes e estrutura explícita.'},
  {id:'swift',name:'Swift',symbol:'Sw',pct:5.9,tags:['Mobile'],f:[5,6,6,5],code:'print(2 + 2)',reason:'Início direto, mas optionals, tipos e abstrações exigem estudo adicional.'},
  {id:'c',name:'C',symbol:'C',pct:21.8,tags:['Sistemas'],f:[7,7,7,9],code:'#include <stdio.h>\n\nint main(void) {\n    printf("%d\\n", 2 + 2);\n    return 0;\n}',reason:'Demanda compreender memória, ponteiros, compilação e comportamento indefinido.'},
  {id:'hs',name:'Haskell',symbol:'Hs',pct:2.3,tags:['Pesquisa'],f:[7,10,6,7],code:'main :: IO ()\nmain = print (2 + 2)',reason:'Programação funcional pura, avaliação preguiçosa e tipos mudam o modelo mental habitual.'},
  {id:'rs',name:'Rust',symbol:'Rs',pct:18,tags:['Sistemas','Backend'],f:[8,9,7,9],code:'fn main() {\n    println!("{}", 2 + 2);\n}',reason:'Ownership, borrowing, lifetimes e segurança de memória exigem conceitos novos.'},
  {id:'cpp',name:'C++',symbol:'C++',pct:24.3,tags:['Sistemas','Games'],f:[8,9,8,10],code:'#include <iostream>\n\nint main() {\n    std::cout << 2 + 2 << \'\\n\';\n}',reason:'Reúne controle de recursos, vários paradigmas, templates e muita compatibilidade histórica.'},
  {id:'asm',name:'Assembly',symbol:'asm',pct:7.2,tags:['Sistemas'],f:[10,10,10,10],code:'section .data\n    output db \'0\', 10\n\nsection .text\n    global _start\n\n_start:\n    mov al, 2\n    add al, 2\n    add byte [output], al\n    mov eax, 1\n    mov edi, 1\n    lea rsi, [rel output]\n    mov edx, 2\n    syscall\n    mov eax, 60\n    xor edi, edi\n    syscall',reason:'Lida diretamente com registradores, arquitetura do processador e chamadas de sistema.',note:'Exemplo específico para Linux x86-64, sintaxe NASM.'},
  {id:'sql',name:'SQL',symbol:'SQL',pct:58.4,tags:['IA e dados','Backend'],f:null,code:'SELECT 2 + 2 AS resultado;',out:'resultado\n---------\n4',reason:'Linguagem declarativa para consultar e manipular dados, com objetivos distintos das linguagens gerais.',note:'O resultado aparece como uma linha de consulta, não como texto de terminal.'}
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

function showView(view,updateHash=true){
  activeView = view==='lab'?'lab':'ranking';
  $('#ranking-view').hidden=activeView!=='ranking';
  $('#lab-view').hidden=activeView!=='lab';
  $$('.view-tab').forEach(btn=>{
    const active=btn.dataset.view===activeView;
    btn.classList.toggle('is-active',active);
    if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');
  });
  if(activeView==='lab')renderCompare();
  if(updateHash){const hash=activeView==='lab'?'#comparar':'#ranking';if(location.hash!==hash)location.hash=hash;}
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
  return `<div class="compare-top"><div class="compare-identity">${logoMarkup(item)}<label class="select-wrap"><span class="sr-only">Linguagem ${side==='left'?'esquerda':'direita'}</span><select data-choice="${side}">${optionList(item.id)}</select></label></div><div class="small-rating"><strong>${diff===null?'—':decimal(diff)} <span class="outof">/10</span></strong><small>Dificuldade</small></div></div>
    <div class="code-card"><div class="code-top"><span class="file-tag">${escapeHtml(item.name.toLowerCase())}</span><button type="button" class="copy-btn" data-copy="${side}" aria-label="Copiar código ${escapeHtml(item.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>Copiar</button></div><div class="code-body"><pre><code>${escapeHtml(item.code)}</code></pre></div></div>
    <div class="result-row"><span class="result-label">${item.id==='sql'?'Resultado da consulta':'Saída esperada'}</span></div><div class="result-box">${escapeHtml(item.out||'4')}</div>
    <p class="description">${escapeHtml(item.reason)}</p>${item.note?`<p class="note">${escapeHtml(item.note)}</p>`:''}
    <section class="difficulty-details" aria-label="Avaliação da Dificuldade: ${escapeHtml(item.name)}"><h2>Avaliação da Dificuldade</h2>${factors}</section>`;
}

function renderCompare(){
  $('#compare-left').innerHTML=compareMarkup(findLang(selected.left),'left');
  $('#compare-right').innerHTML=compareMarkup(findLang(selected.right),'right');
}

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
$('#search').addEventListener('input',renderRanking);
$('#area').addEventListener('change',()=>{writeStore('langscope:area',$('#area').value);renderRanking();});
$('#sort').addEventListener('change',()=>{writeStore('langscope:sort',$('#sort').value);renderRanking();});
$('#clear-filters').addEventListener('click',()=>{$('#search').value='';$('#area').value='all';$('#sort').value='easy';writeStore('langscope:area','all');writeStore('langscope:sort','easy');renderRanking();});
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
renderRanking();
showView(location.hash==='#comparar'?'lab':'ranking',false);
