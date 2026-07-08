const MISSIONS = [
  { id:'m1', week:1, name:'Mi Stanley va conmigo', desc:'Mostrá tu Stanley acompañando tu día futbolero.', instructions:'Publicá una historia, post o reel con tu Stanley en un momento real de tu día. Etiquetá a @Stanley1913_Bolivia y subí la captura.' },
  { id:'m2', week:1, name:'Ritual de previa', desc:'Compartí tu previa con tu producto Stanley favorito.', instructions:'Mostrá tu bebida, mesa o preparación antes de vivir la temporada futbolera. La etiqueta a @Stanley1913_Bolivia debe verse en la captura.' },
  { id:'m3', week:1, name:'Color de hinchada', desc:'Subí un momento usando colores de celebración.', instructions:'Combiná tu Stanley con colores, outfit o decoración futbolera. Subí la captura de Instagram como evidencia.' },
  { id:'m4', week:2, name:'Stanley en la mesa', desc:'Mostrá tu mesa, snack o bebida de temporada.', instructions:'Compartí una foto o video de tu mesa con presencia Stanley. Etiquetá a @Stanley1913_Bolivia.' },
  { id:'m5', week:2, name:'La Cábala Stanley', desc:'Contá qué no puede faltar cuando vivís fútbol.', instructions:'Publicá tu cábala, rutina o detalle favorito junto a tu Stanley. Subí captura visible.' },
  { id:'m6', week:2, name:'Compartido sabe mejor', desc:'Mostrá cómo compartís el momento con amigos o familia.', instructions:'Compartí un momento grupal, cuidando que tu Stanley sea protagonista o parte clara de la escena.' },
  { id:'m7', week:3, name:'El grito del momento', type:'Emoción', publicHint:'Queremos ver cómo vivís cada emoción.', desc:'Queremos ver la pasión con la que vivís cada partido. Capturá ese instante que hace especial cada encuentro: un grito de gol, una celebración, una reacción inesperada, la tensión de una jugada o cualquier emoción que compartas junto a tu Stanley.', instructions:'Subilo a Instagram, etiquetá a @Stanley1913_Bolivia (la etiqueta debe verse en la captura de pantalla) y subí tu evidencia.' },
  { id:'m8', week:3, name:'Throwback Stanley', type:'Lifestyle', publicHint:'Volvé al origen. Queremos conocer tu historia con Stanley.', desc:'Todos tenemos una historia con nuestro Stanley. Buscá la foto más antigua que tengas junto a él o ese recuerdo inolvidable que todavía guardás en tu galería y compartilo con nosotros.', instructions:'Subilo a Instagram, etiquetá a @Stanley1913_Bolivia (la etiqueta debe verse en la captura de pantalla) y subí tu evidencia.' },
  { id:'m9', week:3, name:'Colección Stanley', type:'Lifestyle', publicHint:'Cada Stanley tiene una historia. Mostranos tu colección.', desc:'¿Tenés un solo Stanley o ya empezaste tu colección? Mostranos todos los productos Stanley que forman parte de tu día a día. Queremos conocer la colección de nuestra comunidad.', instructions:'Subilo a Instagram, etiquetá a @Stanley1913_Bolivia (la etiqueta debe verse en la captura de pantalla) y subí tu evidencia.' },
  { id:'m10', week:3, name:'Nostradamus Stanley', type:'Participación especial', publicHint:'¿Ya tenés tus favoritos? Prepará tus pronósticos mundialeros.', desc:'Llegó el momento de sacar tu lado más futbolero. Compartinos tus pronósticos para el cierre del Mundial: campeón, máximo goleador, jugador del torneo y resultado de la Final. No existen respuestas correctas o incorrectas. Esta misión otorga el sello simplemente por participar.', instructions:'Subilo a Instagram, etiquetá a @Stanley1913_Bolivia (la etiqueta debe verse en la captura de pantalla) y subí tu evidencia.', unlockAt:'2026-07-13T00:00:00-04:00', specialLock:true },
  { id:'m11', week:4, name:'Pasaporte casi completo', desc:'Mostrá tus sellos y celebrá tu avance.', instructions:'Compartí una captura o foto de tu progreso en Pasaporte Stanley y etiquetá a @Stanley1913_Bolivia.', highlight:true },
  { id:'m12', week:4, name:'Legend Stanley', desc:'Cerrá el pasaporte con tu mejor momento Stanley.', instructions:'Publicá tu mejor contenido de campaña. Al subir la captura desbloqueás el sello final.', highlight:true }
];

