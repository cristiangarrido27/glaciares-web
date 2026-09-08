# Copiloto Patagonia — by Glaciares Rent a Car

> "Tu compañero de ruta en el fin del mundo"

Guía turística digital, instalable como PWA, elaborada por **Glaciares Rent a Car** ("Patagonia a tu alcance")
para sus clientes que visitan Punta Arenas y la Patagonia. Incluye planificador de rutas, destinos, itinerarios,
gastronomía, alojamiento, recomendaciones de conducción segura, enlaces oficiales y una sección comercial de
arriendo de vehículos.

Copiloto Patagonia **no es un sitio oficial** de la Municipalidad de Punta Arenas. Es contenido original de
Glaciares Rent a Car; los enlaces a `ciudadantartica.cl` se usan solo como referencia externa (`target="_blank"`,
`rel="noopener noreferrer"`), claramente identificados con fuente y fecha.

## Stack técnico

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens de marca en `src/index.css`)
- React Router 7 (rutas SPA + lazy loading por página)
- `vite-plugin-pwa` (manifest + service worker con caché de datos, imágenes y tiles del mapa)
- Leaflet / React-Leaflet (mapas de rutas con OpenStreetMap, sin API key)
- jsPDF (descarga de itinerarios en PDF, cargado de forma diferida)
- `qrcode.react` (código QR para compartir la guía)
- Contenido 100% desacoplado en JSON (`src/data/`), sin base de datos

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación y ejecución

```bash
cd copiloto-patagonia
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # build de producción en /dist
npm run preview   # sirve el build de producción localmente
```

El proyecto ya fue instalado, compilado (`npm run build`) y probado (`npm run dev` / `npm run preview`) durante su
construcción, incluyendo pruebas automatizadas de navegación en las 20 rutas de la aplicación y de la interacción
del planificador, sin errores de consola ni de build.

## Estructura del proyecto

```
src/
  components/     Header, Footer, tarjetas, mapa, buscador, banners, botones reutilizables
  pages/          Una página por ruta (Home, Planner, Destinations, RouteDetail, Admin, etc.)
  data/           Contenido editable: destinations.json, routes.json, restaurants.json,
                  accommodations.json, official-links.json, safety-tips.json, alerts.json, company.json
  context/        FavoritesContext, TripContext, ConsentContext (persistencia en localStorage)
  i18n/           Diccionarios es.json / en.json / pt.json + contexto de idioma
  types/          Tipos TypeScript de todas las colecciones de datos
  utils/          WhatsApp, generación de PDF, motor del planificador
public/
  icons/          Íconos PWA (192, 512, 512 maskable, apple-touch-icon)
  manifest / sw   Generados automáticamente por vite-plugin-pwa en el build
```

## Variables que debes completar

Todas están centralizadas en **`src/data/company.json`** — no hay precios ni datos de contacto sueltos en
componentes:

| Variable | Descripción |
|---|---|
| `whatsappAsistencia` | Número de WhatsApp para el botón flotante "Necesito asistencia" en ruta |
| `whatsappReservas` | Número de WhatsApp para "Cotizar ahora" y el formulario de reporte |
| `correoReservas` | Correo de contacto comercial |
| `direccionEmpresa` | Dirección física de Glaciares Rent a Car |
| `instagramEmpresa` | Usuario/enlace de Instagram |

Mientras no se completen, la interfaz muestra de forma visible `[COMPLETAR]` en vez de simular datos falsos.

**Fotografías**: los destinos usan placeholders ilustrados generados localmente (`public/images/destinations/`,
sin dependencia de servicios externos), marcados con `placeholderImage: true` en `destinations.json`. Se optó por
generarlos localmente en vez de enlazar fotos de stock externas porque varias fotos de Unsplash referenciadas
inicialmente no cargaban o no correspondían al lugar. Debes reemplazarlos por fotografía propia de Glaciares Rent
a Car antes de publicar (basta con sobrescribir los archivos `.jpg` en esa carpeta, manteniendo el mismo nombre
de archivo por destino, o actualizar el campo `image` en `destinations.json`).

**Logotipo**: por defecto se reutiliza el logo ya publicado en `https://glaciaresrentacar.cl/LOGOSINFONDO.png`
(usado en `src/components/Header.tsx`). Reemplázalo si tienes una versión más reciente.

## Panel de administración de contenido

No existe base de datos: todo el contenido vive en los archivos JSON de `src/data/`. Hay dos formas de editarlo:

1. **Editar los archivos JSON directamente** en el repositorio (recomendado para cambios de desarrollador).
2. **Panel `/admin` dentro de la app**: permite ver, editar y descargar cada colección como JSON válido, para
   reemplazar el archivo correspondiente en `src/data/` antes de volver a compilar. No persiste cambios en vivo
   (el sitio es estático), pero evita errores de sintaxis.

