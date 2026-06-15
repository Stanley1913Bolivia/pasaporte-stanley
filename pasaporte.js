const MISSIONS = [
  { id:'m1', week:1, name:'Mi Stanley va conmigo', desc:'MostrÃ¡ tu Stanley acompaÃ±ando tu dÃ­a futbolero.', instructions:'PublicÃ¡ una historia, post o reel con tu Stanley en un momento real de tu dÃ­a. EtiquetÃ¡ a Stanley Bolivia y subÃ­ la captura.' },
  { id:'m2', week:1, name:'Ritual de previa', desc:'CompartÃ­ tu previa con tu producto Stanley favorito.', instructions:'MostrÃ¡ tu bebida, mesa o preparaciÃ³n antes de vivir la temporada futbolera. La etiqueta a Stanley Bolivia debe verse en la captura.' },
  { id:'m3', week:1, name:'Color de hinchada', desc:'SubÃ­ un momento usando colores de celebraciÃ³n.', instructions:'CombinÃ¡ tu Stanley con colores, outfit o decoraciÃ³n futbolera. SubÃ­ la captura de Instagram como evidencia.' },
  { id:'m4', week:2, name:'Stanley en la mesa', desc:'MostrÃ¡ tu mesa, snack o bebida de temporada.', instructions:'CompartÃ­ una foto o video de tu mesa con presencia Stanley. EtiquetÃ¡ a Stanley Bolivia.' },
  { id:'m5', week:2, name:'La cÃ¡bala Stanley', desc:'ContÃ¡ quÃ© no puede faltar cuando vivÃ­s fÃºtbol.', instructions:'PublicÃ¡ tu cÃ¡bala, rutina o detalle favorito junto a tu Stanley. SubÃ­ captura visible.' },
  { id:'m6', week:2, name:'Compartido sabe mejor', desc:'MostrÃ¡ cÃ³mo compartÃ­s el momento con amigos o familia.', instructions:'CompartÃ­ un momento grupal, cuidando que tu Stanley sea protagonista o parte clara de la escena.' },
  { id:'m7', week:3, name:'Set de celebraciÃ³n', desc:'ArmÃ¡ tu rincÃ³n Stanley para ver la temporada.', instructions:'MostrÃ¡ tu setup: sillÃ³n, mesa, terraza o lugar elegido para celebrar.' },
  { id:'m8', week:3, name:'El grito del momento', desc:'CompartÃ­ una reacciÃ³n, festejo o emociÃ³n futbolera.', instructions:'Puede ser foto, historia o reel. Lo importante es la energÃ­a de comunidad y la etiqueta a Stanley Bolivia.' },
  { id:'m9', week:3, name:'MisiÃ³n Secreta: Nostradamus Stanley', desc:'Ya viste los primeros partidos. Ahora contanos cÃ³mo imaginÃ¡s que termina esta temporada futbolera.', instructions:'RespondÃ© en Instagram: campeÃ³n esperado, goleador esperado, partido mÃ¡s esperado y final soÃ±ada. No hay ranking ni premio por acertar: el sello es por participar.' },
  { id:'m10', week:4, name:'Mi lugar favorito', desc:'LlevÃ¡ tu Stanley a un lugar que represente tu pasiÃ³n.', instructions:'MostrÃ¡ tu Stanley en el lugar donde mÃ¡s disfrutÃ¡s vivir esta temporada: casa, oficina, terraza, parque o reuniÃ³n.' },
  { id:'m11', week:4, name:'Pasaporte casi completo', desc:'MostrÃ¡ tus sellos y celebrÃ¡ tu avance.', instructions:'CompartÃ­ una captura o foto de tu progreso en Pasaporte Stanley y etiquetÃ¡ a Stanley Bolivia.', highlight:true },
  { id:'m12', week:4, name:'Legend Stanley', desc:'CerrÃ¡ el pasaporte con tu mejor momento Stanley.', instructions:'PublicÃ¡ tu mejor contenido de campaÃ±a. Al subir la captura desbloqueÃ¡s el sello final.', highlight:true }
];

const CONFIG = window.STANLEY || {};
const STORAGE_KEY = 'stanley_passport';
const CURRENT_WEEK = Number(new URLSearchParams(location.search).get('week') || CONFIG.CURRENT_WEEK || 1);
const player = JSON.parse(localStorage.getItem('stanley_player') || 'null');
let passport = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"evidence":{}}');

const $ = sel => document.querySelector(sel);
const evidenceCount = () => Object.values(passport.evidence || {}).filter(Boolean).length;
const isDone = mission => Boolean(passport.evidence && passport.evidence[mission.id]);
const isLocked = mission => mission.week > CURRENT_WEEK && !isDone(mission);
const levelFor = count => count >= 12 ? 'Legend' : count >= 10 ? 'Gold' : count >= 7 ? 'Silver' : count >= 4 ? 'Bronze' : 'Inicial';
const nextLevel = count => {
  if (count < 4) return { name:'Bronze', missing:4-count };
  if (count < 7) return { name:'Silver', missing:7-count };
  if (count < 10) return { name:'Gold', missing:10-count };
  if (count < 12) return { name:'Legend', missing:12-count };
  return null;
};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
  const cloud = $('#cloud');
  if (cloud) { cloud.textContent = 'Guardado local'; cloud.dataset.s = 'ok'; }
}

