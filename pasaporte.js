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
  { id:'m11', week:4, name:'Pasaporte casi completo', type:'Historia Stanley / Producto', publicHint:'Toda gran historia tiene un protagonista. Contanos qué hace especial al tuyo.', desc:'Ya recorriste casi todo el camino. Antes de llegar a Legend queremos conocer un poco más sobre el Stanley que te acompaña. Tomale una foto a tu Stanley y contanos en una frase: “¿Qué hace especial a tu Stanley?”. No buscamos la mejor fotografía. Buscamos una respuesta auténtica.', instructions:'Subí una foto de tu Stanley a Instagram, etiquetá a @Stanley1913_Bolivia —la etiqueta debe verse en la captura— y acompañala con una frase breve contando qué lo hace especial. Luego subí tu evidencia.', highlight:true, featuredText:'Ya casi llegás a Legend.', examples:['Nunca sale de mi escritorio.','Fue un regalo que todavía uso todos los días.','Me acompaña en cada entrenamiento.','Es el primer Stanley que compré.'] },
  { id:'m12', week:4, name:'Legend Stanley', type:'Identidad / Comunidad', publicHint:'La categoría Legend más importante sos vos.', desc:'Llegaste a la última misión del recorrido. Ahora queremos conocer a la persona detrás del Pasaporte Stanley 1913. Sacate una selfie o una foto posando junto al Stanley que más te representa. Puede ser un solo producto o toda tu colección. Lo importante es que aparezcas vos.', instructions:'Publicá una selfie o foto junto a tu Stanley favorito, etiquetá a @Stanley1913_Bolivia —la etiqueta debe verse en la captura— y subí tu evidencia.', highlight:true, featuredText:'Ponéle cara a tu Pasaporte.', unlockAt:'2026-07-15T00:00:00-04:00', lockedDesc:'La última misión no trata solamente sobre tu Stanley. Trata sobre vos.', lockedText:'Disponible el 15 de julio.' }
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
const LEGEND_GENERATOR_UNLOCK_AT = '2026-07-16T00:00:00-04:00';
const LEGEND_SHARE_ID = 'legend_share';
const LEGEND_SHARE_NAME = 'Pasaporte Legend compartido';
const LEGEND_FINALISTS_READY = CONFIG.LEGEND_FINALISTS_READY === true;
const LEGEND_FINALISTS = Array.isArray(CONFIG.LEGEND_FINALISTS) ? CONFIG.LEGEND_FINALISTS : [];
const LEGEND_STAMP_ASSETS = Object.freeze({
  m1:'assets/sellos/01-sello.png', m2:'assets/sellos/02-sello.png',
  m3:'assets/sellos/03-sello.png', m4:'assets/sellos/04-sello.png',
  m5:'assets/sellos/05-sello.png', m6:'assets/sellos/06-sello.png',
  m7:'assets/sellos/07-sello.png', m8:'assets/sellos/08-sello.png',
  m9:'assets/sellos/09-sello.png', m10:'assets/sellos/10-sello.png',
  m11:'assets/sellos/11-sello.png', m12:'assets/sellos/12-sello.png'
});
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
const NOSTRADAMUS_KEY = 'stanley_nostradamus_prediction';
const NOSTRADAMUS_TEAMS = {
  argentina: { name:'Argentina', abbr:'ARG', colors:['#74acdf','#fff','#74acdf'] },
  france: { name:'Francia', abbr:'FRA', colors:['#1f4ea3','#fff','#e43d30'] },
  spain: { name:'España', abbr:'ESP', colors:['#c60b1e','#ffc400','#c60b1e'] },
  england: { name:'Inglaterra', abbr:'ING', colors:['#fff','#cf142b','#fff'] },
  brazil: { name:'Brasil', abbr:'BRA', colors:['#009b3a','#ffdf00','#002776'] },
  norway: { name:'Noruega', abbr:'NOR', colors:['#ba0c2f','#fff','#00205b'] },
  capeverde: { name:'Cabo Verde', abbr:'CPV', colors:['#003893','#fff','#cf2027'] }
};
const NOSTRADAMUS_SEMIS = [
  { id:'semi1', title:'Cruce 1', teams:['france','spain'] },
  { id:'semi2', title:'Cruce 2', teams:['argentina','england'] }
];
const NOSTRADAMUS_SCORERS = [
  { id:'messi', name:'Lionel Messi', team:'argentina' },
  { id:'mbappe', name:'Kylian Mbappé', team:'france' },
  { id:'kane', name:'Harry Kane', team:'england' },
  { id:'dembele', name:'Ousmane Dembélé', team:'france' },
  { id:'bellingham', name:'Jude Bellingham', team:'england' }
];
const NOSTRADAMUS_PLAYERS = [
  ...NOSTRADAMUS_SCORERS,
  { id:'yamal', name:'Lamine Yamal', team:'spain' },
  { id:'vozinha', name:'Vozinha', team:'capeverde' },
  { id:'julian', name:'Julián Álvarez', team:'argentina' },
  { id:'haaland', name:'Erling Haaland', team:'norway' },
  { id:'vinicius', name:'Vinicius Junior', team:'brazil' },
  { id:'olise', name:'Michael Olise', team:'france' },
  { id:'unai', name:'Unai Simón', team:'spain' }
];
let nostradamusShareFile = null;
let legendPassportFile = null;
let legendPassportDataUrl = '';
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
const isDone = mission => Boolean(passport.evidence && passport.evidence[mission.id]);
const evidenceCount = () => MISSIONS.filter(isDone).length;
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

function readNostradamusState() {
  try {
    return JSON.parse(localStorage.getItem(NOSTRADAMUS_KEY) || '{}');
  } catch (err) {
    console.warn('No se pudo leer Nostradamus desde localStorage.', err);
    return {};
  }
}

function saveNostradamusState(next) {
  localStorage.setItem(NOSTRADAMUS_KEY, JSON.stringify(next || {}));
}

function teamLabel(teamId) {
  const team = NOSTRADAMUS_TEAMS[teamId];
  return team ? team.name : 'Pendiente';
}

function teamAbbr(teamId) {
  const team = NOSTRADAMUS_TEAMS[teamId];
  return team ? team.abbr : '--';
}