Para edición colaborativa en línea sin tocar código ni recompilar, se recomienda conectar
[Decap CMS](https://decapcms.org/) (gratuito) apuntando a la carpeta `src/data/` vía Git Gateway de Netlify —
no viene preinstalado en esta entrega para no añadir infraestructura adicional sin que la definan ustedes
(requiere habilitar Netlify Identity + Git Gateway en el sitio ya desplegado).

## Despliegue en Netlify

El repositorio incluye `netlify.toml` con:

- `command = "npm run build"`, `publish = "dist"`
- Redirección SPA (`/*` → `/index.html`, 200) para que las rutas de React Router funcionen al recargar

Pasos:

1. Conecta el repositorio en Netlify (o arrastra la carpeta `dist` generada por `npm run build`).
2. Selecciona la subcarpeta `copiloto-patagonia` como *base directory* si el repo tiene el sitio comercial actual
   (`index.html` en la raíz) además de esta app.
3. Verifica las variables de `company.json` antes de publicar en producción.
4. Netlify servirá `sitemap.xml` y `robots.txt` automáticamente desde `public/`.

## Checklist final de funcionamiento

- [x] Compila sin errores (`npm run build`) y corre en desarrollo (`npm run dev`)
- [x] Las 20 rutas de la aplicación devuelven 200 y su `<title>` correcto (Home, Planificador, Destinos (+detalle),
      Rutas (+detalle), Antes de viajar, Conducción segura, Dónde comer, Dónde alojar, Información oficial,
      Glaciares Rent a Car, Ayuda, Mi viaje, Favoritos, Privacidad, Cookies, Términos, Admin, 404)
- [x] El planificador genera una propuesta real (ruta, distancia, paradas, combustible, seguridad, documentos,
      mapa, WhatsApp, PDF) sin datos simulados
- [x] Los 14 enlaces de "Información oficial" apuntan a `ciudadantartica.cl` con `target="_blank"` y
      `rel="noopener noreferrer"`, fuente y fecha de revisión visibles
- [x] El botón flotante de asistencia y el de "Cotizar" abren WhatsApp con mensaje predefinido (o muestran
      `[COMPLETAR]` si falta el número)
- [x] Favoritos, "Mi viaje" e historial persisten en `localStorage` sin necesidad de cuenta
- [x] Selector de idioma ES/EN/PT funcional, con interfaz y contenido narrativo completamente traducidos
      (destinos, rutas, gastronomía, alojamiento, enlaces oficiales, conducción segura, antes de viajar, ayuda,
      sección comercial y páginas legales)
- [x] Manifest, service worker e íconos PWA generados; instalación probada vía evento `beforeinstallprompt`
- [x] Aviso de privacidad, cookies y términos de uso con contenido original
- [x] Ningún botón o sección queda vacía o simulada

## Pendiente antes de producción (no bloqueante para desarrollo)

- Completar variables de contacto en `company.json`
- Reemplazar fotografías de referencia por fotografía propia
- Las traducciones EN/PT fueron redactadas íntegramente para esta entrega; se recomienda una revisión final por
  un hablante nativo antes de publicar en producción
- Verificar en terreno las distancias, tiempos y condiciones de camino antes de la temporada alta, y actualizar
  `lastReviewed` en los JSON correspondientes
- Decidir e implementar el CMS de edición en línea (Decap CMS u otro) si se requiere edición sin tocar código

## Pruebas realizadas

- **Build**: `tsc -b && vite build` sin errores ni warnings de TypeScript
- **Navegación**: prueba automatizada (Chromium headless) de las 20 rutas de la SPA, sin errores de JavaScript
- **Interacción**: prueba del planificador (llenado de formulario → generación de propuesta → mapa → descarga de
  PDF → enlace de WhatsApp), sin errores
- **Responsive**: capturas verificadas en viewport móvil (390×844) y escritorio (1440×900)
- **PWA**: manifest válido servido en `/manifest.webmanifest`, service worker generado (`sw.js`)

> Nota: en el entorno de construcción no hay salida a internet hacia dominios externos (OpenStreetMap,
> glaciaresrentacar.cl), por lo que los tiles del mapa y el logotipo externo no pudieron verse en las pruebas
> locales. Esto es una limitación del entorno de pruebas, no del código: en un despliegue real con acceso a
> internet cargarán con normalidad. Las fotografías de destinos ya no dependen de ningún servicio externo (ver
> sección "Fotografías" más arriba), por lo que no tienen este problema. Se recomienda una verificación visual
> final en Netlify o en `npm run preview` con conexión a internet.