MISSIONS.forEach((mission, index) => {
  const number = String(index + 1).padStart(2, '0');
  mission.thumb = `assets/miniatura-sellos/${number}-miniatura.png`;
  mission.stamp = `assets/sellos/${number}-sello.png`;
});

const CONFIG = window.STANLEY || {};
const INSTAGRAM_COMMUNITY_URL = CONFIG.INSTAGRAM_COMMUNITY_URL || 'https://www.instagram.com/channel/AbbX7p2jNimxBq8g/';
const STORAGE_KEY = 'stanley_passport';
const DAILY_LIMIT = Number(CONFIG.DAILY_MISSION_LIMIT || 2);
const DAILY_LIMIT_FLEXIBLE = Boolean(CONFIG.DAILY_LIMIT_FLEXIBLE);
const PHASES = CONFIG.PHASES || [
  { id: 1, starts: '2026-06-01T00:00:00-04:00', ends: '2026-07-03T23:59:59-04:00' },
  { id: 2, starts: '2026-07-04T00:00:00-04:00', ends: '2026-07-08T23:59:59-04:00' },
  { id: 3, starts: '2026-07-09T00:00:00-04:00', ends: '2026-07-13T23:59:59-04:00' },
  { id: 4, starts: '2026-07-14T00:00:00-04:00', ends: '2026-07-17T23:59:59-04:00' }
];
function phaseFromCalendar(now = new Date()) {
  const override = Number(new URLSearchParams(location.search).get('phase'));
  if (override >= 1 && override <= 4) return override;
  const time = now.getTime();
  const active = PHASES.find(phase => time >= new Date(phase.starts).getTime() && time <= new Date(phase.ends).getTime());
  if (active) return active.id;
  const lastOpen = PHASES.filter(phase => time >= new Date(phase.starts).getTime()).pop();
  return lastOpen ? lastOpen.id : Number(CONFIG.CURRENT_WEEK || 1);
}
const CURRENT_PHASE = phaseFromCalendar();
const CURRENT_WEEK = CURRENT_PHASE;
const MAX_IMAGE_SIDE = 1600;
const JPEG_QUALITY = 0.80;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
let passport = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"evidence":{}}');
let player = JSON.parse(localStorage.getItem('stanley_player') || '{}');
if (!player.id && localStorage.getItem('participant_id')) player.id = localStorage.getItem('participant_id');
if (player && player.participant_id && !player.id) player.id = player.participant_id;
if (player && player.id && !player.participant_id) player.participant_id = player.id;

document.querySelectorAll('[data-community-link]').forEach(link => {
  link.href = INSTAGRAM_COMMUNITY_URL;
  link.target = '_blank';
  link.rel = 'noopener';
});
if (player && Object.prototype.hasOwnProperty.call(player, 'documento')) {
  delete player.documento;
  localStorage.setItem('stanley_player', JSON.stringify(player));
}

const $ = sel => document.querySelector(sel);
const setText = (sel, value) => { const el = $(sel); if (el) el.textContent = value; };
const evidenceCount = () => Object.values(passport.evidence || {}).filter(Boolean).length;
const isDone = mission => Boolean(passport.evidence && passport.evidence[mission.id]);
const isDateLocked = mission => Boolean(mission.unlockAt && Date.now() < new Date(mission.unlockAt).getTime());
const isLocked = mission => mission.week > CURRENT_WEEK || isDateLocked(mission);


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