function playerLabel(playerId, list) {
  const player = list.find(item => item.id === playerId);
  if (!player) return 'Pendiente';
  return `${player.name} · ${teamAbbr(player.team)}`;
}

function nostradamusFinalists(state) {
  return [state.semi1, state.semi2].filter(Boolean);
}

function scoreOptions(selected) {
  return Array.from({ length: 10 }, (_, value) => `<option value="${value}" ${String(selected ?? '') === String(value) ? 'selected' : ''}>${value}</option>`).join('');
}

function playerOptions(list, selected) {
  return `<option value="">Elegí una opción...</option>${list.map(player => `<option value="${player.id}" ${selected === player.id ? 'selected' : ''}>${player.name} · ${teamAbbr(player.team)}</option>`).join('')}`;
}

function flagMarkup(teamId) {
  const team = NOSTRADAMUS_TEAMS[teamId];
  if (!team) return '<span class="nostra-flag nostra-flag--empty"></span>';
  return `<span class="nostra-flag nostra-flag--${teamId}" aria-hidden="true"><i></i></span>`;
}

function teamChoiceMarkup(teamId, active, attrs) {
  const team = NOSTRADAMUS_TEAMS[teamId];
  return `
    <button class="nostra-team ${active ? 'is-active' : ''}" type="button" ${attrs} data-team="${teamId}">
      ${flagMarkup(teamId)}
      <strong>${team.name}</strong>
      <small>${team.abbr}</small>
    </button>
  `;
}

function validateNostradamus(state) {
  const finalists = nostradamusFinalists(state);
  if (finalists.length < 2) return 'Elegí un ganador por semifinal para definir la Final.';
  if (!state.champion || !finalists.includes(state.champion)) return 'Elegí un campeón entre tus dos finalistas.';
  if (!state.scorer) return 'Elegí quién será el máximo goleador.';
  if (!state.bestPlayer) return 'Elegí quién será el mejor jugador del torneo.';
  if (state.score1 === undefined || state.score1 === '' || state.score2 === undefined || state.score2 === '') return 'Completá el marcador previsto de la Final.';
  const score1 = Number(state.score1);
  const score2 = Number(state.score2);
  if (score1 === score2) return 'Elegí un marcador con un ganador. Para esta misión, registrá el resultado final del partido.';
  const winner = score1 > score2 ? finalists[0] : finalists[1];
  if (winner !== state.champion) return 'El marcador no coincide con el campeón seleccionado.';
  return '';
}

function isIncompleteNostradamus(error) {
  return [
    'Elegí un ganador por semifinal para definir la Final.',
    'Elegí un campeón entre tus dos finalistas.',
    'Elegí quién será el máximo goleador.',
    'Elegí quién será el mejor jugador del torneo.',
    'Completá el marcador previsto de la Final.'
  ].includes(error);
}

