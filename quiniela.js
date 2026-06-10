/* =========================================================
   QUINIELA STANLEY — motor de pronósticos por etapas (diseño v1)
   Sin backend: el estado se guarda en localStorage.
   Luego se enchufa login / Google Sheets y el cálculo de puntos.
   ========================================================= */

/* ---- banderas por imagen (flagcdn) — los emojis no renderizan en Windows ---- */
const flagURL = iso => `https://flagcdn.com/h40/${iso}.png`;
const flagTag = t => `<img class="flagimg" src="${flagURL(t.iso)}" alt="${t.name}" loading="lazy" />`;

/* ---- 48 selecciones (genéricas, editar al conocerse el sorteo) — [nombre, ISO] ---- */
const TEAMS = [
  ["Argentina","ar"],["Brasil","br"],["Uruguay","uy"],["Colombia","co"],
  ["Chile","cl"],["Perú","pe"],["Ecuador","ec"],["Paraguay","py"],
  ["Bolivia","bo"],["Venezuela","ve"],["Francia","fr"],["Alemania","de"],
  ["España","es"],["Italia","it"],["Portugal","pt"],["Países Bajos","nl"],
  ["Bélgica","be"],["Inglaterra","gb-eng"],["Croacia","hr"],["Dinamarca","dk"],
  ["Suiza","ch"],["Serbia","rs"],["Polonia","pl"],["Austria","at"],
  ["Suecia","se"],["Noruega","no"],["Turquía","tr"],["Ucrania","ua"],
  ["Estados Unidos","us"],["México","mx"],["Canadá","ca"],["Costa Rica","cr"],
  ["Japón","jp"],["Corea del Sur","kr"],["Arabia Saudita","sa"],["Irán","ir"],
  ["Australia","au"],["Catar","qa"],["Marruecos","ma"],["Senegal","sn"],
  ["Nigeria","ng"],["Ghana","gh"],["Camerún","cm"],["Egipto","eg"],
  ["Argelia","dz"],["Costa de Marfil","ci"],["Túnez","tn"],["Sudáfrica","za"]
].map(([name,iso],id)=>({id,name,iso}));

/* ---- 12 grupos A–L de 4 ---- */
const GLETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const GROUPS = {};
GLETTERS.forEach((g,i)=>{ GROUPS[g] = [0,1,2,3].map(k=>i*4+k); });

/* ---- plantilla de dieciseisavos (16 partidos). Siembra provisional:
   se ajusta cuando se conozca el sorteo real. W=1.º, R=2.º, T=mejor 3.º ---- */
const R32_TEMPLATE = [
  [{t:'W',g:'A'},{t:'R',g:'B'}], [{t:'W',g:'C'},{t:'R',g:'D'}],
  [{t:'W',g:'E'},{t:'R',g:'F'}], [{t:'W',g:'G'},{t:'R',g:'H'}],
  [{t:'W',g:'I'},{t:'R',g:'J'}], [{t:'W',g:'K'},{t:'R',g:'L'}],
  [{t:'W',g:'B'},{t:'T',i:0}],   [{t:'W',g:'D'},{t:'T',i:1}],
  [{t:'W',g:'F'},{t:'T',i:2}],   [{t:'W',g:'H'},{t:'T',i:3}],
  [{t:'W',g:'J'},{t:'T',i:4}],   [{t:'W',g:'L'},{t:'T',i:5}],
  [{t:'R',g:'A'},{t:'T',i:6}],   [{t:'R',g:'C'},{t:'T',i:7}],
  [{t:'R',g:'E'},{t:'R',g:'G'}], [{t:'R',g:'I'},{t:'R',g:'K'}]
];

