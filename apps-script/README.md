# Apps Script · Pasaporte Stanley

Backend opcional para guardar inscripciones y evidencias en Google Sheets + Drive.

## Pestañas

- `Participantes`: datos de inscripción, compra válida y respaldo.
- `Evidencias`: capturas cargadas por misión.

## Endpoints

- `POST action=register`: registra al participante.
- `POST action=saveEvidence`: guarda evidencia de una misión.
- `GET action=existe`: valida duplicados por CI y número de respaldo.

El front-end puede funcionar en modo local para sellos y certificado. Para almacenamiento centralizado de evidencias, conectar `saveEvidence` desde `pasaporte.js`.
