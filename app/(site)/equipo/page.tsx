import type { Metadata } from 'next';
import { getEquipo, getPaginas, getSitio } from '@/lib/content';
import { PageShell } from '@/components/Layout';
import { Media } from '@/components/Brand';

export const metadata: Metadata = { title: 'Equipo' };

export default async function Page() {
  const [equipo, p, s] = await Promise.all([getEquipo(), getPaginas(), getSitio()]);
  return (
    <PageShell index={6} bajada={p.bajadaEquipo} ciudad={s.ciudad}>
      <div className="grid-4">
        {equipo.map((m, i) => (
          <article key={m.slug} className="card card--glass person">
            <Media src={m.foto} alt={m.nombre} seed={i + 1} label="foto" />
            <div className="person-body"><strong>{m.nombre}</strong><span className="muted">{m.rol}</span></div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
