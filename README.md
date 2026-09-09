# KiloAKilo

App de seguimiento de peso y ejercicio. PWA que lee datos desde Google Sheets.

## Setup rápido

### 1. Crear Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com) y crea una hoja nueva
2. Crea **dos pestañas** (click derecho en la pestaña → "Añadir hoja"):
   - **Peso** con cabeceras: `fecha` `peso_kg`
   - **Deporte** con cabeceras: `fecha` `deporte` `detalle` `duracion_min`
3. Nombra la hoja como quieras

### 2. Configurar Apps Script

1. En tu Sheet, ve a **Extensiones → Apps Script**
2. Borra todo el contenido del editor y pega el contenido de `apps_script/Code.gs`
3. Guarda (Ctrl+S)
4. Haz clic en **Implementar → Nueva implementación**
5. Selecciona: **Aplicación web**
6. Configura:
   - **Descripción**: "KiloAKilo API"
   - **Ejecutar como**: Yo
   - **Quién tiene acceso**: Cualquier usuario
7. Haz clic en **Implementar**
8. **Copia la URL** que aparece (la guardarás en el siguiente paso)

### 3. Configurar la PWA

1. Abre `web/index.html`
2. Busca la línea: `const API_URL = "TU_URL_DE_APPS_SCRIPT_AQUI";`
3. Reemplaza con la URL que copiaste en el paso anterior
4. Guarda

### 4. Desplegar en GitHub Pages

1. Crea un repositorio en GitHub
2. Sube la carpeta `web/` al repositorio
3. Ve a **Settings → Pages**
4. Selecciona la rama `main` y carpeta `/ (root)`
5. Guarda
6. En 1-2 minutos tu app estará en: `https://TU_USUARIO.github.io/REPOSITORIO/`

## Uso con Gemini

Dicta a Gemini:
> "Hoy pesé 85.3 kilos"

Gemini hará un POST a la URL de tu Apps Script:
```json
{
  "type": "peso",
  "fecha": "2026-09-08",
  "peso_kg": 85.3
}
```

Dicta ejercicio:
> "Hice 30 minutos de running"

```json
{
  "type": "deporte",
  "fecha": "2026-09-08",
  "deporte": "running",
  "detalle": "30 minutos",
  "duracion_min": 30
}
```

## Desarrollo local

Simplemente abre `web/index.html` en tu navegador. Los datos se cargan desde Apps Script (necesitas la URL configurada).

## Estructura

```
apps_script/
  Code.gs            # API: doGet (lee) y doPost (escribe)
  appsscript.json    # Manifest de Apps Script
web/
  index.html         # PWA completa (HTML + CSS + JS inline)
  manifest.json      # Manifest para instalar como app
```
