const CONFIG = window.STANLEY || { APPS_SCRIPT_URL:"", DEADLINE:"2026-07-01T12:00:00-04:00" };
const INSTAGRAM_COMMUNITY_URL = CONFIG.INSTAGRAM_COMMUNITY_URL || "https://www.instagram.com/channel/AbbX7p2jNimxBq8g/";
const newId = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
  : 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2);
const normalizeInstagram = value => String(value || "").trim().replace(/\s+/g, "").replace(/^@+/, "").toLowerCase();

const fileInput = document.getElementById("comprobante");
const fileHint = document.getElementById("file-hint");
let fileData = null;
const MAX_IMAGE_SIDE = 1600;
const JPEG_QUALITY = 0.80;
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

function dataUrlToPayload(dataUrl, fallbackName, fallbackMime) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.*)$/);
  if (!match) throw new Error("No pudimos leer el archivo seleccionado.");
  return {
    name: fallbackName,
    mime: match[1] || fallbackMime || "application/octet-stream",
    b64: match[2] || ""
  };
}

function payloadSizeBytes(payload) {
  return Math.ceil(String(payload.b64 || "").length * 3 / 4);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Safari no pudo leer el archivo seleccionado."));
    reader.onabort = () => reject(new Error("La lectura del archivo fue cancelada."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No pudimos procesar la imagen. Probá guardarla como JPG o PNG y volvé a subirla."));
    img.src = dataUrl;
  });
}

function canvasToJpegDataUrl(canvas) {
  return new Promise((resolve, reject) => {
    if (canvas.toBlob) {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("No pudimos comprimir la imagen."));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("No pudimos leer la imagen comprimida."));
        reader.readAsDataURL(blob);
      }, "image/jpeg", JPEG_QUALITY);
      return;
    }
    try {
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    } catch (err) {
      reject(err);
    }
  });
}

function jpegName(fileName) {
  const clean = String(fileName || "imagen").replace(/\.[^.]+$/, "");
  return `${clean || "imagen"}.jpg`;
}

