// Genera contenido de ejemplo (marcadores entre corchetes) para que el sitio tenga algo que mostrar.
// Uso: node scripts/seed.mjs   (sobrescribe /content)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content');
fs.rmSync(root, { recursive: true, force: true });
const q = (v) => (typeof v === 'string' ? JSON.stringify(v) : String(v));
const yaml = (obj, indent = '') =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return `${indent}${k}:\n` + v.map((it) => {
          const lines = Object.entries(it).map(([a, b]) => `${a}: ${q(b)}`);
          return `${indent}  - ${lines.join(`\n${indent}    `)}`;
        }).join('\n');
      }
      return `${indent}${k}: ${q(v)}`;
    })
    .join('\n') + '\n';
const write = (rel, text) => {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, text);
};

write('sitio.yaml', yaml({
  tagline: '[TAGLINE DEL CLUB — una línea que diga qué es Undefined]',
  manifiesto: '[MANIFIESTO — la frase grande que define al club en 2–3 líneas.]',
  manifiestoApoyo: '[Párrafo de apoyo: a quién reúne, qué hacen juntos y por qué importa.]',
  correo: 'correo@undfinedclub.org',
  whatsapp: '[+52 000 000 0000]',
  ciudad: '[Ciudad, País]',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/',
  tiktok: 'https://tiktok.com/',
}));
write('nosotros.yaml', yaml({
  resumen: '[Descripción del club: origen, año de fundación, ciudad y quiénes lo integran.]',
  frase: '[Frase que resume quiénes somos en una o dos líneas.]',
  parrafo1: '[Párrafo 1: cómo y por qué nació el club, quiénes lo fundaron y en qué contexto.]',
  parrafo2: '[Párrafo 2: qué hacemos hoy, a quién reunimos y qué nos hace distintos.]',
  fundacion: '[AAAA]',
  miembros: '[N]',
  eventosRealizados: '[N]',
}));
write('mision.yaml', yaml({
  mision: '[Texto de misión: qué hacemos, para quién y cómo.]',
  vision: '[Texto de visión: el futuro que queremos construir.]',
  valores: [1, 2, 3, 4].map((n) => ({ nombre: `[Valor ${n}]`, descripcion: '[Qué significa este valor para el club.]' })),
}));
write('paginas.yaml', yaml({
  bajadaNosotros: '[Bajada: una línea sobre el club.]',
  bajadaMision: '[Bajada: el propósito que nos mueve.]',
  bajadaTrabajo: '[Bajada: proyectos y resultados del club.]',
  bajadaEventos: '[Bajada: dónde nos encontramos.]',
  bajadaNoticias: '[Bajada: lo que se dice del club en medios y nuestros comunicados.]',
  bajadaEquipo: '[Bajada: las personas detrás del club.]',
  bajadaAliados: '[Bajada: quienes construyen con nosotros.]',
  bajadaContacto: '[Bajada: cómo contactarnos.]',
  impacto: [['[N]', '[Proyectos realizados]'], ['[N]', '[Personas impactadas]'], ['[N]', '[Aliados involucrados]'], ['[N]', '[Ciudades]']].map(([valor, etiqueta]) => ({ valor, etiqueta })),
  formatos: [1, 2, 3, 4].map((n) => ({ nombre: `[Formato ${n}]`, descripcion: '[Qué pasa en este formato y para quién es.]' })),
  aliadosCta: '[Qué ofrece una alianza y cómo se colabora con el club.]',
  boletin: '[Frecuencia y qué incluye el boletín.]',
}));

const body = '[Cuerpo de la nota. Escribe aquí el contenido completo desde el panel /keystatic.]\n';
for (let n = 1; n <= 12; n++) {
  const d = new Date(Date.UTC(2026, 8, 28 - n * 6)).toISOString().slice(0, 10);
  write(`noticias/noticia-${n}.mdoc`, `---\n${yaml({
    titulo: n === 1 ? '[Titular de la noticia principal]' : `[Titular de la noticia ${n}]`,
    medio: '[Medio]',
    fecha: d,
    extracto: '[Extracto de dos líneas con lo más relevante de la nota.]',
    destacada: n === 1,
  })}---\n\n${body}`);
}
const futuro = ['2026-10-15', '2026-11-05', '2026-11-20', '2026-12-03', '2027-01-22', '2027-02-12', '2027-03-05', '2027-03-26', '2027-04-16'];
futuro.forEach((d, i) => write(`eventos/evento-${i + 1}.yaml`, yaml({
  nombre: `[Nombre del evento ${i + 1}]`, fecha: d, hora: '[Hora]', lugar: '[Lugar]', formato: '[Formato]',
  descripcion: '[Descripción breve: de qué trata y para quién es.]', registro: 'https://example.com/registro', destacado: i < 2,
})));
['2026-09-12', '2026-08-22', '2026-07-30', '2026-06-18', '2026-05-21', '2026-04-24', '2026-03-19', '2026-02-26'].forEach((d, i) =>
  write(`eventos/evento-pasado-${i + 1}.yaml`, yaml({ nombre: `[Evento pasado ${i + 1}]`, fecha: d, hora: '[Hora]', lugar: '[Lugar]', formato: '[Formato]', descripcion: '[Descripción breve.]' })));
for (let n = 1; n <= 12; n++) write(`proyectos/proyecto-${n}.mdoc`, `---\n${yaml({
  titulo: `[Proyecto ${n}]`, categoria: '[Categoría]', anio: 2026, descripcion: '[Descripción en una línea.]', caso: n <= 2, orden: n,
})}---\n\n## Reto\n\n[Cuál era el problema.]\n\n## Lo que hicimos\n\n[Cómo lo resolvimos.]\n\n## Resultado\n\n[Qué cambió gracias al proyecto.]\n`);
for (let n = 1; n <= 4; n++) write(`comunicados/comunicado-${n}.yaml`, yaml({ titulo: `[Título del comunicado ${n}]`, fecha: new Date(Date.UTC(2026, 8, 25 - n * 14)).toISOString().slice(0, 10) }));
for (let n = 1; n <= 8; n++) write(`equipo/persona-${n}.yaml`, yaml({ nombre: `[Nombre Apellido ${n}]`, rol: '[Rol en el club]', orden: n }));
for (let n = 1; n <= 12; n++) write(`aliados/aliado-${n}.yaml`, yaml({ nombre: `[Aliado ${n}]`, url: 'https://example.com', orden: n }));
console.log('Contenido de ejemplo generado en /content');