function hasLocalEvidencePreview(item) {
  return Boolean(item && item.dataUrl && /^data:image\//.test(String(item.dataUrl)));
}

function isImageEvidence(url, name = '') {
  const clean = String(url || '').split('?')[0].toLowerCase();
  const filename = String(name || '').toLowerCase();
  return /^data:image\//.test(String(url || '')) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(clean) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(filename);
}

function dataUrlToPayload(dataUrl, fallbackName, fallbackMime) {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.*)$/);
  if (!match) throw new Error('No pudimos leer el archivo seleccionado.');
  return {
    name: fallbackName,
    mime: match[1] || fallbackMime || 'application/octet-stream',
    b64: match[2] || ''
  };
}

function payloadSizeBytes(payload) {
  return Math.ceil(String(payload.b64 || '').length * 3 / 4);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Safari no pudo leer el archivo seleccionado.'));
      reader.onabort = () => reject(new Error('La lectura del archivo fue cancelada.'));
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No pudimos procesar la imagen. Probá guardarla como JPG o PNG y volvé a subirla.'));
    img.src = dataUrl;
  });
}

function canvasToJpegDataUrl(canvas) {
  return new Promise((resolve, reject) => {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(blob => {
          try {
            if (!blob) {
              reject(new Error('No pudimos comprimir la imagen.'));
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(reader.error || new Error('No pudimos leer la imagen comprimida.'));
            reader.readAsDataURL(blob);
          } catch (err) {
            reject(err);
          }
        }, 'image/jpeg', JPEG_QUALITY);
        return;
      }
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    } catch (err) {
      reject(err);
    }
  });
}

function originalFilePayload(sourceDataUrl, file) {
  const payload = dataUrlToPayload(sourceDataUrl, file.name, file.type || 'application/octet-stream');
  if (payloadSizeBytes(payload) > MAX_UPLOAD_BYTES) {
    throw new Error('No pudimos cargar la imagen. Intentá con una captura de pantalla o una imagen más liviana.');
  }
  return { payload, dataUrl: sourceDataUrl, fileName: file.name, mime: payload.mime, compressed: false };
}

async function tryCompressImage(sourceDataUrl, file) {
  try {
    const img = await loadImage(sourceDataUrl);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('El navegador no permitió preparar la imagen.');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const compressedDataUrl = await canvasToJpegDataUrl(canvas);
    const name = jpegName(file.name);
    const payload = dataUrlToPayload(compressedDataUrl, name, 'image/jpeg');
    if (payloadSizeBytes(payload) > MAX_UPLOAD_BYTES) {
      throw new Error('La imagen sigue superando los 6 MB después de comprimirla.');
    }
    return { payload, dataUrl: compressedDataUrl, fileName: name, mime: 'image/jpeg', compressed: true };
  } catch (err) {
    console.error('Falló la compresión de imagen; intento enviar original:', err);
    return originalFilePayload(sourceDataUrl, file);
  }
}

function jpegName(fileName) {
  const clean = String(fileName || 'evidencia').replace(/\.[^.]+$/, '');
  return `${clean || 'evidencia'}.jpg`;
}

async function prepareUploadFile(file) {
  if (!file) throw new Error('No encontramos el archivo seleccionado.');
  let sourceDataUrl = '';
  try {
    sourceDataUrl = await readFileAsDataURL(file);
  } catch (err) {
    console.error('Error completo al leer archivo:', err);
    throw new Error('No pudimos cargar la imagen. Intentá con una captura de pantalla o una imagen más liviana.');
  }
  if (!String(file.type || '').startsWith('image/')) {
    try {
      return originalFilePayload(sourceDataUrl, file);
    } catch (err) {
      console.error('Error completo al preparar archivo original:', err);
      throw err;
    }
  }
  return tryCompressImage(sourceDataUrl, file);
}

function setMissionUploadStatus(missionId, message, state = 'info') {
  const el = document.querySelector(`[data-upload-status="${missionId}"]`);
  if (!el) return;
  el.textContent = message || '';
  el.dataset.state = state;
  el.hidden = !message;
}