async function prepareUploadFile(file) {
  if (!file) throw new Error("No encontramos el archivo seleccionado.");
  const sourceDataUrl = await readFileAsDataURL(file);
  if (!String(file.type || "").startsWith("image/")) {
    const payload = dataUrlToPayload(sourceDataUrl, file.name, file.type || "application/octet-stream");
    if (payloadSizeBytes(payload) > MAX_UPLOAD_BYTES) {
      throw new Error("El archivo supera los 6 MB luego de procesarlo. Subí una imagen más liviana.");
    }
    return { payload, dataUrl: sourceDataUrl, fileName: file.name, mime: payload.mime };
  }

  const img = await loadImage(sourceDataUrl);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
  const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("El navegador no permitió preparar la imagen.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const compressedDataUrl = await canvasToJpegDataUrl(canvas);
  const name = jpegName(file.name);
  const payload = dataUrlToPayload(compressedDataUrl, name, "image/jpeg");
  if (payloadSizeBytes(payload) > MAX_UPLOAD_BYTES) {
    throw new Error("La imagen sigue superando los 6 MB después de comprimirla. Probá con una captura más liviana.");
  }
  return { payload, dataUrl: compressedDataUrl, fileName: name, mime: "image/jpeg" };
}

if (fileInput && fileHint) {
  fileInput.addEventListener("change", async () => {
    const f = fileInput.files[0];
    if (!f) {
      fileData = null;
      fileHint.textContent = "Tocá para subir tu factura o respaldo";
      fileHint.classList.remove("ok");
      return;
    }
    fileData = null;
    fileHint.textContent = "Procesando imagen...";
    fileHint.classList.remove("ok");
    try {
      const prepared = await prepareUploadFile(f);
      fileData = prepared.payload;
      fileHint.textContent = "✓ " + prepared.fileName;
      fileHint.classList.add("ok");
    } catch (err) {
      console.error("Error completo al procesar comprobante:", err);
      fileInput.value = "";
      fileData = null;
      fileHint.textContent = "Tocá para subir tu factura o respaldo";
      fileHint.classList.remove("ok");
      showError(err && err.message ? err.message : "No pudimos procesar la imagen. Probá con otra captura.");
    }
  });
}

const deadline = new Date(CONFIG.DEADLINE).getTime();
const pad = n => String(n).padStart(2, "0");
function tick() {
  const countdown = document.getElementById("countdown");
  if (!countdown) return;
  const diff = deadline - Date.now();
  const d = Math.max(0, Math.floor(diff / 864e5));
  const h = Math.max(0, Math.floor((diff % 864e5) / 36e5));
  const m = Math.max(0, Math.floor((diff % 36e5) / 6e4));
  const s = Math.max(0, Math.floor((diff % 6e4) / 1e3));
  document.getElementById("cd-d").textContent = d;
  document.getElementById("cd-h").textContent = pad(h);
  document.getElementById("cd-m").textContent = pad(m);
  document.getElementById("cd-s").textContent = pad(s);
}
tick();
setInterval(tick, 1000);

const form = document.getElementById("form");
const errorEl = document.getElementById("form-error");
const submitBtn = document.getElementById("submit");
const registrationSuccessModal = document.getElementById("registro-activo");

function applyCommunityLinks() {
  document.querySelectorAll("[data-community-link]").forEach(link => {
    link.href = INSTAGRAM_COMMUNITY_URL;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function showError(msg) {
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.hidden = false;
  errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetBtn() {
  submitBtn.disabled = false;
  submitBtn.textContent = "Inscribirme y abrir mi Pasaporte";
}

function showRegistrationSuccess() {
  if (!registrationSuccessModal) {
    window.location.href = "jugar.html";
    return;
  }
  registrationSuccessModal.classList.add("is-open");
  registrationSuccessModal.setAttribute("aria-hidden", "false");
  submitBtn.disabled = false;
  submitBtn.textContent = "Pasaporte activo";
}

function safePlayer(data) {
  return {
    id: data.participant_id || data.id || "",
    participant_id: data.participant_id || data.id || "",
    nombre: data.nombre || "",
    instagram: data.instagram || "",
    whatsapp: data.whatsapp || "",
    email: data.email || "",
    ciudad: data.ciudad || ""
  };
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    for (const el of form.querySelectorAll("input[required]")) {
      if (el.type === "file" || el.type === "checkbox") continue;
      if (!el.value.trim()) {
        showError("Completá todos los campos obligatorios.");
        el.focus();
        return;
      }
    }
    if (!form.canal.value) { showError("Elegí tu canal de compra."); form.canal.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())) { showError("Revisá tu correo: no parece válido."); form.email.focus(); return; }
    if (form.whatsapp.value.replace(/\D/g, "").length < 7) { showError("Revisá tu WhatsApp: falta el número."); form.whatsapp.focus(); return; }
    if (!fileData) return showError("Subí tu factura o respaldo de compra.");
    if (!document.getElementById("terminos").checked) return showError("Tenés que aceptar las bases y la veracidad de tus datos.");
    if (!document.getElementById("validacion").checked) return showError("Tenés que aceptar la validación de tu inscripción.");
    if (!document.getElementById("datos").checked) return showError("Tenés que aceptar el tratamiento de datos y comunicaciones.");

    const fullName = form.nombre_completo.value.trim();
    const player = {
      id: newId(),
      nombre: fullName,
      instagram: form.instagram.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      email: form.email.value.trim(),
      ciudad: form.ciudad.value.trim()
    };

    const comprobanteNro = form.comprobante_nro.value.trim();
    const payload = {
      action: "register",
      id: player.id,
      nombre: player.nombre,
      apellido: "",
      documento: form.documento.value.trim(),
      instagram: player.instagram,
      whatsapp: player.whatsapp,
      email: player.email,
      ciudad: player.ciudad,
      canal: form.canal.value,
      comprobante_nro: comprobanteNro,
      enviado: new Date().toISOString(),
      comprobante: fileData
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Verificando...";
    try {
      if (!CONFIG.APPS_SCRIPT_URL) {
        await new Promise(r => setTimeout(r, 500));
        console.warn("APPS_SCRIPT_URL vacío: registro NO enviado a la nube (modo demo).", payload);
      } else {
        try {
          const q = new URLSearchParams({ action: "existe", ci: form.documento.value.trim(), comp: comprobanteNro });
          const chk = await fetch(CONFIG.APPS_SCRIPT_URL + "?" + q.toString()).then(r => r.json());
          if (chk && chk.ci) { resetBtn(); return showError("Ese documento (CI) ya está inscrito. Si ya participaste, entrá a Mi Pasaporte desde el menú."); }
          if (chk && chk.comp) { resetBtn(); return showError("Ese número de comprobante ya fue registrado. Cada compra puede inscribirse una sola vez."); }
        } catch (err) {
          console.warn("Chequeo de duplicado no disponible; continúo (el servidor deduplica igual).", err);
        }

        submitBtn.textContent = "Subiendo evidencia...";
        const saved = await fetch(CONFIG.APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) }).then(r => r.json());
        if (!saved || saved.ok === false) {
          resetBtn();
          return showError((saved && saved.error) || "No pudimos registrar tu inscripción. Revisá tus datos e intentá de nuevo.");
        }
        player.id = saved.participant_id || saved.id || player.id;
        player.participant_id = player.id;
      }
      localStorage.setItem("stanley_player", JSON.stringify(player));
      localStorage.setItem("participant_id", player.id);
      submitBtn.textContent = "¡Listo! Pasaporte activo";
      updatePassportNavigation();
      showRegistrationSuccess();
    } catch (err) {
      resetBtn();
      showError("No pudimos registrar tu inscripción. Revisá tu conexión e intentá de nuevo.");
      console.error(err);
    }
  });
}


const recoverModal = document.getElementById("recuperar");
function openRecoverModal() {
  if (!recoverModal) return;
  recoverModal.classList.add("is-open");
  recoverModal.setAttribute("aria-hidden", "false");
  if (location.hash !== "#recuperar") history.replaceState(null, "", "#recuperar");
  setTimeout(() => recoverModal.querySelector("input[name='instagram']")?.focus(), 80);
}
function closeRecoverModal() {
  if (!recoverModal) return;
  recoverModal.classList.remove("is-open");
  recoverModal.setAttribute("aria-hidden", "true");
  if (location.hash === "#recuperar") history.replaceState(null, "", location.pathname + location.search);
}
document.querySelectorAll("[data-recover-open]").forEach(btn => {
  btn.addEventListener("click", event => {
    event.preventDefault();
    openRecoverModal();
  });
});
document.querySelectorAll("[data-recover-close]").forEach(btn => {
  btn.addEventListener("click", closeRecoverModal);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeRecoverModal();
});
if (location.hash === "#recuperar") openRecoverModal();


function hasParticipantSession() {
  return Boolean(localStorage.getItem("participant_id"));
}

function updatePassportNavigation() {
  const hasSession = hasParticipantSession();
  document.querySelectorAll("[data-auth-passport]").forEach(el => {
    el.hidden = !hasSession;
    el.setAttribute("aria-hidden", String(!hasSession));
  });
  document.querySelectorAll("[data-auth-recover]").forEach(el => {
    el.hidden = hasSession;
    el.setAttribute("aria-hidden", String(hasSession));
  });

  document.querySelectorAll("[data-floating-passport]").forEach(btn => {
    const label = btn.querySelector("[data-floating-passport-label]");
    btn.dataset.mode = hasSession ? "passport" : "recover";
    btn.setAttribute("aria-label", hasSession ? "Mi Pasaporte" : "Ya tengo Pasaporte");
    btn.title = hasSession ? "Mi Pasaporte" : "Ya tengo Pasaporte";
    if (label) label.textContent = hasSession ? "Mi Pasaporte" : "Ya tengo Pasaporte";
  });
}

document.addEventListener("click", event => {
  const floating = event.target.closest("[data-floating-passport]");
  if (!floating) return;
  event.preventDefault();
  if (hasParticipantSession()) {
    window.location.href = "jugar.html";
  } else {
    openRecoverModal();
  }
});

updatePassportNavigation();
applyCommunityLinks();

const recoverForm = document.getElementById("recover-form");
const recoverErrorEl = document.getElementById("recover-error");
const recoverSubmitBtn = document.getElementById("recover-submit");

function showRecoverError(msg) {
  if (!recoverErrorEl) return;
  recoverErrorEl.textContent = msg;
  recoverErrorEl.hidden = false;
  recoverErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetRecoverBtn() {
  if (!recoverSubmitBtn) return;
  recoverSubmitBtn.disabled = false;
  recoverSubmitBtn.textContent = "Recuperar y abrir mi Pasaporte";
}

if (recoverForm) {
  recoverForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    recoverErrorEl.hidden = true;

    const instagram = normalizeInstagram(recoverForm.instagram.value);
    const documento = recoverForm.documento.value.trim();
    if (!instagram || !documento) {
      showRecoverError("Completá Instagram y Carnet de Identidad para recuperar tu pasaporte.");
      return;
    }
    if (!CONFIG.APPS_SCRIPT_URL) {
      showRecoverError("La recuperación necesita conexión con Apps Script.");
      return;
    }

    recoverSubmitBtn.disabled = true;
    recoverSubmitBtn.textContent = "Verificando...";
    try {
      const payload = {
        action: "recoverParticipant",
        instagram,
        documento
      };
      const saved = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (!saved || saved.ok === false || !saved.participant_id) {
        resetRecoverBtn();
        return showRecoverError((saved && saved.error) || "No encontramos un pasaporte con esos datos. Revisá Instagram y CI.");
      }

      const recoveredPlayer = safePlayer(saved.participant || saved);
      localStorage.setItem("stanley_player", JSON.stringify(recoveredPlayer));
      localStorage.setItem("participant_id", recoveredPlayer.id);
      localStorage.setItem("stanley_recovered_at", new Date().toISOString());
      recoverSubmitBtn.textContent = "Pasaporte recuperado...";
      window.location.href = "jugar.html";
    } catch (err) {
      resetRecoverBtn();
      showRecoverError("No pudimos recuperar tu pasaporte. Revisá tu conexión e intentá de nuevo.");
      console.error(err);
    }
  });
}

document.querySelectorAll("[data-carousel]").forEach(function (box, idx) {
  var imgs = box.querySelectorAll(".prize__img, .gallery-card__img");
  if (imgs.length < 2) return;
  var i = 0;
  setTimeout(function () {
    setInterval(function () {
      imgs[i].classList.remove("is-active");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("is-active");
    }, 3200);
  }, idx * 900);
});
