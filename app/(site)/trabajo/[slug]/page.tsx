import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { reader, getSitio } from '@/lib/content';
import { PageShell } from '@/components/Layout';
import { Media } from '@/components/Brand';
import { RichText } from '@/components/RichText';
import { SectionLink } from '@/components/SectionLink';

export async function generateStaticParams() {
  return (await reader.collections.proyectos.list()).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await reader.collections.proyectos.read((await params).slug);
  return { title: p?.titulo ?? 'Proyecto' };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, s] = await Promise.all([reader.collections.proyectos.read(slug), getSitio()]);
  if (!p) notFound();
  return (
    <PageShell index={3} ciudad={s.ciudad}>
      <article className="detail">
        <SectionLink href="/trabajo" className="text-link text-link--light">← Todos los proyectos</SectionLink>
        <span className="mono muted">{[p.categoria, p.anio].filter(Boolean).join(' · ')}</span>
        <h2 className="detail-title">{p.titulo}</h2>
        <p className="detail-lede">{p.descripcion}</p>
        <Media className="detail-media" src={p.imagen} alt={p.titulo} seed={5} />
        <RichText content={p.contenido} />
      </article>
    </PageShell>
  );
}
