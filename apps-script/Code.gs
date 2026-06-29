/**
 * PASAPORTE STANLEY - backend Google Apps Script (Sheets + Drive)
 *
 * Hojas:
 *   Participantes
 *   Misiones
 *   Premios
 *   Auditoría
 *
 * Reglas:
 *   - participant_id es el identificador principal.
 *   - CI unico.
 *   - Factura/comprobante unico.
 *   - Instagram se normaliza para recuperacion, pero participant_id sigue siendo el identificador.
 *   - Toda mision/evidencia/premio queda asociada a participant_id.
 */

const SHEET_ID  = "PEGAR_ID_DE_LA_HOJA";
const FOLDER_ID = "PEGAR_ID_DE_LA_CARPETA";

const SHEETS = {
  participantes: "Participantes",
  misiones: "Misiones",
  premios: "Premios",
  auditoria: "Auditoría"
};

const HEADERS = {
  participantes: [
    "participant_id","ci","comprobante_numero","nombre","instagram","whatsapp","email","ciudad",
    "canal_compra","comprobante_url","fecha_registro","estado","created_at","updated_at",
    "level","stamps_count","daily_completed_count","last_mission_completed_date",
    "duplicate_flags","notes"
  ],
  misiones: [
    "mission_record_id","participant_id","mission_id","mission_name","week",
    "evidence_url","evidence_filename","completed_at","status","submitted_at",
    "validated_at","validated_by","validation_notes","instagram_post_type","instagram_url",
    "participant_name","participant_instagram","participant_whatsapp"
  ],
  premios: [
    "prize_selection_id","participant_id","level","prize_type","prize_name",
    "draw_name","selected_at","status","notes","draw_date","eligibility_level",
    "winner_confirmed_at","delivered_at","delivery_notes"
  ],
  auditoria: [
    "audit_id","timestamp","action","participant_id","entity","entity_id",
    "status","detail","user_agent","source","participant_name","participant_instagram"
  ]
};

function doPost(e){
  try{
    const d = JSON.parse(e.postData.contents || "{}");
    const action = d.action || "register";
    if(action === "register") return json(register_(d));
    if(action === "recoverParticipant") return json(recoverParticipant_(d));
    if(action === "getParticipantMissions") return json(getParticipantMissions_(d));
    if(action === "saveEvidence") return json(saveMission_(d));
    if(action === "saveMission") return json(saveMission_(d));
    if(action === "selectPrize") return json(selectPrize_(d));
    return json({ok:false, error:"accion desconocida: " + action});
  }catch(err){
    audit_("error", "", "request", "", "error", String(err));
    return json({ok:false, error:String(err)});
  }
}

function doGet(e){
  const p = (e && e.parameter) || {};
  if(p.action === "setup") return json(setup_());
  if(p.action === "existe"){
    const dup = findDuplicates_(p.ci || "", p.comp || p.comprobante_numero || p.factura || "", p.participant_id || p.id || "");
    return json({ok:true, ci:dup.ci, comp:dup.comprobante_numero, comprobante_numero:dup.comprobante_numero});
  }
  if(p.action === "recoverParticipant") return json(recoverParticipant_(p));
  if(p.action === "getParticipantMissions") return json(getParticipantMissions_(p));
  return json({ok:true, msg:"Pasaporte Stanley API activa."});
}

function setup_(){
  Object.keys(SHEETS).forEach(function(key){
    sheet_(SHEETS[key], HEADERS[key]);
  });
  return {ok:true, sheets:Object.keys(SHEETS).map(function(key){ return SHEETS[key]; })};
}

function register_(d){
  const participantes = sheet_(SHEETS.participantes, HEADERS.participantes);
  const ci = clean_(d.documento || d.ci);
  const comprobanteNumero = clean_(d.comprobante_numero || d.comprobante_nro || d.factura);

  const dup = findDuplicates_(ci, comprobanteNumero, d.participant_id || "");
  if(dup.ci){
    audit_("register", "", "Participantes", ci, "dup_ci", "CI duplicado");
    return {ok:false, code:"dup_ci", error:"Ese documento (CI) ya esta inscrito."};
  }
  if(dup.comprobante_numero){
    audit_("register", "", "Participantes", comprobanteNumero, "dup_comp", "Comprobante duplicado");
    return {ok:false, code:"dup_comp", error:"Ese numero de comprobante ya fue registrado."};
  }

  const participantId = d.participant_id || makeParticipantId_();
  const now = new Date();
  let comprobanteUrl = "";
  if(d.comprobante && d.comprobante.b64){
    comprobanteUrl = saveFile_(d.comprobante, participantId, "compra");
  }

  upsert_(participantes, 0, participantId, [
    participantId,
    ci,
    "'" + comprobanteNumero,
    clean_(d.nombre || d.nombre_completo),
    clean_(d.instagram),
    "'" + clean_(d.whatsapp),
    clean_(d.email),
    clean_(d.ciudad),
    clean_(d.canal || d.canal_compra),
    comprobanteUrl,
    now,
    "activo",
    now,
    now,
    clean_(d.level || "Sin nivel"),
    Number(d.stamps_count || 0),
    Number(d.daily_completed_count || 0),
    clean_(d.last_mission_completed_date),
    clean_(d.duplicate_flags),
    clean_(d.notes)
  ]);

  audit_("register", participantId, "Participantes", participantId, "ok", "Participante registrado");
  return {ok:true, participant_id:participantId, id:participantId};
}

