/**
 * PASAPORTE STANLEY — backend Google Apps Script (Sheets + Drive)
 *
 * Pestañas:
 *   Participantes  registro de compra válida
 *   Evidencias     capturas cargadas por misión
 *
 * Endpoints:
 *   POST { action:"register", ... }       guarda inscripción
 *   POST { action:"saveEvidence", ... }   guarda evidencia de una misión
 *   GET  ?action=existe&ci=&comp=         valida duplicados
 */

const SHEET_ID  = "PEGAR_ID_DE_LA_HOJA";
const FOLDER_ID = "PEGAR_ID_DE_LA_CARPETA";

function doPost(e){
  try{
    const d = JSON.parse(e.postData.contents);
    const action = d.action || "register";
    if(action === "register") return json(register_(d));
    if(action === "saveEvidence") return json(saveEvidence_(d));
    return json({ok:false, error:"accion desconocida: "+action});
  }catch(err){
    return json({ok:false, error:String(err)});
  }
}

function doGet(e){
  const p = (e && e.parameter) || {};
  if(p.action === "existe"){
    const dup = findDuplicates_(p.ci || "", p.comp || "", p.id || "");
    return json({ok:true, ci:dup.ci, comp:dup.comp});
  }
  return json({ok:true, msg:"Pasaporte Stanley API activa."});
}

function register_(d){
  const sh = sheet_("Participantes", [
    "id","nombre","documento","instagram","whatsapp","email","ciudad",
    "canal_compra","comprobante_nro","comprobante","fecha"
  ]);
  const dup = findDuplicates_(d.documento, d.comprobante_nro, d.id);
  if(dup.ci) return {ok:false, code:"dup_ci", error:"Ese documento (CI) ya esta inscrito."};
  if(dup.comp) return {ok:false, code:"dup_comp", error:"Ese numero de comprobante ya fue registrado."};

  let fileUrl = "";
  if(d.comprobante && d.comprobante.b64) fileUrl = saveFile_(d.comprobante, d.documento || d.id, "compra");

  upsert_(sh, 0, d.id, [
    d.id || "", d.nombre || "", d.documento || "", d.instagram || "",
    "'" + (d.whatsapp || ""), d.email || "", d.ciudad || "", d.canal || "",
    "'" + (d.comprobante_nro || ""), fileUrl, new Date()
  ]);
  return {ok:true, id:d.id};
}

function saveEvidence_(d){
  const sh = sheet_("Evidencias", [
    "id","participante_id","documento","mision_id","mision","archivo","fecha"
  ]);
  const evidenceId = d.evidence_id || [d.id, d.mission_id].join("_");
  let fileUrl = "";
  if(d.evidence && d.evidence.b64) fileUrl = saveFile_(d.evidence, d.documento || d.id, d.mission_id || "mision");

  upsert_(sh, 0, evidenceId, [
    evidenceId, d.id || "", d.documento || "", d.mission_id || "",
    d.mission_name || "", fileUrl, new Date()
  ]);
  return {ok:true, evidence_id:evidenceId};
}

function findDuplicates_(documento, compNro, excludeId){
  const out = {ci:false, comp:false};
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName("Participantes");
  if(!sh || sh.getLastRow() < 2) return out;
  const doc = normKey_(documento);
  const comp = normKey_(compNro);
  const data = sh.getDataRange().getValues();
  for(let i = 1; i < data.length; i++){
    const r = data[i];
    if(excludeId && String(r[0]) === String(excludeId)) continue;
    if(doc && normKey_(r[2]) === doc) out.ci = true;
    if(comp && normKey_(r[8]) === comp) out.comp = true;
    if(out.ci && (out.comp || !comp)) break;
  }
  return out;
}

function normKey_(v){
  return String(v == null ? "" : v).toLowerCase().replace(/\s+/g, "").trim();
}

function saveFile_(file, ownerKey, kind){
  const bytes = Utilities.base64Decode(file.b64);
  const blob = Utilities.newBlob(bytes, file.mime || "application/octet-stream", file.name || "archivo");
  const safe = String(ownerKey || "participante").replace(/[^\w.-]+/g, "_");
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const saved = folder.createFile(blob).setName([safe, kind || "archivo", Date.now(), file.name || "archivo"].join("_"));
  return saved.getUrl();
}

function sheet_(name, headers){
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(name);
  if(!sh) sh = ss.insertSheet(name);
  if(sh.getLastRow() === 0) sh.appendRow(headers);
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
