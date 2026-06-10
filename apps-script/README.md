# Backend Google Sheets — Quiniela Stanley

El sitio (GitHub Pages) envía el **registro** y los **pronósticos** a un Web App de
Apps Script, que escribe en una Hoja de Cálculo. Los comprobantes van a una carpeta de Drive.

## Pasos (una sola vez)
1. **Hoja de cálculo**: creá una Hoja de Google nueva. Copiá su **ID** (en la URL, entre `/d/` y `/edit`).
2. **Carpeta de Drive**: creá una carpeta para los comprobantes. Copiá su **ID** (en la URL, después de `/folders/`).
3. **Proyecto Apps Script**: andá a https://script.google.com → *Nuevo proyecto*. Borrá el contenido y pegá `Code.gs` de esta carpeta.
4. Pegá los dos IDs arriba de `Code.gs` (`SHEET_ID`, `FOLDER_ID`). Guardá.
5. **Implementar → Nueva implementación → Aplicación web**:
   - *Ejecutar como*: **Yo**
   - *Quién tiene acceso*: **Cualquier usuario**
   - Implementar → autorizá los permisos cuando lo pida.
6. Copiá la **URL del Web App** (termina en `/exec`) y pegala en `web/config.js` → `APPS_SCRIPT_URL`.
7. `git commit` + `push`. Listo: el sitio empieza a guardar en la nube.

> Si después editás `Code.gs`: *Implementar → Administrar implementaciones → (editar) → Nueva versión*.

## Qué se guarda
- Pestaña **Participantes**: `id, nombre, apellido, documento, whatsapp, email, ciudad, comprobante, fecha`.
- Pestaña **Pronosticos**: `id, nombre, documento, actualizado, avance%, campeon, finalista, tercer_puesto, grupos_json, partidos_json` (1 fila por jugador; se actualiza con cada cambio).

El **id** lo genera la página al inscribirse y queda en el navegador del jugador, así sus
pronósticos (cargados después, incluso otro día) se vinculan a su registro.

## Bajar a Excel
*Archivo → Descargar → Microsoft Excel (.xlsx)* desde la Hoja. Las columnas `*_json` traen
el detalle completo; si querés expandirlas a columnas, lo hacemos con un script aparte.

## Notas
- Mientras `APPS_SCRIPT_URL` esté vacío en `config.js`, el sitio anda en **modo demo**
  (valida y guarda local, no envía a la nube).
- Dedup: hoy la clave es el `id` del jugador. Para evitar CI duplicados entre dispositivos,
  se puede limpiar en la Hoja o agregar control luego.
