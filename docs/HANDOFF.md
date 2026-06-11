# Traspaso — "Pronosticá con Stanley"

Documento para quien continúe o reciba el proyecto. Última actualización: 2026-06.

## 1. Qué es
Campaña recreativa de pronósticos futboleros para compradores Stanley Bolivia (Openbrands S.R.L.).
El usuario se inscribe (con factura/respaldo), arma su pronóstico de fase de grupos y compite en el
**Ranking General Stanley**; opcionalmente sella el **Modo Nostradamus** (cuadro completo). Sitio
estático (GitHub Pages) + backend en Google Apps Script (Sheets + Drive).

## 2. Estructura del repo (carpeta `web/`)
- `index.html` — home (landing + secciones + formulario de inscripción).
- `app.js` — lógica del formulario (validación, envío al backend, redirección a la quiniela).
- `jugar.html` + `quiniela.js` + `jugar.css` — la quiniela: fase de grupos (12 grupos, 1.º/2.º/3.º +
  8 mejores terceros), campos base (goles desempate + campeón de referencia), llaves 16avos→final
  (cuadro real Mundial 2026), Modo Nostradamus, e imágenes compartibles (campeón / resumen, formato
  historia 1080×1920).
- `etapa2.html` — página de "Etapa 2" (quiniela diaria en vivo). **Prototipo con datos de ejemplo,
  bajo candado** (ver §7). Sin backend.
- `ranking.html` + `ranking.js` — leaderboards: 2 tabs (Ranking General Stanley + Modo Nostradamus).
- `styles.css` — estilos globales. `config.js` — configuración (ver §5). `phase.js` — fase de campaña.
- `assets/` — logos, favicons, OG image, fotos de productos.
- `apps-script/Code.gs` — **fuente** del backend (con IDs en placeholder; el real va aparte, ver §4).
- `apps-script/README.md`, `docs/PLAN-ETAPA2.md` — notas.

## 3. Cómo correr local
No requiere build. Servir por HTTP (no abrir como archivo, porque las imágenes del canvas no se
exportan bajo `file://`):
```
cd web
python -m http.server 8000
# abrir http://localhost:8000
```
Para previsualizar fases: `?phase=eliminatorias` en la URL. Para destrabar fechas al testear: el
toggle "Modo diseño" en la quiniela (QUITAR antes del lanzamiento — ver §7).

## 4. Backend (Google Apps Script + Sheets + Drive) — lo más importante
**Vive en una cuenta Google, NO en GitHub.** El sitio solo llama a la URL del Web App.
- **Hoja de Cálculo** (Sheets): pestañas `Participantes`, `Pronosticos`, `Resultados_grupos`,
  `Resultados_partidos`, `Ranking`, `Ranking_nostradamus`.
- **Carpeta de Drive**: guarda los comprobantes (configurados **privados**: solo el dueño los ve).
- **Proyecto Apps Script** (`Code.gs`): expone un Web App (`doPost`/`doGet`).
- Los **IDs reales** (`SHEET_ID`, `FOLDER_ID`) y el `Code.gs` listo para pegar están en el archivo
  **`Code-Stanley-PEGAR.txt`** (NO está en el repo; se entrega por fuera). En el repo van como
  placeholders por ser público.

**Re-desplegar el backend tras editar `Code.gs`:** pegar en script.google.com → Guardar →
*Implementar → Administrar implementaciones → editar → Nueva versión → Implementar*. La URL `/exec`
**no cambia** (no hay que tocar `config.js`).

## 5. `config.js` (valores que se editan sin tocar código)
- `APPS_SCRIPT_URL` — URL `/exec` del Web App (pública, no secreta).
- `WHATSAPP_INVITE_URL` — link de la comunidad de WhatsApp (**pendiente** del cliente; mientras sea
  placeholder, la web muestra "muy pronto").
- `DEADLINE` — cierre de inscripciones (jueves 18 jun 2026, 11:30, hora Bolivia).
- `IG_HANDLE` — `@stanley1913_bolivia` (aparece en las imágenes compartibles y el cartel).
- `PHASE` — fase de la campaña: `inscripcion | grupos | eliminatorias | cerrado` (cambia el home y el nav).

## 6. Operación durante el torneo (cargar resultados y recalcular)
1. En la Hoja, menú **🏆 Quiniela → Preparar pestañas de Resultados** (crea `Resultados_grupos` y
   `Resultados_partidos`).
2. Cargar a mano los resultados reales: en `Resultados_grupos` qué selecciones clasificaron (`clasifico`
   = si/1/x) y su puesto; en `Resultados_partidos` quién avanzó y los goles.
3. En `Code.gs`, setear `GOLES_REALES_GRUPOS` (total real de goles de fase de grupos, para el desempate).
4. Menú **🏆 Quiniela → Recalcular ranking** → llena `Ranking` (General) y `Ranking_nostradamus`.
   El sitio los lee solo (no hay que tocar nada más).

**Puntaje (en `PUNTOS`/constantes de `Code.gs`, editables):** Ranking General = +1 por selección
clasificada (máx 32), corte = Top 50% + ≥24 aciertos. Nostradamus = avanzar + marcador exacto por ronda.

## 7. Pendientes / decisiones abiertas
- Confirmar/poner el **link de WhatsApp** en `config.js`.
- **Quitar el "Modo diseño"** de la quiniela antes del lanzamiento (hoy es un toggle visible en
  `jugar.html`/`quiniela.js`; permite saltear candados de fecha — solo para testing).
- **Etapa 2** (`etapa2.html`): prototipo con datos de ejemplo, sin backend, bajo candado. Decidir si
  se reactiva (requiere desarrollo) o se maneja por comunidad. Ver `docs/PLAN-ETAPA2.md`.
- Cargar `GOLES_REALES_GRUPOS` cuando se sepa.

## 8. Migración a infraestructura Stanley (resumen)
Son dos migraciones independientes (ver §detalle con quien la pidió):
- **GitHub** (repo + Pages a cuenta/org Stanley): mover el código, habilitar Pages, actualizar las
  ~5 URLs absolutas (og:url/og:image/twitter en `index.html`, y la URL de compartir en `quiniela.js`).
  Ideal: **dominio propio** (subdominio de stanley1913.bo) para que la URL no cambie nunca.
- **Google** (Hoja + Drive + Apps Script a una cuenta Stanley): crear todo nuevo bajo la cuenta Stanley,
  nuevos `SHEET_ID`/`FOLDER_ID`, recrear el Apps Script → **nueva `APPS_SCRIPT_URL`** en `config.js`.
  Conviene hacerlo **antes del lanzamiento** (sin datos reales que migrar). Es lo correcto para que
  los datos personales queden bajo control de Stanley/Openbrands.

## 9. Qué hay que entregar para el traspaso
- **El repo** (acceso de escritura / colaborador, o transferencia del repo).
- **`Code-Stanley-PEGAR.txt`** (backend con IDs reales) — por canal privado, no por el repo.
- **Acceso Google**: compartir (o transferir) la **Hoja**, la **carpeta de Drive** y el **proyecto
  Apps Script** con la cuenta del nuevo responsable.
- Valores: `APPS_SCRIPT_URL`, repo + URL de Pages, `IG_HANDLE`, `DEADLINE`, y el link de WhatsApp cuando exista.
