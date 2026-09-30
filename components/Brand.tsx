import type { CSSProperties } from 'react';
import type { GlyphName } from '@/lib/sections';
import { placeholderBg } from '@/lib/sections';

/** Isotipo de Undefined (recuadro con punto y escalón). */
export function LogoMark({ size = 32, color = '#FFFFFF', className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg className={className} width={size} height={(size * 390) / 430} viewBox="0 0 430 390" fill={color} aria-hidden="true">
      <rect x="3" y="2" width="377" height="28" />
      <rect x="3" y="2" width="27" height="303" />
      <rect x="398" y="107" width="28" height="225" />
      <rect x="278" y="304" width="148" height="28" />
      <rect x="278" y="304" width="27" height="80" />
      <rect x="55" y="356" width="250" height="28" />
      <circle cx="214" cy="182" r="21" />
    </svg>
  );
}

const GLYPHS: Record<GlyphName, { d: string; dots: [number, number, number][] }> = {
  nosotros: { d: 'M12 86 V60 H34 V52 H62 V60 H84 V86', dots: [[28, 36, 6], [48, 26, 6], [68, 36, 6]] },
  mision: { d: 'M14 70 V14 H70 M82 26 V82 H26 M48 4 V22 M48 74 V92 M4 48 H22 M74 48 H92', dots: [[48, 48, 7]] },
  trabajo: { d: 'M14 88 V34 H62 V88 Z M26 34 V22 H74 V76 H62 M38 22 V10 H86 V64 H74', dots: [[38, 61, 6]] },
  eventos: { d: 'M14 70 V22 H82 V82 H26 M14 40 H82 M32 12 V30 M64 12 V30', dots: [[58, 62, 7]] },
  noticias: { d: 'M22 54 H42 V74 M22 34 H62 V74 M22 14 H82 V74', dots: [[22, 74, 7]] },
  equipo: { d: 'M12 86 V60 H44 V86 M52 86 V60 H84 V86', dots: [[28, 32, 8], [68, 32, 8]] },
  aliados: { d: 'M38 58 H14 V14 H58 V38 M58 38 H82 V82 H38 V58', dots: [[48, 48, 6]] },
  contacto: { d: 'M26 64 H14 V14 H82 V64 H50 V80 H30 V70', dots: [[34, 40, 5], [48, 40, 5], [62, 40, 5]] },
};

/** Pictograma a lápiz de cada sección. Usa el filtro #uc-pencil definido en <PencilDefs/>. */
export function Glyph({ name, size = 92, color = 'currentColor', className }: { name: GlyphName; size?: number; color?: string; className?: string }) {
  const g = GLYPHS[name];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 96 96" fill={color} aria-hidden="true">
      <g filter="url(#uc-pencil)">
        <path d={g.d} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={g.d} transform="translate(1.6 -1.2) rotate(0.8 48 48)" fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        {g.dots.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
      </g>
    </svg>
  );
}

export function PencilDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="uc-pencil" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={7} result="wob" />
          <feDisplacementMap in="SourceGraphic" in2="wob" scale={4.5} xChannelSelector="R" yChannelSelector="G" result="shaky" />
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves={1} seed={3} result="grit" />
          <feColorMatrix in="grit" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.3" result="gritA" />
          <feComposite in="shaky" in2="gritA" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/** Grano de papel sobre toda la pantalla. */
export function Grain() {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id="uc-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#uc-grain)" />
    </svg>
  );
}

/** Fondo líquido animado (manchas de color difuminadas). */
export function Liquid({ intense = false }: { intense?: boolean }) {
  return (
    <div className={`liquid${intense ? ' liquid--intense' : ''}`} aria-hidden="true">
      <span className="blob b1" /><span className="blob b3" /><span className="blob b2" /><span className="blob b4" /><span className="blob b5" />
    </div>
  );
}

/** Imagen del CMS o un degradado de marcador si todavía no hay foto. */
export function Media({ src, alt, seed = 1, label = 'imagen', className, style }: { src?: string | null; alt: string; seed?: number; label?: string; className?: string; style?: CSSProperties }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`media ${className ?? ''}`} src={src} alt={alt} loading="lazy" style={style} />;
  }
  return (
    <div className={`media media--ph ${className ?? ''}`} style={{ background: placeholderBg(seed), ...style }} role="img" aria-label={alt}>
      <span>[{label}]</span>
    </div>
  );
}
