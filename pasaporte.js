const MISSIONS = [
  { id:'m1', week:1, name:'Mi Stanley va conmigo', desc:'Mostrá tu Stanley acompañando tu día futbolero.', instructions:'Publicá una historia, post o reel con tu Stanley en un momento real de tu día. Etiquetá a @Stanley1913_Bolivia y subí la captura.' },
  { id:'m2', week:1, name:'Ritual de previa', desc:'Compartí tu previa con tu producto Stanley favorito.', instructions:'Mostrá tu bebida, mesa o preparación antes de vivir la temporada futbolera. La etiqueta a @Stanley1913_Bolivia debe verse en la captura.' },
  { id:'m3', week:1, name:'Color de hinchada', desc:'Subí un momento usando colores de celebración.', instructions:'Combiná tu Stanley con colores, outfit o decoración futbolera. Subí la captura de Instagram como evidencia.' },
  { id:'m4', week:2, name:'Stanley en la mesa', desc:'Mostrá tu mesa, snack o bebida de temporada.', instructions:'Compartí una foto o video de tu mesa con presencia Stanley. Etiquetá a @Stanley1913_Bolivia.' },
  { id:'m5', week:2, name:'La Cábala Stanley', desc:'Contá qué no puede faltar cuando vivís fútbol.', instructions:'Publicá tu cábala, rutina o detalle favorito junto a tu Stanley. Subí captura visible.' },
  { id:'m6', week:2, name:'Compartido sabe mejor', desc:'Mostrá cómo compartís el momento con amigos o familia.', instructions:'Compartí un momento grupal, cuidando que tu Stanley sea protagonista o parte clara de la escena.' },
  { id:'m7', week:3, name:'Set de celebración', desc:'Armá tu rincón Stanley para ver la temporada.', instructions:'Mostrá tu setup: sillón, mesa, terraza o lugar elegido para celebrar.' },
  { id:'m8', week:3, name:'El grito del momento', desc:'Compartí una reacción, festejo o emoción futbolera.', instructions:'Puede ser foto, historia o reel. Lo importante es la energía de comunidad y la etiqueta a @Stanley1913_Bolivia.' },
  { id:'m9', week:3, name:'Misión Nostradamus', desc:'Ya viste los primeros partidos. Ahora contanos cómo imaginás que termina esta temporada futbolera.', instructions:'Respondé en Instagram: campeón esperado, goleador esperado, partido más esperado y final soñada. No hay ranking ni premio por acertar: el sello se obtiene por participar y cargar evidencia válida.' },
  { id:'m10', week:4, name:'Mi lugar favorito', desc:'Llevá tu Stanley a un lugar que represente tu pasión.', instructions:'Mostrá tu Stanley en el lugar donde más disfrutás vivir esta temporada: casa, oficina, terraza, parque o reunión.' },
  { id:'m11', week:4, name:'Pasaporte casi completo', desc:'Mostrá tus sellos y celebrá tu avance.', instructions:'Compartí una captura o foto de tu progreso en Pasaporte Stanley y etiquetá a @Stanley1913_Bolivia.', highlight:true },
  { id:'m12', week:4, name:'Legend Stanley', desc:'Cerrá el pasaporte con tu mejor momento Stanley.', instructions:'Publicá tu mejor contenido de campaña. Al subir la captura desbloqueás el sello final.', highlight:true }
];

MISSIONS.forEach((mission, index) => {
  const number = String(index + 1).padStart(2, '0');
  mission.thumb = `assets/miniatura-sellos/${number}-miniatura.png`;
  mission.stamp = `assets/sellos/${number}-sello.png`;
});

const CONFIG = window.STANLEY || {};
const STORAGE_KEY = 'stanley_passport';
const DAILY_LIMIT = Number(CONFIG.DAILY_MISSION_LIMIT || 2);
const DAILY_LIMIT_FLEXIBLE = Boolean(CONFIG.DAILY_LIMIT_FLEXIBLE);
const CURRENT_WEEK = Number(new URLSearchParams(location.search).get('week') || CONFIG.CURRENT_WEEK || 1);
let passport = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"evidence":{}}');
let player = JSON.parse(localStorage.getItem('stanley_player') || '{}');
if (!player.id && localStorage.getItem('participant_id')) player.id = localStorage.getItem('participant_id');
if (player && player.participant_id && !player.id) player.id = player.participant_id;
if (player && player.id && !player.participant_id) player.participant_id = player.id;
if (player && Object.prototype.hasOwnProperty.call(player, 'documento')) {
  delete player.documento;
  localStorage.setItem('stanley_player', JSON.stringify(player));
}