function updateHeader() {
  const count = evidenceCount();
  const next = nextLevel(count);
  $('#stamp-count').textContent = count;
  $('#pg-fill').style.width = Math.round((count / MISSIONS.length) * 100) + '%';
  $('#pg-label').textContent = `${count}/12 sellos completados`;
  $('#current-level').textContent = levelFor(count);
  $('#stamp-summary').textContent = `${count} de 12 misiones completadas Â· Semana activa ${CURRENT_WEEK}.`;
  $('#next-level').textContent = next ? `Te faltan ${next.missing} sellos para ${next.name}.` : 'Pasaporte completo. Nivel Legend desbloqueado.';
  $('#btn-certificate').disabled = count < 10;
  if (player) $('#player-name').textContent = `${player.nombre || 'Participante'} Â· ${player.ciudad || 'Bolivia'} Â· ${player.instagram || '@instagram'}`;
}

function renderStamps() {
  const wrap = $('#stamp-grid');
  wrap.innerHTML = '';
  MISSIONS.forEach((mission, index) => {
    const done = isDone(mission), locked = isLocked(mission);
    const el = document.createElement('button');
    el.className = `stamp ${done ? 'done' : ''} ${locked ? 'locked' : ''} ${mission.highlight ? 'stamp--legend' : ''}`;
    el.type = 'button';
    el.innerHTML = `<span>${done ? 'âœ“' : index + 1}</span><strong>${mission.name}</strong><small>${done ? 'Sello desbloqueado' : locked ? `Bloqueado Â· semana ${mission.week}` : 'Disponible'}</small>`;
    el.onclick = () => document.getElementById(mission.id)?.scrollIntoView({ behavior:'smooth', block:'center' });
    wrap.appendChild(el);
  });
}

function renderPassportSheet() {
  const sheet = $('#passport-sheet');
  if (!sheet) return;
  sheet.innerHTML = '';
  [1,2,3,4].forEach(week => {
    const page = document.createElement('article');
    page.className = `passport-page ${week > CURRENT_WEEK ? 'locked' : ''} ${week === 4 ? 'passport-page--legend' : ''}`;
    page.innerHTML = `
      <div class="passport-page__head">
        <span>Semana ${week}</span>
        <strong>${week > CURRENT_WEEK ? 'Bloqueada' : week === 4 ? 'Cierre Legend' : 'Disponible'}</strong>
      </div>
      <div class="passport-page__stamps">
        ${MISSIONS.filter(m => m.week === week).map(mission => {
          const done = isDone(mission), locked = isLocked(mission);
          return `<button class="passport-stamp ${done ? 'done' : ''} ${locked ? 'locked' : ''} ${mission.highlight ? 'special' : ''}" type="button" data-target="${mission.id}">
            <span>${done ? 'âœ“' : mission.id.replace('m','')}</span>
            <strong>${mission.name}</strong>
            <small>${locked ? 'Se desbloquea luego' : done ? 'Sellado' : 'Disponible'}</small>
          </button>`;
        }).join('')}
      </div>`;
    sheet.appendChild(page);
  });
  sheet.querySelectorAll('.passport-stamp').forEach(button => {
    button.addEventListener('click', () => document.getElementById(button.dataset.target)?.scrollIntoView({ behavior:'smooth', block:'center' }));
  });
}

function renderMissions() {
  const list = $('#mission-list');
  list.innerHTML = '';
  MISSIONS.forEach(mission => {
    const evidence = passport.evidence && passport.evidence[mission.id];
    const done = isDone(mission), locked = isLocked(mission);
    const card = document.createElement('article');
    card.className = `passport-mission ${done ? 'completed' : ''} ${locked ? 'locked' : ''} ${mission.highlight ? 'passport-mission--legend' : ''}`;
    card.id = mission.id;
    card.innerHTML = `
      <div class="passport-mission__main">
        <span class="mission-card__week">Semana ${mission.week}</span>
        <h3>${mission.name}</h3>
        <p>${locked ? 'Pista desbloqueada: nombre del reto. La descripciÃ³n completa se revelarÃ¡ en su semana.' : mission.desc}</p>
        <div class="mission-instructions">${locked ? 'CaracterÃ­sticas e instrucciones bloqueadas.' : mission.instructions}</div>
        <div class="mission-status">${done ? 'Sello desbloqueado' : locked ? 'Carga bloqueada hasta su semana' : 'MisiÃ³n disponible'}</div>
      </div>
      <div class="evidence-box">
        ${evidence ? `<img src="${evidence.dataUrl}" alt="Evidencia cargada para ${mission.name}" />` : `<div class="evidence-empty">${locked ? 'Carga bloqueada' : 'SubÃ­ captura de Instagram'}</div>`}
        <label class="gb-btn evidence-btn ${locked ? 'disabled' : ''}">
          ${done ? 'Cambiar evidencia' : locked ? 'Bloqueado' : 'Subir evidencia'}
          <input type="file" accept="image/*" ${locked ? 'disabled' : ''} data-mission="${mission.id}">
        </label>
      </div>`;
    list.appendChild(card);
  });
  list.querySelectorAll('input[type="file"]').forEach(input => input.addEventListener('change', onEvidenceUpload));
}

