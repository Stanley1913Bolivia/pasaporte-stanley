const MISSIONS = [
  { id:'m1', week:1, name:'Mi Stanley va conmigo', desc:'Mostra tu Stanley acompanando tu dia futbolero.', instructions:'Publica una historia, post o reel con tu Stanley en un momento real de tu dia. Etiqueta a Stanley Bolivia y subi la captura.', stamp:'assets/sellos/sello-01-mi-stanley-va-conmigo.png' },
  { id:'m2', week:1, name:'Ritual de previa', desc:'Comparti tu previa con tu producto Stanley favorito.', instructions:'Mostra tu bebida, mesa o preparacion antes de vivir la temporada futbolera. La etiqueta a Stanley Bolivia debe verse en la captura.', stamp:'assets/sellos/sello-02-ritual-de-previa.png' },
  { id:'m3', week:1, name:'Color de hinchada', desc:'Subi un momento usando colores de celebracion.', instructions:'Combina tu Stanley con colores, outfit o decoracion futbolera. Subi la captura de Instagram como evidencia.', stamp:'assets/sellos/sello-03-color-de-hinchada.png', thumb:'assets/sellos/miniatura-03-color-de-hinchada.png' },
  { id:'m4', week:2, name:'Stanley en la mesa', desc:'Mostra tu mesa, snack o bebida de temporada.', instructions:'Comparti una foto o video de tu mesa con presencia Stanley. Etiqueta a Stanley Bolivia.', stamp:'assets/sellos/sello-04-stanley-en-la-mesa.png' },
  { id:'m5', week:2, name:'La cabala Stanley', desc:'Conta que no puede faltar cuando vivis futbol.', instructions:'Publica tu cabala, rutina o detalle favorito junto a tu Stanley. Subi captura visible.' },
  { id:'m6', week:2, name:'Compartido sabe mejor', desc:'Mostra como compartis el momento con amigos o familia.', instructions:'Comparti un momento grupal, cuidando que tu Stanley sea protagonista o parte clara de la escena.' },
  { id:'m7', week:3, name:'Set de celebracion', desc:'Arma tu rincon Stanley para ver la temporada.', instructions:'Mostra tu setup: sillon, mesa, terraza o lugar elegido para celebrar.' },
  { id:'m8', week:3, name:'El grito del momento', desc:'Comparti una reaccion, festejo o emocion futbolera.', instructions:'Puede ser foto, historia o reel. Lo importante es la energia de comunidad y la etiqueta a Stanley Bolivia.' },
  { id:'m9', week:3, name:'Mision Secreta: Nostradamus Stanley', desc:'Ya viste los primeros partidos. Ahora contanos como imaginas que termina esta temporada futbolera.', instructions:'Responde en Instagram: campeon esperado, goleador esperado, partido mas esperado y final sonada. No hay ranking ni premio por acertar: el sello se obtiene por participar y cargar evidencia valida.' },
  { id:'m10', week:4, name:'Mi lugar favorito', desc:'Lleva tu Stanley a un lugar que represente tu pasion.', instructions:'Mostra tu Stanley en el lugar donde mas disfrutas vivir esta temporada: casa, oficina, terraza, parque o reunion.' },
  { id:'m11', week:4, name:'Pasaporte casi completo', desc:'Mostra tus sellos y celebra tu avance.', instructions:'Comparti una captura o foto de tu progreso en Pasaporte Stanley y etiqueta a Stanley Bolivia.', highlight:true },
  { id:'m12', week:4, name:'Legend Stanley', desc:'Cerra el pasaporte con tu mejor momento Stanley.', instructions:'Publica tu mejor contenido de campana. Al subir la captura desbloqueas el sello final.', highlight:true }
];

const CONFIG = window.STANLEY || {};
const STORAGE_KEY = 'stanley_passport';
const CURRENT_WEEK = Number(new URLSearchParams(location.search).get('week') || CONFIG.CURRENT_WEEK || 1);
const player = JSON.parse(localStorage.getItem('stanley_player') || 'null');
let passport = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"evidence":{}}');

const $ = sel => document.querySelector(sel);
const setText = (sel, value) => { const el = $(sel); if (el) el.textContent = value; };
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

