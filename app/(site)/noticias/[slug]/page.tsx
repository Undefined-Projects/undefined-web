import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { reader, getSitio } from '@/lib/content';
import { PageShell } from '@/components/Layout';
import { Media } from '@/components/Brand';
import { RichText } from '@/components/RichText';
import { SectionLink } from '@/components/SectionLink';
import { fechaLarga } from '@/lib/format';

export async function generateStaticParams() {
  return (await reader.collections.noticias.list()).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = await reader.collections.noticias.read((await params).slug);
  return { title: n?.titulo ?? 'Noticia', description: n?.extracto };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [n, s] = await Promise.all([reader.collections.noticias.read(slug), getSitio()]);
  if (!n) notFound();
  return (
    <PageShell index={5} ciudad={s.ciudad}>
      <article className="detail">
        <SectionLink href="/noticias" className="text-link text-link--light">← Todas las noticias</SectionLink>
        <span className="mono muted">{[n.medio, fechaLarga(n.fecha)].filter(Boolean).join(' · ')}</span>
        <h2 className="detail-title">{n.titulo}</h2>
        <p className="detail-lede">{n.extracto}</p>
        <Media className="detail-media" src={n.imagen} alt={n.titulo} seed={6} />
        <RichText content={n.contenido} />
        {n.enlaceExterno && <a className="btn btn--accent" href={n.enlaceExterno} target="_blank" rel="noreferrer">Ver nota original</a>}
      </article>
    </PageShell>
  );
}
