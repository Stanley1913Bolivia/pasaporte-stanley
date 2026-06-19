const MISSIONS = [
  { id:'m1', week:1, name:'Mi Stanley va conmigo', desc:'Mostra tu Stanley acompanando tu dia futbolero.', instructions:'Publica una historia, post o reel con tu Stanley en un momento real de tu dia. Etiqueta a @Stanley1913_Bolivia y subi la captura.' },
  { id:'m2', week:1, name:'Ritual de previa', desc:'Comparti tu previa con tu producto Stanley favorito.', instructions:'Mostra tu bebida, mesa o preparacion antes de vivir la temporada futbolera. La etiqueta a @Stanley1913_Bolivia debe verse en la captura.' },
  { id:'m3', week:1, name:'Color de hinchada', desc:'Subi un momento usando colores de celebración.', instructions:'Combina tu Stanley con colores, outfit o decoracion futbolera. Subi la captura de Instagram como evidencia.' },
  { id:'m4', week:2, name:'Stanley en la mesa', desc:'Mostra tu mesa, snack o bebida de temporada.', instructions:'Comparti una foto o video de tu mesa con presencia Stanley. Etiqueta a @Stanley1913_Bolivia.' },
  { id:'m5', week:2, name:'La Cábala Stanley', desc:'Conta que no puede faltar cuando vivis futbol.', instructions:'Publica tu cabala, rutina o detalle favorito junto a tu Stanley. Subi captura visible.' },
  { id:'m6', week:2, name:'Compartido sabe mejor', desc:'Mostra como compartis el momento con amigos o familia.', instructions:'Comparti un momento grupal, cuidando que tu Stanley sea protagonista o parte clara de la escena.' },
  { id:'m7', week:3, name:'Set de Celebración', desc:'Arma tu rincon Stanley para ver la temporada.', instructions:'Mostra tu setup: sillon, mesa, terraza o lugar elegido para celebrar.' },
  { id:'m8', week:3, name:'El grito del momento', desc:'Comparti una reaccion, festejo o emocion futbolera.', instructions:'Puede ser foto, historia o reel. Lo importante es la energia de comunidad y la etiqueta a @Stanley1913_Bolivia.' },
  { id:'m9', week:3, name:'Misión Secreta: Nostradamus', desc:'Ya viste los primeros partidos. Ahora contanos como imaginas que termina esta temporada futbolera.', instructions:'Responde en Instagram: campeon esperado, goleador esperado, partido mas esperado y final sonada. No hay ranking ni premio por acertar: el sello se obtiene por participar y cargar evidencia valida.' },
  { id:'m10', week:4, name:'Mi lugar favorito', desc:'Lleva tu Stanley a un lugar que represente tu pasion.', instructions:'Mostra tu Stanley en el lugar donde mas disfrutas vivir esta temporada: casa, oficina, terraza, parque o reunion.' },
  { id:'m11', week:4, name:'Pasaporte casi completo', desc:'Mostra tus sellos y celebra tu avance.', instructions:'Comparti una captura o foto de tu progreso en Pasaporte Stanley y etiqueta a @Stanley1913_Bolivia.', highlight:true },
  { id:'m12', week:4, name:'Legend Stanley', desc:'Cerra el pasaporte con tu mejor momento Stanley.', instructions:'Publica tu mejor contenido de campana. Al subir la captura desbloqueas el sello final.', highlight:true }
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

const $ = sel => document.querySelector(sel);
const setText = (sel, value) => { const el = $(sel); if (el) el.textContent = value; };
const evidenceCount = () => Object.values(passport.evidence || {}).filter(Boolean).length;
const isDone = mission => Boolean(passport.evidence && passport.evidence[mission.id]);
const isLocked = mission => mission.week > CURRENT_WEEK;

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
      documento: player.documento || '',
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
            <p>${locked ? 'Pista desbloqueada: nombre del reto. La descripcion completa se revelara en su semana.' : mission.desc}</p>
          </div>
          <span class="mission-inline-art">${thumb(mission, 'inline')}</span>
        </div>
        <div class="mission-instructions ${locked ? 'blurred' : ''}">
          ${locked ? 'Caracteristicas e instrucciones bloqueadas.' : mission.instructions}
        </div>
        <span class="mission-state-pill">${done ? 'Completado' : locked ? 'Carga bloqueada hasta su semana' : dailyBlocked ? 'Volvé mañana para completar más misiones' : 'Sello desbloqueado'}</span>
        <div class="mission-completed-stamp">
          ${done ? stamp(mission, 'card') : ''}
        </div>
      </div>
      <div class="mission-evidence">
        ${evidence ? `<img src="${evidence.dataUrl}" alt="Evidencia cargada para ${mission.name}" />` : `<div class="evidence-empty">${locked ? 'Carga bloqueada' : dailyBlocked ? 'Límite diario alcanzado' : 'Subi captura de Instagram'}</div>`}
        <label class="gb-btn evidence-btn ${locked || dailyBlocked ? 'disabled' : ''}">
          ${done ? 'Cambiar evidencia' : locked ? 'Bloqueado' : dailyBlocked ? 'Disponible mañana' : 'Subir evidencia'}
          <input type="file" accept="image/*" data-mission="${mission.id}" ${locked || dailyBlocked ? 'disabled' : ''}>
        </label>
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
      alert('Ya completaste tus 2 misiones de hoy. Volvé mañana para seguir sumando sellos.');
      input.value = '';
      renderAll();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      passport.evidence = passport.evidence || {};
      passport.evidence[mission.id] = {
        name:file.name,
        dataUrl:reader.result,
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
  updateProgress();
  renderOverview();
  renderPassportSheet();
  renderMissions();
}

bindUploads();
renderAll();
