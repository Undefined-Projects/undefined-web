import type { Metadata } from 'next';
import { getMision, getPaginas, getSitio } from '@/lib/content';
import { PageShell, SubHead } from '@/components/Layout';

export const metadata: Metadata = { title: 'Misión y visión' };

export default async function Page() {
  const [m, p, s] = await Promise.all([getMision(), getPaginas(), getSitio()]);
  return (
    <PageShell index={2} bajada={p.bajadaMision} ciudad={s.ciudad}>
      <div className="grid-2">
        <article className="card card--light statement"><span className="eyebrow">Misión</span><p>{m.mision}</p></article>
        <article className="card card--accent statement"><span className="eyebrow">Visión</span><p>{m.vision}</p></article>
      </div>
      <SubHead title="Valores" />
      <div className="grid-4">
        {m.valores.map((v, i) => (
          <div key={i} className="card card--glass value"><strong>{v.nombre}</strong><span>{v.descripcion}</span></div>
        ))}
      </div>
    </PageShell>
  );
}