/* ---- etapas ---- */
const STAGES = [
  {id:'grupos', n:1, etapa:'Etapa 1', title:'Fase de grupos',  short:'Grupos',
   lead:'En cada grupo ordená 1.º, 2.º y 3.º (tocá cada equipo). Los dos primeros clasifican; después elegí los 8 mejores terceros.', locked:false},
  {id:'r32', n:2, etapa:'Etapa 2', title:'Dieciseisavos', short:'16avos', count:16, prev:null,
   lead:'Elegí quién avanza en cada llave (un toque). Después, si querés, sumá puntos extra adivinando el marcador.', locked:false},
  {id:'r16', n:3, etapa:'Etapa 3', title:'Octavos de final', short:'Octavos', count:8, prev:'r32',
   lead:'Se habilita cuando se definan los dieciseisavos.', locked:true},
  {id:'qf',  n:4, etapa:'Etapa 4', title:'Cuartos de final', short:'Cuartos', count:4, prev:'r16',
   lead:'Se habilita cuando se definan los octavos.', locked:true},
  {id:'sf',  n:5, etapa:'Etapa 5', title:'Semifinales', short:'Semis', count:2, prev:'qf',
   lead:'Se habilita cuando se definan los cuartos.', locked:true},
  {id:'final', n:6, etapa:'Etapa 6', title:'La final', short:'Final', count:1, prev:'sf',
   lead:'Elegí al campeón y al 3.er puesto. Sumá puntos extra con los marcadores.', locked:true}
];
const ROUND_ORDER = ['r32','r16','qf','sf','final'];

/* ---- estado ---- */
const KEY = 'stanley_quiniela_v1';
const DEFAULT = {rank:{}, thirds:[], scores:{}, adv:{}, design:false, active:'grupos'};
let state = load();
function load(){ try{ return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY))||{}); }catch(e){ return Object.assign({},DEFAULT); } }
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

const team = id => (id==null?null:TEAMS[id]);

/* ---- resolución de equipos clasificados ---- */
function rankTeam(g, r){ // equipo con rank r en grupo g
  const m = state.rank[g]||{};
  const found = Object.keys(m).find(id=>m[id]===r);
  return found==null?null:Number(found);
}
function thirdsTeam(i){ return state.thirds[i]!=null ? state.thirds[i] : null; }

function matchDefs(round){
  if(round==='r32') return R32_TEMPLATE;
  const prev = STAGES.find(s=>s.id===round).prev;
  const cnt = STAGES.find(s=>s.id===round).count;
  return Array.from({length:cnt},(_,i)=>[
    {t:'WIN',round:prev,m:i*2},{t:'WIN',round:prev,m:i*2+1}]);
}

function slotInfo(slot){
  switch(slot.t){
    case 'W': return {id:rankTeam(slot.g,1), label:'1.º '+slot.g};
    case 'R': return {id:rankTeam(slot.g,2), label:'2.º '+slot.g};
    case 'T': return {id:thirdsTeam(slot.i), label:'Mejor 3.º'};
    case 'WIN': return {id:getWinner(slot.round,slot.m), label:'Por definir'};
    case 'LOSE': return {id:getLoser(slot.round,slot.m), label:'Por definir'};
  }
}
function resultOf(round,m){
  const key = round+'-'+m;
  const defs = matchDefs(round)[m];
  const A = slotInfo(defs[0]).id, B = slotInfo(defs[1]).id;
  const adv = state.adv[key];                 // quién avanza = decide la cascada
  if(A==null||B==null||!adv) return {A,B,win:null,lose:null};
  const win = adv==='a'?A:B, lose = adv==='a'?B:A;
  return {A,B,win,lose};
}
const getWinner = (round,m)=> resultOf(round,m).win;
const getLoser  = (round,m)=> resultOf(round,m).lose;

/* ---- completitud (para marcar etapas hechas) ---- */
function groupsDone(){
  const allGroups = GLETTERS.every(g=> rankTeam(g,1)!=null && rankTeam(g,2)!=null);
  return allGroups && state.thirds.length===8;
}
function roundDone(round){
  const cnt = STAGES.find(s=>s.id===round).count;
  for(let m=0;m<cnt;m++){ if(getWinner(round,m)==null) return false; }
  return true;
}
const isDone = id => id==='grupos' ? groupsDone() : roundDone(id);

