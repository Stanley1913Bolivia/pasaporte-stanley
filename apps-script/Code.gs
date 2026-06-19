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
 *   - Instagram se guarda visible, pero no se usa como identificador.
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
    "participant_id","ci","factura","nombre","instagram","whatsapp","email","ciudad",
    "canal_compra","comprobante_url","fecha_registro","estado"
  ],
  misiones: [
    "mission_record_id","participant_id","mission_id","mission_name","week",
    "evidence_url","evidence_filename","completed_at","status"
  ],
  premios: [
    "prize_selection_id","participant_id","level","prize_type","prize_name",
    "draw_name","selected_at","status","notes"
  ],
  auditoria: [
    "audit_id","timestamp","action","participant_id","entity","entity_id",
    "status","detail"
  ]
};

function doPost(e){
  try{
    const d = JSON.parse(e.postData.contents || "{}");
    const action = d.action || "register";
    if(action === "register") return json(register_(d));
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
    const dup = findDuplicates_(p.ci || "", p.comp || p.factura || "", p.participant_id || p.id || "");
    return json({ok:true, ci:dup.ci, comp:dup.factura, factura:dup.factura});
  }
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
  const factura = clean_(d.comprobante_nro || d.factura);

  const dup = findDuplicates_(ci, factura, d.participant_id || "");
  if(dup.ci){
    audit_("register", "", "Participantes", ci, "dup_ci", "CI duplicado");
    return {ok:false, code:"dup_ci", error:"Ese documento (CI) ya esta inscrito."};
  }
  if(dup.factura){
    audit_("register", "", "Participantes", factura, "dup_factura", "Factura duplicada");
    return {ok:false, code:"dup_comp", error:"Ese numero de comprobante ya fue registrado."};
  }

  const participantId = d.participant_id || makeParticipantId_();
  let comprobanteUrl = "";
  if(d.comprobante && d.comprobante.b64){
    comprobanteUrl = saveFile_(d.comprobante, participantId, "compra");
  }

  upsert_(participantes, 0, participantId, [
    participantId,
    ci,
    "'" + factura,
    clean_(d.nombre || d.nombre_completo),
    clean_(d.instagram),
    "'" + clean_(d.whatsapp),
    clean_(d.email),
    clean_(d.ciudad),
    clean_(d.canal || d.canal_compra),
    comprobanteUrl,
    new Date(),
    "activo"
  ]);

  audit_("register", participantId, "Participantes", participantId, "ok", "Participante registrado");
  return {ok:true, participant_id:participantId, id:participantId};
}

function saveMission_(d){
  const participantId = clean_(d.participant_id || d.id);
  if(!participantId) return {ok:false, code:"missing_participant_id", error:"Falta participant_id."};

  const participant = findParticipant_(participantId);
  if(!participant) return {ok:false, code:"participant_not_found", error:"participant_id no encontrado."};

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
    "completada"
  ]);

  audit_("saveMission", participantId, "Misiones", recordId, "ok", "Mision completada con evidencia");
  return {ok:true, participant_id:participantId, mission_record_id:recordId, evidence_url:evidenceUrl};
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
    clean_(d.notes)
  ]);

  audit_("selectPrize", participantId, "Premios", selectionId, "ok", "Seleccion de premio registrada");
  return {ok:true, participant_id:participantId, prize_selection_id:selectionId};
}

function findDuplicates_(ci, factura, excludeParticipantId){
  const out = {ci:false, factura:false};
  const sh = getSheet_(SHEETS.participantes);
  if(!sh || sh.getLastRow() < 2) return out;
  const ciKey = normKey_(ci);
  const facturaKey = normKey_(factura);
  const data = sh.getDataRange().getValues();
  for(let i = 1; i < data.length; i++){
    const r = data[i];
    if(excludeParticipantId && String(r[0]) === String(excludeParticipantId)) continue;
    if(ciKey && normKey_(r[1]) === ciKey) out.ci = true;
    if(facturaKey && normKey_(r[2]) === facturaKey) out.factura = true;
    if(out.ci && out.factura) break;
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

function audit_(action, participantId, entity, entityId, status, detail){
  try{
    const auditoria = sheet_(SHEETS.auditoria, HEADERS.auditoria);
    auditoria.appendRow([
      "aud_" + Utilities.getUuid(),
      new Date(),
      action || "",
      participantId || "",
      entity || "",
      entityId || "",
      status || "",
      detail || ""
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
