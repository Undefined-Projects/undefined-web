import type { Metadata } from 'next';
import { getAliados, getPaginas, getSitio } from '@/lib/content';
import { PageShell } from '@/components/Layout';
import { SectionLink } from '@/components/SectionLink';

export const metadata: Metadata = { title: 'Aliados' };

export default async function Page() {
  const [aliados, p, s] = await Promise.all([getAliados(), getPaginas(), getSitio()]);
  return (
    <PageShell index={7} bajada={p.bajadaAliados} ciudad={s.ciudad}>
      <div className="grid-allies">
        <div className="logos">
          {aliados.map((a) => {
            const inner = a.logo ? <img src={a.logo} alt={a.nombre} /> : <span className="mono">[logo]</span>;
            return a.url ? <a key={a.slug} className="logo-cell" href={a.url} target="_blank" rel="noreferrer" aria-label={a.nombre}>{inner}</a> : <div key={a.slug} className="logo-cell">{inner}</div>;
          })}
        </div>
        <article className="card card--accent ally-cta">
          <span className="eyebrow">Súmate</span>
          <p className="ally-cta-title">¿Quieres ser aliado de Undefined?</p>
          <p>{p.aliadosCta}</p>
          <SectionLink href="/contacto" className="btn btn--dark btn--lg">Hablemos →</SectionLink>
        </article>
      </div>
    </PageShell>
  );
}
