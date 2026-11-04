# Los Altos — copia estática de saludlosaltos.com

Copia estática de la página de inicio de https://saludlosaltos.com (Clínica de salud mental y adicciones Los Altos, Hermosillo, Sonora).

## Origen de cada archivo

| Archivo | Origen |
|---|---|
| `index.html` | HTML de la página de inicio tal como lo dibujó el navegador (guardado el 2026-11-04), sin los scripts de Vue |
| `css/app.ec54f82e.css`, `css/chunk-vendors.3d5cf4b0.css` | Archivos originales, recuperados del Internet Archive (mismo hash que el sitio) |
| `img/icons/favicon-32x32.png`, `manifest.json` | Originales, recuperados del Internet Archive |
| `img/*.png` | **Imágenes de relleno** (dicen "FALTA IMAGEN") |

El 2026-11-04 el servidor de saludlosaltos.com respondía 404 a todos los archivos y su certificado HTTPS estaba vencido, así que no se pudieron descargar los originales que faltan.

## Pendiente

Reemplazar con los originales, usando **el mismo nombre**:

- `img/heroImg.7af3cd1b.png`, `img/3.77e08757.png`, `img/guidePhoto.3dadaffc.png`, `img/medicalCenter.d37125ab.png`
- `img/gallery1.3464c677.png` … `img/gallery6.e172d758.png`
- `pdf/SALUD_MENTAL_y_ADICCIONES_SEPTIEMBRE.pdf`

Las páginas `about-us/`, `services/` y `gallery/` se reconstruyeron con los textos del sitio original, usando el mismo encabezado, pie y estilos del inicio (más `css/paginas.css`). La galería usa las mismas imágenes de relleno.

## Limitaciones

El sitio original es una app de Vue. Sin sus scripts, la página es estática: se ve igual, pero las partes interactivas (por ejemplo, el menú móvil) no funcionan.

## Ver en local

```bash
python -m http.server 8000
```

Luego abre http://localhost:8000.