function renderEvidenceView(mission, evidence) {
  if (!evidence) {
    return `<div class="evidence-empty">Subí captura de Instagram</div>`;
  }
  const url = evidenceUrl(evidence);
  const localPreview = hasLocalEvidencePreview(evidence);
  const previewHref = url || evidence.dataUrl;
  const preview = localPreview
    ? `<a class="evidence-preview" href="${previewHref}" target="_blank" rel="noopener" aria-label="Abrir evidencia completa de ${mission.name}"><img src="${evidence.dataUrl}" alt="Evidencia cargada para ${mission.name}" loading="lazy" /></a>`
    : `<div class="evidence-empty evidence-empty--uploaded"><strong>Evidencia registrada</strong><span>Vista previa no disponible en este dispositivo.</span></div>`;
  return preview;
}

function phaseMeta(phase) {
  const data = {
    1: { title:'FASE 1', subtitle:'Misiones iniciales del Pasaporte Stanley.' },
    2: { title:'FASE 2', subtitle:'Disponible del 4 al 8 de julio.' },
    3: { title:'FASE 3', subtitle:'Disponible del 9 al 13 de julio.' },
    4: { title:'FASE 4 · RECTA FINAL', subtitle:'Disponible del 14 al 17 de julio.' }
  };
  return data[phase] || { title:`FASE ${phase}`, subtitle:'' };
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
  if (DAILY_LIMIT_FLEXIBLE) return 'Límite diario flexibilizado por la organización durante esta etapa.';
  if (doneToday <= 0) return 'Podés completar hasta 2 misiones por día.';
  if (doneToday === 1) return 'Te queda 1 misión disponible por completar hoy.';
  return 'Ya completaste tus 2 misiones de hoy. Volvé mañana para seguir sumando sellos.';
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
  let wrap = document.querySelector('#mission-list, #missions-list, .mission-list, .missions-list, [data-passport-list]');
  if (wrap) {
    wrap.id = 'mission-list';
    wrap.classList.add('mission-list', 'missions-list');
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

function nextObjectiveFor(count) {
  if (count >= 12) return { title:'Pasaporte completo', copy:'Pasaporte completo. Alcanzaste el nivel Legend.', share:true };
  if (count >= 10) return { title:'Legend', copy:`Te faltan ${12 - count} sellos para Legend. Participás en el sorteo de Ediciones Especiales Stanley.`, share:true };
  if (count >= 7) return { title:'Gold', copy:`Te faltan ${10 - count} sellos para Gold. Participás en el sorteo principal de la campaña.`, share:true };
  if (count >= 4) return { title:'Silver', copy:`Te faltan ${7 - count} sellos para Silver. Participás en sorteos intermedios.`, share:true };
  return { title:'Bronze', copy:`Te faltan ${4 - count} sellos para Bronze. Desbloqueás tu primer nivel del Pasaporte Stanley.`, share:false };
}

function renderNextObjective(count) {
  const objective = nextObjectiveFor(count);
  setText('#next-objective-title', objective.title);
  setText('#next-objective-copy', objective.copy);
  const share = $('#share-passport');
  if (share) share.hidden = !objective.share;
}

function levelUnlockMessage(before, after) {
  const unlocked = [
    { at:4, msg:'¡Nivel Bronze desbloqueado! Ya tenés tus primeros 4 sellos.' },
    { at:7, msg:'¡Nivel Silver desbloqueado! Ya participás en sorteos intermedios.' },
    { at:10, msg:'¡Nivel Gold desbloqueado! Ya participás en el sorteo principal.' },
    { at:12, msg:'¡Nivel Legend desbloqueado! Completaste el Pasaporte Stanley.' }
  ].filter(item => before < item.at && after >= item.at).pop();
  return unlocked ? unlocked.msg : '';
}

function showLevelToast(message) {
  if (!message) return;
  const toast = document.createElement('div');
  toast.className = 'level-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 260);
  }, 4200);
}

function thumb(mission, context) {
  if (mission.thumb) return `<img class="mission-thumb mission-thumb--${context}" src="${mission.thumb}" alt="${mission.name}">`;
  return `<span class="mission-thumb mission-thumb--empty mission-thumb--${context}">${mission.id.replace('m','')}</span>`;
}

function stamp(mission, context) {
  if (mission.stamp) return `<img class="mission-stamp mission-stamp--${context}" src="${mission.stamp}" alt="${mission.name}">`;
  return `<span class="mission-thumb mission-thumb--empty mission-thumb--${context}">${mission.id.replace('m','')}</span>`;
}

