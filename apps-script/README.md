# Apps Script - Pasaporte Stanley

Backend para guardar registros, misiones, evidencias, premios y auditoria en Google Sheets + Drive.

## Hojas requeridas

El script crea y usa exactamente estas 4 hojas:

- `Participantes`
- `Misiones`
- `Premios`
- `Auditoría`

## Identificador principal

El identificador principal es `participant_id`.

- Se genera automaticamente en Apps Script cuando no llega desde el front.
- Se devuelve al registro como `participant_id`.
- El front lo guarda localmente y lo usa para misiones/evidencias.
- Instagram queda visible en `Participantes`, pero no se usa como identificador principal.

## Estructura de hojas

### Participantes

Columnas:

`participant_id`, `ci`, `factura`, `nombre`, `instagram`, `whatsapp`, `email`, `ciudad`, `canal_compra`, `comprobante_url`, `fecha_registro`, `estado`

Validaciones:

- `ci` unico.
- `factura` unica.
- `instagram` visible, no unico y no identificador principal.

### Misiones

Columnas:

`mission_record_id`, `participant_id`, `mission_id`, `mission_name`, `week`, `evidence_url`, `evidence_filename`, `completed_at`, `status`

Reglas:

- Toda mision completada se registra con `participant_id`.
- Toda evidencia se guarda en Drive y queda asociada a `participant_id`.
- `mission_record_id` usa `participant_id + mission_id`, para actualizar la misma mision si se cambia evidencia.

### Premios

Columnas:

`prize_selection_id`, `participant_id`, `level`, `prize_type`, `prize_name`, `draw_name`, `selected_at`, `status`, `notes`

Reglas:

- Toda seleccion de premio se basa en `participant_id`.
- No se selecciona por Instagram, nombre, CI ni factura.

### Auditoría

Columnas:

`audit_id`, `timestamp`, `action`, `participant_id`, `entity`, `entity_id`, `status`, `detail`

Reglas:

- Registra acciones relevantes: registro, mision completada, seleccion de premio y errores.

## Endpoints

- `GET action=setup`: crea/verifica las 4 hojas y encabezados.
- `GET action=existe&ci=&comp=`: valida duplicados por CI y factura.
- `POST action=register`: registra participante y devuelve `participant_id`.
- `POST action=saveEvidence`: registra mision/evidencia asociada a `participant_id`.
- `POST action=selectPrize`: registra seleccion de premio asociada a `participant_id`.

## Configuracion

En `Code.gs`, completar:

```js
const SHEET_ID  = "PEGAR_ID_DE_LA_HOJA";
const FOLDER_ID = "PEGAR_ID_DE_LA_CARPETA";
```

Luego publicar como Web App y copiar la URL `/exec` en `config.js` como `APPS_SCRIPT_URL`.
