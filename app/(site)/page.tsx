// Se regenera cada hora para que los eventos pasen solos de "próximos" a "pasados".
export const revalidate = 3600;

import { SECTIONS } from '@/lib/sections';
import { getEquipo, getEventos, getMision, getNosotros, getNoticias, getProyectos, getSitio, getAliados } from '@/lib/content';
import { dia, mes, fechaLarga } from '@/lib/format';
import { LogoMark } from '@/components/Brand';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Tile } from '@/components/Tile';
import { Footer } from '@/components/Layout';

export default async function Home() {
  const [sitio, nosotros, mision, proyectos, eventos, noticias, equipo, aliados] = await Promise.all([
    getSitio(), getNosotros(), getMision(), getProyectos(), getEventos(), getNoticias(), getEquipo(), getAliados(),
  ]);
  const destacados = eventos.proximos.filter((e) => e.destacado).slice(0, 3);
  const heroEventos = (destacados.length ? destacados : eventos.proximos.slice(0, 2)).map((e) => ({
    slug: e.slug, nombre: e.nombre, dia: dia(e.fecha), mes: mes(e.fecha), hora: e.hora, lugar: e.lugar, descripcion: e.descripcion, registro: e.registro,
  }));
  const S = SECTIONS;
  const row = (a: string, b: string, key: string) => (
    <div className="row" key={key}><span className="row-a">{a}</span><span className="row-b mono">{b}</span></div>
  );

  return (
    <div className="home">
      <div className="home-bg" aria-hidden="true"><div className="liquid liquid--page"><span className="blob b1" /><span className="blob b2" /><span className="blob b3" /><span className="blob b4" /></div></div>
      <header className="home-header">
        <a className="brand" href="/" aria-label="Undefined, inicio"><LogoMark size={34} /><span>Undefined</span></a>
        <span className="mono muted home-hint">
          <span className="only-hover">pasa el cursor sobre cada bloque ↘</span>
          <span className="only-touch">toca cada bloque</span>
        </span>
      </header>

      <main className="bento">
        <div className="bento-hero">
          <HeroCarousel tagline={sitio.tagline} manifiesto={sitio.manifiesto} apoyo={sitio.manifiestoApoyo} eventos={heroEventos} />
        </div>

        <Tile area="nos" num={S[1].num} lines={S[1].lines} glyph="nosotros" href={S[1].path}>
          <p>{nosotros.resumen}</p>
        </Tile>

        <Tile area="mis" num={S[2].num} lines={S[2].lines} glyph="mision" href={S[2].path}>
          <div className="kv"><span className="kv-k">Misión</span><p>{mision.mision}</p></div>
          <div className="kv"><span className="kv-k">Visión</span><p>{mision.vision}</p></div>
        </Tile>

        <Tile area="tra" num={S[3].num} lines={S[3].lines} glyph="trabajo" href={S[3].path}>
          <div className="rows">{proyectos.slice(0, 3).map((p) => row(p.titulo, p.categoria ?? '', p.slug))}</div>
        </Tile>

        <Tile area="eve" num={S[4].num} lines={S[4].lines} glyph="eventos" href={S[4].path} variant="accent">
          <div className="rows">{eventos.proximos.slice(0, 2).map((e) => row(e.nombre, `${dia(e.fecha)} ${mes(e.fecha)}`, e.slug))}</div>
        </Tile>

        <Tile area="not" num={S[5].num} lines={S[5].lines} glyph="noticias" href={S[5].path} linkLabel="Ver todas las noticias →">
          <div className="rows">{noticias.slice(0, 2).map((n) => row(n.titulo, fechaLarga(n.fecha), n.slug))}</div>
        </Tile>

        <Tile area="equ" num={S[6].num} lines={S[6].lines} glyph="equipo" href={S[6].path}>
          <div className="mini-people">
            {equipo.slice(0, 4).map((p) => (
              <div key={p.slug} className="mini-person">
                {p.foto ? <img src={p.foto} alt="" /> : <span className="mini-avatar" />}
                <div><strong>{p.nombre}</strong><small>{p.rol}</small></div>
              </div>
            ))}
          </div>
        </Tile>

        <Tile area="ali" num={S[7].num} lines={S[7].lines} glyph="aliados" href={S[7].path}>
          <div className="mini-logos">
            {aliados.slice(0, 6).map((a) => (a.logo ? <img key={a.slug} src={a.logo} alt={a.nombre} /> : <span key={a.slug} className="mini-logo mono">[logo]</span>))}
          </div>
        </Tile>

        <Tile area="con" num={S[8].num} lines={S[8].lines} glyph="contacto" href={S[8].path} variant="light">
          <strong className="contact-mail">{sitio.correo}</strong>
          <div className="mono contact-socials">
            {sitio.instagram && <a href={sitio.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {sitio.linkedin && <a href={sitio.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {sitio.whatsapp && <span>{sitio.whatsapp}</span>}
          </div>
          <a className="btn btn--accent" href={`mailto:${sitio.correo}`}>Escríbenos</a>
        </Tile>
      </main>

      <Footer ciudad={sitio.ciudad} />
    </div>
  );
}