function renderNostradamusBuilder() {
  const state = readNostradamusState();
  const finalists = nostradamusFinalists(state);
  const championOptions = finalists.length === 2
    ? finalists.map(teamId => teamChoiceMarkup(teamId, state.champion === teamId, 'data-nostra-champion')).join('')
    : '<p class="nostra-empty">Primero elegí los ganadores de las dos semifinales.</p>';
  const scoreReady = finalists.length === 2;
  const status = validateNostradamus(state);

  return `
    <section class="nostradamus-builder" data-nostradamus>
      <div class="nostra-hero">
        <div>
          <span>Nostradamus Stanley</span>
          <h4>Armá tu pronóstico y generá tu historia</h4>
          <p>Publicá tu historia en Instagram, etiquetá a @Stanley1913_Bolivia y subí la captura como evidencia para obtener tu sello.</p>
        </div>
        <div class="nostra-ball" aria-hidden="true"></div>
      </div>

      <div class="nostra-step">
        <h5>Elegí quién avanza a la Final</h5>
        <div class="nostra-semis">
          ${NOSTRADAMUS_SEMIS.map(match => `
            <article class="nostra-match">
              <span>${match.title}</span>
              <div class="nostra-team-grid">
                ${match.teams.map(teamId => teamChoiceMarkup(teamId, state[match.id] === teamId, `data-nostra-semi="${match.id}"`)).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </div>

      <div class="nostra-step">
        <h5>¿Quién será campeón?</h5>
        <div class="nostra-team-grid nostra-team-grid--champion">${championOptions}</div>
      </div>

      <div class="nostra-step nostra-fields">
        <label>
          <span>¿Quién será el máximo goleador?</span>
          <select data-nostra-field="scorer">${playerOptions(NOSTRADAMUS_SCORERS, state.scorer)}</select>
        </label>
        <label>
          <span>¿Quién será el mejor jugador del torneo?</span>
          <select data-nostra-field="bestPlayer">${playerOptions(NOSTRADAMUS_PLAYERS, state.bestPlayer)}</select>
        </label>
      </div>

      <div class="nostra-step">
        <h5>¿Cómo terminará la Final?</h5>
        <div class="nostra-score">
          <label><span>${flagMarkup(finalists[0])}${teamLabel(finalists[0])}</span><select data-nostra-field="score1" ${scoreReady ? '' : 'disabled'}>${scoreOptions(state.score1)}</select></label>
          <strong>VS.</strong>
          <label><span>${flagMarkup(finalists[1])}${teamLabel(finalists[1])}</span><select data-nostra-field="score2" ${scoreReady ? '' : 'disabled'}>${scoreOptions(state.score2)}</select></label>
        </div>
      </div>

      <div class="nostra-summary">
        <span>Mi pronóstico Nostradamus</span>
        <p><strong>Final:</strong> ${flagMarkup(finalists[0])}${teamLabel(finalists[0])} vs. ${teamLabel(finalists[1])}${flagMarkup(finalists[1])}</p>
        <p><strong>Campeón:</strong> ${flagMarkup(state.champion)}${teamLabel(state.champion)}</p>
        <p><strong>Marcador:</strong> ${state.score1 ?? '-'} - ${state.score2 ?? '-'}</p>
        <p><strong>Máximo goleador:</strong> ${playerLabel(state.scorer, NOSTRADAMUS_SCORERS)}</p>
        <p><strong>Mejor jugador:</strong> ${playerLabel(state.bestPlayer, NOSTRADAMUS_PLAYERS)}</p>
        <small data-nostra-message>${status || 'Listo para generar tu historia.'}</small>
      </div>

      <div class="nostra-actions">
        <button class="gb-btn" type="button" data-nostra-generate>Generar mi historia</button>
        <button class="gb-btn gb-btn--secondary" type="button" data-nostra-share disabled>Compartir mi pronóstico</button>
        <a class="gb-btn gb-btn--secondary" data-nostra-download download="nostradamus-stanley.png" hidden>Descargar imagen</a>
        <button class="gb-btn gb-btn--secondary" type="button" data-nostra-upload>Ya la publiqué, subir evidencia</button>
      </div>
      <div class="nostra-preview" data-nostra-preview hidden></div>
      <div class="nostra-generating" data-nostra-generating hidden>
        <span class="nostra-spin-ball" aria-hidden="true"></span>
        <span class="nostra-stamp-pop" aria-hidden="true">Nostradamus Stanley</span>
      </div>
      <p class="nostra-note">La etiqueta debe verse en la captura de pantalla. El sello se desbloquea únicamente cuando subís la evidencia.</p>
    </section>
  `;
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '').split(/\s+/);
  let line = '';
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
  return y;
}

function fitTextToWidth(ctx, text, maxWidth, maxFontSize, minFontSize, weight = 900) {
  let size = maxFontSize;
  const family = 'Montserrat, Arial';
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  } while (size >= minFontSize);
  ctx.font = `${weight} ${minFontSize}px ${family}`;
  return minFontSize;
}

function drawRoundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function loadCanvasImage(src) {
  return new Promise(resolve => {
    if (!src) return resolve(null);
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawImageContain(ctx, image, x, y, w, h) {
  if (!image) return false;
  const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);
  const dw = image.naturalWidth * scale;
  const dh = image.naturalHeight * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  return true;
}

function drawFlag(ctx, teamId, x, y, w, h) {
  const team = NOSTRADAMUS_TEAMS[teamId];
  if (!team) return;
  ctx.save();
  drawRoundRect(ctx, x, y, w, h, 12);
  ctx.clip();
  const colors = team.colors;
  if (teamId === 'england') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#cf142b';
    ctx.fillRect(x + w * .42, y, w * .16, h);
    ctx.fillRect(x, y + h * .40, w, h * .20);
  } else {
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      if (teamId === 'france' || teamId === 'norway') ctx.fillRect(x + (w / colors.length) * index, y, w / colors.length, h);
      else ctx.fillRect(x, y + (h / colors.length) * index, w, h / colors.length);
    });
  }
  ctx.restore();
}

function drawBall(ctx, x, y, r) {
  ctx.save();
  ctx.fillStyle = '#f8f3ea';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.moveTo(x, y - r * .42);
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
    ctx.lineTo(x + Math.cos(a) * r * .24, y + Math.sin(a) * r * .24);
    const b = a + Math.PI / 5;
    ctx.lineTo(x + Math.cos(b) * r * .42, y + Math.sin(b) * r * .42);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No pudimos generar la imagen.')), 'image/png', 1);
    } catch (err) {
      reject(err);
    }
  });
}

async function generateNostradamusImage(state) {
  const error = validateNostradamus(state);
  if (error) throw new Error(isIncompleteNostradamus(error) ? 'Completá todos tus pronósticos para generar tu historia.' : error);
  const finalists = nostradamusFinalists(state);
  const stampAssets = await Promise.all([
    loadCanvasImage('assets/sellos/01-sello.png'),
    loadCanvasImage('assets/sellos/02-sello.png'),
    loadCanvasImage('assets/sellos/03-sello.png'),
    loadCanvasImage('assets/sellos/04-sello.png'),
    loadCanvasImage('assets/sellos/10-sello.png')
  ]);
  const nostraStamp = stampAssets[4];
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tu navegador no permitió generar la imagen.');

  ctx.fillStyle = '#00a66f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let x = -120; x < canvas.width; x += 180) {
    ctx.fillStyle = 'rgba(0,0,0,.05)';
    ctx.fillRect(x, 0, 70, canvas.height);
  }
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(70, 109, 430, 58);
  ctx.fillStyle = '#d1b08d';
  ctx.font = '900 24px Montserrat, Arial';
  ctx.fillText('PASAPORTE STANLEY 1913', 92, 147);

  ctx.fillStyle = '#fff';
  ctx.font = '900 84px Montserrat, Arial';
  ctx.fillText('MI PRONÓSTICO', 70, 272);
  ctx.fillText('NOSTRADAMUS', 70, 360);

  ctx.save();
  ctx.globalAlpha = .98;
  if (nostraStamp) {
    drawImageContain(ctx, nostraStamp, 772, 70, 230, 190);
  } else {
    ctx.strokeStyle = '#d1b08d';
    ctx.lineWidth = 6;
    drawRoundRect(ctx, 782, 78, 205, 165, 24);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '900 30px Montserrat, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NOSTRADAMUS', 884, 155);
    ctx.fillStyle = '#d1b08d';
    ctx.font = '800 20px Montserrat, Arial';
    ctx.fillText('STANLEY', 884, 192);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  const ig = normalizedIg(player && player.instagram);
  if (ig) {
    ctx.fillStyle = '#111';
    drawRoundRect(ctx, 70, 395, 330, 54, 27);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '800 26px Montserrat, Arial';
    ctx.fillText(ig, 96, 431);
  }

  drawRoundRect(ctx, 70, 505, 940, 495, 34);
  ctx.fillStyle = 'rgba(255,255,255,.94)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(185,154,120,.34)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#b99a78';
  ctx.font = '900 28px Montserrat, Arial';
  ctx.fillText('FINAL', 120, 575);
  drawFlag(ctx, finalists[0], 128, 615, 150, 92);
  drawFlag(ctx, finalists[1], 802, 615, 150, 92);
  ctx.fillStyle = '#111';
  const leftName = teamLabel(finalists[0]).toUpperCase();
  const rightName = teamLabel(finalists[1]).toUpperCase();
  fitTextToWidth(ctx, leftName, 330, 58, 36);
  ctx.fillText(leftName, 120, 805);
  ctx.textAlign = 'right';
  fitTextToWidth(ctx, rightName, 330, 58, 36);
  ctx.fillText(rightName, 960, 805);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#00a66f';
  ctx.font = '900 54px Montserrat, Arial';
  ctx.fillText('VS.', 540, 688);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.14)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 12;
  drawRoundRect(ctx, 390, 835, 300, 114, 24);
  ctx.fillStyle = '#fffaf1';
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#00a66f';
  ctx.lineWidth = 4;
  drawRoundRect(ctx, 390, 835, 300, 114, 24);
  ctx.stroke();
  ctx.fillStyle = '#111';
  ctx.font = '900 78px Montserrat, Arial';
  ctx.fillText(`${state.score1} - ${state.score2}`, 540, 915);
  ctx.textAlign = 'left';

  drawRoundRect(ctx, 70, 1035, 940, 185, 30);
  ctx.fillStyle = '#111';
  ctx.fill();
  drawFlag(ctx, state.champion, 122, 1082, 112, 72);
  ctx.fillStyle = '#d1b08d';
  ctx.font = '900 28px Montserrat, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CAMPEÓN', 540, 1098);
  ctx.fillStyle = '#fff';
  const championName = teamLabel(state.champion).toUpperCase();
  fitTextToWidth(ctx, championName, 560, 68, 42);
  ctx.fillText(championName, 540, 1167);
  ctx.textAlign = 'left';

  const cards = [
    { x:70, label:'MÁXIMO GOLEADOR', icon:'ball', value:playerLabel(state.scorer, NOSTRADAMUS_SCORERS) },
    { x:555, label:'MEJOR JUGADOR', icon:'star', value:playerLabel(state.bestPlayer, NOSTRADAMUS_PLAYERS) }
  ];
  cards.forEach(card => {
    drawRoundRect(ctx, card.x, 1250, 455, 185, 26);
    ctx.fillStyle = '#fffaf1';
    ctx.fill();
    ctx.strokeStyle = card.icon === 'star' ? '#d1b08d' : '#00a66f';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#b99a78';
    ctx.font = '900 22px Montserrat, Arial';
    ctx.fillText(card.label, card.x + 34, 1307);
    ctx.fillStyle = card.icon === 'star' ? '#d1b08d' : '#00a66f';
    if (card.icon === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const r = i % 2 ? 13 : 26;
        const px = card.x + 386 + Math.cos(a) * r;
        const py = 1300 + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      drawBall(ctx, card.x + 388, 1300, 25);
    }
    ctx.fillStyle = '#111';
    fitTextToWidth(ctx, card.value, 350, 36, 24);
    wrapCanvasText(ctx, card.value, card.x + 34, 1376, 350, 40);
  });

  drawRoundRect(ctx, 70, 1488, 940, 206, 30);
  ctx.fillStyle = '#111';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '900 42px Montserrat, Arial';
  ctx.fillText('La recta final se vive con Stanley.', 120, 1565);
  ctx.fillStyle = '#d1b08d';
  ctx.font = '800 30px Montserrat, Arial';
  wrapCanvasText(ctx, 'Subilo a tus historias y etiquetá a @Stanley1913_Bolivia', 120, 1625, 800, 38);

  drawRoundRect(ctx, 70, 1725, 940, 150, 28);
  ctx.fillStyle = '#fffaf1';
  ctx.fill();
  ctx.save();
  const bottomStamps = [
    { img:stampAssets[0], x:108, y:1745, w:145, h:105, r:-.10, a:.28 },
    { img:stampAssets[1], x:270, y:1744, w:145, h:115, r:.07, a:.34 },
    { img:stampAssets[2], x:430, y:1754, w:210, h:95, r:-.04, a:.40 },
    { img:stampAssets[3], x:665, y:1745, w:145, h:112, r:.09, a:.28 },
    { img:nostraStamp, x:802, y:1734, w:176, h:126, r:-.03, a:1 }
  ];
  bottomStamps.forEach(item => {
    if (!item.img) return;
    ctx.save();
    ctx.globalAlpha = item.a;
    ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
    ctx.rotate(item.r);
    drawImageContain(ctx, item.img, -item.w / 2, -item.h / 2, item.w, item.h);
    ctx.restore();
  });
  ctx.restore();

  const blob = await canvasToPngBlob(canvas);
  const dataUrl = canvas.toDataURL('image/png');
  return { blob, dataUrl };
}

function fittedCanvasText(ctx, value, maxWidth, maxFontSize, minFontSize, weight = 900) {
  const original = String(value || '');
  let size = maxFontSize;
  while (size > minFontSize) {
    ctx.font = `${weight} ${size}px Montserrat, Arial`;
    if (ctx.measureText(original).width <= maxWidth) return { text:original, size };
    size -= 2;
  }
  ctx.font = `${weight} ${minFontSize}px Montserrat, Arial`;
  if (ctx.measureText(original).width <= maxWidth) return { text:original, size:minFontSize };
  let shortened = original;
  while (shortened.length > 2 && ctx.measureText(`${shortened}…`).width > maxWidth) shortened = shortened.slice(0, -1);
  return { text:`${shortened}…`, size:minFontSize };
}

function drawFittedCanvasText(ctx, value, x, y, maxWidth, maxFontSize, minFontSize, weight = 900) {
  const fitted = fittedCanvasText(ctx, value, maxWidth, maxFontSize, minFontSize, weight);
  ctx.font = `${weight} ${fitted.size}px Montserrat, Arial`;
  ctx.fillText(fitted.text, x, y);
  return fitted;
}

function legendGeneratorAvailable(now = Date.now()) {
  return now >= new Date(LEGEND_GENERATOR_UNLOCK_AT).getTime();
}

function readLegendChoice() {
  const index = Number(localStorage.getItem('stanley_legend_finalist'));
  return index === 0 || index === 1 ? index : null;
}

function legendFinalistsReady() {
  return LEGEND_FINALISTS_READY && LEGEND_FINALISTS.length === 2 && LEGEND_FINALISTS.every(item => item && item.name && item.code && item.flag);
}

function legendShareEvidence() {
  return passport.legendShare || null;
}

function legendEligible() {
  return Boolean(participantId() && evidenceCount() === 12 && legendShareEvidence() && evidenceUrl(legendShareEvidence()));
}

async function generateLegendPassportImage(championIndex) {
  if (evidenceCount() !== 12) throw new Error('Necesitás los 12 sellos para generar tu Pasaporte Legend.');
  if (!legendGeneratorAvailable()) throw new Error('El generador se habilita el 16 de julio.');
  if (!legendFinalistsReady()) throw new Error('Los finalistas todavía no fueron configurados.');
  if (championIndex !== 0 && championIndex !== 1) throw new Error('Elegí quién será tu campeón.');

  const champion = LEGEND_FINALISTS[championIndex];
  const runnerUp = LEGEND_FINALISTS[championIndex === 0 ? 1 : 0];
  const stampIds = Object.keys(LEGEND_STAMP_ASSETS);
  const [campaignStamp, championFlag, runnerFlag, ...stampImages] = await Promise.all([
    loadCanvasImage('assets/sellos/sello-00.png'),
    loadCanvasImage(champion.flag),
    loadCanvasImage(runnerUp.flag),
    ...stampIds.map(id => loadCanvasImage(LEGEND_STAMP_ASSETS[id]))
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tu navegador no permitió generar la imagen.');

  ctx.fillStyle = '#f7f3ec';
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = '#00a66f';
  ctx.fillRect(0, 0, 1080, 390);
  for (let x = -90; x < 1080; x += 170) {
    ctx.fillStyle = 'rgba(0,0,0,.045)';
    ctx.fillRect(x, 0, 64, 390);
  }

  ctx.fillStyle = '#111';
  drawRoundRect(ctx, 68, 68, 390, 58, 12);
  ctx.fill();
  ctx.fillStyle = '#d1b08d';
  ctx.font = '900 23px Montserrat, Arial';
  ctx.fillText('PASAPORTE STANLEY 1913', 92, 106);
  ctx.fillStyle = '#fff';
  ctx.font = '900 76px Montserrat, Arial';
  ctx.fillText('MI PASAPORTE', 68, 232);
  ctx.fillText('STANLEY', 68, 316);
  ctx.fillStyle = '#111';
  ctx.font = '900 30px Montserrat, Arial';
  ctx.fillText('12/12 sellos · Nivel Legend', 70, 365);
  if (campaignStamp) drawImageContain(ctx, campaignStamp, 800, 56, 220, 245);

  const participantLabel = normalizedIg(player && player.instagram) || String((player && player.nombre) || 'StanleyLover');
  ctx.fillStyle = '#111';
  drawRoundRect(ctx, 68, 420, 944, 92, 24);
  ctx.fill();
  ctx.fillStyle = '#fff';
  drawFittedCanvasText(ctx, participantLabel, 104, 480, 730, 38, 24, 800);

  ctx.fillStyle = '#b99a78';
  ctx.font = '900 23px Montserrat, Arial';
  ctx.fillText('MIS 12 SELLOS', 68, 570);
  drawRoundRect(ctx, 68, 595, 944, 625, 30);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = 'rgba(185,154,120,.35)';
  ctx.lineWidth = 3;
  ctx.stroke();

  stampImages.forEach((image, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 92 + column * 226;
    const y = 626 + row * 190;
    ctx.fillStyle = row === 2 ? '#f4efe7' : '#fbfaf7';
    drawRoundRect(ctx, x, y, 202, 164, 22);
    ctx.fill();
    if (image) drawImageContain(ctx, image, x + 18, y + 15, 166, 134);
  });

  ctx.fillStyle = '#111';
  drawRoundRect(ctx, 68, 1260, 944, 415, 32);
  ctx.fill();
  ctx.fillStyle = '#d1b08d';
  ctx.font = '900 26px Montserrat, Arial';
  ctx.fillText('MI CAMPEÓN', 110, 1324);
  if (championFlag) drawImageContain(ctx, championFlag, 108, 1360, 560, 200);
  ctx.fillStyle = '#fff';
  drawFittedCanvasText(ctx, String(champion.name).toUpperCase(), 108, 1630, 600, 60, 34);

  ctx.globalAlpha = .66;
  ctx.fillStyle = '#fff';
  drawRoundRect(ctx, 740, 1348, 220, 230, 24);
  ctx.fill();
  if (runnerFlag) drawImageContain(ctx, runnerFlag, 770, 1380, 160, 98);
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.font = '900 18px Montserrat, Arial';
  ctx.fillText('FINALISTA', 850, 1514);
  drawFittedCanvasText(ctx, runnerUp.shortName || runnerUp.name, 850, 1550, 180, 24, 16, 900);
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#00a66f';
  ctx.font = '900 38px Montserrat, Arial';
  ctx.fillText('La fiesta del fútbol se vive con Stanley.', 68, 1743);
  ctx.fillStyle = '#111';
  ctx.font = '800 26px Montserrat, Arial';
  ctx.fillText('Orgullosamente parte de StanleyLovers Bolivia.', 68, 1793);
  ctx.fillStyle = '#b99a78';
  drawRoundRect(ctx, 68, 1830, 944, 62, 18);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.font = '900 24px Montserrat, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Compartilo y etiquetá a @Stanley1913_Bolivia', 540, 1871);
  ctx.textAlign = 'left';

  const blob = await canvasToPngBlob(canvas);
  return { blob, dataUrl:canvas.toDataURL('image/png') };
}

function legendFinalistCards(selected) {
  if (!legendFinalistsReady()) return '<p class="legend-final__notice">Los dos finalistas se cargarán antes de habilitar el generador.</p>';
  return LEGEND_FINALISTS.map((item, index) => `
    <button class="legend-finalist ${selected === index ? 'is-selected' : ''}" type="button" data-legend-finalist="${index}" aria-pressed="${selected === index}">
      <img src="${item.flag}" alt="Bandera de ${item.name}">
      <span>${item.code}</span>
      <strong>${item.name}</strong>
    </button>
  `).join('');
}

function renderLegendFinal() {
  const host = $('#legend-final');
  if (!host) return;
  if (!participantId()) {
    host.hidden = true;
    host.innerHTML = '';
    return;
  }
  host.hidden = false;
  const count = evidenceCount();
  if (count < 12) {
    host.innerHTML = `
      <span class="stage__kicker">Cierre Legend</span>
      <h2>Tu historia final</h2>
      <p>Completá los 12 sellos para generar tu Pasaporte Legend.</p>
      <strong class="legend-final__progress">${count}/12 sellos</strong>`;
    return;
  }
  if (!legendGeneratorAvailable()) {
    host.innerHTML = `
      <span class="stage__kicker">Nivel Legend alcanzado</span>
      <h2>¡Pasaporte completo!</h2>
      <p>El 16 de julio podrás generar tu historia final, elegir a tu campeón y compartir tu Pasaporte completo.</p>
      <strong class="legend-final__progress">12/12 sellos · Disponible el 16 de julio</strong>`;
    return;
  }

  const selected = readLegendChoice();
  const finalEvidence = legendShareEvidence();
  const hasGenerated = Boolean(legendPassportDataUrl);
  host.innerHTML = `
    <div class="legend-final__head">
      <div>
        <span class="stage__kicker">Nivel Legend</span>
        <h2>¡Pasaporte completo!</h2>
        <p>Alcanzaste el nivel Legend. Generá tu historia final, elegí a tu campeón y compartí tu Pasaporte completo para quedar habilitado en el Sorteo Legend.</p>
      </div>
      <strong>12/12 sellos</strong>
    </div>
    ${legendEligible() ? '<div class="legend-eligibility is-ready">¡Ya estás habilitado para el Sorteo Legend!</div>' : '<div class="legend-eligibility">Completaste los 12 sellos. Para quedar habilitado en el Sorteo Legend, compartí tu Pasaporte completo y subí la evidencia final.</div>'}
    <div class="legend-builder">
      <div class="legend-builder__choices">
        <h3>¿Quién será tu campeón?</h3>
        <p>Elegí exactamente una selección. La otra quedará como finalista.</p>
        <div class="legend-finalists">${legendFinalistCards(selected)}</div>
        <button class="gb-btn" type="button" data-legend-generate ${selected === null || !legendFinalistsReady() ? 'disabled' : ''}>Generar mi Pasaporte Legend</button>
        <p class="upload-status" data-legend-status hidden></p>
      </div>
      <div class="legend-builder__result">
        <div class="legend-preview" data-legend-preview>${hasGenerated ? `<img src="${legendPassportDataUrl}" alt="Pasaporte Legend generado">` : '<span>Tu historia Legend aparecerá acá.</span>'}</div>
        <div class="legend-actions" ${hasGenerated ? '' : 'hidden'}>
          <button class="gb-btn" type="button" data-legend-share>Compartir mi Pasaporte</button>
          <a class="gb-btn gb-btn--secondary" data-legend-download href="${legendPassportDataUrl}" download="pasaporte-stanley-legend.png">Descargar imagen</a>
        </div>
      </div>
    </div>
    <div class="legend-proof">
      <div>
        <h3>Evidencia final para el Sorteo Legend</h3>
        <p>Compartí tu Pasaporte completo en historias, etiquetá a @Stanley1913_Bolivia y subí una captura donde se vea la publicación y la etiqueta.</p>
        ${finalEvidence ? '<strong>✓ PASAPORTE LEGEND COMPARTIDO</strong>' : ''}
      </div>
      <div class="legend-proof__evidence">
        ${finalEvidence ? renderEvidenceView({ name:LEGEND_SHARE_NAME }, finalEvidence) : '<div class="evidence-empty">Subí el comprobante final</div>'}
        <p class="upload-status" data-upload-status="legend_share" hidden></p>
        <label class="gb-btn evidence-btn">
          ${finalEvidence ? 'Cambiar evidencia' : 'Ya lo compartí · Subir comprobante final'}
          <input type="file" accept="image/*,.jpg,.jpeg,.png,.heic,.heif,.pdf" data-legend-share>
        </label>
        ${finalEvidence && evidenceUrl(finalEvidence) ? `<a class="gb-btn gb-btn--secondary" href="${evidenceUrl(finalEvidence)}" target="_blank" rel="noopener">Ver evidencia cargada</a>` : ''}
      </div>
    </div>`;
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
  return MISSIONS.reduce((total, mission) => {
    const item = passport.evidence && passport.evidence[mission.id];
    return total + (item && localDay(item.date || item.completedAt) === today ? 1 : 0);
  }, 0);
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
  let legendShare = null;
  (rows || []).forEach(row => {
    const url = row.evidence_url || row.url || '';
    if (row.mission_id === LEGEND_SHARE_ID) {
      legendShare = {
        name:row.evidence_filename || LEGEND_SHARE_NAME,
        evidence_filename:row.evidence_filename || '',
        dataUrl:'',
        evidence_url:url,
        instagram_url:row.instagram_url || '',
        instagram_post_type:row.instagram_post_type || '',
        date:row.completed_at || row.submitted_at || new Date().toISOString(),
        completed_at:row.completed_at || '',
        updatedAt:row.submitted_at || row.completed_at || new Date().toISOString(),
        source:'backend'
      };
      return;
    }
    const mission = MISSIONS.find(item => item.id === row.mission_id);
    if (!mission) return;
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
  return { evidence, legendShare };
}

async function hydratePassportFromBackend() {
  if (!CONFIG.APPS_SCRIPT_URL || !player || !player.id) return;
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
    const recovered = missionRowsToEvidence(saved.missions || []);
    const localEvidence = passport.evidence || {};
    passport.evidence = { ...recovered.evidence };
    Object.keys(localEvidence).forEach(id => {
      const remote = passport.evidence[id] || {};
      passport.evidence[id] = {
        ...remote,
        ...localEvidence[id],
        evidence_url:remote.evidence_url || localEvidence[id].evidence_url || '',
        completed_at:remote.completed_at || localEvidence[id].completed_at || ''
      };
    });
    if (recovered.legendShare) {
      passport.legendShare = {
        ...recovered.legendShare,
        ...(passport.legendShare || {}),
        evidence_url:recovered.legendShare.evidence_url || (passport.legendShare && passport.legendShare.evidence_url) || '',
        completed_at:recovered.legendShare.completed_at || (passport.legendShare && passport.legendShare.completed_at) || ''
      };
    }
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
  
  
  const bar = $('#passport-progress-bar') || $('#pg-fill');
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
      <small>${done ? 'Completada' : locked && mission.lockedText ? mission.lockedText : locked && mission.specialLock ? 'Disponible 13 de julio' : locked ? `Bloqueado - fase ${mission.week}` : 'Disponible'}</small>
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
      const datedLocked = locked && Boolean(mission.lockedText);
      const missionDescription = specialLocked ? 'Disponible el 13 de julio.' : datedLocked ? mission.lockedDesc : locked ? (mission.publicHint || 'Pista desbloqueada: nombre del reto. La descripción completa se revelará en su fase.') : mission.desc;
      const missionInstruction = specialLocked ? 'Andá preparando tus pronósticos mundialeros. Sólo durante la recta final del Mundial.' : datedLocked ? mission.lockedText : locked ? 'Características e instrucciones bloqueadas.' : mission.instructions;
      const article = document.createElement('article');
      article.id = mission.id;
      article.className = `mission-card phase-${phase} ${mission.id === 'm10' && !locked && !done ? 'nostradamus-active' : ''} ${specialLocked ? 'special-locked' : done ? 'done' : locked ? 'locked' : dailyBlocked ? 'daily-blocked' : 'available'}`;
      article.innerHTML = `
        <div class="mission-copy">
          <div class="mission-copy-head">
            <div>
              <span class="week-pill">${specialLocked ? '🔮 MISIÓN ESPECIAL' : `Fase ${mission.week}`}</span>
              <h3>${mission.name}</h3>
              <p>${missionDescription}</p>
              ${mission.type && !specialLocked ? `<small class="mission-type">${mission.type}</small>` : ''}
            </div>
            <span class="mission-inline-art">${thumb(mission, 'inline')}</span>
          </div>
          <div class="mission-instructions ${locked && !specialLocked && !datedLocked ? 'blurred' : ''}">
            ${missionInstruction}
          </div>
          ${!locked && mission.featuredText ? `<strong class="mission-featured">${mission.featuredText}</strong>` : ''}
          ${!locked && !done && mission.examples ? `<div class="mission-examples"><span>Podés inspirarte:</span>${mission.examples.map(example => `<q>${example}</q>`).join('')}</div>` : ''}
          ${mission.id === 'm10' && !locked && !done ? renderNostradamusBuilder() : ''}
          <span class="mission-state-pill">${done ? '✓ SELLO OBTENIDO' : specialLocked ? 'Disponible el 13 de julio' : datedLocked ? 'Última misión' : locked ? 'Carga bloqueada hasta su fase' : dailyBlocked ? 'Volvé mañana para completar más misiones' : 'Sello desbloqueado'}</span>
          <div class="mission-completed-stamp">
            ${done ? stamp(mission, 'card') : ''}
          </div>
        </div>
        <div class="mission-evidence">
          ${done ? renderEvidenceView(mission, evidence) : `<div class="evidence-empty">${specialLocked ? 'Disponible el 13 de julio' : datedLocked ? 'Carga bloqueada' : locked ? 'Carga bloqueada' : dailyBlocked ? 'Límite diario alcanzado' : 'Subí captura de Instagram'}</div>`}
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

function refreshNostradamus() {
  renderAll();
  const target = document.getElementById('m10');
  if (target) target.scrollIntoView({ block:'center' });
}

function setNostradamusMessage(message, state = 'info') {
  const el = document.querySelector('[data-nostra-message]');
  if (!el) return;
  el.textContent = message;
  el.dataset.state = state;
}

function bindNostradamus() {
  document.addEventListener('click', async event => {
    const semi = event.target.closest('[data-nostra-semi]');
    if (semi) {
      const state = readNostradamusState();
      const matchId = semi.dataset.nostraSemi;
      state[matchId] = semi.dataset.team;
      const finalists = [state.semi1, state.semi2].filter(Boolean);
      if (!finalists.includes(state.champion)) state.champion = '';
      saveNostradamusState(state);
      refreshNostradamus();
      return;
    }

    const champion = event.target.closest('[data-nostra-champion]');
    if (champion) {
      const state = readNostradamusState();
      const finalists = nostradamusFinalists(state);
      if (!finalists.includes(champion.dataset.team)) return;
      state.champion = champion.dataset.team;
      saveNostradamusState(state);
      refreshNostradamus();
      return;
    }

    const generate = event.target.closest('[data-nostra-generate]');
    if (generate) {
      const state = readNostradamusState();
      const error = validateNostradamus(state);
      if (error) {
        setNostradamusMessage(isIncompleteNostradamus(error) ? 'Completá todos tus pronósticos para generar tu historia.' : error, 'error');
        return;
      }
      const builder = generate.closest('[data-nostradamus]');
      const generating = builder && builder.querySelector('[data-nostra-generating]');
      generate.disabled = true;
      generate.textContent = 'Generando...';
      if (builder) builder.classList.add('is-generating');
      if (generating) generating.hidden = false;
      try {
        const [image] = await Promise.all([
          generateNostradamusImage(state),
          new Promise(resolve => setTimeout(resolve, 950))
        ]);
        try {
          nostradamusShareFile = new File([image.blob], 'nostradamus-stanley.png', { type:'image/png' });
        } catch (fileErr) {
          console.warn('El navegador no permite preparar archivo para compartir; queda disponible descarga.', fileErr);
          nostradamusShareFile = null;
        }
        const preview = document.querySelector('[data-nostra-preview]');
        const download = document.querySelector('[data-nostra-download]');
        const share = document.querySelector('[data-nostra-share]');
        if (preview) {
          preview.hidden = false;
          preview.innerHTML = `<img src="${image.dataUrl}" alt="Historia generada Nostradamus Stanley">`;
        }
        if (download) {
          download.hidden = false;
          download.href = image.dataUrl;
        }
        if (share) share.disabled = false;
        setNostradamusMessage('Tu pronóstico está listo.', 'success');
      } catch (err) {
        console.error('Error generando historia Nostradamus:', err);
        setNostradamusMessage(err && err.message ? err.message : 'No pudimos generar la historia. Intentá nuevamente.', 'error');
      } finally {
        if (builder) builder.classList.remove('is-generating');
        if (generating) generating.hidden = true;
        generate.disabled = false;
        generate.textContent = 'Generar mi historia';
      }
      return;
    }

    const share = event.target.closest('[data-nostra-share]');
    if (share) {
      try {
        if (nostradamusShareFile && navigator.canShare && navigator.canShare({ files:[nostradamusShareFile] }) && navigator.share) {
          await navigator.share({
            files:[nostradamusShareFile],
            title:'Mi pronóstico Nostradamus Stanley',
            text:'La recta final se vive con Stanley.'
          });
          setNostradamusMessage('Listo. Después de publicarla, subí la captura como evidencia.', 'success');
        } else {
          const download = document.querySelector('[data-nostra-download]');
          if (download && download.href) download.click();
          setNostradamusMessage('Tu navegador no permite compartir archivos directamente. Descargá la imagen y subila a Instagram.', 'info');
        }
      } catch (err) {
        console.error('Error compartiendo historia Nostradamus:', err);
        setNostradamusMessage('No pudimos compartir directamente. Usá Descargar imagen y publicala en Instagram.', 'error');
      }
      return;
    }

    const upload = event.target.closest('[data-nostra-upload]');
    if (upload) {
      const input = document.querySelector('input[type="file"][data-mission="m10"]');
      const mission = document.getElementById('m10');
      if (mission) mission.scrollIntoView({ behavior:'smooth', block:'center' });
      if (input && !input.disabled) setTimeout(() => input.click(), 240);
      else setNostradamusMessage('La carga de evidencia no está disponible en este momento.', 'error');
    }
  });

  document.addEventListener('change', event => {
    const field = event.target.closest('[data-nostra-field]');
    if (!field) return;
    const state = readNostradamusState();
    state[field.dataset.nostraField] = field.value;
    saveNostradamusState(state);
    renderAll();
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

function setLegendStatus(message, state = 'info') {
  const el = document.querySelector('[data-legend-status]');
  if (!el) return;
  el.textContent = message || '';
  el.dataset.state = state;
  el.hidden = !message;
}

function bindLegend() {
  document.addEventListener('click', async event => {
    const finalist = event.target.closest('[data-legend-finalist]');
    if (finalist) {
      localStorage.setItem('stanley_legend_finalist', finalist.dataset.legendFinalist);
      renderLegendFinal();
      return;
    }

    const generate = event.target.closest('[data-legend-generate]');
    if (generate) {
      const selected = readLegendChoice();
      generate.disabled = true;
      generate.textContent = 'Generando...';
      setLegendStatus('Preparando tu Pasaporte Legend...', 'info');
      try {
        const image = await generateLegendPassportImage(selected);
        legendPassportDataUrl = image.dataUrl;
        try {
          legendPassportFile = new File([image.blob], 'pasaporte-stanley-legend.png', { type:'image/png' });
        } catch (fileErr) {
          console.warn('El navegador no permite preparar un archivo para compartir.', fileErr);
          legendPassportFile = null;
        }
        renderLegendFinal();
        setLegendStatus('Tu Pasaporte Legend está listo.', 'success');
      } catch (err) {
        console.error('Error generando Pasaporte Legend:', err);
        generate.disabled = false;
        generate.textContent = 'Generar mi Pasaporte Legend';
        setLegendStatus(err && err.message ? err.message : 'No pudimos generar la imagen.', 'error');
      }
      return;
    }

    const share = event.target.closest('[data-legend-share]');
    if (share) {
      try {
        if (legendPassportFile && navigator.canShare && navigator.canShare({ files:[legendPassportFile] }) && navigator.share) {
          await navigator.share({
            files:[legendPassportFile],
            title:'Mi Pasaporte Stanley Legend',
            text:'La fiesta del fútbol se vive con Stanley.'
          });
          setLegendStatus('Listo. Publicalo, etiquetá a @Stanley1913_Bolivia y subí la captura final.', 'success');
        } else {
          const download = document.querySelector('[data-legend-download]');
          if (download) download.click();
          setLegendStatus('Descargamos la imagen. Ahora podés publicarla desde tu galería.', 'info');
        }
      } catch (err) {
        console.error('Error compartiendo Pasaporte Legend:', err);
        setLegendStatus('No pudimos compartir directamente. Usá “Descargar imagen”.', 'error');
      }
    }
  });

  document.addEventListener('change', async event => {
    const input = event.target.closest('input[type="file"][data-legend-share]');
    if (!input) return;
    const file = input.files && input.files[0];
    if (!file) return;
    if (evidenceCount() !== 12 || !legendGeneratorAvailable()) {
      alert('La evidencia final se habilita con 12 sellos desde el 16 de julio.');
      input.value = '';
      return;
    }
    const button = input.closest('.evidence-btn');
    input.disabled = true;
    if (button) button.classList.add('disabled', 'is-uploading');
    setMissionUploadStatus(LEGEND_SHARE_ID, 'Procesando imagen...', 'info');
    try {
      const prepared = await prepareUploadFile(file);
      setMissionUploadStatus(LEGEND_SHARE_ID, 'Subiendo evidencia...', 'info');
      const saved = await syncMissionEvidence_({ id:LEGEND_SHARE_ID, name:LEGEND_SHARE_NAME, week:'Final Legend' }, prepared);
      passport.legendShare = {
        name:prepared.fileName,
        evidence_filename:prepared.fileName,
        dataUrl:prepared.dataUrl,
        evidence_url:(saved && saved.evidence_url) || prepared.dataUrl,
        date:new Date().toISOString(),
        updatedAt:new Date().toISOString(),
        completed_at:(saved && saved.completed_at) || new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
      renderAll();
      setMissionUploadStatus(LEGEND_SHARE_ID, 'Evidencia final enviada correctamente.', 'success');
    } catch (err) {
      console.error('Error completo al subir evidencia Legend:', err);
      const message = err && err.message ? err.message : 'No pudimos subir la evidencia final. Intentá nuevamente.';
      setMissionUploadStatus(LEGEND_SHARE_ID, message, 'error');
      alert(message);
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
  renderLegendFinal();
}

const sharePassportButton = $('#share-passport');
if (sharePassportButton) {
  sharePassportButton.addEventListener('click', () => {
    showLevelToast('Pronto podrás compartir tu Pasaporte Stanley en historias.');
  });
}

bindNostradamus();
bindUploads();
bindLegend();
renderAll();
hydratePassportFromBackend().then(renderAll);
