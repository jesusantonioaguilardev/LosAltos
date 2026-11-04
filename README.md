# Los Altos — copia estática de saludlosaltos.com

Copia estática de la página de inicio de https://saludlosaltos.com (Clínica de salud mental y adicciones Los Altos, Hermosillo, Sonora).

## Origen de cada archivo

| Archivo | Origen |
|---|---|
| `index.html` | HTML de la página de inicio tal como lo dibujó el navegador (guardado el 2026-11-04), sin los scripts de Vue |
| `css/app.ec54f82e.css`, `css/chunk-vendors.3d5cf4b0.css` | Archivos originales, recuperados del Internet Archive (mismo hash que el sitio) |
| `img/icons/favicon-32x32.png`, `manifest.json` | Originales, recuperados del Internet Archive |
| `img/*.webp` | Fotos de las instalaciones y del equipo entregadas por el cliente |

El 2026-11-04 el servidor de saludlosaltos.com respondía 404 a todos los archivos y su certificado HTTPS estaba vencido, así que no se pudieron descargar los originales que faltan.

## Pendiente

- `pdf/SALUD_MENTAL_y_ADICCIONES_SEPTIEMBRE.pdf`

Las páginas `about-us/`, `services/` y `gallery/` se reconstruyeron con los textos del sitio original, usando el mismo encabezado, pie y estilos del inicio (más `css/paginas.css`).

## Buscador e idioma

- La lupa del encabezado abre el buscador (`js/sitio.js`), que busca en el índice `js/indice.js`.
- La bandera de Estados Unidos cambia el sitio a inglés y la de México lo regresa a español. Las traducciones están en `js/i18n.js` (texto en español → inglés) y el idioma elegido se guarda en el navegador.

## Limitaciones

El sitio original es una app de Vue. Sin sus scripts, la página es estática: se ve igual; el buscador y el cambio de idioma se rehicieron en `js/sitio.js`, pero el menú móvil todavía no funciona.

## Ver en local

```bash
python -m http.server 8000
```

Luego abre http://localhost:8000.