/* =========================================================
   RENDER
   ========================================================= */
const stepperEl = document.getElementById('stepper');
const stagesEl  = document.getElementById('stages');

function renderStepper(){
  stepperEl.innerHTML='';
  STAGES.forEach(s=>{
    const locked = s.locked && !state.design;
    const b = document.createElement('button');
    b.className='step-btn'+(s.id===state.active?' active':'')+(isDone(s.id)?' done':'')+(locked?' locked':'');
    b.innerHTML = `<span class="sb__n">${isDone(s.id)?'✓':s.n}</span>${s.short}${locked?' <span class="sb__lock">🔒</span>':''}`;
    if(!locked) b.onclick=()=>goto(s.id);
    stepperEl.appendChild(b);
  });
}

function goto(id){ state.active=id; save(); renderStepper(); renderStage(id); window.scrollTo({top:0,behavior:'smooth'}); }

function renderStage(id){
  const s = STAGES.find(x=>x.id===id);
  stagesEl.innerHTML='';
  const wrap = document.createElement('section');
  wrap.className='stage active';
  wrap.innerHTML = `<div class="stage__head">
      <span class="stage__kicker">${s.etapa}</span>
      <h2>${s.title}</h2><p>${s.lead}</p></div>`;

  const locked = s.locked && !state.design;
  if(locked){ wrap.appendChild(lockedMsg(s)); }
  else if(id==='grupos'){ wrap.appendChild(renderGroups()); wrap.appendChild(renderThirds()); }
  else { wrap.appendChild(renderRound(id)); }

  wrap.appendChild(stageNav(id));
  stagesEl.appendChild(wrap);
}

function lockedMsg(s){
  const d=document.createElement('div'); d.className='locked-msg';
  d.innerHTML=`<div class="lk__ico">🔒</div><h3>${s.title} — todavía no</h3>
    <p>Esta etapa se abre cuando se conozcan los partidos de la ronda anterior. Te avisaremos para que cargues tus pronósticos a tiempo.</p>
    <p style="margin-top:10px">Mientras tanto activá <strong>“Modo diseño”</strong> arriba para previsualizarla.</p>`;
  return d;
}

/* ---- fase de grupos ---- */
function renderGroups(){
  const grid=document.createElement('div'); grid.className='groups';
  GLETTERS.forEach(g=>{
    const card=document.createElement('div'); card.className='group';
    card.innerHTML=`<div class="group__head"><h4>Grupo ${g}</h4><span class="group__hint">1.º · 2.º clasifican · 3.º repechaje</span></div>`;
    GROUPS[g].forEach(id=>{
      const t=team(id); const r=(state.rank[g]||{})[id];
      const row=document.createElement('div');
      row.className='grow'+(r?(' r'+r):'');
      row.innerHTML=`${flagTag(t)}<span class="gname">${t.name}</span>
        <span class="grow__rank">${r?r+'°':''}</span>`;
      row.onclick=()=>cycleRank(g,id);
      card.appendChild(row);
    });
    grid.appendChild(card);
  });
  return grid;
}
function cycleRank(g,id){
  const m = state.rank[g] = state.rank[g]||{};
  if(m[id]){ // quitar
    const was=m[id]; delete m[id];
    if(was===3){ const i=state.thirds.indexOf(id); if(i>=0) state.thirds.splice(i,1); }
  } else {
    const used=Object.values(m);
    const free=[1,2,3].find(r=>!used.includes(r));
    if(!free) return; // ya hay 3 marcados
    m[id]=free;
  }
  save(); renderStepper(); renderStage('grupos');
}