const $ = sel => document.querySelector(sel);
const setText = (sel, value) => { const el = $(sel); if (el) el.textContent = value; };
const evidenceCount = () => Object.values(passport.evidence || {}).filter(Boolean).length;
const isDone = mission => Boolean(passport.evidence && passport.evidence[mission.id]);
const isLocked = mission => mission.week > CURRENT_WEEK;


function participantId() {
  return (player && (player.participant_id || player.id)) || localStorage.getItem('participant_id') || '';
}

function normalizedIg(value) {
  const raw = String(value || '').trim().replace(/\s+/g, '').replace(/^@+/, '');
  return raw ? `@${raw}` : '';
}

function evidenceUrl(item) {
  return item && (item.evidence_url || item.dataUrl || item.url || '');
}

function isImageEvidence(url, name = '') {
  const clean = String(url || '').split('?')[0].toLowerCase();
  const filename = String(name || '').toLowerCase();
  return /^data:image\//.test(String(url || '')) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(clean) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(filename);
}

function renderEvidenceView(mission, evidence) {
  if (!evidence) {
    return `<div class="evidence-empty">SubÃ­ captura de Instagram</div>`;
  }
  const url = evidenceUrl(evidence);
  const fileName = evidence.name || evidence.evidence_filename || 'Evidencia cargada';
  const type = evidence.instagram_post_type ? `<small>${evidence.instagram_post_type}</small>` : '';
  const igLink = evidence.instagram_url ? `<a class="evidence-link evidence-link--ghost" href="${evidence.instagram_url}" target="_blank" rel="noopener">Ver publicaciÃ³n</a>` : '';
  const preview = url && isImageEvidence(url, fileName)
    ? `<a class="evidence-preview" href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="Evidencia cargada para ${mission.name}" loading="lazy" onerror="this.closest('.evidence-preview').classList.add('is-unavailable')" /><span>Ver evidencia cargada</span></a>`
    : `<div class="evidence-empty evidence-empty--uploaded">${url ? 'Evidencia cargada' : 'Evidencia no disponible en este dispositivo.'}</div>`;
  const button = url ? `<a class="gb-btn evidence-open" href="${url}" target="_blank" rel="noopener">Ver evidencia cargada</a>` : '';
  return `
    ${preview}
    <div class="evidence-meta">
      <strong>${fileName || 'Evidencia cargada'}</strong>
      ${type}
      <div class="evidence-actions">${button}${igLink}</div>
    </div>
  `;
}

