'use client';

/**
 * Motor de la transición entre secciones.
 * - Escritorio: la página se aleja, aparece un carrusel 3D con las 9 secciones, gira hacia el destino y se acerca.
 * - Celular (<768px): la pantalla gira como un cubo hacia la sección.
 * - Con "reducir movimiento" activado: navegación normal, sin animación.
 * Fuera de la animación la página se renderiza normal (scroll nativo, sin transformaciones 3D).
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SECTIONS, sectionIndexOf } from '@/lib/sections';
import { SectionPreview } from './SectionPreview';

type Phase = 'idle' | 'enter' | 'out' | 'spin' | 'await' | 'in';
type Mode = 'none' | 'ring' | 'cube';
type S = { mode: Mode; phase: Phase; from: number; to: number; angle: number; dir: number; W: number; H: number; scrollY: number };

const STEP = 360 / SECTIONS.length; // 40°
const T_OUT = 650;
const T_SPIN = 1400;
const T_IN = 650;
const T_CUBE = 720;

type Ctx = { navigate: (href: string) => void; busy: boolean };
const StageContext = createContext<Ctx>({ navigate: () => {}, busy: false });
export const useStage = () => useContext(StageContext);

const IDLE: S = { mode: 'none', phase: 'idle', from: 0, to: 0, angle: 0, dir: 1, W: 0, H: 0, scrollY: 0 };

export function Stage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [s, setS] = useState<S>(IDLE);
  const timers = useRef<number[]>([]);
  const pending = useRef<{ href: string } | null>(null);
  const resetScroll = useRef(false);

  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);

  const finish = useCallback(() => {
    clear();
    pending.current = null;
    resetScroll.current = true;
    setS(IDLE);
  }, []);

  // Al terminar, la nueva página arranca desde arriba.
  useEffect(() => {
    if (s.mode === 'none' && resetScroll.current) {
      resetScroll.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [s.mode]);

  // Bloquea el scroll del documento mientras la animación corre.
  useEffect(() => {
    const el = document.documentElement;
    if (s.mode !== 'none') { el.classList.add('is-staging'); return () => el.classList.remove('is-staging'); }
  }, [s.mode]);

  // Cuando la ruta ya cambió, continúa con la segunda mitad de la animación.
  useEffect(() => {
    if (s.phase !== 'await' || sectionIndexOf(pathname) !== s.to) return;
    clear();
    if (s.mode === 'ring') {
      setS((p) => ({ ...p, phase: 'in' }));
      later(T_IN + 60, finish);
    } else {
      later(60, finish);
    }
  }, [pathname, s.phase, s.to, s.mode, finish]);

  const navigate = useCallback((href: string) => {
    if (s.mode !== 'none') return;
    const url = new URL(href, window.location.href);
    const cur = sectionIndexOf(pathname);
    const to = sectionIndexOf(url.pathname);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || cur < 0 || to < 0 || cur === to) {
      router.push(url.pathname + url.search + url.hash);
      return;
    }
    router.prefetch(url.pathname);
    pending.current = { href: url.pathname + url.search + url.hash };
    const W = window.innerWidth;
    const H = window.innerHeight;
    const base = { W, H, scrollY: window.scrollY, from: cur, to };
    const go = () => { if (pending.current) router.push(pending.current.href, { scroll: false }); };

    if (W < 768) {
      const dir = to === 0 || to < cur ? -1 : 1;
      setS({ ...base, mode: 'cube', phase: 'enter', angle: 0, dir });
      requestAnimationFrame(() => requestAnimationFrame(() => setS((p) => ({ ...p, phase: 'spin', angle: -dir * 90 }))));
      later(T_CUBE, () => { setS((p) => ({ ...p, phase: 'await' })); go(); });
    } else {
      const N = SECTIONS.length;
      let delta = ((to - cur) % N + N) % N;
      if (delta > N / 2) delta -= N;
      const start = -cur * STEP;
      setS({ ...base, mode: 'ring', phase: 'enter', angle: start, dir: 1 });
      requestAnimationFrame(() => requestAnimationFrame(() => setS((p) => ({ ...p, phase: 'out' }))));
      later(T_OUT, () => setS((p) => ({ ...p, phase: 'spin', angle: start - delta * STEP })));
      later(T_OUT + T_SPIN + 50, () => { setS((p) => ({ ...p, phase: 'await' })); go(); });
    }
    later(9000, finish); // salida de emergencia si algo falla
  }, [s.mode, pathname, router, finish]);

  const active = sectionIndexOf(pathname);
  const ctx: Ctx = { navigate, busy: s.mode !== 'none' };

  if (s.mode === 'none') return <StageContext.Provider value={ctx}>{children}</StageContext.Provider>;

  const { W, H } = s;
  const content = (i: number) =>
    i === active ? (
      <div className="face-scroll" style={{ transform: `translateY(${-(i === s.from ? s.scrollY : 0)}px)` }}>{children}</div>
    ) : (
      <SectionPreview index={i} />
    );

  if (s.mode === 'cube') {
    const R = W / 2;
    const spinning = s.phase === 'spin';
    return (
      <StageContext.Provider value={ctx}>
        <div className="stage" style={{ '--W': `${W}px`, '--H': `${H}px` } as CSSProperties}>
          <div className="stage-persp" style={{ perspective: `${W * 2.8}px` }}>
            <div className={`stage-zoom${spinning ? ' is-cube-spinning' : ''}`}>
              <div className="stage-ring" style={{ transform: `translateZ(${-R}px) rotateY(${s.angle}deg)`, transition: spinning ? `transform ${T_CUBE}ms cubic-bezier(0.65,0,0.35,1)` : 'none' }}>
                {[s.from, s.to].map((i) => (
                  <div key={i} className="face" style={{ transform: `rotateY(${i === s.to ? s.dir * 90 : 0}deg) translateZ(${R}px)` }}>
                    {content(i)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </StageContext.Provider>
    );
  }

  const R = (W / 2) / Math.tan((STEP / 2) * (Math.PI / 180)) * 1.06;
  const zoomedOut = s.phase === 'out' || s.phase === 'spin' || s.phase === 'await';
  const zoom = zoomedOut ? 0.4 : 1;
  const showAll = s.phase !== 'enter' && s.phase !== 'in';
  return (
    <StageContext.Provider value={ctx}>
      <div className="stage" style={{ '--W': `${W}px`, '--H': `${H}px` } as CSSProperties}>
        <div className="stage-persp" style={{ perspective: `${W * 2.2}px` }}>
          <div className="stage-zoom" style={{ transform: `scale3d(${zoom}, ${zoom}, ${zoom})`, transition: `transform ${T_OUT}ms cubic-bezier(0.65,0,0.35,1)` }}>
            <div className="stage-ring" style={{ transform: `translateZ(${-R}px) rotateY(${s.angle}deg)`, transition: `transform ${T_SPIN}ms cubic-bezier(0.65,0,0.35,1)` }}>
              {SECTIONS.map((sec) => {
                const front = sec.index === active || (s.phase === 'in' && sec.index === s.to);
                return (
                  <div
                    key={sec.index}
                    className={`face${zoomedOut ? ' face--card' : ''}`}
                    aria-hidden={!front}
                    style={{ transform: `rotateY(${sec.index * STEP}deg) translateZ(${R}px)`, opacity: showAll || front ? 1 : 0 }}
                  >
                    {content(sec.index)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </StageContext.Provider>
  );
}