function renderThirds(){
  const box=document.createElement('div'); box.className='thirds';
  // pool = equipos marcados como 3.º
  const pool=[];
  GLETTERS.forEach(g=>{ const id=rankTeam(g,3); if(id!=null) pool.push(id); });
  const n=state.thirds.length;
  box.innerHTML=`<div class="thirds__head"><h3>Mejores terceros</h3>
    <span class="counter${n===8?' full':''}">${n} / 8</span></div>
    <p class="hint">De los terceros que marcaste en cada grupo, elegí los 8 que también clasifican.</p>`;
  if(!pool.length){
    const e=document.createElement('p'); e.className='thirds__empty';
    e.textContent='Marcá un tercero (3.er toque) en los grupos para habilitar esta selección.';
    box.appendChild(e); return box;
  }
  const grid=document.createElement('div'); grid.className='thirds__grid';
  pool.forEach(id=>{
    const t=team(id); const sel=state.thirds.includes(id);
    const full = state.thirds.length>=8 && !sel;
    const chip=document.createElement('div');
    chip.className='third'+(sel?' sel':'')+(full?' disabled':'');
    chip.innerHTML=`${flagTag(t)}<span>${t.name}</span>`;
    chip.onclick=()=>{
      const i=state.thirds.indexOf(id);
      if(i>=0) state.thirds.splice(i,1);
      else { if(state.thirds.length>=8) return; state.thirds.push(id); }
      save(); renderStepper(); renderStage('grupos');
    };
    grid.appendChild(chip);
  });
  box.appendChild(grid);
  return box;
}

/* ---- rondas de bracket ---- */
function renderRound(round){
  const cont=document.createElement('div');
  const grid=document.createElement('div'); grid.className='round';
  const defs=matchDefs(round);
  defs.forEach((def,m)=> grid.appendChild(matchCard(round,m,def)));
  cont.appendChild(grid);

  if(round==='final'){
    cont.appendChild(thirdPlaceCard());
    cont.appendChild(championBanner());
  }
  return cont;
}

function matchCard(round,m,def){
  const key=round+'-'+m;
  const aI=slotInfo(def[0]), bI=slotInfo(def[1]);
  const res=resultOf(round,m);
  const card=document.createElement('div'); card.className='match'; card.dataset.key=key;
  card.innerHTML=`<div class="match__head"><span>Partido ${m+1}</span><span class="mdate">Fecha por confirmar</span></div>`;
  card.appendChild(advRow(key,'a',aI,res.win,round,m));
  card.appendChild(advRow(key,'b',bI,res.win,round,m));
  card.appendChild(matchFoot(key,round,m,aI,bI));
  return card;
}

/* fila: tocar para elegir quién AVANZA (decide la cascada) */
function advRow(key,slot,info,winId,round,m){
  const row=document.createElement('div');
  const known=info.id!=null;
  const isWin = known && winId===info.id;
  row.className='mteam'+(known?' pick':' tbd-row')+(isWin?' win':'');
  row.dataset.slot=slot;
  if(known){
    const t=team(info.id);
    row.innerHTML=`<span class="mname">${flagTag(t)} ${t.name}</span>
      <span class="advflag">${isWin?'✓ avanza':'avanza'}</span>`;
    row.onclick=()=>chooseAdv(key,slot,round,m);
  } else {
    row.innerHTML=`<span class="mname tbd">${info.label}</span>`;
  }
  return row;
}

