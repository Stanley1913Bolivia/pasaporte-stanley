const CONFIG = window.STANLEY || { APPS_SCRIPT_URL:"", DEADLINE:"2026-06-27T20:00:00-04:00" };
const newId = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
  : 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2);

const fileInput = document.getElementById("comprobante");
const fileHint = document.getElementById("file-hint");
let fileData = null;

if (fileInput && fileHint) {
  fileInput.addEventListener("change", () => {
    const f = fileInput.files[0];
    if (!f) {
      fileData = null;
      fileHint.textContent = "Tocá para subir tu factura o respaldo";
      fileHint.classList.remove("ok");
      return;
    }
    if (f.size > 6 * 1024 * 1024) {
      showError("El archivo supera los 6 MB. Subí una imagen más liviana.");
      fileInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      fileData = { name: f.name, mime: f.type || "application/octet-stream", b64: String(e.target.result).split(",")[1] };
      fileHint.textContent = "✓ " + f.name;
      fileHint.classList.add("ok");
    };
    reader.readAsDataURL(f);
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
      documento: form.documento.value.trim(),
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
      documento: player.documento,
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
          const q = new URLSearchParams({ action: "existe", ci: player.documento, comp: comprobanteNro });
          const chk = await fetch(CONFIG.APPS_SCRIPT_URL + "?" + q.toString()).then(r => r.json());
          if (chk && chk.ci) { resetBtn(); return showError("Ese documento (CI) ya está inscrito. Si ya participaste, entrá a Mi Pasaporte desde el menú."); }
          if (chk && chk.comp) { resetBtn(); return showError("Ese número de comprobante ya fue registrado. Cada compra puede inscribirse una sola vez."); }
        } catch (err) {
          console.warn("Chequeo de duplicado no disponible; continúo (el servidor deduplica igual).", err);
        }

        submitBtn.textContent = "Enviando...";
        const saved = await fetch(CONFIG.APPS_SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) }).then(r => r.json());
        if (!saved || saved.ok === false) {
          resetBtn();
          return showError((saved && saved.error) || "No pudimos registrar tu inscripción. Revisá tus datos e intentá de nuevo.");
        }
        player.id = saved.participant_id || saved.id || player.id;
      }
      localStorage.setItem("stanley_player", JSON.stringify(player));
      submitBtn.textContent = "¡Listo! Abriendo tu Pasaporte...";
      window.location.href = "jugar.html";
    } catch (err) {
      resetBtn();
      showError("No pudimos registrar tu inscripción. Revisá tu conexión e intentá de nuevo.");
      console.error(err);
    }
  });
}

document.querySelectorAll("[data-carousel]").forEach(function (box, idx) {
  var imgs = box.querySelectorAll(".prize__img");
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
