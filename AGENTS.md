# AGENTS.md

## Qué es esto

App de seguimiento de peso y ejercicio. El usuario dicta datos a Gemini, que los escribe en Google Sheets. Una PWA en GitHub Pages lee el Sheet y muestra gráficos.

## Arquitectura

```
Voz → Gemini → Apps Script (doPost) → Google Sheet → Apps Script (doGet) → PWA (Chart.js)
```

- **Google Sheet** = base de datos + backup automático en Drive
- **Apps Script** = API pública (doGet lee, doPost escribe). Ejecuta como owner, sin OAuth.
- **PWA estática** en GitHub Pages (gratis, HTTPS)
- **Chart.js** para gráficos de peso y ejercicio
- Sin backend propio, sin npm, sin bundler, sin build step

## Estructura

```
apps_script/
  Code.gs            # doGet(), doPost(), formateo de datos (~50 líneas)
  appsscript.json    # Manifest de Apps Script
web/
  index.html         # PWA: layout responsive + Chart.js
  manifest.json      # PWA manifest para instalar en móvil
README.md            # Guía de setup paso a paso
```

## Esquema de datos (2 hojas en el Sheet)

### Hoja `Peso`

| Columna | Tipo | Ejemplo |
|---------|------|---------|
| fecha | date | 2026-09-08 |
| peso_kg | number | 85.3 |

### Hoja `Deporte` (pendiente de definir)

| Columna | Tipo | Ejemplo |
|---------|------|---------|
| fecha | date | 2026-09-08 |
| deporte | text | running |
| detalle | text | 3 series de 10 min |
| duracion_min | number | 30 |

## Comandos de setup

1. Crear Google Sheet manualmente en Drive
2. Crear dos pestañas en el Sheet: `Peso` (con cabeceras: `fecha`, `peso_kg`) y `Deporte` (con cabeceras: `fecha`, `deporte`, `detalle`, `duracion_min`)
3. Abrir Extensiones → Apps Script → pegar `Code.gs`
4. Desplegar Apps Script como Web App (Ejecutar como: Yo, Cualquiera con el vínculo puede acceder)
5. Copiar URL de despliegue → pegar en `index.html` como `API_URL`
6. Subir `web/` a GitHub Pages

## Testing

- Abrir `web/index.html` en navegador para probar UI
- Probar Apps Script visitando la URL de `doGet` en el navegador
- Probar `doPost` via curl:
  ```bash
  # Peso
  curl -X POST <url_deployed> -H "Content-Type: application/json" \
    -d '{"type":"peso","fecha":"2026-09-08","peso_kg":85.3}'
  
  # Deporte
  curl -X POST <url_deployed> -H "Content-Type: application/json" \
    -d '{"type":"deporte","fecha":"2026-09-08","deporte":"running","detalle":"30 min","duracion_min":30}'
  ```

## Restricciones conocidas

- Apps Script: timeout ~6 min (irrelevante aquí), rate limit ~30k ejecuciones/día
- Sin build step — JS y CSS van inline en index.html o con CDN (Chart.js)
- PWA necesita HTTPS (GitHub Pages lo provee)
- La constante `API_URL` en index.html debe cambiarse tras el despliegue
