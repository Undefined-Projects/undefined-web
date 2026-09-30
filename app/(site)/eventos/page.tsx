// Se regenera cada hora para que los eventos pasen solos de "próximos" a "pasados".
export const revalidate = 3600;

import type { Metadata } from 'next';
import { getEventos, getPaginas, getSitio } from '@/lib/content';
import { Cta, PageShell, SubHead } from '@/components/Layout';
import { Media } from '@/components/Brand';
import { dia, mes, mesAnio } from '@/lib/format';

export const metadata: Metadata = { title: 'Nuestros eventos' };

export default async function Page() {
  const [{ proximos, pasados }, p, s] = await Promise.all([getEventos(), getPaginas(), getSitio()]);
  const top = proximos.slice(0, 3);
  const cal = proximos.slice(3);
  return (
    <PageShell index={4} bajada={p.bajadaEventos} ciudad={s.ciudad}>
      <div className="grid-events">
        <article className="card card--light upcoming">
          <span className="eyebrow">Próximos</span>
          {top.length === 0 && <p className="muted-dark">Pronto anunciaremos nuevas fechas.</p>}
          {top.map((e) => (
            <div key={e.slug} className="event-row">
              <div className="date-block date-block--dark"><span>{dia(e.fecha)}</span><small className="mono">{mes(e.fecha)}</small></div>
              <div className="event-row-text">
                <strong>{e.nombre}</strong>
                <span>{[e.lugar, e.hora, e.formato].filter(Boolean).join(' · ')}</span>
              </div>
              {e.registro && <a className="btn btn--accent" href={e.registro} target="_blank" rel="noreferrer">Registrarme</a>}
            </div>
          ))}
        </article>
        <article className="card card--glass past">
          <span className="eyebrow">Eventos pasados</span>
          <div className="past-grid">
            {pasados.slice(0, 4).map((e, i) => (
              <div key={e.slug} className="photo">
                <Media src={e.imagen} alt={e.nombre} seed={i + 4} label="foto" />
                <div className="photo-cap"><strong>{e.nombre}</strong></div>
              </div>
            ))}
          </div>
        </article>
      </div>

      {cal.length > 0 && (
        <>
          <SubHead title="Calendario completo" sub="Todas las fechas confirmadas de la temporada." />
          <div className="grid-2 grid-2--tight">
            {cal.map((e) => (
              <div key={e.slug} className="card card--glass event-sm">
                <div className="date-block"><span>{dia(e.fecha)}</span><small className="mono">{mes(e.fecha)}</small></div>
                <div className="event-row-text"><strong>{e.nombre}</strong><span className="muted">{[e.lugar, e.hora].filter(Boolean).join(' · ')}</span></div>
                {e.registro && <a className="btn btn--outline-light" href={e.registro} target="_blank" rel="noreferrer">Registrarme</a>}
              </div>
            ))}
          </div>
        </>
      )}

      {p.formatos.length > 0 && (
        <>
          <SubHead title="Formatos" sub="Los tipos de encuentro que organizamos." />
          <div className="grid-4">
            {p.formatos.map((f, i) => <div key={i} className="card card--glass value"><strong>{f.nombre}</strong><span>{f.descripcion}</span></div>)}
          </div>
        </>
      )}

      {pasados.length > 4 && (
        <>
          <SubHead title="Galería" sub="Momentos de eventos pasados." />
          <div className="grid-4">
            {pasados.slice(4).map((e, i) => (
              <div key={e.slug} className="photo photo--tall">
                <Media src={e.imagen} alt={e.nombre} seed={i + 9} label="foto" />
                <div className="photo-cap"><strong>{e.nombre}</strong><span className="mono muted">{mesAnio(e.fecha)}</span></div>
              </div>
            ))}
          </div>
        </>
      )}
      <Cta text="¿Quieres organizar un evento con nosotros?" />
    </PageShell>
  );
}
