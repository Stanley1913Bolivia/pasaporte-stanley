/* Leaderboard en vivo — lee el ranking del Web App de Apps Script */
const APPS_URL = (window.STANLEY||{}).APPS_SCRIPT_URL || '';
const lb = document.getElementById('lb');
const upd = document.getElementById('lb-updated');
const me = (()=>{ try{ return JSON.parse(localStorage.getItem('stanley_player')); }catch(e){ return null; } })();

function msg(t){ lb.innerHTML = `<p class="lb-empty">${t}</p>`; }

if(!APPS_URL){ msg('El ranking todavía no está conectado.'); }
else {
  msg('Cargando ranking…');
  fetch(APPS_URL + '?action=ranking')
    .then(r=>r.json())
    .then(data=>{
      const r = (data && data.ranking) || [];
      if(!r.length){ msg('Aún no hay puntos: el ranking se publica cuando empiecen a cargarse los resultados. ¡Armá tu quiniela mientras tanto!'); return; }
      if(data.actualizado) upd.textContent = 'Actualizado: ' + fmt(data.actualizado);
      render(r);
    })
    .catch(()=> msg('No pudimos cargar el ranking. Probá de nuevo en un rato.'));
}

function fmt(s){ try{ return new Intl.DateTimeFormat('es-BO',{dateStyle:'medium',timeStyle:'short',timeZone:'America/La_Paz'}).format(new Date(s)); }catch(e){ return s; } }
function medal(p){ return p===1?'🥇':p===2?'🥈':p===3?'🥉':p; }

function render(rows){
  let html = `<table class="lb-table"><thead><tr>
    <th>#</th><th>Jugador</th><th class="lb-hide">Ciudad</th><th>Pts</th><th class="lb-hide">Exactos</th>
    </tr></thead><tbody>`;
  rows.forEach(row=>{
    const mine = me && row.nombre && me.nombre &&
      row.nombre.trim().toLowerCase()===me.nombre.trim().toLowerCase();
    html += `<tr class="${mine?'lb-me':''}">
      <td class="lb-pos">${medal(row.pos)}</td>
      <td>${esc(row.nombre)||'—'}</td>
      <td class="lb-hide">${esc(row.ciudad)||''}</td>
      <td class="lb-pts">${row.puntos}</td>
      <td class="lb-hide">${row.exactos||0}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  lb.innerHTML = html;
}
function esc(s){ return String(s==null?'':s).replace(/[<>&]/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }
