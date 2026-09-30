import type { Metadata } from 'next';
import { getNosotros, getPaginas, getSitio } from '@/lib/content';
import { PageShell } from '@/components/Layout';
import { Media } from '@/components/Brand';

export const metadata: Metadata = { title: 'Quiénes somos' };

export default async function Page() {
  const [n, p, s] = await Promise.all([getNosotros(), getPaginas(), getSitio()]);
  return (
    <PageShell index={1} bajada={p.bajadaNosotros} ciudad={s.ciudad}>
      <div className="grid-about">
        <article className="card card--light story">
          <span className="mono muted-dark">Nuestra historia</span>
          <p className="story-lead">{n.frase}</p>
          <p>{n.parrafo1}</p>
          <p>{n.parrafo2}</p>
        </article>
        <Media className="about-photo" src={n.foto} alt="Foto del club" seed={3} label="foto del club" />
        <div className="stats stats--3">
          <div className="card card--glass stat"><strong>{n.fundacion}</strong><span>Año de fundación</span></div>
          <div className="card card--glass stat"><strong>{n.miembros}</strong><span>Miembros</span></div>
          <div className="card card--glass stat"><strong>{n.eventosRealizados}</strong><span>Eventos realizados</span></div>
        </div>
      </div>
    </PageShell>
  );
}
