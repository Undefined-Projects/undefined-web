import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Panel de contenido de Undefined.
 * Entra a /keystatic para editar noticias, eventos, proyectos, equipo, aliados y textos.
 * - En local guarda en /content (archivos del repo).
 * - En producción usa GitHub: cada cambio es un commit y Vercel vuelve a publicar solo.
 */
const storage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github'
    ? {
        kind: 'github' as const,
        repo: (process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ?? 'owner/repo') as `${string}/${string}`,
      }
    : { kind: 'local' as const };

const img = (dir: string, label = 'Imagen') =>
  fields.image({ label, directory: `public/images/${dir}`, publicPath: `/images/${dir}/` });

export default config({
  storage,
  ui: {
    brand: { name: 'Undefined' },
    navigation: {
      Contenido: ['noticias', 'eventos', 'proyectos', 'comunicados'],
      Comunidad: ['equipo', 'aliados'],
      Textos: ['sitio', 'nosotros', 'mision', 'paginas'],
    },
  },
  collections: {
    noticias: collection({
      label: 'Noticias',
      slugField: 'titulo',
      path: 'content/noticias/*',
      format: { contentField: 'contenido' },
      entryLayout: 'content',
      columns: ['titulo', 'fecha'],
      schema: {
        titulo: fields.slug({ name: { label: 'Titular' } }),
        medio: fields.text({ label: 'Medio', description: 'Ej. El Heraldo, Comunicado propio' }),
        fecha: fields.date({ label: 'Fecha', validation: { isRequired: true } }),
        extracto: fields.text({ label: 'Extracto', multiline: true }),
        imagen: img('noticias'),
        destacada: fields.checkbox({ label: 'Nota destacada', description: 'Aparece grande al inicio de Noticias' }),
        enlaceExterno: fields.url({ label: 'Enlace a la nota original (opcional)' }),
        contenido: fields.markdoc({ label: 'Contenido' }),
      },
    }),
    eventos: collection({
      label: 'Eventos',
      slugField: 'nombre',
      path: 'content/eventos/*',
      columns: ['nombre', 'fecha'],
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre del evento' } }),
        fecha: fields.date({ label: 'Fecha', validation: { isRequired: true } }),
        hora: fields.text({ label: 'Hora', description: 'Ej. 18:00 h' }),
        lugar: fields.text({ label: 'Lugar' }),
        formato: fields.text({ label: 'Formato', description: 'Ej. Meetup, Taller, Hackathon' }),
        descripcion: fields.text({ label: 'Descripción breve', multiline: true }),
        registro: fields.url({ label: 'Enlace de registro' }),
        imagen: img('eventos'),
        destacado: fields.checkbox({
          label: 'Mostrar en el carrusel de inicio',
          description: 'Solo se muestran los próximos (fecha futura)',
        }),
      },
    }),
    proyectos: collection({
      label: 'Proyectos (Nuestro trabajo)',
      slugField: 'titulo',
      path: 'content/proyectos/*',
      format: { contentField: 'contenido' },
      columns: ['titulo', 'anio'],
      schema: {
        titulo: fields.slug({ name: { label: 'Nombre del proyecto' } }),
        categoria: fields.text({ label: 'Categoría' }),
        anio: fields.integer({ label: 'Año' }),
        descripcion: fields.text({ label: 'Descripción en una línea' }),
        imagen: img('proyectos'),
        caso: fields.checkbox({ label: 'Caso destacado', description: 'Aparece en grande en Nuestro trabajo' }),
        orden: fields.integer({ label: 'Orden', defaultValue: 0 }),
        contenido: fields.markdoc({ label: 'Detalle del proyecto (reto, lo que hicimos, resultado)' }),
      },
    }),
    comunicados: collection({
      label: 'Comunicados',
      slugField: 'titulo',
      path: 'content/comunicados/*',
      columns: ['titulo', 'fecha'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        fecha: fields.date({ label: 'Fecha', validation: { isRequired: true } }),
        archivo: fields.file({ label: 'PDF', directory: 'public/comunicados', publicPath: '/comunicados/' }),
      },
    }),
    equipo: collection({
      label: 'Equipo',
      slugField: 'nombre',
      path: 'content/equipo/*',
      columns: ['nombre', 'orden'],
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        rol: fields.text({ label: 'Rol en el club' }),
        foto: img('equipo', 'Foto'),
        orden: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
    aliados: collection({
      label: 'Aliados',
      slugField: 'nombre',
      path: 'content/aliados/*',
      columns: ['nombre', 'orden'],
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        logo: img('aliados', 'Logo'),
        url: fields.url({ label: 'Sitio web' }),
        orden: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
  },
  singletons: {
    sitio: singleton({
      label: 'Sitio y contacto',
      path: 'content/sitio',
      schema: {
        tagline: fields.text({ label: 'Tagline (portada)' }),
        manifiesto: fields.text({ label: 'Manifiesto (frase grande)', multiline: true }),
        manifiestoApoyo: fields.text({ label: 'Manifiesto (párrafo de apoyo)', multiline: true }),
        correo: fields.text({ label: 'Correo de contacto' }),
        whatsapp: fields.text({ label: 'WhatsApp' }),
        ciudad: fields.text({ label: 'Ciudad, País' }),
        instagram: fields.url({ label: 'Instagram' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        tiktok: fields.url({ label: 'TikTok' }),
      },
    }),
    nosotros: singleton({
      label: 'Quiénes somos',
      path: 'content/nosotros',
      schema: {
        resumen: fields.text({ label: 'Resumen (ficha de inicio)', multiline: true }),
        frase: fields.text({ label: 'Frase principal', multiline: true }),
        parrafo1: fields.text({ label: 'Párrafo 1', multiline: true }),
        parrafo2: fields.text({ label: 'Párrafo 2', multiline: true }),
        foto: img('nosotros', 'Foto del club'),
        fundacion: fields.text({ label: 'Año de fundación' }),
        miembros: fields.text({ label: 'Miembros' }),
        eventosRealizados: fields.text({ label: 'Eventos realizados' }),
      },
    }),
    mision: singleton({
      label: 'Misión y visión',
      path: 'content/mision',
      schema: {
        mision: fields.text({ label: 'Misión', multiline: true }),
        vision: fields.text({ label: 'Visión', multiline: true }),
        valores: fields.array(
          fields.object({
            nombre: fields.text({ label: 'Valor' }),
            descripcion: fields.text({ label: 'Qué significa', multiline: true }),
          }),
          { label: 'Valores', itemLabel: (p) => p.fields.nombre.value || 'Valor' },
        ),
      },
    }),
    paginas: singleton({
      label: 'Textos de las secciones',
      path: 'content/paginas',
      schema: {
        bajadaNosotros: fields.text({ label: 'Bajada · Quiénes somos' }),
        bajadaMision: fields.text({ label: 'Bajada · Misión y visión' }),
        bajadaTrabajo: fields.text({ label: 'Bajada · Nuestro trabajo' }),
        bajadaEventos: fields.text({ label: 'Bajada · Nuestros eventos' }),
        bajadaNoticias: fields.text({ label: 'Bajada · Noticias' }),
        bajadaEquipo: fields.text({ label: 'Bajada · Equipo' }),
        bajadaAliados: fields.text({ label: 'Bajada · Aliados' }),
        bajadaContacto: fields.text({ label: 'Bajada · Hablemos' }),
        impacto: fields.array(
          fields.object({ valor: fields.text({ label: 'Cifra' }), etiqueta: fields.text({ label: 'Etiqueta' }) }),
          { label: 'Cifras de impacto (Nuestro trabajo)', itemLabel: (p) => p.fields.etiqueta.value || 'Cifra' },
        ),
        formatos: fields.array(
          fields.object({ nombre: fields.text({ label: 'Formato' }), descripcion: fields.text({ label: 'Descripción', multiline: true }) }),
          { label: 'Formatos de evento', itemLabel: (p) => p.fields.nombre.value || 'Formato' },
        ),
        aliadosCta: fields.text({ label: 'Texto de la tarjeta “¿Quieres ser aliado?”', multiline: true }),
        boletin: fields.text({ label: 'Texto del boletín (Noticias)' }),
      },
    }),
  },
});