function onEvidenceUpload(event) {
  const input = event.currentTarget, file = input.files && input.files[0], missionId = input.dataset.mission;
  const mission = MISSIONS.find(m => m.id === missionId);
  if (!file || !mission || isLocked(mission)) return;
  if (file.size > 6 * 1024 * 1024) {
    openModal('<h3 class="modal__h">Archivo muy pesado</h3><p class="modal__p">SubÃ­ una captura de hasta 6 MB.</p>');
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = String(e.target.result);
    passport.evidence = passport.evidence || {};
    passport.evidence[missionId] = { name:file.name, dataUrl, uploadedAt:new Date().toISOString() };
    save();
    syncEvidence(missionId, file, dataUrl);
    renderAll();
    openModal('<h3 class="modal__h">Sello desbloqueado</h3><p class="modal__p">Tu evidencia quedÃ³ cargada. La misiÃ³n suma a tu Pasaporte Stanley.</p>');
  };
  reader.readAsDataURL(file);
}

function syncEvidence(missionId, file, dataUrl) {
  if (!CONFIG.APPS_SCRIPT_URL || !player) return;
  const mission = MISSIONS.find(item => item.id === missionId);
  const payload = {
    action:'saveEvidence',
    id:player.id,
    documento:player.documento,
    mission_id:missionId,
    mission_name:mission?.name || missionId,
    evidence:{ name:file.name, mime:file.type || 'image/png', b64:dataUrl.split(',')[1] || '' }
  };
  fetch(CONFIG.APPS_SCRIPT_URL, { method:'POST', body:JSON.stringify(payload) }).catch(() => {
    const cloud = $('#cloud');
    if (cloud) { cloud.textContent = 'Guardado local'; cloud.dataset.s = 'err'; }
  });
}

function openModal(html) { $('#modal-body').innerHTML = html; $('#modal').hidden = false; }
function closeModal() { $('#modal').hidden = true; }

function drawCertificate() {
  const count = evidenceCount();
  if (count < 10) return openModal('<h3 class="modal__h">Certificado bloqueado</h3><p class="modal__p">AlcanzÃ¡ Gold con 10 sellos para descargar tu certificado.</p>');
  const level = levelFor(count);
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#022417'; ctx.fillRect(0,0,1080,1920);
  for (let x=0;x<1080;x+=120){ ctx.fillStyle = x % 240 === 0 ? '#01A66A' : '#019A63'; ctx.fillRect(x,0,120,1920); }
  ctx.fillStyle = 'rgba(0,0,0,.34)'; ctx.fillRect(0,0,1080,1920);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b59677'; ctx.font = '900 46px Montserrat, Arial'; ctx.fillText('PASAPORTE STANLEY',540,210);
  ctx.fillStyle = '#fff'; ctx.font = '96px Anton, Arial'; ctx.fillText('COMPLETÃ‰ MI',540,390); ctx.fillText('PASAPORTE STANLEY',540,500);
  ctx.font = '800 54px Montserrat, Arial'; ctx.fillText(player?.nombre || 'Participante Stanley',540,690);
  ctx.font = '600 34px Inter, Arial'; ctx.fillText(player?.ciudad || 'Bolivia',540,750);
  ctx.fillStyle = '#b59677'; ctx.font = '900 64px Montserrat, Arial'; ctx.fillText(`Nivel ${level}`,540,890);
  ctx.fillStyle = '#fff'; ctx.font = '800 42px Montserrat, Arial'; ctx.fillText(`${count}/12 sellos completados`,540,955);
  for (let i=0;i<12;i++){ const x=225+(i%4)*210, y=1090+Math.floor(i/4)*190; ctx.beginPath(); ctx.arc(x,y,62,0,Math.PI*2); ctx.fillStyle=i<count?'#b59677':'rgba(255,255,255,.18)'; ctx.fill(); ctx.fillStyle='#fff'; ctx.font='900 48px Montserrat, Arial'; ctx.fillText(i<count?'âœ“':String(i+1),x,y+17); }
  ctx.font = '700 30px Inter, Arial'; ctx.fillText('La fiesta del fÃºtbol se vive con Stanley',540,1720);
  ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = '600 24px Inter, Arial'; ctx.fillText('Stanley Bolivia / Openbrands S.R.L.',540,1780);
  const link = document.createElement('a'); link.download = `certificado-pasaporte-stanley-${level.toLowerCase()}.png`; link.href = canvas.toDataURL('image/png'); link.click();
}

function renderAll() { updateHeader(); renderStamps(); renderPassportSheet(); renderMissions(); }

$('#modal-x').addEventListener('click', closeModal);
$('#modal').addEventListener('click', event => { if (event.target.id === 'modal') closeModal(); });
$('#btn-certificate').addEventListener('click', drawCertificate);
renderAll();