function saveMission_(d){
  const participantId = clean_(d.participant_id || d.id);
  if(!participantId) return {ok:false, code:"missing_participant_id", error:"Falta participant_id."};

  const participant = findParticipant_(participantId);
  if(!participant) return {ok:false, code:"participant_not_found", error:"participant_id no encontrado."};
  const participantInfo = participantInfo_(participant);

  const missionId = clean_(d.mission_id);
  if(!missionId) return {ok:false, code:"missing_mission_id", error:"Falta mission_id."};

  const misiones = sheet_(SHEETS.misiones, HEADERS.misiones);
  const recordId = d.mission_record_id || [participantId, missionId].join("_");
  let evidenceUrl = clean_(d.evidence_url);
  let evidenceName = "";
  if(d.evidence && d.evidence.b64){
    evidenceUrl = saveFile_(d.evidence, participantId, missionId);
    evidenceName = clean_(d.evidence.name);
  }

  upsert_(misiones, 0, recordId, [
    recordId,
    participantId,
    missionId,
    clean_(d.mission_name),
    clean_(d.week),
    evidenceUrl,
    evidenceName,
    new Date(),
    "completada",
    new Date(),
    clean_(d.validated_at),
    clean_(d.validated_by),
    clean_(d.validation_notes),
    clean_(d.instagram_post_type),
    clean_(d.instagram_url),
    participantInfo.name,
    participantInfo.instagram,
    participantInfo.whatsapp
  ]);

  audit_("saveMission", participantId, "Misiones", recordId, "ok", "Mision completada con evidencia");
  return {ok:true, participant_id:participantId, mission_record_id:recordId, evidence_url:evidenceUrl};
}

function recoverParticipant_(d){
  const instagram = clean_(d.instagram || d.ig);
  const ci = clean_(d.documento || d.ci);
  if(!instagram || !ci){
    return {ok:false, code:"missing_recovery_fields", error:"Falta Instagram o CI."};
  }

  const participant = findParticipantByRecovery_(instagram, ci);
  if(!participant){
    audit_("recoverParticipant", "", "Participantes", normInstagram_(instagram), "not_found", "Recuperacion fallida");
    return {ok:false, code:"participant_not_found", error:"No encontramos un pasaporte con esos datos."};
  }

  const safe = participantPublic_(participant);
  audit_("recoverParticipant", safe.participant_id, "Participantes", safe.participant_id, "ok", "Participante recuperado");
  return {ok:true, participant_id:safe.participant_id, participant:safe};
}

function getParticipantMissions_(d){
  const participantId = clean_(d.participant_id || d.id);
  if(!participantId) return {ok:false, code:"missing_participant_id", error:"Falta participant_id."};
  if(!findParticipant_(participantId)) return {ok:false, code:"participant_not_found", error:"participant_id no encontrado."};

  const sh = getSheet_(SHEETS.misiones);
  if(!sh || sh.getLastRow() < 2) return {ok:true, participant_id:participantId, missions:[]};

  const data = sh.getDataRange().getValues();
  const missions = [];
  for(let i = 1; i < data.length; i++){
    const r = data[i];
    if(String(r[1]) !== String(participantId)) continue;
    missions.push({
      mission_record_id: clean_(r[0]),
      participant_id: clean_(r[1]),
      mission_id: clean_(r[2]),
      mission_name: clean_(r[3]),
      week: clean_(r[4]),
      evidence_url: clean_(r[5]),
      evidence_filename: clean_(r[6]),
      completed_at: dateString_(r[7]),
      status: clean_(r[8]),
      submitted_at: dateString_(r[9]),
      validated_at: dateString_(r[10]),
      instagram_post_type: clean_(r[13]),
      instagram_url: clean_(r[14])
    });
  }
  return {ok:true, participant_id:participantId, missions:missions};
}

function selectPrize_(d){
  const participantId = clean_(d.participant_id || d.id);
  if(!participantId) return {ok:false, code:"missing_participant_id", error:"Falta participant_id."};
  if(!findParticipant_(participantId)) return {ok:false, code:"participant_not_found", error:"participant_id no encontrado."};

  const premios = sheet_(SHEETS.premios, HEADERS.premios);
  const selectionId = d.prize_selection_id || [participantId, clean_(d.prize_type || "premio"), Date.now()].join("_");

  upsert_(premios, 0, selectionId, [
    selectionId,
    participantId,
    clean_(d.level),
    clean_(d.prize_type),
    clean_(d.prize_name),
    clean_(d.draw_name),
    new Date(),
    clean_(d.status || "seleccionado"),
    clean_(d.notes),
    clean_(d.draw_date),
    clean_(d.eligibility_level || d.level),
    clean_(d.winner_confirmed_at),
    clean_(d.delivered_at),
    clean_(d.delivery_notes)
  ]);

  audit_("selectPrize", participantId, "Premios", selectionId, "ok", "Seleccion de premio registrada");
  return {ok:true, participant_id:participantId, prize_selection_id:selectionId};
}