function stampMarkup(mission, done, mode) {
  if (mission.stamp && done) {
    return `<img class="stamp-art stamp-art--full" src="${mission.stamp}" alt="${mission.name}">`;
  }
  if (mission.stamp) {
    return `<span class="stamp-art stamp-art--preview"><img src="${mission.stamp}" alt=""></span>`;
  }
  return `<span class="stamp-fallback">${mode || mission.id.replace('m','')}</span>`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
  const cloud = $('#cloud');
  if (cloud) { cloud.textContent = 'Guardado local'; cloud.dataset.s = 'ok'; }
}

function updateHeader() {
  const count = evidenceCount();
  const next = nextLevel(count);
  const level = levelFor(count);
  const percent = Math.round((count / MISSIONS.length) * 100);
  const nextText = next ? `Te faltan ${next.missing} sellos para ${next.name}.` : 'Pasaporte completo.';

  setText('#stamp-count', count);
  setText('#pg-label', `${count}/12 sellos`);
  setText('#stamp-summary', `${count} de 12 misiones completadas.`);
  setText('#active-week', CURRENT_WEEK);
  setText('#meter-level', level);
  setText('#meter-stamps', `${count}/12`);
  setText('#meter-next-level', nextText);

  const fill = $('#pg-fill');
  if (fill) fill.style.width = percent + '%';
  if (player) setText('#player-name', `${player.nombre || 'Participante'} - ${player.ciudad || 'Bolivia'} - ${player.instagram || '@instagram'}`);
}

function renderStamps() {
  const wrap = $('#stamp-grid');
  if (!wrap) return;
  wrap.innerHTML = '';
  MISSIONS.forEach((mission, index) => {
    const done = isDone(mission), locked = isLocked(mission);
    const el = document.createElement('button');
    el.className = `stamp ${done ? 'done' : ''} ${locked ? 'locked' : ''} ${mission.highlight ? 'stamp--legend' : ''}`;
    el.type = 'button';
    el.innerHTML = `${stampMarkup(mission, done, 'thumb')}<strong>${mission.name}</strong><small>${done ? 'Sello desbloqueado' : locked ? `Bloqueado - semana ${mission.week}` : 'Disponible'}</small>`;
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
            ${stampMarkup(mission, done, 'full')}
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
  if (!list) return;
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
        <p>${locked ? 'Pista desbloqueada: nombre del reto. La descripcion completa se revelara en su semana.' : mission.desc}</p>
        <div class="mission-instructions">${locked ? 'Caracteristicas e instrucciones bloqueadas.' : mission.instructions}</div>
        <div class="mission-status">${done ? 'Sello desbloqueado' : locked ? 'Carga bloqueada hasta su semana' : 'Mision disponible'}</div>
      </div>
      <div class="evidence-box">
        ${mission.stamp ? `<div class="mission-stamp-preview">${stampMarkup(mission, done, 'full')}</div>` : ''}
        ${evidence ? `<img src="${evidence.dataUrl}" alt="Evidencia cargada para ${mission.name}" />` : `<div class="evidence-empty">${locked ? 'Carga bloqueada' : 'Subi captura de Instagram'}</div>`}
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
    openModal('<h3 class="modal__h">Archivo muy pesado</h3><p class="modal__p">Subi una captura de hasta 6 MB.</p>');
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
    openModal('<h3 class="modal__h">Sello desbloqueado</h3><p class="modal__p">Tu evidencia quedo cargada. La mision suma a tu Pasaporte Stanley.</p>');
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

function openModal(html) { const body = $('#modal-body'), modal = $('#modal'); if (body && modal) { body.innerHTML = html; modal.hidden = false; } }
function closeModal() { const modal = $('#modal'); if (modal) modal.hidden = true; }
function renderAll() { updateHeader(); renderStamps(); renderPassportSheet(); renderMissions(); }

const closeButton = $('#modal-x');
if (closeButton) closeButton.addEventListener('click', closeModal);
const modal = $('#modal');
if (modal) modal.addEventListener('click', event => { if (event.target.id === 'modal') closeModal(); });
renderAll();