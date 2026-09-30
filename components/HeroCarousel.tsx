'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Liquid, LogoMark } from './Brand';
import { SectionLink } from './SectionLink';

export type HeroEvent = {
  slug: string;
  nombre: string;
  dia: string;
  mes: string;
  hora?: string | null;
  lugar?: string | null;
  descripcion?: string | null;
  registro?: string | null;
};

type Props = { tagline: string; manifiesto: string; apoyo: string; eventos: HeroEvent[]; intervalo?: number };

/** Ficha grande de inicio: carrusel automático (marca → próximos eventos → manifiesto). */
export function HeroCarousel({ tagline, manifiesto, apoyo, eventos, intervalo = 10 }: Props) {
  const slides: { key: string; label: string; node: ReactNode }[] = [
    {
      key: 'marca',
      label: 'Marca',
      node: (
        <>
          <span className="mono hero-num">01</span>
          <div className="hero-mark"><LogoMark size={170} /></div>
          <div className="hero-brand">
            <div className="hero-wordmark">Undefined</div>
            <p className="hero-tagline">{tagline}</p>
          </div>
        </>
      ),
    },
    ...eventos.map((e, i) => ({
      key: e.slug,
      label: `Próximo evento ${i + 1}`,
      node: (
        <>
          <div className="hero-top"><span className="mono hero-num">01</span><span className="chip">Próximo evento</span></div>
          <div className="hero-event">
            <div className="date-block date-block--xl"><span>{e.dia}</span><small className="mono">{e.mes}</small></div>
            <div className="hero-event-text">
              <h3>{e.nombre}</h3>
              <span className="mono">{[e.lugar, e.hora].filter(Boolean).join(' · ')}</span>
            </div>
          </div>
          <div className="hero-bottom">
            <p>{e.descripcion}</p>
            {e.registro ? <a className="btn btn--accent" href={e.registro} target="_blank" rel="noreferrer">Registrarme</a> : <SectionLink className="btn btn--accent" href="/eventos">Ver evento</SectionLink>}
          </div>
        </>
      ),
    })),
    {
      key: 'manifiesto',
      label: 'Manifiesto',
      node: (
        <>
          <div className="hero-top"><span className="mono hero-num">01</span><span className="chip">Manifiesto</span></div>
          <p className="hero-manifesto">{manifiesto}</p>
          <div className="hero-bottom">
            <p>{apoyo}</p>
            <SectionLink className="btn btn--outline-light" href="/trabajo">Ver nuestro trabajo</SectionLink>
          </div>
        </>
      ),
    },
  ];
  const N = slides.length;
  const [cur, setCur] = useState(0);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const restart = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => { if (!paused.current) setCur((c) => (c + 1) % N); }, Math.max(3, intervalo) * 1000);
  }, [N, intervalo]);
  useEffect(() => { restart(); return () => window.clearInterval(timer.current); }, [restart]);

  const go = (i: number) => { setCur(((i % N) + N) % N); restart(); };

  return (
    <section
      className="hero"
      aria-roledescription="carrusel"
      aria-label="Destacados"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }}
      onBlur={() => { paused.current = false; }}
      onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; paused.current = true; }}
      onTouchEnd={(e) => {
        const x = e.changedTouches[0]?.clientX;
        if (touchX.current != null && x != null && Math.abs(x - touchX.current) > 40) go(cur + (x < touchX.current ? 1 : -1));
        touchX.current = null;
        paused.current = false;
      }}
    >
      <Liquid intense />
      {slides.map((s, i) => (
        <div key={s.key} className={`hero-slide${i === cur ? ' is-active' : ''}`} aria-hidden={i !== cur} inert={i !== cur}>
          {s.node}
        </div>
      ))}
      <div className="hero-dots">
        {slides.map((s, i) => (
          <button key={s.key} type="button" aria-label={`Ir a: ${s.label}`} aria-current={i === cur} onClick={() => go(i)}>
            <span className={i === cur ? 'is-on' : ''} />
          </button>
        ))}
      </div>
    </section>
  );
}