async function syncMissionEvidence_(mission, prepared) {
  if (!CONFIG.APPS_SCRIPT_URL || !player || !player.id) return null;
  try {
    const payload = {
      action: 'saveEvidence',
      participant_id: player.id,
      id: player.id,
      mission_id: mission.id,
      mission_name: mission.name,
      week: mission.week,
      evidence: prepared.payload
    };
    const saved = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(r => r.json());
    if (!saved || saved.ok === false) {
      console.error('No se pudo sincronizar la evidencia.', saved);
      throw new Error((saved && saved.error) || 'No pudimos subir la evidencia. Intentá nuevamente.');
    }
    return saved;
  } catch (err) {
    console.error('Error completo al subir evidencia:', err);
    throw err;
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
  setText('#active-week', CURRENT_PHASE);
  setText('#meter-level', level.name);
  setText('#meter-stamps', `${count}/12`);
  setText('#meter-next-level', level.next ? `Te faltan ${level.missing} sellos para ${level.next}.` : 'Pasaporte completo.');
  renderNextObjective(count);
  
  
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
      <small>${done ? 'Completada' : locked && mission.specialLock ? 'Disponible 13 de julio' : locked ? `Bloqueado - fase ${mission.week}` : 'Disponible'}</small>
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
          <span>Fase ${week}${week > CURRENT_WEEK ? ' Bloqueada' : ''}</span>
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
  [1, 2, 3, 4].forEach(phase => {
    const meta = phaseMeta(phase);
    const group = document.createElement('section');
    group.className = `mission-phase mission-phase--${phase} ${phase > CURRENT_PHASE ? 'is-locked' : 'is-open'}`;
    group.innerHTML = `
      <header class="mission-phase__head">
        <div>
          <span>${meta.title}</span>
          <p>${meta.subtitle}</p>
        </div>
      </header>
      <div class="mission-phase__list"></div>
    `;
    const list = group.querySelector('.mission-phase__list');
    MISSIONS.filter(mission => mission.week === phase).forEach(mission => {
      const done = isDone(mission);
      const locked = isLocked(mission);
      const dailyBlocked = noMoreToday && !done && !locked;
      const evidence = passport.evidence && passport.evidence[mission.id];
      const openEvidenceButton = done && evidenceUrl(evidence) ? `<a class="gb-btn evidence-open" href="${evidenceUrl(evidence)}" target="_blank" rel="noopener">Ver evidencia cargada</a>` : '';
      const specialLocked = locked && mission.specialLock;
      const article = document.createElement('article');
      article.id = mission.id;
      article.className = `mission-card phase-${phase} ${specialLocked ? 'special-locked' : done ? 'done' : locked ? 'locked' : dailyBlocked ? 'daily-blocked' : 'available'}`;
      article.innerHTML = `
        <div class="mission-copy">
          <div class="mission-copy-head">
            <div>
              <span class="week-pill">${specialLocked ? '🔮 MISIÓN ESPECIAL' : `Fase ${mission.week}`}</span>
              <h3>${mission.name}</h3>
              <p>${specialLocked ? 'Disponible el 13 de julio.' : locked ? (mission.publicHint || 'Pista desbloqueada: nombre del reto. La descripción completa se revelará en su fase.') : mission.desc}</p>
              ${mission.type && !specialLocked ? `<small class="mission-type">${mission.type}</small>` : ''}
            </div>
            <span class="mission-inline-art">${thumb(mission, 'inline')}</span>
          </div>
          <div class="mission-instructions ${locked && !specialLocked ? 'blurred' : ''}">
            ${specialLocked ? 'Andá preparando tus pronósticos mundialeros. Sólo durante la recta final del Mundial.' : locked ? 'Características e instrucciones bloqueadas.' : mission.instructions}
          </div>
          <span class="mission-state-pill">${done ? '✓ SELLO OBTENIDO' : specialLocked ? 'Disponible el 13 de julio' : locked ? 'Carga bloqueada hasta su fase' : dailyBlocked ? 'Volvé mañana para completar más misiones' : 'Sello desbloqueado'}</span>
          <div class="mission-completed-stamp">
            ${done ? stamp(mission, 'card') : ''}
          </div>
        </div>
        <div class="mission-evidence">
          ${done ? renderEvidenceView(mission, evidence) : `<div class="evidence-empty">${specialLocked ? 'Disponible el 13 de julio' : locked ? 'Carga bloqueada' : dailyBlocked ? 'Límite diario alcanzado' : 'Subí captura de Instagram'}</div>`}
          <p class="upload-status" data-upload-status="${mission.id}" hidden></p>
          ${locked ? `<span class="gb-btn evidence-btn disabled">${specialLocked ? 'Disponible pronto' : 'Bloqueado'}</span>` : `<label class="gb-btn evidence-btn ${dailyBlocked ? 'disabled' : ''}">
            ${done ? (evidenceUrl(evidence) ? 'Cambiar evidencia' : 'Subir evidencia nuevamente') : dailyBlocked ? 'Disponible mañana' : 'Subir evidencia'}
            <input type="file" accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.pdf" data-mission="${mission.id}" ${dailyBlocked ? 'disabled' : ''}>
          </label>`}
          ${openEvidenceButton}
        </div>
      `;
      list.appendChild(article);
    });
    wrap.appendChild(group);
  });
}

function bindUploads() {
  document.addEventListener('change', async event => {
    const input = event.target;
    if (!input.matches('input[type="file"][data-mission]')) return;
    const file = input.files && input.files[0];
    if (!file) return;
    const mission = MISSIONS.find(item => item.id === input.dataset.mission);
    if (!mission || isLocked(mission)) return;
    const wasDone = isDone(mission);
    const beforeCount = evidenceCount();
    if (!wasDone && dailyLimitReached()) {
      alert('Ya completaste tus 2 misiones de hoy. Volvé mañana para seguir sumando sellos.');
      input.value = '';
      renderAll();
      return;
    }
    const button = input.closest('.evidence-btn');
    input.disabled = true;
    if (button) button.classList.add('disabled', 'is-uploading');
    setMissionUploadStatus(mission.id, 'Procesando imagen...', 'info');
    try {
      const prepared = await prepareUploadFile(file);
      setMissionUploadStatus(mission.id, 'Subiendo evidencia...', 'info');
      const saved = await syncMissionEvidence_(mission, prepared);
      passport.evidence = passport.evidence || {};
      passport.evidence[mission.id] = {
        name:prepared.fileName,
        evidence_filename:prepared.fileName,
        dataUrl:prepared.dataUrl,
        evidence_url:(saved && saved.evidence_url) || prepared.dataUrl,
        date: wasDone && passport.evidence[mission.id] ? passport.evidence[mission.id].date : new Date().toISOString(),
        updatedAt:new Date().toISOString(),
        completed_at:(saved && saved.completed_at) || new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
      const afterCount = evidenceCount();
      renderAll();
      showLevelToast(levelUnlockMessage(beforeCount, afterCount));
      setMissionUploadStatus(mission.id, 'Evidencia enviada correctamente.', 'success');
      setTimeout(() => setMissionUploadStatus(mission.id, '', 'info'), 1200);
    } catch (err) {
      console.error('Error completo al procesar o subir evidencia:', err);
      setMissionUploadStatus(mission.id, err && err.message ? err.message : 'No pudimos procesar o subir la evidencia. Intentá nuevamente.', 'error');
      alert(err && err.message ? err.message : 'No pudimos procesar o subir la evidencia. Intentá nuevamente.');
    } finally {
      input.disabled = false;
      if (button) button.classList.remove('disabled', 'is-uploading');
      input.value = '';
    }
  });
}

function renderAll() {
  updateSessionIndicator();
  updateProgress();
  renderOverview();
  renderPassportSheet();
  renderMissions();
}

const sharePassportButton = $('#share-passport');
if (sharePassportButton) {
  sharePassportButton.addEventListener('click', () => {
    showLevelToast('Pronto podrás compartir tu Pasaporte Stanley en historias.');
  });
}

bindUploads();
renderAll();
hydratePassportFromBackend().then(renderAll);