function findDuplicates_(ci, comprobanteNumero, excludeParticipantId){
  const out = {ci:false, comprobante_numero:false};
  const sh = getSheet_(SHEETS.participantes);
  if(!sh || sh.getLastRow() < 2) return out;
  const ciKey = normKey_(ci);
  const comprobanteKey = normKey_(comprobanteNumero);
  const data = sh.getDataRange().getValues();
  for(let i = 1; i < data.length; i++){
    const r = data[i];
    if(excludeParticipantId && String(r[0]) === String(excludeParticipantId)) continue;
    if(ciKey && normKey_(r[1]) === ciKey) out.ci = true;
    if(comprobanteKey && normKey_(r[2]) === comprobanteKey) out.comprobante_numero = true;
    if(out.ci && out.comprobante_numero) break;
  }
  return out;
}

function findParticipant_(participantId){
  const sh = getSheet_(SHEETS.participantes);
  if(!sh || sh.getLastRow() < 2) return null;
  const data = sh.getDataRange().getValues();
  for(let i = 1; i < data.length; i++){
    if(String(data[i][0]) === String(participantId)) return data[i];
  }
  return null;
}

function findParticipantByRecovery_(instagram, ci){
  const sh = getSheet_(SHEETS.participantes);
  if(!sh || sh.getLastRow() < 2) return null;
  const instagramKey = normInstagram_(instagram);
  const ciKey = normKey_(ci);
  const data = sh.getDataRange().getValues();
  for(let i = 1; i < data.length; i++){
    const r = data[i];
    if(instagramKey && ciKey && normInstagram_(r[4]) === instagramKey && normKey_(r[1]) === ciKey) return r;
  }
  return null;
}

function participantPublic_(r){
  return {
    participant_id: clean_(r[0]),
    id: clean_(r[0]),
    nombre: clean_(r[3]),
    instagram: clean_(r[4]),
    whatsapp: clean_(r[5]),
    email: clean_(r[6]),
    ciudad: clean_(r[7]),
    level: clean_(r[14]),
    stamps_count: Number(r[15] || 0)
  };
}

function participantInfo_(r){
  if(!r) return {name:"", instagram:"", whatsapp:""};
  return {
    name: clean_(r[3]),
    instagram: clean_(r[4]),
    whatsapp: clean_(r[5])
  };
}

function audit_(action, participantId, entity, entityId, status, detail){
  try{
    const auditoria = sheet_(SHEETS.auditoria, HEADERS.auditoria);
    const participant = participantId ? findParticipant_(participantId) : null;
    const participantInfo = participantInfo_(participant);
    auditoria.appendRow([
      "aud_" + Utilities.getUuid(),
      new Date(),
      action || "",
      participantId || "",
      entity || "",
      entityId || "",
      status || "",
      detail || "",
      "",
      "apps_script",
      participantInfo.name,
      participantInfo.instagram
    ]);
  }catch(err){
    console.error(err);
  }
}

function makeParticipantId_(){
  return "pt_" + Utilities.getUuid();
}

function clean_(v){
  return String(v == null ? "" : v).trim();
}

function normKey_(v){
  return clean_(v).toLowerCase().replace(/\s+/g, "");
}

function normInstagram_(v){
  return clean_(v).toLowerCase().replace(/\s+/g, "").replace(/^@+/, "");
}

function dateString_(v){
  if(!v) return "";
  if(Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v.getTime())) return v.toISOString();
  return clean_(v);
}

function saveFile_(file, ownerKey, kind){
  const bytes = Utilities.base64Decode(file.b64);
  const blob = Utilities.newBlob(bytes, file.mime || "application/octet-stream", file.name || "archivo");
  const safeOwner = clean_(ownerKey || "participant").replace(/[^\w.-]+/g, "_");
  const safeKind = clean_(kind || "archivo").replace(/[^\w.-]+/g, "_");
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const saved = folder.createFile(blob).setName([safeOwner, safeKind, Date.now(), file.name || "archivo"].join("_"));
  return saved.getUrl();
}

function getSheet_(name){
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function sheet_(name, headers){
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(name);
  if(!sh) sh = ss.insertSheet(name);
  if(sh.getLastRow() === 0){
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }else{
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function upsert_(sh, keyCol, key, row){
  const last = sh.getLastRow();
  if(last > 1){
    const values = sh.getRange(2, keyCol + 1, last - 1, 1).getValues();
    for(let i = 0; i < values.length; i++){
      if(String(values[i][0]) === String(key)){
        sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return;
      }
    }
  }
  sh.appendRow(row);
}

function json(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
