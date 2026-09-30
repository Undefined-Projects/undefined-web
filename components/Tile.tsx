'use client';
import { useId, useState, type ReactNode } from 'react';
import type { GlyphName } from '@/lib/sections';
import { Glyph } from './Brand';
import { SectionLink } from './SectionLink';

type Props = {
  num: string;
  lines: [string, string?];
  glyph: GlyphName;
  href: string;
  linkLabel?: string;
  variant?: 'glass' | 'accent' | 'light';
  area: string;
  children: ReactNode;
};

/**
 * Ficha de la malla de inicio.
 * Escritorio (con mouse): el panel sube al pasar el cursor o al enfocar con teclado.
 * Celular/tablet: acordeón, se abre al tocar.
 */
export function Tile({ num, lines, glyph, href, linkLabel = 'Ver sección →', variant = 'glass', area, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <article className={`tile tile--${variant}`} data-open={open || undefined} style={{ gridArea: area }}>
      <button type="button" className="tile-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <span className="tile-num">{num}</span>
        <svg className="tile-plus" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        <span className="tile-title">{lines[0]}{lines[1] ? <><br />{lines[1]}</> : null}</span>
        <Glyph name={glyph} className="tile-glyph" />
      </button>
      <div className="tile-panel" id={id}>
        <div className="tile-panel-inner">
          <div className="tile-panel-card">
            <span className="tile-num tile-panel-num">{num}</span>
            {children}
            <SectionLink href={href} className="tile-link">{linkLabel}</SectionLink>
          </div>
        </div>
      </div>
    </article>
  );
}
