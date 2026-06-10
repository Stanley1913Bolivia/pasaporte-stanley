/* ====== CONFIG (editar estos valores) ====== */
const CONFIG = {
  // URL del Web App de Apps Script o, más adelante, se reemplaza por Supabase.
  APPS_SCRIPT_URL: "",
  // Fecha/hora de cierre de inscripciones (ISO, hora local Bolivia -04:00)
  DEADLINE: "2026-06-11T12:00:00-04:00",
  // Link de invitación a la comunidad de WhatsApp
  WHATSAPP_INVITE_URL: "https://chat.whatsapp.com/"
};

/* ====== archivo comprobante ====== */
const fileInput = document.getElementById("comprobante");
const fileHint = document.getElementById("file-hint");
let fileData = null; // {name, mime, b64}
fileInput.addEventListener("change", () => {
  const f = fileInput.files[0];
  if (!f) { fileData = null; fileHint.textContent = "Tocá para subir tu comprobante"; fileHint.classList.remove("ok"); return; }
  if (f.size > 6 * 1024 * 1024) { showError("El comprobante supera los 6 MB. Subí una imagen más liviana."); fileInput.value = ""; return; }
  const reader = new FileReader();
  reader.onload = e => {
    fileData = { name: f.name, mime: f.type || "application/octet-stream", b64: String(e.target.result).split(",")[1] };
    fileHint.textContent = "✓ " + f.name;
    fileHint.classList.add("ok");
  };
  reader.readAsDataURL(f);
});

/* ====== countdown ====== */
const deadline = new Date(CONFIG.DEADLINE).getTime();
const pad = n => String(n).padStart(2, "0");
function tick() {
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
tick(); setInterval(tick, 1000);

/* ====== submit (solo registro) ====== */
const form = document.getElementById("form");
const errorEl = document.getElementById("form-error");
const submitBtn = document.getElementById("submit");
function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; errorEl.scrollIntoView({ behavior: "smooth", block: "center" }); }

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  for (const el of form.querySelectorAll("input[required]")) {
    if (el.type === "file") continue;
    if (!el.value.trim()) { showError("Completá todos los campos obligatorios."); el.focus(); return; }
  }
  if (!fileData) return showError("Subí tu comprobante de compra.");
  if (!document.getElementById("terminos").checked) return showError("Tenés que aceptar las bases y condiciones.");

  const payload = {
    nombre: form.nombre.value.trim(),
    apellido: form.apellido.value.trim(),
    documento: form.documento.value.trim(),
    whatsapp: form.whatsapp.value.trim(),
    email: form.email.value.trim(),
    ciudad: form.ciudad.value.trim(),
    enviado: new Date().toISOString(),
    comprobante: fileData
  };

  submitBtn.disabled = true; submitBtn.textContent = "Enviando…";
  try {
    if (!CONFIG.APPS_SCRIPT_URL) {
      // modo demo (sin backend conectado): simula éxito
      await new Promise(r => setTimeout(r, 600));
      console.warn("APPS_SCRIPT_URL vacío: registro NO guardado (modo demo).", payload);
    } else {
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || "Error del servidor");
    }
    showConfirm();
  } catch (err) {
    submitBtn.disabled = false; submitBtn.textContent = "Inscribirme y armar mi quiniela";
    showError("No pudimos registrar tu inscripción. Revisá tu conexión e intentá de nuevo.");
    console.error(err);
  }
});

function showConfirm() {
  form.closest(".form-card").hidden = true;
  const c = document.getElementById("confirm");
  c.hidden = false;
  document.getElementById("wa-cta").href = CONFIG.WHATSAPP_INVITE_URL;
  c.scrollIntoView({ behavior: "smooth", block: "center" });
}