function updateSessionIndicator() {
  const id = participantId();
  const ig = normalizedIg(player && player.instagram);
  const label = $('#player-name');
  const cloud = $('#cloud');
  if (label) {
    if (id && ig) label.textContent = `${ig} · Progreso sincronizado`;
    else if (id) label.textContent = 'Pasaporte activo';
    else label.textContent = 'Modo invitado · se guarda en este dispositivo';
  }
  if (cloud) {
    cloud.textContent = id ? 'Progreso sincronizado' : 'Guardado local';
    cloud.dataset.s = id ? 'sync' : 'ok';
  }
}
function localDay(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function completedTodayCount() {
  const today = localDay();
  return Object.values(passport.evidence || {}).filter(item => localDay(item.date || item.completedAt) === today).length;
}

function remainingToday() {
  if (DAILY_LIMIT_FLEXIBLE) return 999;
  return Math.max(0, DAILY_LIMIT - completedTodayCount());
}

function dailyLimitReached() {
  return !DAILY_LIMIT_FLEXIBLE && remainingToday() <= 0;
}

function dailyLimitMessage() {
  const doneToday = completedTodayCount();
  if (DAILY_LIMIT_FLEXIBLE) return 'L?mite diario flexibilizado por la organizaci?n durante esta etapa.';
  if (doneToday <= 0) return 'Pod?s completar hasta 2 misiones por d?a.';
  if (doneToday === 1) return 'Te queda 1 misi?n disponible por completar hoy.';
  return 'Ya completaste tus 2 misiones de hoy. Volv? ma?ana para seguir sumando sellos.';
}

function ensureDailyNotice() {
  const notice = document.querySelector('#daily-limit-notice');
  if (notice) notice.remove();
  return null;
}

function findHeading(pattern) {
  return Array.from(document.querySelectorAll('h1,h2,h3,.section-eyebrow,.gb-kicker'))
    .find(el => pattern.test((el.textContent || '').trim()));
}

function ensureOverviewGrid() {
  let wrap = document.querySelector('#stamp-grid, #stamps-grid, .stamps-grid, [data-passport-missions]');
  if (wrap) {
    wrap.classList.add('missions-overview-grid');
    return wrap;
  }
  const heading = findHeading(/^misiones$/i);
  const host = heading ? heading.closest('section, article, div') : null;
  wrap = document.createElement('div');
  wrap.id = 'stamp-grid';
  wrap.className = 'stamp-grid missions-overview-grid';
  if (host) {
    host.appendChild(wrap);
  }
  return wrap;
}

function ensureMissionsList() {
  let wrap = document.querySelector('#missions-list, .missions-list, [data-passport-list]');
  if (wrap) {
    wrap.id = 'missions-list';
    wrap.classList.add('missions-list');
    return wrap;
  }
  const heading = findHeading(/completa|complet/i);
  const titleBlock = heading ? heading.closest('.section-heading, .gb-section-head, div') : null;
  wrap = document.createElement('div');
  wrap.id = 'missions-list';
  wrap.className = 'missions-list';
  if (titleBlock && titleBlock.parentElement) {
    titleBlock.insertAdjacentElement('afterend', wrap);
  } else {
    document.body.appendChild(wrap);
  }
  return wrap;
}

function levelFor(count) {
  if (count >= 12) return { name:'Legend', next:null, missing:0, pct:100 };
  if (count >= 10) return { name:'Gold', next:'Legend', missing:12-count, pct:Math.round(count/12*100) };
  if (count >= 7) return { name:'Silver', next:'Gold', missing:10-count, pct:Math.round(count/12*100) };
  if (count >= 4) return { name:'Bronze', next:'Silver', missing:7-count, pct:Math.round(count/12*100) };
  return { name:'Inicial', next:'Bronze', missing:4-count, pct:Math.round(count/12*100) };
}

function thumb(mission, context) {
  if (mission.thumb) return `<img class="mission-thumb mission-thumb--${context}" src="${mission.thumb}" alt="${mission.name}">`;
  return `<span class="mission-thumb mission-thumb--empty mission-thumb--${context}">${mission.id.replace('m','')}</span>`;
}

function stamp(mission, context) {
  if (mission.stamp) return `<img class="mission-stamp mission-stamp--${context}" src="${mission.stamp}" alt="${mission.name}">`;
  return `<span class="mission-thumb mission-thumb--empty mission-thumb--${context}">${mission.id.replace('m','')}</span>`;
}

async function syncMissionEvidence_(mission, file, dataUrl) {
  if (!CONFIG.APPS_SCRIPT_URL || !player || !player.id) return;
  try {
    const payload = {
      action: 'saveEvidence',
      participant_id: player.id,
      id: player.id,
      mission_id: mission.id,
      mission_name: mission.name,
      week: mission.week,
      evidence: {
        name: file.name,
        mime: file.type || 'application/octet-stream',
        b64: String(dataUrl).split(',')[1]
      }
    };
    const saved = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(r => r.json());
    if (!saved || saved.ok === false) console.warn('No se pudo sincronizar la evidencia.', saved);
  } catch (err) {
    console.warn('Evidencia guardada localmente, pero no sincronizada.', err);
  }
}

function hasLocalEvidence() {
  return Object.values(passport.evidence || {}).some(Boolean);
}

function missionRowsToEvidence(rows) {
  const evidence = {};
  (rows || []).forEach(row => {
    const mission = MISSIONS.find(item => item.id === row.mission_id);
    if (!mission) return;
    const url = row.evidence_url || row.url || '';
    evidence[mission.id] = {
      name: row.evidence_filename || row.mission_name || mission.name || 'Evidencia cargada',
      evidence_filename: row.evidence_filename || '',
      dataUrl: url,
      evidence_url: url,
      instagram_url: row.instagram_url || '',
      instagram_post_type: row.instagram_post_type || '',
      date: row.completed_at || row.submitted_at || new Date().toISOString(),
      completed_at: row.completed_at || '',
      updatedAt: row.submitted_at || row.completed_at || new Date().toISOString(),
      source: 'backend'
    };
  });
  return evidence;
}

async function hydratePassportFromBackend() {
  if (hasLocalEvidence() || !CONFIG.APPS_SCRIPT_URL || !player || !player.id) return;
  try {
    const payload = { action: 'getParticipantMissions', participant_id: player.id };
    const saved = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(r => r.json());
    if (!saved || saved.ok === false) {
      console.warn('No se pudo recuperar el progreso desde el backend.', saved);
      return;
    }
    const evidence = missionRowsToEvidence(saved.missions || []);
    if (!Object.keys(evidence).length) return;
    passport.evidence = evidence;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
  } catch (err) {
    console.warn('No se pudo reconstruir el progreso desde el backend.', err);
  }
}

function updateProgress() {
  const count = evidenceCount();
  const level = levelFor(count);
  setText('#stamp-count', count);
  setText('#progress-count', count);
  setText('#pg-label', `${count}/12 sellos completados`);
  setText('#stamp-summary', `${count} de 12 misiones completadas.`);
  setText('#current-level', level.name);
  setText('#next-level-copy', level.next ? `Te faltan ${level.missing} sellos para ${level.next}.` : 'Pasaporte completo.');
  setText('#active-week', CURRENT_WEEK);
  setText('#meter-level', level.name);
  setText('#meter-stamps', `${count}/12`);
  setText('#meter-next-level', level.next ? `Te faltan ${level.missing} sellos para ${level.next}.` : 'Pasaporte completo.');
  
  
  const bar = $('#passport-progress-bar');
  if (bar) bar.style.width = `${level.pct}%`;
  const mini = $('#meter-progress-bar');
  if (mini) mini.style.width = `${level.pct}%`;
}

function renderOverview() {
  const wrap = ensureOverviewGrid();
  if (!wrap) return;
  wrap.innerHTML = '';
  MISSIONS.forEach((mission, index) => {
    const done = isDone(mission);
    const locked = isLocked(mission);
    const el = document.createElement('button');
    el.type = 'button';
    el.className = `mission-tile ${done ? 'done' : locked ? 'locked' : 'available'}`;
    el.innerHTML = `
      <span class="mission-tile-number">${index + 1}</span>
      <span class="mission-tile-art">${done ? stamp(mission, 'tile') : thumb(mission, 'tile')}</span>
      <strong>${mission.name}</strong>
      <small>${done ? 'Completada' : locked ? `Bloqueado - semana ${mission.week}` : 'Disponible'}</small>
    `;
    el.onclick = () => document.getElementById(mission.id)?.scrollIntoView({ behavior:'smooth', block:'center' });
    wrap.appendChild(el);
  });
}

function renderPassportSheet() {
  const wrap = $('#passport-sheet');
  if (!wrap) return;
  wrap.innerHTML = [1,2,3,4].map(week => {
    const weekMissions = MISSIONS.filter(mission => mission.week === week);
    return `
      <article class="passport-week passport-week-large ${week > CURRENT_WEEK ? 'locked' : ''}">
        <header>
          <span>Semana ${week}${week > CURRENT_WEEK ? ' Bloqueada' : ''}</span>
        </header>
        <div class="passport-week-grid passport-week-grid-large">
          ${weekMissions.map(mission => {
            const done = isDone(mission);
            const locked = isLocked(mission);
            return `
              <div class="passport-slot-large ${done ? 'done' : locked ? 'locked' : 'available'}">
                ${done ? stamp(mission, 'sheet') : `<span class="passport-empty-number">${mission.id.replace('m','')}</span>`}
                ${locked ? '<small>BLOQUEADA</small>' : ''}
              </div>`;
          }).join('')}
        </div>
      </article>`;
  }).join('');
}

function renderMissions() {
  const wrap = ensureMissionsList();
  if (!wrap) return;
  const noMoreToday = dailyLimitReached();
  wrap.innerHTML = '';
  MISSIONS.forEach(mission => {
    const done = isDone(mission);
    const locked = isLocked(mission);
    const dailyBlocked = noMoreToday && !done && !locked;
    const evidence = passport.evidence && passport.evidence[mission.id];
    const article = document.createElement('article');
    article.id = mission.id;
    article.className = `mission-card ${done ? 'done' : locked ? 'locked' : dailyBlocked ? 'daily-blocked' : 'available'}`;
    article.innerHTML = `
      <div class="mission-copy">
        <div class="mission-copy-head">
          <div>
            <span class="week-pill">Semana ${mission.week}</span>
            <h3>${mission.name}</h3>
            <p>${locked ? 'Pista desbloqueada: nombre del reto. La descripciÃ³n completa se revelarÃ¡ en su semana.' : mission.desc}</p>
          </div>
          <span class="mission-inline-art">${thumb(mission, 'inline')}</span>
        </div>
        <div class="mission-instructions ${locked ? 'blurred' : ''}">
          ${locked ? 'CaracterÃ­sticas e instrucciones bloqueadas.' : mission.instructions}
        </div>
        <span class="mission-state-pill">${done ? '? SELLO OBTENIDO' : locked ? 'Carga bloqueada hasta su semana' : dailyBlocked ? 'Volv? ma?ana para completar m?s misiones' : 'Sello desbloqueado'}</span>
        <div class="mission-completed-stamp">
          ${done ? stamp(mission, 'card') : ''}
        </div>
      </div>
      <div class="mission-evidence">
        ${done ? renderEvidenceView(mission, evidence) : `<div class="evidence-empty">${locked ? 'Carga bloqueada' : dailyBlocked ? 'LÃ­mite diario alcanzado' : 'SubÃ­ captura de Instagram'}</div>`}
        ${locked ? `<span class="gb-btn evidence-btn disabled">Bloqueado</span>` : `<label class="gb-btn evidence-btn ${dailyBlocked ? 'disabled' : ''}">
          ${done ? (evidenceUrl(evidence) ? 'Cambiar evidencia' : 'Subir evidencia nuevamente') : dailyBlocked ? 'Disponible maÃ±ana' : 'Subir evidencia'}
          <input type="file" accept="image/*" data-mission="${mission.id}" ${dailyBlocked ? 'disabled' : ''}>
        </label>`}
      </div>
    `;
    wrap.appendChild(article);
  });
}

function bindUploads() {
  document.addEventListener('change', event => {
    const input = event.target;
    if (!input.matches('input[type="file"][data-mission]')) return;
    const file = input.files && input.files[0];
    if (!file) return;
    const mission = MISSIONS.find(item => item.id === input.dataset.mission);
    if (!mission || isLocked(mission)) return;
    const wasDone = isDone(mission);
    if (!wasDone && dailyLimitReached()) {
      alert('Ya completaste tus 2 misiones de hoy. Volv? ma?ana para seguir sumando sellos.');
      input.value = '';
      renderAll();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      passport.evidence = passport.evidence || {};
      passport.evidence[mission.id] = {
        name:file.name,
        evidence_filename:file.name,
        dataUrl:reader.result,
        evidence_url:reader.result,
        date: wasDone && passport.evidence[mission.id] ? passport.evidence[mission.id].date : new Date().toISOString(),
        updatedAt:new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
      syncMissionEvidence_(mission, file, reader.result);
      renderAll();
    };
    reader.readAsDataURL(file);
  });
}

function renderAll() {
  updateSessionIndicator();
  updateProgress();
  renderOverview();
  renderPassportSheet();
  renderMissions();
}

bindUploads();
renderAll();
hydratePassportFromBackend().then(renderAll);
