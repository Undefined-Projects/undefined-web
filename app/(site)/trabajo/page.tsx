import type { Metadata } from 'next';
import Link from 'next/link';
import { getPaginas, getProyectos, getSitio } from '@/lib/content';
import { Cta, PageShell, SubHead } from '@/components/Layout';
import { Media } from '@/components/Brand';

export const metadata: Metadata = { title: 'Nuestro trabajo' };

type P = Awaited<ReturnType<typeof getProyectos>>[number];
function ProjectCard({ p, i }: { p: P; i: number }) {
  return (
    <Link href={`/trabajo/${p.slug}`} className="card card--glass project">
      <Media src={p.imagen} alt={p.titulo} seed={i + 2} />
      <div className="project-body">
        <span className="mono muted">{[p.categoria, p.anio].filter(Boolean).join(' · ')}</span>
        <strong>{p.titulo}</strong>
        <span className="soft">{p.descripcion}</span>
      </div>
    </Link>
  );
}

export default async function Page() {
  const [proyectos, p, s] = await Promise.all([getProyectos(), getPaginas(), getSitio()]);
  const casos = proyectos.filter((x) => x.caso);
  const primeros = proyectos.slice(0, 6);
  const resto = proyectos.slice(6);
  return (
    <PageShell index={3} bajada={p.bajadaTrabajo} ciudad={s.ciudad}>
      <div className="grid-3 grid-3--tall">{primeros.map((x, i) => <ProjectCard key={x.slug} p={x} i={i} />)}</div>
      {casos.length > 0 && (
        <>
          <SubHead title="Casos destacados" />
          <div className="stack">
            {casos.map((c, i) => (
              <article key={c.slug} className="card card--light case">
                <Media src={c.imagen} alt={c.titulo} seed={i * 3 + 1} label="imagen del caso" />
                <div className="case-body">
                  <span className="mono muted-dark">Caso destacado · {c.anio}</span>
                  <h3>{c.titulo}</h3>
                  <p>{c.descripcion}</p>
                  <Link href={`/trabajo/${c.slug}`} className="text-link">Ver caso →</Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {resto.length > 0 && (
        <>
          <SubHead title="Más proyectos" />
          <div className="grid-3">{resto.map((x, i) => <ProjectCard key={x.slug} p={x} i={i + 6} />)}</div>
        </>
      )}
      {p.impacto.length > 0 && (
        <>
          <SubHead title="Impacto" />
          <div className="grid-4">
            {p.impacto.map((it, i) => <div key={i} className="card card--glass stat stat--big"><strong>{it.valor}</strong><span>{it.etiqueta}</span></div>)}
          </div>
        </>
      )}
      <Cta text="¿Tienes un proyecto en mente? Construyámoslo juntos." />
    </PageShell>
  );
}
