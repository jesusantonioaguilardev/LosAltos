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
- Retratos de las personas 9 a 17 del equipo (`img/equipo-9.webp` … `img/equipo-17.webp`) y las fotos de grupo de cocina y paramédicos

Las páginas `about-us/`, `services/` y `gallery/` se reconstruyeron con los textos del sitio original, usando el mismo encabezado, pie y estilos del inicio (más `css/paginas.css`).

## Limitaciones

El sitio original es una app de Vue. Sin sus scripts, la página es estática: se ve igual, pero las partes interactivas (por ejemplo, el menú móvil) no funcionan.

## Ver en local

```bash
python -m http.server 8000
```

Luego abre http://localhost:8000.
