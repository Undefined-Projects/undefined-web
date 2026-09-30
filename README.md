# Undefined · sitio web

Sitio de **undfinedclub.org** hecho con **Next.js 15** (React 19, TypeScript) y un panel de contenido **Keystatic** para editar noticias, eventos, proyectos, equipo y aliados sin tocar código.

- Inicio con malla de fichas (se abren al pasar el cursor en escritorio y al tocarlas en el celular) y carrusel automático de destacados.
- Transición 3D entre secciones: un carrusel de páginas en escritorio y un giro de cubo en el celular. Se desactiva sola si el visitante tiene activado "reducir movimiento".
- 8 secciones con su propia página, más páginas de detalle para cada noticia y cada proyecto.
- Totalmente responsivo, con fuentes alojadas en el propio sitio y formularios de contacto y boletín.

Todo el contenido actual son **marcadores entre corchetes** (`[Titular de la noticia]`, `[Lugar]`…). Se reemplazan desde el panel.

---

## 1. Correrlo en tu computadora

Necesitas [Node.js 20 o superior](https://nodejs.org).

```bash
npm install
npm run dev
```

- Sitio: http://localhost:3000
- Panel de contenido: http://localhost:3000/keystatic

En local, lo que guardes en el panel se escribe directamente en la carpeta `content/`.

## 2. Editar el contenido (panel /keystatic)

| En el panel | Dónde aparece |
|---|---|
| **Noticias** | Página Noticias, ficha 06 y página de cada nota. Marca una como *destacada* para que salga en grande. |
| **Eventos** | Página Eventos, ficha 05 y carrusel de inicio (activa *Mostrar en el carrusel*). Los eventos pasan solos a "pasados" cuando llega su fecha. |
| **Proyectos** | Nuestro trabajo, ficha 04 y página de cada proyecto. *Caso destacado* lo muestra en grande. |
| **Comunicados** | Lista con PDF descargable en Noticias. |
| **Equipo / Aliados** | Sus páginas y las fichas 07 y 08. Usa *Orden* para acomodarlos. |
| **Sitio y contacto** | Tagline, manifiesto, correo, WhatsApp, redes y ciudad. |
| **Quiénes somos / Misión y visión / Textos de las secciones** | Textos de esas páginas, valores, cifras de impacto, formatos de evento, etc. |

Las fotos se suben desde el panel y se guardan en `public/images/`. Mientras una entrada no tenga foto, se muestra un degradado de marcador.

## 3. Publicarlo (Vercel, gratis)

1. Sube esta carpeta a un repositorio nuevo en GitHub.
2. En [vercel.com](https://vercel.com) → *Add New Project* → elige el repositorio → *Deploy*. No hay que configurar nada más para que el sitio funcione.
3. Conecta tu dominio en *Project → Settings → Domains* (`undfinedclub.org` y `www.undfinedclub.org`) y sigue las instrucciones de DNS que te da Vercel.

### Activar el panel en producción

En producción el panel guarda los cambios como commits en GitHub, y Vercel vuelve a publicar solo (tarda 1–2 min).

1. En Vercel → *Settings → Environment Variables* agrega:
   - `NEXT_PUBLIC_KEYSTATIC_STORAGE` = `github`
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` = `tu-usuario/tu-repo`
2. Vuelve a publicar y entra a `https://tu-dominio/keystatic`. Keystatic te guiará para crear una GitHub App; al terminar te dará `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` y `KEYSTATIC_SECRET`. Agrégalas también en Vercel y publica otra vez.
3. Quien vaya a editar necesita acceso de escritura al repositorio en GitHub.

Guía oficial: https://keystatic.com/docs/github-mode

## 4. Formularios (contacto y boletín)

Funcionan desde el inicio, pero **sin configuración solo registran el mensaje en los logs del servidor**. Para recibirlos por correo:

1. Crea una cuenta en [resend.com](https://resend.com) y verifica tu dominio.
2. Agrega en Vercel: `RESEND_API_KEY`, `CONTACT_TO` (quién recibe) y `CONTACT_FROM` (remitente con tu dominio).

Si prefieres guardar los suscriptores en una base de datos o una herramienta de correo (Mailchimp, Brevo…), el lugar para cambiarlo es `app/api/boletin/route.ts`.

## 5. Estructura

```
app/
  (site)/            páginas públicas (inicio y 8 secciones)
  keystatic/         panel de contenido
  api/               contacto, boletín y API del panel
  globals.css        todos los estilos (colores en :root)
  fonts/             Figtree y JetBrains Mono (licencia OFL)
components/
  Stage.tsx          transición 3D entre secciones
  HeroCarousel.tsx   carrusel de la ficha grande
  Tile.tsx           fichas de inicio (hover / acordeón)
  Brand.tsx          logo, pictogramas a lápiz, fondo líquido, grano
content/             contenido editable (lo escribe el panel)
keystatic.config.ts  qué campos tiene cada tipo de contenido
lib/sections.ts      orden, números, títulos y fondos de las secciones
scripts/seed.mjs     regenera el contenido de ejemplo (¡borra /content!)
```

- **Color de acento:** `--accent` en `app/globals.css`.
- **Segundos del carrusel:** prop `intervalo` de `<HeroCarousel>` en `app/(site)/page.tsx` (10 por defecto).
- **Logo:** `LogoMark` en `components/Brand.tsx` es una reproducción vectorial. Si tienes el SVG oficial, reemplaza su contenido.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # compilar para producción
npm start       # servir la versión compilada
npm run lint    # revisar tipos de TypeScript
```
