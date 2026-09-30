import type { Metadata } from 'next';
import Link from 'next/link';
import { getComunicados, getNoticias, getPaginas, getSitio } from '@/lib/content';
import { PageShell, SubHead } from '@/components/Layout';
import { Media } from '@/components/Brand';
import { NewsletterForm } from '@/components/Forms';
import { fechaLarga } from '@/lib/format';

export const metadata: Metadata = { title: 'Noticias' };

type N = Awaited<ReturnType<typeof getNoticias>>[number];
const href = (n: N) => n.enlaceExterno || `/noticias/${n.slug}`;
const ext = (n: N) => (n.enlaceExterno ? { target: '_blank', rel: 'noreferrer' } : {});

function NewsCard({ n, i }: { n: N; i: number }) {
  return (
    <article className="card card--glass news">
      <Media src={n.imagen} alt={n.titulo} seed={i + 1} />
      <div className="news-body">
        <span className="mono muted">{[n.medio, fechaLarga(n.fecha)].filter(Boolean).join(' · ')}</span>
        <h3>{n.titulo}</h3>
        <Link href={href(n)} {...ext(n)} className="text-link text-link--light">Leer nota →</Link>
      </div>
    </article>
  );
}

export default async function Page() {
  const [noticias, comunicados, p, s] = await Promise.all([getNoticias(), getComunicados(), getPaginas(), getSitio()]);
  const principal = noticias.find((n) => n.destacada) ?? noticias[0];
  const resto = noticias.filter((n) => n !== principal);
  const top = resto.slice(0, 4);
  const mas = resto.slice(4);
  return (
    <PageShell index={5} bajada={p.bajadaNoticias} ciudad={s.ciudad}>
      {principal && (
        <div className="grid-news">
          <article className="card card--light featured">
            <Media src={principal.imagen} alt={principal.titulo} seed={7} label="imagen destacada" />
            <div className="featured-body">
              <span className="mono muted-dark">Destacada · {[principal.medio, fechaLarga(principal.fecha)].filter(Boolean).join(' · ')}</span>
              <h2>{principal.titulo}</h2>
              <p>{principal.extracto}</p>
              <Link href={href(principal)} {...ext(principal)} className="text-link">Leer nota completa →</Link>
            </div>
          </article>
          {top.map((n, i) => <NewsCard key={n.slug} n={n} i={i} />)}
        </div>
      )}
      {mas.length > 0 && (
        <>
          <SubHead title="Más noticias" sub="Notas recientes sobre el club." />
          <div className="grid-4">{mas.map((n, i) => <NewsCard key={n.slug} n={n} i={i + 5} />)}</div>
        </>
      )}
      {comunicados.length > 0 && (
        <>
          <SubHead title="Comunicados" sub="Anuncios oficiales de Undefined." />
          <div className="card card--light list">
            {comunicados.map((c) => (
              <div key={c.slug} className="list-row">
                <span className="mono muted-dark">{fechaLarga(c.fecha)}</span>
                <strong>{c.titulo}</strong>
                {c.archivo ? <a className="text-link" href={c.archivo} target="_blank" rel="noreferrer">Descargar PDF →</a> : <span />}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="card card--glass newsletter">
        <div><h2>Recibe nuestras noticias</h2><p className="soft">{p.boletin}</p></div>
        <NewsletterForm />
      </div>
    </PageShell>
  );
}
