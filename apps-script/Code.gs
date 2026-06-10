/**
 * QUINIELA STANLEY — backend Google Apps Script (Sheets + Drive)
 *
 * Guarda:
 *   - "Participantes": el registro (datos + link al comprobante en Drive)
 *   - "Pronosticos":   la quiniela de cada jugador (grupos + llaves), 1 fila por jugador
 *
 * DESPLIEGUE (una vez):
 *  1. Creá una Hoja de Cálculo y copiá su ID (está en la URL entre /d/ y /edit).
 *  2. Creá una carpeta en Drive para los comprobantes y copiá su ID.
 *  3. Pegá ambos IDs abajo (SHEET_ID, FOLDER_ID).
 *  4. script.google.com → Nuevo proyecto → pegá este código → Guardar.
 *  5. Implementar → Nueva implementación → "Aplicación web":
 *        - Ejecutar como: Yo
 *        - Quién tiene acceso: Cualquier usuario
 *  6. Copiá la URL del Web App y pegala en web/config.js → APPS_SCRIPT_URL
 *  (Si cambiás el código, Implementar → Administrar implementaciones → editar → Nueva versión.)
 */

const SHEET_ID  = "PEGAR_ID_DE_LA_HOJA";
const FOLDER_ID = "PEGAR_ID_DE_LA_CARPETA";

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const action = d.action || "register";
    if (action === "register")  return json(register_(d));
    if (action === "savePicks") return json(savePicks_(d));
    return json({ ok: false, error: "accion desconocida: " + action });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, msg: "Quiniela Stanley API activa. Usá POST." });
}

/* ---------- REGISTRO ---------- */
function register_(d) {
  const sh = sheet_("Participantes",
    ["id","nombre","apellido","documento","whatsapp","email","ciudad","comprobante","fecha"]);

  let fileUrl = "";
  if (d.comprobante && d.comprobante.b64) {
    fileUrl = saveFile_(d.comprobante, d.documento || d.id);
  }
  const values = [
    d.id || "", d.nombre || "", d.apellido || "", d.documento || "",
    "'" + (d.whatsapp || ""), d.email || "", d.ciudad || "", fileUrl, new Date()
  ];
  upsert_(sh, 0, d.id, values);   // dedup por id (col 0)
  return { ok: true, id: d.id };
}

/* ---------- PRONÓSTICOS ---------- */
function savePicks_(d) {
  const sh = sheet_("Pronosticos",
    ["id","nombre","documento","actualizado","avance%","campeon","finalista","tercer_puesto","grupos_json","partidos_json"]);
  const values = [
    d.id || "", d.nombre || "", d.documento || "", new Date(), d.avance || 0,
    d.campeon || "", d.finalista || "", d.tercero || "",
    JSON.stringify({ rank: d.rank || {}, thirds: d.thirds || [] }),
    JSON.stringify({ adv: d.adv || {}, scores: d.scores || {} })
  ];
  upsert_(sh, 0, d.id, values);
  return { ok: true };
}

/* ---------- helpers ---------- */
function saveFile_(file, hint) {
  if (!FOLDER_ID || FOLDER_ID.indexOf("PEGAR") === 0) return "";
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const bytes = Utilities.base64Decode(file.b64);
  const name = "comprobante_" + (hint || "") + "_" + Date.now() + extOf_(file.mime, file.name);
  const blob = Utilities.newBlob(bytes, file.mime || "application/octet-stream", name);
  const f = folder.createFile(blob);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return f.getUrl();
}
function extOf_(mime, name) {
  if (name && name.indexOf(".") >= 0) return "." + name.split(".").pop();
  if (!mime) return "";
  if (mime.indexOf("pdf") >= 0) return ".pdf";
  if (mime.indexOf("png") >= 0) return ".png";
  if (mime.indexOf("jpeg") >= 0 || mime.indexOf("jpg") >= 0) return ".jpg";
  return "";
}
function sheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers); }
  else if (sh.getLastRow() === 0) { sh.appendRow(headers); }
  return sh;
}
function upsert_(sh, keyCol, key, values) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);                 // evita choques de escrituras simultáneas
  try {
    const data = sh.getDataRange().getValues();
    let rowIdx = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][keyCol]) === String(key)) { rowIdx = i + 1; break; }
    }
    if (rowIdx > 0) sh.getRange(rowIdx, 1, 1, values.length).setValues([values]);
    else sh.appendRow(values);
  } finally {
    lock.releaseLock();
  }
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
