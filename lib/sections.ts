export type GlyphName =
  | 'nosotros' | 'mision' | 'trabajo' | 'eventos' | 'noticias' | 'equipo' | 'aliados' | 'contacto';

export type Section = {
  index: number;
  path: string;
  num: string;
  title: string;
  /** Título con salto de línea para las fichas */
  lines: [string, string?];
  glyph?: GlyphName;
  /** Degradado de fondo de la página */
  bg: string;
};

const base = '#0F0C2A';
const pink = (a: number) => `rgba(232,69,126,${a})`;
const blue = (a: number) => `rgba(62,127,193,${a})`;
const violet = (a: number) => `rgba(106,47,154,${a})`;
const g = (x: string, y: string, c: (a: number) => string, a: number) =>
  `radial-gradient(50% 55% at ${x} ${y}, ${c(a)} 0%, ${c(0)} 70%)`;

export const SECTIONS: Section[] = [
  { index: 0, path: '/', num: '01', title: 'Undefined', lines: ['Undefined'], bg: base },
  { index: 1, path: '/nosotros', num: '02', title: 'Quiénes somos', lines: ['Quiénes', 'somos'], glyph: 'nosotros',
    bg: [g('85%', '10%', pink, 0.4), g('5%', '95%', blue, 0.35), g('45%', '50%', violet, 0.45), base].join(', ') },
  { index: 2, path: '/mision', num: '03', title: 'Misión y visión', lines: ['Misión', 'y visión'], glyph: 'mision',
    bg: [g('10%', '10%', blue, 0.4), g('95%', '90%', pink, 0.35), g('45%', '50%', violet, 0.45), base].join(', ') },
  { index: 3, path: '/trabajo', num: '04', title: 'Nuestro trabajo', lines: ['Nuestro', 'trabajo'], glyph: 'trabajo',
    bg: [g('90%', '85%', pink, 0.4), g('10%', '10%', violet, 0.55), g('45%', '50%', violet, 0.4), base].join(', ') },
  { index: 4, path: '/eventos', num: '05', title: 'Nuestros eventos', lines: ['Nuestros', 'eventos'], glyph: 'eventos',
    bg: [g('80%', '15%', pink, 0.5), g('15%', '90%', blue, 0.35), g('45%', '50%', violet, 0.45), base].join(', ') },
  { index: 5, path: '/noticias', num: '06', title: 'Noticias', lines: ['Noticias'], glyph: 'noticias',
    bg: [g('85%', '10%', pink, 0.4), g('5%', '95%', blue, 0.35), g('45%', '50%', violet, 0.45), base].join(', ') },
  { index: 6, path: '/equipo', num: '07', title: 'Equipo', lines: ['Equipo'], glyph: 'equipo',
    bg: [g('15%', '15%', pink, 0.38), g('90%', '90%', blue, 0.38), g('45%', '50%', violet, 0.45), base].join(', ') },
  { index: 7, path: '/aliados', num: '08', title: 'Aliados', lines: ['Aliados'], glyph: 'aliados',
    bg: [g('50%', '0%', blue, 0.45), g('80%', '100%', pink, 0.38), g('45%', '50%', violet, 0.45), base].join(', ') },
  { index: 8, path: '/contacto', num: '09', title: 'Hablemos', lines: ['Hablemos'], glyph: 'contacto',
    bg: [g('85%', '50%', pink, 0.45), g('5%', '10%', violet, 0.55), g('45%', '50%', violet, 0.4), base].join(', ') },
];

/** Índice de sección a partir de una ruta (las páginas de detalle cuentan como su sección). */
export function sectionIndexOf(pathname: string): number {
  if (pathname === '/' || pathname === '') return 0;
  const hit = SECTIONS.find((s) => s.index > 0 && (pathname === s.path || pathname.startsWith(s.path + '/')));
  return hit ? hit.index : -1;
}

/** Degradados para las imágenes de marcador (cuando no hay foto). */
export function placeholderBg(seed: number) {
  const x = 10 + ((seed * 17) % 80);
  return `radial-gradient(80% 90% at ${x}% 30%, #E8457E 0%, rgba(232,69,126,0) 70%), radial-gradient(70% 80% at 80% 90%, #3E7FC1 0%, rgba(62,127,193,0) 70%), #2A1D63`;
}