/* pie de la tarjeta: estado + acceso al marcador (puntos extra) */
function matchFoot(key,round,m,aI,bI){
  const foot=document.createElement('div'); foot.className='match__foot';
  if(aI.id==null||bI.id==null){
    foot.innerHTML=`<span class="foot-hint">${round==='r32'?'Completá la fase de grupos':'Se define con la ronda anterior'}</span>`;
    return foot; }
  const adv=state.adv[key]; const sc=state.scores[key];
  if(!adv){ foot.innerHTML=`<span class="foot-hint">👆 Tocá quién avanza</span>`; return foot; }
  const hasScore = sc && sc.a!=null && sc.b!=null;
  const btn=document.createElement('button');
  btn.className='scorebtn'+(hasScore?' set':'');
  btn.innerHTML = hasScore ? `🎯 Marcador ${sc.a}–${sc.b} <small>editar</small>`
                           : `🎯 Adivinar marcador <small>+ puntos extra</small>`;
  btn.onclick=()=>openScoreModal(key,round,m,false);
  foot.appendChild(btn);
  return foot;
}

function chooseAdv(key,slot,round,m){
  const prev=state.adv[key];
  state.adv[key]=slot;
  // si cambió el que avanza, el marcador anterior pudo quedar contradictorio → se descarta
  if(prev && prev!==slot) delete state.scores[key];
  save();
  refreshCard(key,round,m); renderStepper();
  // recién elegido y sin marcador → ofrecer adivinarlo (puntos extra)
  if(prev!==slot && !state.scores[key]) openScoreModal(key,round,m,true);
}

function refreshCard(key,round,m){
  const old=document.querySelector(`.match[data-key="${key}"]`);
  if(old) old.replaceWith(matchCard(round,m,matchDefs(round)[m]));
}

/* ---- modal de marcador (puntos extra) ---- */
function closeModal(){ const m=document.getElementById('modal'); if(m){m.hidden=true; document.getElementById('modal-body').innerHTML='';} }
function openScoreModal(key,round,m,offer){
  const def=matchDefs(round)[m];
  const aI=slotInfo(def[0]), bI=slotInfo(def[1]);
  if(aI.id==null||bI.id==null) return;
  const A=team(aI.id), B=team(bI.id);
  const adv=state.adv[key]; if(!adv) return;
  const advTeam = adv==='a'?A:B;
  const sc=state.scores[key]||{};
  const body=document.getElementById('modal-body');
  body.innerHTML=`
    <h3 class="modal__h">⚽ ¡Avanza ${advTeam.name}!</h3>
    <p class="modal__p">${offer?'¿Querés sumar <b>puntos extra</b> adivinando el marcador exacto? Es opcional.':'Editá tu marcador para los puntos extra.'}</p>
    <div class="modal__match">
      <div class="ms-row${adv==='a'?' adv':''}"><span class="mname">${flagTag(A)} ${A.name}</span>
        <input class="score" type="number" min="0" max="99" inputmode="numeric" id="ms-a" value="${sc.a!=null?sc.a:''}"></div>
      <div class="ms-row${adv==='b'?' adv':''}"><span class="mname">${flagTag(B)} ${B.name}</span>
        <input class="score" type="number" min="0" max="99" inputmode="numeric" id="ms-b" value="${sc.b!=null?sc.b:''}"></div>
    </div>
    <p class="modal__note">📌 Si empatan, <b>${advTeam.name}</b> avanza por penales (según tu decisión).</p>
    <p class="modal__warn" id="ms-warn" hidden></p>
    <div class="modal__actions">
      ${sc.a!=null
        ? '<button class="btn btn--sm" id="ms-clear" style="background:#9aa2a6">Quitar marcador</button>'
        : '<button class="btn btn--sm" id="ms-skip" style="background:#aab">Más tarde</button>'}
      <button class="btn btn--sm" id="ms-save">Guardar</button>
    </div>`;
  document.getElementById('modal').hidden=false;
  const warn=body.querySelector('#ms-warn');
  const skip=body.querySelector('#ms-skip'); if(skip) skip.onclick=closeModal;
  const clr=body.querySelector('#ms-clear'); if(clr) clr.onclick=()=>{ delete state.scores[key]; save(); refreshCard(key,round,m); renderStepper(); closeModal(); };
  body.querySelector('#ms-save').onclick=()=>{
    const a=parseInt(body.querySelector('#ms-a').value,10);
    const b=parseInt(body.querySelector('#ms-b').value,10);
    if(isNaN(a)||isNaN(b)){ warn.textContent='Completá ambos marcadores o tocá “Más tarde”.'; warn.hidden=false; return; }
    const advG=adv==='a'?a:b, rivG=adv==='a'?b:a;
    if(rivG>advG){ warn.textContent=`El que no avanza no puede ganar: ${advTeam.name} debe ir igual o arriba (un empate se va a penales).`; warn.hidden=false; return; }
    state.scores[key]={a:Math.max(0,Math.min(99,a)), b:Math.max(0,Math.min(99,b))};
    save(); refreshCard(key,round,m); renderStepper(); closeModal();
  };
}

