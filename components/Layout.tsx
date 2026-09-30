import type { ReactNode } from 'react';
import { SECTIONS } from '@/lib/sections';
import { Glyph, LogoMark } from './Brand';
import { SectionLink } from './SectionLink';

export function Footer({ ciudad }: { ciudad?: string }) {
  return (
    <footer className="site-footer mono">
      <span>© {new Date().getFullYear()} Undefined</span>
      <span>{ciudad}</span>
      <span>www.undfinedclub.org</span>
    </footer>
  );
}

/** Estructura común de las páginas de sección: volver, número, título, bajada y pictograma. */
export function PageShell({ index, bajada, ciudad, children }: { index: number; bajada?: string | null; ciudad?: string; children: ReactNode }) {
  const s = SECTIONS[index];
  return (
    <div className="page" style={{ background: s.bg }}>
      <header className="page-header">
        <SectionLink href="/" className="btn btn--ghost">← Volver al inicio</SectionLink>
        <SectionLink href="/" className="brand" aria-label="Undefined, inicio"><LogoMark size={30} /><span>Undefined</span></SectionLink>
      </header>
      <div className="page-hero">
        <div className="page-hero-title">
          <span className="mono muted">{s.num}</span>
          <h1>{s.title}</h1>
        </div>
        {bajada ? <p className="page-hero-lede">{bajada}</p> : null}
        {s.glyph ? <Glyph name={s.glyph} size={72} color="#FFFFFF" className="page-hero-glyph" /> : null}
      </div>
      <main className="page-main">{children}</main>
      <Footer ciudad={ciudad} />
    </div>
  );
}

export function SubHead({ title, sub }: { title: string; sub?: string | null }) {
  return (
    <div className="subhead">
      <h2>{title}</h2>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}

export function Cta({ text, href = '/contacto', label = 'Hablemos →' }: { text: string; href?: string; label?: string }) {
  return (
    <div className="cta">
      <p>{text}</p>
      <SectionLink href={href} className="btn btn--dark btn--lg">{label}</SectionLink>
    </div>
  );
}