function thirdPlaceCard(){
  // 3.er puesto: perdedores de las 2 semifinales
  const def=[{t:'LOSE',round:'sf',m:0},{t:'LOSE',round:'sf',m:1}];
  // reutiliza matchDefs vía clave especial 'third'
  matchDefsCache['third']=[def];
  const wrap=document.createElement('div');
  wrap.innerHTML='<h3 style="font-family:Montserrat;font-weight:800;text-transform:uppercase;text-align:center;color:var(--ink);margin:34px 0 16px;font-size:18px">Partido por el 3.er puesto</h3>';
  const grid=document.createElement('div'); grid.className='round';
  grid.appendChild(matchCard('third',0,def));
  wrap.appendChild(grid);
  return wrap;
}

function championBanner(){
  const champ=getWinner('final',0);
  const b=document.createElement('div'); b.className='champion-banner';
  b.innerHTML=`<div class="cb__k">Tu campeón</div>
    <div class="cb__team">${champ!=null?flagTag(team(champ))+' '+team(champ).name:'🏆 Por definir'}</div>`;
  return b;
}

/* navegación inferior */
function stageNav(id){
  const order=STAGES.map(s=>s.id);
  const i=order.indexOf(id);
  const nav=document.createElement('div'); nav.className='stage__nav';
  const prev=STAGES[i-1], next=STAGES[i+1];
  const mk=(s,label,cls)=>{
    if(!s) return '<span class="spacer"></span>';
    const locked=s.locked && !state.design;
    return `<button class="btn ${cls}${locked?'':''}" ${locked?'disabled style="opacity:.5"':''} data-go="${s.id}">${label}</button>`;
  };
  nav.innerHTML = (prev?mk(prev,'← '+prev.short,'btn--ghost'):'<span class="spacer"></span>')
    + '<span class="spacer"></span>'
    + (next?mk(next,next.short+' →',''):'');
  nav.querySelectorAll('[data-go]').forEach(b=>{ if(!b.disabled) b.onclick=()=>goto(b.dataset.go); });
  // ghost necesita fondo oscuro; en página clara lo forzamos a sólido
  nav.querySelectorAll('.btn--ghost').forEach(b=>{b.classList.remove('btn--ghost');});
  return nav;
}

/* cache para matchDefs de 'third' */
const matchDefsCache={};
const _matchDefs=matchDefs;
matchDefs=function(round){ return matchDefsCache[round]||_matchDefs(round); };

/* =========================================================
   eventos globales (scores) + init
   ========================================================= */
// cierre del modal (botón × y click fuera de la tarjeta)
document.getElementById('modal-x').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e=>{ if(e.target.id==='modal') closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

document.getElementById('design-mode').addEventListener('change', e=>{
  state.design=e.target.checked; save();
  renderStepper(); renderStage(state.active);
});

(function init(){
  document.getElementById('design-mode').checked=!!state.design;
  // si la etapa activa quedó bloqueada y no hay modo diseño, volver a grupos
  const act=STAGES.find(s=>s.id===state.active);
  if(act && act.locked && !state.design) state.active='grupos';
  renderStepper();
  renderStage(state.active);
})();
